import { useEffect, useRef, useState } from 'react'
import {
  fetchChannels,
  channelSelectors,
  changeCurrentChannel,
  createChannel, removeChannel, updateChannel, addChannel, deleteChannel, changeChannel, changeToDefault,
} from '../../features/channels/channelsSlice.js'
import {
  addMessage,
  fetchMessages, postMessage,
  selectMessagesByChannel,
} from '../../features/messages/messagesSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import ListGroup from 'react-bootstrap/ListGroup'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import cn from 'classnames'
import { io } from 'socket.io-client'
import Modal from 'react-bootstrap/Modal'
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'

const Channel = (props) => {
  const { channel, isActive } = props
  const { removable } = channel

  return (
    <ListGroup.Item as="li" className="nav-item w-100">
      {removable ? <RemovableChannelButton channel={channel} isActive={isActive} /> : <DefaultChannelButton channel={channel} isActive={isActive} />}
    </ListGroup.Item>
  )
}

const DefaultChannelButton = (props) => {
  const { channel, isActive } = props
  const dispatch = useDispatch()
  const handleClick = () => isActive ? null : dispatch(changeCurrentChannel(channel.id))
  const buttonClasses = cn('w-100 rounded-0 text-start btn')

  return (
    <Button type="button" className={buttonClasses} onClick={handleClick} variant={isActive ? 'secondary' : null}>
      <span className="me-1">#</span>
      {channel.name}
    </Button>
  )
}

const ChannelFormModal = (props) => {
  const { show, handleClose, channelId } = props
  const dispatch = useDispatch()
  const channels = useSelector(channelSelectors.selectAll)
  const { t } = useTranslation()

  const channelValidationSchema = yup.object().shape({
    name: yup.string()
      .required(t('errors.required_field'))
      .min(3, t('errors.channel_length', { min: 3, max: 20 }))
      .max(20, t('errors.channel_length', { min: 3, max: 20 }))
      .notOneOf(channels.map(channel => channel.name), t('errors.channel_unique'))
      .trim(),
  })

  const { name } = channelId ? channels.find(channel => channel.id === channelId) : { name: '' }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{channelId ? t('add_channel') : t('rename_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name }}
          onSubmit={async ({ name }, { setSubmitting, resetForm }) => {
            const filteredName = ['en', 'ru'].reduce((name, lang) => {
              filter.loadDictionary(lang)
              return filter.clean(name)
            }, name)
            if (channelId) {
              await dispatch(updateChannel({ id: channelId, name: filteredName }))
              toast.success(t('channel.renamed'))
            }
            else {
              await dispatch(createChannel({ name: filteredName }))
              toast.success(t('channel.created'))
            }
            handleClose()
            resetForm()
            setSubmitting(false)
          }}
          validationSchema={channelValidationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
        >
          {({ errors }) => {
            const inputClasses = cn('mb-2', 'form-control', {
              'is-invalid': errors.name,
            })

            return (
              <Form>
                <div>
                  <Field name="name" className={inputClasses} id="name" autoFocus />
                  <label htmlFor="name" className="visually-hidden">{t('channel_name')}</label>
                  <ErrorMessage
                    component="div"
                    name="name"
                    className="invalid-feedback"
                  />
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={handleClose} className="me-2">
                      {t('buttons.cancel')}
                    </Button>
                    <Button variant="primary" type="submit">
                      {t('buttons.submit')}
                    </Button>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

const RemovableChannelButton = (props) => {
  const { channel, isActive } = props
  const dispatch = useDispatch()
  const handleChannelClick = () => isActive ? null : dispatch(changeCurrentChannel(channel.id))
  const buttonClasses = cn('w-100 rounded-0 text-start text-truncate', {
    'btn-secondary': isActive,
  })

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const [showRemove, setRemoveShow] = useState(false)
  const handleRemoveShow = () => setRemoveShow(true)
  const handleRemoveClose = () => setRemoveShow(false)

  const { t } = useTranslation()

  const handleRemove = async () => {
    await dispatch(removeChannel(channel.id))
    handleRemoveClose()
    toast.success(t('channel.removed'))
  }

  return (
    <Dropdown
      as={ButtonGroup}
      className="d-flex"
    >
      <Button
        variant={isActive ? 'secondary' : null}
        onClick={handleChannelClick}
        className={buttonClasses}
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>

      <Dropdown.Toggle split variant={isActive ? 'secondary' : null} id="dropdown-split-basic">
        <span className={cn('visually-hidden')}>{t('channel_management')}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRemoveShow}>{t('buttons.delete')}</Dropdown.Item>
        <Modal show={showRemove} onHide={handleRemoveClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('delete_channel')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="lead">{t('sure')}</p>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleRemoveClose} className="me-2">
                {t('buttons.cancel')}
              </Button>
              <Button variant="danger" type="button" onClick={handleRemove}>
                {t('buttons.delete')}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
        <Dropdown.Item onClick={handleShow}>{t('buttons.rename')}</Dropdown.Item>
        <ChannelFormModal show={show} onHide={handleClose} channelId={channel.id} handleClose={handleClose} />
      </Dropdown.Menu>
    </Dropdown>
  )
}

const Main = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  const channels = useSelector(channelSelectors.selectAll)
  const currentChannelId = useSelector(state => state.channels.currentChannel)
  const { username, token } = useSelector(state => state.auth)

  const { loadingStatus } = useSelector(state => state.channels)
  const channelMessages = useSelector(state =>
    selectMessagesByChannel(state.messages, currentChannelId ? currentChannelId : null),
  )
  const currentChannel = channels.find(channel => channel.id === currentChannelId)

  const inputRef = useRef(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentChannel?.id])

  const socketRef = useRef(null)

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001'
    if (!socketRef.current) {
      socketRef.current = io(socketUrl)
    }

    const socket = socketRef.current
    if (!socket.connected) {
      socket.connect()
    }

    const socketListenersMap = {
      newMessage: (newMessage) => {
        dispatch(addMessage(newMessage))
      },
      newChannel: (newChannel) => {
        dispatch(addChannel(newChannel))
      },
      removeChannel: (channel) => {
        if (currentChannelId === channel.id) {
          dispatch(changeToDefault())
        }
        dispatch(deleteChannel(channel.id))
      },
      renameChannel: (channel) => {
        const { id, name } = channel
        dispatch(changeChannel({ id, changes: { name } }))
      },
    }

    for (const [listener, callback] of Object.entries(socketListenersMap)) {
      if (!socket.hasListeners(listener)) {
        socket.on(listener, callback)
      }
    }

    return () => {
      for (const listener of Object.keys(socketListenersMap)) {
        socket.off(listener)
      }

      socket.disconnect()
    }
  }, [token, dispatch, currentChannelId])

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const { t } = useTranslation()

  if (loadingStatus === 'loading') {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>
    )
  }

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('channels')}</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleShow}>
              <svg
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-plus-square"
              >
                <path
                  d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                >
                </path>
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                >
                </path>
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => {
              return <Channel channel={channel} isActive={currentChannel.id === channel.id} />
            })}
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0"><b>{currentChannel ? `# ${currentChannel.name}` : ''}</b></p>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {channelMessages.map((message) => {
                return (
                  <div className="text-break mb-2">
                    <b>{message.username}</b>
                    {': '}
                    {message.body}
                  </div>
                )
              })}
            </div>
            <div className="mt-auto px-5 py-3">
              <Formik
                initialValues={{ body: '' }}
                onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
                  const trimmedBody = values.body.trim()

                  if (!trimmedBody) {
                    setSubmitting(false)
                    return
                  }

                  const filteredBody = ['en', 'ru'].reduce((body, lang) => {
                    filter.loadDictionary(lang)
                    return filter.clean(body)
                  }, trimmedBody)

                  try {
                    await dispatch(postMessage({
                      body: filteredBody,
                      username,
                      channelId: currentChannel.id,
                    }))

                    resetForm()
                  }
                  catch {
                    setErrors({ body: t('errors.message_not_delivered') })
                  }
                  finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ values, isSubmitting, errors }) => (
                  <Form className="py-1 border rounded-2">
                    <div className="input-group has-validation">
                      <Field
                        name="body"
                        aria-label={t('new_message')}
                        placeholder={t('message_placeholder')}
                        autoFocus
                        innerRef={inputRef}
                        className={cn('border-0', 'p-0', 'ps-2', 'form-control', { 'is-invalid': errors.body })}
                      />
                      <Button
                        type="submit"
                        className="btn btn-group-vertical"
                        disabled={isSubmitting || !values.body.trim()}
                        variant={null}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-arrow-right-square"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                          />
                        </svg>
                        <span className="visually-hidden">{t('buttons.submit')}</span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ChannelFormModal show={show} handleClose={handleClose} channelId={null} />
    </div>
  )
}

export default Main
