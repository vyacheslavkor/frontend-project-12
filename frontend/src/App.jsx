import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound, Login, Main, Signup } from './Components/Pages'
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
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
