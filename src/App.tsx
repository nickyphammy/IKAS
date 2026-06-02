import { Route, Routes } from 'react-router-dom'
import AddViewpointPage from './pages/AddViewpointPage'
import DailyRecsPage from './pages/DailyRecsPage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import SavedPage from './pages/SavedPage'
import ViewpointPage from './pages/ViewpointPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/daily-recs" element={<DailyRecsPage />} />
      <Route path="/add-viewpoint" element={<AddViewpointPage />} />
      <Route path="/viewpoint" element={<ViewpointPage />} />
    </Routes>
  )
}

export default App
