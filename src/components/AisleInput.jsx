import {
  Checkbox,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'

const AisleInput = ({
  hasAisle,
  onHasAisleChanged,
  aisleNumber,
  onAisleNumberChanged,
}) => {
  return (
    <HStack>
      <Checkbox
        defaultChecked={hasAisle}
        checked={hasAisle}
        onChange={onHasAisleChanged}
      />
      <NumberInput
        value={aisleNumber}
        onChange={(newValue) => onAisleNumberChanged(newValue)}
        min={1}
        isDisabled={!hasAisle}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  )
}

export default AisleInput
