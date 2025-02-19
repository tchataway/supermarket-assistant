import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Box, useToast } from '@chakra-ui/react'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'

const List = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
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

        // If we got this far we have the data for an approved user.
        setLoading(false)
        setUser(userData)
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

  if (loading) {
    return <Spinner />
  }

  return (
    <Box maxWidth={'400px'} mx='auto'>
      {!user && (
        <Box mt='4rem' mx='2rem'>
          User not approved.
        </Box>
      )}
      {user && (
        <Box mt='4rem' mx='2rem'>
          {`${authUser.displayName}'s list has ${user.list.length} item(s) on it.`}
        </Box>
      )}
    </Box>
  )
}

export default List
