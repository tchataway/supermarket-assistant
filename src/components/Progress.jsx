import { useEffect, useState } from 'react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

const calcProgress = (max, current) => {
  // Progress is tracked as a number from 0-100.
  return ((max - current) / max) * 100
}

const Progress = ({ maxCount, remaining, onChange }) => {
  const [progress, setProgress] = useState(calcProgress(maxCount, remaining))

  useEffect(() => {
    setProgress(calcProgress(maxCount, remaining))
  }, [maxCount, remaining])

  const handleClick = () => {
    // Cycle count and update progress.
    let newCount = remaining - 1

    if (newCount < 0) {
      newCount = maxCount
    }

    setProgress(calcProgress(maxCount, newCount))
    onChange(newCount)
  }

  return (
    <CircularProgress value={progress} onClick={handleClick} color='green'>
      {remaining > 0 ? (
        <CircularProgressLabel
          fontSize='lg'
          fontWeight='semibold'
          userSelect='none'
        >
          {remaining}
        </CircularProgressLabel>
      ) : (
        <CircularProgressLabel userSelect='none'>
          <CheckIcon boxSize={6} color='green' />
        </CircularProgressLabel>
      )}
    </CircularProgress>
  )
}

export default Progress
