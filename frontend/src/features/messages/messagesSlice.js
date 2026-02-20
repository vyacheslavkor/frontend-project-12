import { createSlice, createEntityAdapter, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import routes from '../../constants/routes.js'
import axios from 'axios'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { getState }) => {
    const response = await axios.get(routes.messages(), { headers: { Authorization: `Bearer ${getState().auth.token}` } })
    return response.data
  },
)

export const postMessage = createAsyncThunk(
  'messages/postMessage',
  async (message, { getState }) => {
    const response = await axios.post(routes.messages(), message, { headers: { Authorization: `Bearer ${getState().auth.token}` } })
    return response.data
  },
)

const messagesAdapter = createEntityAdapter()

const messagesSlice = createSlice({
  name: 'channels',
  initialState: messagesAdapter.getInitialState({ currentChannel: null, loadingStatus: 'idle' }),
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      messagesAdapter.addMany(state, action)
    }).addCase(postMessage.fulfilled, () => {
      // messagesAdapter.addOne(state, action)
    })
  },
})

export const messageSelectors = messagesAdapter.getSelectors(state => state.messages)

export const selectMessagesByChannel = createSelector(
  [messagesAdapter.getSelectors().selectAll, (_, channelId) => channelId],
  (messages, channelId) => channelId ? messages.filter(message => message.channelId === channelId) : [],
)

export const { addMessage } = messagesSlice.actions

export default messagesSlice.reducer
