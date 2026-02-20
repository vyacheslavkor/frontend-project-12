import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.jpg'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import axios from 'axios'
import routes from '../../constants/routes.js'
import { setCredentials } from '../../features/auth/authSlice.js'
import cn from 'classnames'
import { Button } from 'react-bootstrap'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={avatar}
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                  setSubmitting(true)
                  const { username, password } = values

                  const tryLogin = async () => {
                    try {
                      const response = await axios.post(routes.login(), {
                        username, password,
                      })

                      dispatch(setCredentials({ token: response.data.token, username: response.data.username }))

                      navigate('/')
                    }
                    catch {
                      setErrors({ password: 'Неверные имя пользователя или пароль' })
                    }
                    finally {
                      setSubmitting(false)
                    }
                  }

                  tryLogin()
                }}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-md-0">
                    <h1 className="text-center mb-4">Войти</h1>
                    <div className="form-floating mb-3">
                      <Field
                        id="username"
                        className={cn('form-control', { 'is-invalid': Object.hasOwn(errors, 'password') && errors.password })}
                        name="username"
                        autoComplete="username"
                        required={true}
                        placeholder="Ваш ник"
                      />
                      <label htmlFor="username">Ваш ник</label>
                    </div>
                    <div className="form-floating mb-4">
                      <Field
                        type="password"
                        id="password"
                        required={true}
                        className={cn('form-control', { 'is-invalid': errors.password })}
                        name="password"
                        placeholder="Пароль"
                        autoComplete="current-password"
                      />
                      <label htmlFor="password" className="form-label">Пароль</label>
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="invalid-tooltip"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-100 mb-3 btn btn-outline-primary"
                      disabled={isSubmitting}
                      variant={null}
                    >
                      Войти
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                {' '}
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
