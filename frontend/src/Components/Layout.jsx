import { Outlet } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice.js'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'

export default function Layout() {
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const logoutButton = token ? <Button variant="primary" onClick={() => dispatch(logout())}>{t('buttons.logout')}</Button> : null

  return (
    <>
      <div className="d-flex flex-column h-100">
        <Navbar expand="lg" className="shadow-sm" bg="white" variant="light">
          <Container>
            <Navbar.Brand as={Link} to="/">
              {t('header.title')}
            </Navbar.Brand>
            {logoutButton}
          </Container>
        </Navbar>

        <Outlet />
      </div>
      <ToastContainer />
    </>
  )
}
