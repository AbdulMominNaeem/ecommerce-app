import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { VerifyEmail } from './pages/VerifyEmail'
import { PublicRoute } from './components/PublicRoute'
import { Profile } from './pages/Profile'
import { Dashboard } from './pages/Dashboard'
import { UserManagement } from './pages/UserManagement'
import { Products } from './pages/Products'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/" element={<Home />} />
          <Route path='/UserMg' element={<UserManagement/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path='/productmg' element={<Products/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
