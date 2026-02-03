import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound, Login, Main } from './Components/Pages'
import RequireAuth from './Components/RequireAuth'
import Layout from './Components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Main />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
