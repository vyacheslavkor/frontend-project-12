import { Outlet } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="d-flex flex-column h-100">
      <Navbar expand='lg' className='shadow-sm' bg='white' variant='light'>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            Hexlet Chat
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Outlet/>
    </div>
  );
}
