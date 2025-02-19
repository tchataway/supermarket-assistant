import { useEffect, useState } from 'react'
import Progress from './Progress'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Box, HStack, Skeleton } from '@chakra-ui/react'

const Request = ({ request, shopName }) => {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState({
    name: '',
    aisles: {},
  })

  const { amount, productRef } = request

  useEffect(() => {
    // Hydrate product data.
    const getProduct = async () => {
      try {
        setLoading(true)

        const snapshot = await getDoc(doc(db, 'products', productRef))

        setProduct(snapshot.data())

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    getProduct()
  }, [request])

  if (loading) {
    return <Skeleton height='50px' />
  }

  if (!product) {
    return <Box>Bad product data.</Box>
  }

  const aisle = product.aisles[shopName]

  return (
    <HStack justifyContent='space-between' spacing={4}>
      <Progress maxCount={amount} />
      <Box width='100%' justifyContent='start'>
        {product.name}
      </Box>
      <Box fontWeight='semibold' width='50px' textAlign='center'>
        {aisle}
      </Box>
    </HStack>
  )
}

export default Request
