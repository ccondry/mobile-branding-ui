// determine URL base for production or development environment
let base
let mmBase
if (process.env.NODE_ENV === 'production') {
  // production environment
  base = 'https://mm-brand.cxdemo.net/api/v1'
  mmBase = 'https://mm.cxdemo.net/api/v1'
} else {
  // development environment
  // prefix base URL with localhost and port
  // base = 'http://localhost:3037/api/v1'
  // use production REST API
  base = 'https://mm-brand.cxdemo.net/api/v1'
  mmBase = 'https://mm.cxdemo.net/api/v1'
}

const state = {
  endpoints: {
    // This REST API endpoint software version.
    version: base + '/version',
    // Retrieves the dCloud session config for given session and datacenter (and userId if instant demo).
    session: base + '/session',
    // Retrieves the brand config.
    brand: base + '/brand',
    // Retrieves the base demo config.
    demo: base + '/demo',
    // upload photo
    photo: mmBase + '/photos',
    // upload answers
    answers: mmBase + '/answers',
    // multichannel options list
    multichannel: base + '/multichannel'
  }
}

const getters = {
  // REST API endpoints
  endpoints: state => state.endpoints
}

export default {
  state,
  getters
}
