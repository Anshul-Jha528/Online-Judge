import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import {Routes,Route,Navigate} from 'react-router-dom'
function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Login" replace/>}/>
      <Route path="/Dashboard" element={<Dashboard />}/>
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
  )
}

export default App
