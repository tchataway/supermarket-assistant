import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Box, Button, IconButton, Select, useToast } from '@chakra-ui/react'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import Request from '../components/Request'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import fetchProduct from '../functions/fetchProduct'
import sortByColesAisle from '../functions/sortByColesAisle'
import sortByFoodlandAisle from '../functions/sortByFoodlandAisle'
import sortByWoolworthsAisle from '../functions/sortByWoolworthsAisle'

const List = () => {
  const [user, setUser] = useState(null)
  const [selectedShopName, setSelectedShopName] = useState('')
  const [shopName, setShopName] = useState('foodland')
  const [list, setList] = useState([])
  const [sortedList, setSortedList] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortDescending, setSortDescending] = useState(true)
  const toast = useToast()

  const auth = getAuth()
  const authUser = auth.currentUser

  useEffect(() => {
    // Retrieve user from DB.
    const getUser = async () => {
      if (!authUser) {
        // We should have redirected to the sign in page, but
        // haven't for some reason. Bail out.
        return
      }

      setLoading(true)

      try {
        const snapshot = await getDoc(doc(db, 'users', authUser.uid))

        if (!snapshot.exists()) {
          // User not found in DB.
          setLoading(false)
          return
        }

        const userData = snapshot.data()

        if (!userData.approved) {
          console.log('User found but not approved yet.')
          setLoading(false)
          return
        }

        // Hydrate product data for each request.
        const requestList = await Promise.all(
          userData.list.map(async (item) => {
            const { amount, productRef } = item

            const product = await fetchProduct(productRef, setLoading)

            return {
              amount,
              name: product.name,
              aisles: product.aisles,
              remaining: amount,
            }
          })
        )

        // If we got this far we have the data for an approved user.
        setLoading(false)
        setUser(userData)
        setList(requestList)
      } catch (error) {
        toast({
          status: 'error',
          description: 'Unable to fetch user data from database.',
          duration: '3000',
        })
        console.log(error)
        setLoading(false)
      }
    }

    getUser()
  }, [authUser, toast])

  // Sort list whenever it or selected shop name changes.
  useEffect(() => {
    console.log('Sort begun...')

    let listCopy = [...list]

    switch (shopName) {
      case 'coles':
        setSortedList(
          sortDescending
            ? listCopy.sort(sortByColesAisle).reverse()
            : listCopy.sort(sortByColesAisle)
        )
        break

      case 'foodland':
        setSortedList(
          sortDescending
            ? listCopy.sort(sortByFoodlandAisle).reverse()
            : listCopy.sort(sortByFoodlandAisle)
        )
        break

      case 'woolworths':
        setSortedList(
          sortDescending
            ? listCopy.sort(sortByWoolworthsAisle).reverse()
            : listCopy.sort(sortByWoolworthsAisle)
        )
        break

      default:
        break
    }
  }, [list, shopName, sortDescending])

  const handleShopNameChange = (e) => {
    setSelectedShopName(e.target.value)
    setShopName(e.target.value.toLowerCase())
  }

  const handleSortClick = () => {
    setSortDescending((prevState) => !prevState)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Box
      maxWidth={'400px'}
      height='100vh'
      mx='auto'
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      {!user && (
        <Box mt='4rem' mx='2rem'>
          User not approved.
        </Box>
      )}
      {user && (
        <>
          <Box mt='4rem' mx='2rem' height='auto'>
            <Select
              value={selectedShopName}
              onChange={handleShopNameChange}
              placeholder='Select shop'
            >
              <option>Foodland</option>
              <option>Coles</option>
              <option>Woolworths</option>
            </Select>
          </Box>
          <IconButton
            icon={sortDescending ? <ArrowDownIcon /> : <ArrowUpIcon />}
            onClick={handleSortClick}
            width='30px'
            mt='2rem'
            alignSelf='end'
          />
          <Box height='100%'>
            {sortedList.map((request, index) => (
              <div key={index}>
                <Request
                  request={request}
                  shopName={shopName}
                  onChange={(newCount) => {
                    let updatedList = [...sortedList]

                    const updatedRequest = { ...request, remaining: newCount }
                    updatedList[index] = updatedRequest

                    setList(updatedList)
                  }}
                  mb='6px'
                />
              </div>
            ))}
          </Box>
        </>
      )}
      <Button colorScheme='blue' my='2rem' mx='3rem' height='100px'>
        Finish Shopping
      </Button>
    </Box>
  )
}

export default List
