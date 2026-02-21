import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.jpg'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { login, setCredentials } from '../../features/auth/authSlice.js'
import cn from 'classnames'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

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
                  alt={t('buttons.login')}
                />
              </div>
              <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  setSubmitting(true)
                  const { username, password } = values

                  try {
                    const response = await dispatch(login({ username, password })).unwrap()

                    dispatch(setCredentials({ token: response.token, username: response.username }))
                    navigate('/')
                  }
                  catch (error) {
                    if (error.code === 'ERR_NETWORK') {
                      toast.error(t('errors.network'))
                      setErrors({ network: 'ERR_NETWORK' })
                    }
                    else {
                      setErrors({ password: t('errors.wrong_username_or_password') })
                    }
                  }
                  finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-md-0">
                    <h1 className="text-center mb-4">{t('buttons.login')}</h1>
                    <div className="form-floating mb-3">
                      <Field
                        id="username"
                        className={cn('form-control', { 'is-invalid': errors.password })}
                        name="username"
                        autoComplete="username"
                        required={true}
                        placeholder={t('fields.your_nick')}
                      />
                      <label htmlFor="username">{t('fields.your_nick')}</label>
                    </div>
                    <div className="form-floating mb-4">
                      <Field
                        type="password"
                        id="password"
                        required={true}
                        className={cn('form-control', { 'is-invalid': errors.password })}
                        name="password"
                        placeholder={t('fields.password')}
                        autoComplete="current-password"
                      />
                      <label htmlFor="password" className="form-label">{t('fields.password')}</label>
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
                      {t('buttons.login')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('have_not_account')}</span>
                {' '}
                <a href="/signup">{t('buttons.signup')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
