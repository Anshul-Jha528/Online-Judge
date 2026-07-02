import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminCreateProblem from './Components/AdminCreateProblem'
import AdminProblems from './Components/AdminProblems'
import AdminUpdateProblem from './Components/AdminUpdateProblem'
import ShowAllProblems from './Components/ShowAllProblems'
import Submissions from './Components/Submissions'
import Leaderboard from './Components/Leaderboard'
import Profile from './Components/Profile'
import { ToastContainer } from 'react-toastify'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route element={<Dashboard />}>

          <Route path="/dashboard" element={<ShowAllProblems />} />

          <Route path="/submissions" element={<Submissions />} />

          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/admin/createProblem" element={<AdminCreateProblem />} />

          <Route path="/admin/myProblems" element={<AdminProblems />} />

          <Route
            path="/admin/updateProblem/:problemID"
            element={<AdminUpdateProblem />}
          />
        </Route>

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </>
  )
}

export default App
