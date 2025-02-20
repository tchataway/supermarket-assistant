import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'

const fetchProduct = async (productRef, setLoading) => {
  try {
    setLoading(true)

    const snapshot = await getDoc(doc(db, 'products', productRef))

    setLoading(false)
    return snapshot.data()
  } catch (error) {
    setLoading(false)
    console.log(error)
  }
}

export default fetchProduct
