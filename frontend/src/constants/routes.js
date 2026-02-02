const basePath = '/api/v1'

export default {
  signup: () => [basePath, 'signup'].join('/'),
  login: () => [basePath, 'login'].join('/'),
  channels: () => [basePath, 'channels'].join('/'),
  postChannel: (id) => [basePath, 'channels', id].join('/'),
  messages: () => [basePath, 'messages'].join('/'),
  postMessage: (id) => [basePath, 'messages', id].join('/'),
}
