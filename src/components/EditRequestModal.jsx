import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import AisleInput from './AisleInput'

const EditRequestModal = ({ onConfirm, onClose, request }) => {
  const { aisles } = request
  const [amount, setAmount] = useState(request.amount)
  const [hasFoodlandAisle, setHasFoodlandAisle] = useState(aisles.foodland > 0)
  const [foodlandAisle, setFoodlandAisle] = useState(aisles.foodland ?? 1)
  const [hasColesAisle, setHasColesAisle] = useState(aisles.coles > 0)
  const [colesAisle, setColesAisle] = useState(aisles.coles ?? 1)
  const [hasWoolworthsAisle, setHasWoolworthsAisle] = useState(
    aisles.woolworths > 0
  )
  const [woolworthsAisle, setWoolworthsAisle] = useState(aisles.woolworths ?? 1)

  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedRequest = { ...request, amount }

    if (hasColesAisle) {
      updatedRequest.aisles.coles = colesAisle
    } else {
      delete updatedRequest.aisles.coles
    }

    if (hasFoodlandAisle) {
      updatedRequest.aisles.foodland = foodlandAisle
    } else {
      delete updatedRequest.aisles.foodland
    }

    if (hasWoolworthsAisle) {
      updatedRequest.aisles.woolworths = woolworthsAisle
    } else {
      delete updatedRequest.aisles.woolworths
    }

    const modalData = {
      removeRequest: false,
      request: updatedRequest,
    }

    onConfirm(modalData)
    onClose()
  }

  const onRemove = () => {
    onConfirm({ request, removeRequest: true })
    onClose()
  }

  return (
    <ModalContent>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Edit {request.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button colorScheme='red' onClick={onRemove} mb={2}>
            Remove Item from List
          </Button>
          <FormControl>
            <FormLabel>Amount required</FormLabel>
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

          <Box fontSize='2xl' mt={3}>
            Aisles
          </Box>
          <HStack spacing={2} mt={2}>
            <FormControl>
              <FormLabel textAlign='center'>Coles</FormLabel>
              <AisleInput
                hasAisle={hasColesAisle}
                onHasAisleChanged={() =>
                  setHasColesAisle((prevState) => !prevState)
                }
                aisleNumber={colesAisle}
                onAisleNumberChanged={(newValue) => {
                  setColesAisle(newValue)
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel textAlign='center'>Foodland</FormLabel>
              <AisleInput
                hasAisle={hasFoodlandAisle}
                onHasAisleChanged={() =>
                  setHasFoodlandAisle((prevState) => !prevState)
                }
                aisleNumber={foodlandAisle}
                onAisleNumberChanged={(newValue) => {
                  setFoodlandAisle(newValue)
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel textAlign='center'>Woolworths</FormLabel>
              <AisleInput
                hasAisle={hasWoolworthsAisle}
                onHasAisleChanged={() =>
                  setHasWoolworthsAisle((prevState) => !prevState)
                }
                aisleNumber={woolworthsAisle}
                onAisleNumberChanged={(newValue) => {
                  setWoolworthsAisle(newValue)
                }}
              />
            </FormControl>
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button type='submit' colorScheme='blue' mr={3}>
            Update
          </Button>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

export default EditRequestModal
