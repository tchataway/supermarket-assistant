import { useState } from 'react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

const Progress = ({ maxCount }) => {
  const [count, setCount] = useState(maxCount)
  const [progress, setProgress] = useState(0)

  const handleClick = () => {
    // Cycle count and update progress.
    let newCount = count - 1

    if (newCount < 0) {
      newCount = maxCount
    }

    // Progress is tracked as a number from 0-100.
    const progress = ((maxCount - newCount) / maxCount) * 100

    setCount(newCount)
    setProgress(progress)
  }

  return (
    <CircularProgress value={progress} onClick={handleClick} color='green'>
      {count > 0 ? (
        <CircularProgressLabel fontSize='lg' fontWeight='semibold'>
          {count}
        </CircularProgressLabel>
      ) : (
        <CircularProgressLabel>
          <CheckIcon boxSize={6} color='green' />
        </CircularProgressLabel>
      )}
    </CircularProgress>
  )
}

export default Progress
