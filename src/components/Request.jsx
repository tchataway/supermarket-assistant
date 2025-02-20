import Progress from './Progress'
import { Box, HStack } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'

const Request = ({ request, shopName, onChange }) => {
  const { amount, name, aisles, remaining } = request
  const aisle = aisles[shopName]

  const handleProgressChange = (newCount) => {
    onChange(newCount)
  }

  return (
    <HStack justifyContent='space-between' spacing={4}>
      <Progress
        maxCount={amount}
        remaining={remaining}
        onChange={handleProgressChange}
      />
      <Box width='100%' justifyContent='start'>
        {name}
      </Box>
      <Box
        fontWeight='semibold'
        fontSize={'lg'}
        width='50px'
        textAlign='center'
      >
        {aisle ? aisle : <LockIcon color='red.500' height='60%' width='60%' />}
      </Box>
    </HStack>
  )
}

export default Request
