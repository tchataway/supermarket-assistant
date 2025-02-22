import { useRef, useState } from 'react'
import { CloseIcon, SmallCloseIcon } from '@chakra-ui/icons'
import {
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'

const NewRequest = ({ onSubmit, autocompleteOptions, validate }) => {
  const [amount, setAmount] = useState(1)
  const [itemName, setItemName] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const itemNameInputRef = useRef(null)

  const suggestions = autocompleteOptions.filter((option) =>
    option.toLowerCase().includes(itemName.toLowerCase())
  )

  const processItem = (itemName) => {
    if (itemName === '') {
      // Don't add items with empty names.
      return
    }

    if (!validate(itemName)) {
      return
    }

    onSubmit(amount, itemName, itemNameInputRef)

    // Restore defaults.
    setAmount(1)
    setItemName('')
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    processItem(itemName)
  }

  return (
    <form onSubmit={handleSubmit} autoComplete='off'>
      <HStack width='100%' display='flex'>
        <FormControl maxWidth='65px'>
          <NumberInput
            value={amount}
            onChange={(newValue) => {
              setAmount(newValue)
            }}
            min={1}
            max={9}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <InputGroup flexGrow={1}>
          <FormControl>
            <div className='autocomplete'>
              <Input
                ref={itemNameInputRef}
                type='text'
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value)

                  if (e.target.value === '') {
                    setShowSuggestions(false)
                  } else {
                    setShowSuggestions(true)
                  }
                }}
                placeholder='Add item'
                variant='flushed'
              />
              {showSuggestions && (
                <ul className='suggestions'>
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setShowSuggestions(false)
                        processItem(item)
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FormControl>
          {itemName !== '' && (
            <InputRightElement>
              <IconButton
                icon={<CloseIcon />}
                onClick={() => {
                  setItemName('')
                  itemNameInputRef.current.focus()
                  setShowSuggestions(false)
                }}
                variant={'ghost'}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </HStack>
      <button type='submit' display='none' height='0' width='0' />
    </form>
  )
}

export default NewRequest
