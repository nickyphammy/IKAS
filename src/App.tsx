import { Route, Routes } from 'react-router-dom'
import AddViewpointPage from './pages/AddViewpointPage'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/add-viewpoint" element={<AddViewpointPage />} />
    </Routes>
  )
}

export default App
