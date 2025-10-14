import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import Request from '../components/Request'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import fetchProduct from '../functions/fetchProduct'
import sortByColesAisle from '../functions/sortByColesAisle'
import sortByFoodlandAisle from '../functions/sortByFoodlandAisle'
import sortByWoolworthsAisle from '../functions/sortByWoolworthsAisle'
import NewRequest from '../components/NewRequest'
import EditRequestModal from '../components/EditRequestModal'

const List = () => {
  const [user, setUser] = useState(null)
  const [selectedShopName, setSelectedShopName] = useState('Foodland')
  const [shopName, setShopName] = useState('foodland')
  const [list, setList] = useState([])
  const [sortedList, setSortedList] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortDescending, setSortDescending] = useState(true)
  const [autocompleteOptions, setAutocompleteOptions] = useState([])

  // Edit Request Modal:
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [requestToEdit, setRequestToEdit] = useState({})

  const toast = useToast()

  const auth = getAuth()
  const authUser = auth.currentUser

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
            aisleDataFetched: true,
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

  // Get product names for auto-complete.
  const getProductNames = async () => {
    const allProducts = await getDocs(collection(db, 'products'))

    const productNames = allProducts.docs.map((productDoc) => {
      return productDoc.data().name
    })

    setAutocompleteOptions(productNames)
  }

  const initialisePage = async () => {
    await getUser()
    getProductNames()
  }

  useEffect(() => {
    initialisePage()
  }, [authUser, toast])

  // Sort list whenever it or selected shop name changes.
  useEffect(() => {
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

  const validateNewRequest = (newRequest) => {
    const existingRequest = sortedList.filter(
      (listItem) => listItem.name.toLowerCase() === newRequest.toLowerCase()
    )

    if (existingRequest.length > 0) {
      // Prevent duplicate request entries.
      toast({
        status: 'error',
        description: `${existingRequest[0].name} already on list`,
      })
      return false
    }

    return true
  }

  const findAndUpdateRequest = (updatedRequest) => {
    let updatedList = [...list]

    const index = updatedList.findIndex(
      (request) => request.name === updatedRequest.name
    )

    if (index === -1) {
      // Couldn't find it, probably deleted before task was finished.
      return
    }

    updatedRequest.aisleDataFetched = true
    updatedList[index] = { ...updatedList[index], ...updatedRequest }
    setList(updatedList)
  }

  const handleNewRequestAdded = async (amount, itemName, inputRef) => {
    // Attempt to retrieve product information.
    const newRequest = {
      amount,
      remaining: amount,
      name: itemName,
      aisles: {},
    }

    // Add new request to list.
    setList((prevState) => [...prevState, newRequest])
    inputRef.current.focus()
  }

  const openModal = (request) => {
    setRequestToEdit(request)
    onOpen()
  }

  const removeRequest = (itemName) => {
    let updatedList = list.filter((listItem) => listItem.name !== itemName)

    setList(updatedList)
  }

  const handleModalConfirm = (modalData) => {
    if (modalData.removeRequest) {
      // Handle delete.
      removeRequest(modalData.request.name)
      return
    }

    // Find edited request in list and update it.
    let updatedList = [...list]
    const editIndex = updatedList.findIndex(
      (request) => request.name === modalData.request.name
    )

    // Calculate new "remaining" number by adding the difference
    // between requested amounts to it. For example, if a request
    // has "2" requested, then by default it will also have "2"
    // remaining. If we increase the amount requested to "3",
    // the difference is +1, so the remaining would go from "2" to "3".
    const oldRequest = updatedList[editIndex]
    const updatedRequest = modalData.request
    const deltaAmountRequested = updatedRequest.amount - oldRequest.amount

    // If the new amount is less than the old one, our new remaining
    // could be negative, so clamp it to 0.
    updatedRequest.remaining = Math.max(
      oldRequest.remaining + deltaAmountRequested,
      0
    )

    updatedList[editIndex] = { ...oldRequest, ...updatedRequest }
    setList(updatedList)
  }

  const handleUpdateList = () => {
    const submitListUpdates = async () => {
      const remainingItems = []
      setLoading(true)

      try {
        const batch = writeBatch(db)

        await Promise.all(
          list.map(async (listItem) => {
            // Update product data in DB.
            let productRef = ''
            const q = query(
              collection(db, 'products'),
              where('name', '==', listItem.name)
            )
            const existingProduct = await getDocs(q)

            if (!existingProduct.empty) {
              // Update existing document.
              batch.update(doc(db, 'products', existingProduct.docs[0].id), {
                ...existingProduct.docs[0].data(),
                aisles: listItem.aisles,
              })
              productRef = existingProduct.docs[0].id
            } else {
              // New item. Add to database.
              const newProductDocRef = await addDoc(
                collection(db, 'products'),
                {
                  name: listItem.name,
                  aisles: listItem.aisles,
                }
              )
              productRef = newProductDocRef.id
            }

            if (listItem.remaining > 0) {
              // If this item is still requested, add it to
              // list of items to send to DB.
              remainingItems.push({
                amount: listItem.remaining,
                productRef,
              })
            }
          })
        )

        await batch.commit()

        // Update user list.
        const userRef = auth.currentUser.uid
        const userDocRef = doc(db, 'users', userRef)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()

        await updateDoc(doc(db, 'users', userRef), {
          ...userData,
          list: remainingItems,
        })
      } catch (error) {
        toast({
          status: 'error',
          description: 'Failed to update list in database',
        })
        console.log(error)
      }

      // Trigger refresh.
      await initialisePage()
      setLoading(false) // initialisePage() should do this, but this is thorough.
    }

    submitListUpdates()
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
          <Box mt='4rem' mx='2rem' height='auto' zIndex={0}>
            <Select
              value={selectedShopName}
              onChange={handleShopNameChange}
              placeholder='Select shop'
              mb='2rem'
            >
              <option>Foodland</option>
              <option>Coles</option>
              <option>Woolworths</option>
            </Select>
          </Box>
          <div className='above'>
            <NewRequest
              onSubmit={handleNewRequestAdded}
              autocompleteOptions={autocompleteOptions}
              validate={validateNewRequest}
            />
          </div>
          <IconButton
            icon={sortDescending ? <ArrowDownIcon /> : <ArrowUpIcon />}
            onClick={handleSortClick}
            width='30px'
            alignSelf='end'
            className='below'
          />
          <Box height='100%' overflowY='auto' className='hideScrollbar'>
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
                  onContextMenu={() => {
                    openModal(request)
                  }}
                  onDataReceived={(updatedRequest) =>
                    findAndUpdateRequest(updatedRequest)
                  }
                  mb='6px'
                />
              </div>
            ))}
          </Box>
        </>
      )}

      {/* Edit Request Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <EditRequestModal
          onConfirm={handleModalConfirm}
          onClose={onClose}
          request={requestToEdit}
        />
      </Modal>

      <Button
        colorScheme='blue'
        my='2rem'
        mx='3rem'
        height='100px'
        onClick={handleUpdateList}
      >
        Update List
      </Button>
    </Box>
  )
}

export default List
