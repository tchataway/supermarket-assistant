import Progress from './Progress'
import { Box, HStack, Spinner, useToast } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase.config'

const Request = ({
  request,
  shopName,
  onChange,
  onContextMenu,
  onDataReceived,
}) => {
  const { amount, name, aisles, remaining, aisleDataFetched } = request
  const aisle = aisles[shopName]
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleProgressChange = (newCount) => {
    onChange(newCount)
  }

  useEffect(() => {
    // Attempt to get aisle data from DB.
    const populateAislesData = async () => {
      const requestWithAislesData = {
        name,
        aisles: {},
      }

      setLoading(true)
      try {
        const q = query(collection(db, 'products'), where('name', '==', name))
        const existingProduct = await getDocs(q)

        if (!existingProduct.empty) {
          // Populate aisles data.
          const aislesData = existingProduct.docs[0].data().aisles
          requestWithAislesData.aisles = aislesData
        }
      } catch (error) {
        toast({ status: error, description: 'Network error occurred' })
        return
      }

      onDataReceived(requestWithAislesData)
      setLoading(false)
    }

    if (!aisleDataFetched) {
      populateAislesData()
    }
  }, [aisles, aisleDataFetched])

  return (
    <HStack
      justifyContent='space-between'
      spacing={4}
      onContextMenu={(e) => {
        e.preventDefault()

        if (loading) {
          // Prevent edits until loading is finished.
          return
        }

        onContextMenu()
      }}
    >
      <Progress
        maxCount={amount}
        remaining={remaining}
        onChange={handleProgressChange}
      />
      <Box width='100%' justifyContent='start' userSelect='none'>
        {name}
      </Box>
      <Box
        fontWeight='semibold'
        fontSize={'lg'}
        width='50px'
        textAlign='center'
        userSelect='none'
      >
        {loading ? (
          <Spinner />
        ) : aisle ? (
          aisle
        ) : (
          <LockIcon color='red.500' height='60%' width='60%' />
        )}
      </Box>
    </HStack>
  )
}

export default Request
