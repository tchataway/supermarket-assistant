import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import List from './pages/List'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PrivateRoute />}>
          <Route path='/' element={<List />} />
        </Route>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default App
