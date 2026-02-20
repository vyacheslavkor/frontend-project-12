import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import routes from '../../constants/routes.js'
import axios from 'axios'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState }) => {
    const response = await axios.get(routes.channels(), { headers: { Authorization: `Bearer ${getState().auth.token}` } })
    return response.data
  },
)

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channel, { getState }) => {
    const response = await axios.post(routes.channels(), channel, { headers: { Authorization: `Bearer ${getState().auth.token}` } })
    return response.data
  },
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id, { getState }) => {
    const response = await axios.delete(routes.postChannel(id), { headers: { Authorization: `Bearer ${getState().auth.token}` } })
    return response.data
  },
)

export const updateChannel = createAsyncThunk(
  'channels/updateChannel',
  async (channel, { getState }) => {
    const response = await axios.patch(routes.postChannel(channel.id), { name: channel.name }, { headers: { Authorization: `Bearer ${getState().auth.token}` } })
    return response.data
  },
)

const channelsAdapter = createEntityAdapter()

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ currentChannel: null, loadingStatus: 'loading' }),
  reducers: {
    addChannel: channelsAdapter.addOne,
    deleteChannel: channelsAdapter.removeOne,
    changeChannel: channelsAdapter.updateOne,
    changeCurrentChannel: (state, action) => {
      state.currentChannel = action.payload
    },
    changeToDefault: (state) => {
      state.currentChannel = channelsAdapter.getSelectors().selectAll(state).at(0).id
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      channelsAdapter.addMany(state, action)
      if (state.currentChannel === null) {
        state.currentChannel = action.payload.at(0).id
        state.loadingStatus = 'idle'
      }
    }).addCase(fetchChannels.pending, (state) => {
      state.loadingStatus = 'loading'
    }).addCase(createChannel.fulfilled, (state, action) => {
      channelsAdapter.addOne(state, action)
      state.currentChannel = action.payload.id
    }).addCase(removeChannel.fulfilled, (state, action) => {
      channelsAdapter.removeOne(state, action.payload.id)
      if (state.currentChannel === action.payload.id) {
        state.currentChannel = channelsAdapter.getSelectors().selectAll(state).at(0).id
      }
    }).addCase(updateChannel.fulfilled, (state, action) => {
      const { id, name } = action.payload
      channelsAdapter.updateOne(state, { id, changes: { name } })
    })
  },
})

export const channelSelectors = channelsAdapter.getSelectors(state => state.channels)
export const { changeCurrentChannel, addChannel, deleteChannel, changeChannel, changeToDefault } = channelsSlice.actions

export default channelsSlice.reducer
