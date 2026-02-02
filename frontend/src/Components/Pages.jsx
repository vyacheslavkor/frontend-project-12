import notfound from '../assets/404.svg'
import avatar from '../assets/avatar.jpg'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch } from 'react-redux'
import { setCredentials, logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import routes from '../constants/routes.js'
import cn from 'classnames'

const NotFound = () => {
  return (<>
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container"><a className="navbar-brand" href="/">Hexlet Chat</a></div>
      </nav>
      <div className="text-center">
        <img alt="Страница не найдена" className="img-fluid h-25" src={notfound}/>
        <h1 className="h4 text-muted">Страница не найдена</h1>
        <p className="text-muted">Но вы можете перейти <a href="/">на главную страницу</a></p>
      </div>
    </div>
    <div className="Toastify"></div>
  </>)
}

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (<div className="d-flex flex-column h-100">
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container"><a className="navbar-brand" href="/">Hexlet Chat</a></div>
    </nav>
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center"><img
                src={avatar} className="rounded-circle" alt="Войти"
              /></div>
              <Formik initialValues={{ username: '', password: '' }}
                      onSubmit={(values, { setSubmitting, setErrors }) => {
                        setSubmitting(true)
                        const { username, password } = values

                        const tryLogin = async () => {
                          try {
                            console.log(username, password)
                            const response = await axios.post(routes.login(), {
                              username, password
                            })

                            console.log('resp')
                            dispatch(setCredentials({ token: response.data.token, username: response.data.username }))

                            navigate('/')
                          } catch {
                            setErrors({ password: 'Неверные имя пользователя или пароль' })
                          } finally {
                            setSubmitting(false)
                          }
                        }

                        tryLogin()
                      }}
              >
                {({ isSubmitting, errors }) => (<Form className="col-12 col-md-6 mt-3 mt-md-0">
                  <h1 className="text-center mb-4">Войти</h1>
                  <div className="form-floating mb-3">
                    <Field id="username"
                           className={cn('form-control', { 'is-invalid': Object.hasOwn(errors, 'password') && errors.password })}
                           name="username"
                           autoComplete="username" required={true} placeholder="Ваш ник"
                    />
                    <label htmlFor="username">Ваш ник</label>
                  </div>
                  <div className="form-floating mb-4">
                    <Field type="password" id="password" required={true}
                           className={cn('form-control', { 'is-invalid': Object.hasOwn(errors, 'password') && errors.password })}
                           name="password" placeholder="Пароль" autoComplete='current-password'
                    />
                    <label htmlFor="password" className="form-label">Пароль</label>
                    {Object.hasOwn(errors, 'password') && errors.password ?
                      <div className="invalid-tooltip">{errors.password}</div> : null}
                  </div>
                  <button type="submit" className="w-100 mb-3 btn btn-outline-primary"
                          disabled={isSubmitting}>Войти
                  </button>
                </Form>)}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center"><span>Нет аккаунта?</span> <a href="/signup">Регистрация</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>)
}

const Main = () => {
  return <div></div>
}

export {
  NotFound, Login, Main
}
    
