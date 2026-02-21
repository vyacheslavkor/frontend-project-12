import signupPic from '../../assets/signup.jpg'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { Button } from 'react-bootstrap'
import { setCredentials, signup } from '../../features/auth/authSlice.js'
import { useTranslation } from 'react-i18next'

const Signup = () => {
  const { t } = useTranslation()

  const validationSchema = yup.object().shape({
    username: yup.string()
      .required(t('errors.required_field'))
      .min(3, t('errors.username_length', { min: 3, max: 20 }))
      .max(20, t('errors.username_length', { min: 3, max: 20 }))
      .trim(),
    password: yup.string()
      .required(t('errors.required_field'))
      .min(6, t('errors.password_length', { min: 6 })),
    confirmPassword: yup.string()
      .required(t('errors.required_field'))
      .oneOf(
        [yup.ref('password'), null],
        t('errors.confirm_password'),
      ),
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={signupPic}
                  className="rounded-circle"
                  alt={t('buttons.signup')}
                />
              </div>
              <Formik
                initialValues={{ username: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                validateOnMount={false}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  setSubmitting(true)

                  try {
                    const registerResult = await dispatch(signup({ username: values.username, password: values.password })).unwrap()

                    const { token, username } = registerResult
                    dispatch(setCredentials({ token, username }))

                    navigate('/')
                  }
                  catch (error) {
                    if (error.code === 409) {
                      setErrors({ confirmPassword: t('errors.username_conflict') })
                    }
                    else {
                      setErrors({ confirmPassword: t('errors.oops') })
                    }
                  }

                  setSubmitting(false)
                }}
              >
                {({ isSubmitting, errors, touched }) => {
                  return (
                    <Form className="w-50">
                      <h1 className="text-center mb-4">{t('buttons.signup')}</h1>
                      <div className="form-floating mb-3">
                        <Field
                          id="username"
                          className={cn('form-control', { 'is-invalid': touched.username && errors.username })}
                          name="username"
                          autoComplete="username"
                          required={true}
                          placeholder={t('errors.username_length', { min: 3, max: 20 })}
                          autoFocus
                        />
                        <label className="form-label" htmlFor="username">{t('fields.username')}</label>
                        <ErrorMessage
                          component="div"
                          name="username"
                          className="invalid-tooltip"
                        />
                      </div>
                      <div className="form-floating mb-3">
                        <Field
                          id="password"
                          className={cn('form-control', { 'is-invalid': touched.password && errors.password })}
                          name="password"
                          autoComplete="new-password"
                          required={true}
                          placeholder={t('errors.password_length', { min: 6 })}
                          type="password"
                        />
                        <label className="form-label" htmlFor="password">{t('fields.password')}</label>
                        <ErrorMessage
                          component="div"
                          name="password"
                          className="invalid-tooltip"
                        />
                      </div>
                      <div className="form-floating mb-4">
                        <Field
                          id="confirmPassword"
                          className={cn('form-control', { 'is-invalid': touched.confirmPassword && errors.confirmPassword })}
                          name="confirmPassword"
                          autoComplete="new-password"
                          required={true}
                          placeholder={t('errors.confirm_password')}
                          type="password"
                        />
                        <label className="form-label" htmlFor="confirmPassword">{t('fields.confirm_password')}</label>
                        <ErrorMessage
                          component="div"
                          name="confirmPassword"
                          className="invalid-tooltip"
                        />
                      </div>
                      <Button className="w-100" variant="outline-primary" type="submit" disabled={isSubmitting}>{t('buttons.register')}</Button>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Signup
