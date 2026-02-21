import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../../constants/routes.js'

const initialUser = {
  token: '',
  username: '',
}
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : initialUser
  }
  catch {
    localStorage.removeItem('user')
    return initialUser
  }
}

const user = getStoredUser()

const initialState = {
  token: user.token,
  username: user.username,
}

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, password }) => {
    const response = await axios.post(routes.signup(), { username, password })
    return response.data
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    const response = await axios.post(routes.login(), {
      username, password,
    })

    return response.data
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, username } = action.payload
      state.token = token
      state.username = username
      localStorage.setItem('user', JSON.stringify({ token, username }))
    },
    logout: (state) => {
      state.token = ''
      state.username = ''
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
