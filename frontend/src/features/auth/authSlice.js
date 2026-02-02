import { createSlice } from '@reduxjs/toolkit'

const initialUser = {
  token: '',
  username: ''
}
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : initialUser
  } catch (err) {
    console.warn('Невалидные данные в localStorage по ключу "user":', err)
    localStorage.removeItem('user')
    return initialUser
  }
}

const user = getStoredUser();

const initialState = {
  token: user.token,
  username: user.username
}

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
      localStorage.removeItem('user');
    },
  },
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
