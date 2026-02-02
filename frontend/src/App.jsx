import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound, Login, Main } from './Components/Pages';
import RequireAuth from './Components/RequireAuth'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound/>}/>
        <Route element={<RequireAuth/>}>
          <Route path="/" element={<Main/>}/>
        </Route>
        <Route path="login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
