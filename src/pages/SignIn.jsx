import { Box, Button } from '@chakra-ui/react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const user = auth.currentUser
  const provider = new GoogleAuthProvider()

  const handleClick = async () => {
    try {
      await signInWithPopup(auth, provider)
      navigate('/')
    } catch (error) {
      console.log('Unable to sign in')
      console.log(error)
    }
  }

  if (!user) {
    return (
      <Button colorScheme='blue' mt='4rem' onClick={handleClick}>
        Sign In with Google
      </Button>
    )
  }

  return (
    <Box mx='auto' maxWidth={'300px'}>
      <Box mt='4rem'>{`Currently signed in as ${user.displayName}`}</Box>
    </Box>
  )
}

export default SignIn
