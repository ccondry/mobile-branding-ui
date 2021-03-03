import * as types from '../mutation-types'
import { Toast } from 'buefy/dist/components/toast'
import Vue from 'vue'
import { setUrlQueryParameter } from '../../utils'

const state = {
  username: '',
  sessionId: '',
  datacenter: '',
  userId: '',
  phone: '',
  sessionInfo: {},
  verticalConfig: '',
  sessionInfoError: null,
  demoBaseConfig: null,
  multichannelOptions: []
}

const getters = {
  // customer name
  username: state => state.username,
  // dCloud session ID
  sessionId: state => state.sessionId,
  // dCloud datacenter
  datacenter: state => state.datacenter,
  // dCloud instant demo user ID
  userId: state => state.userId,
  // dCloud instant demo user phone number
  phone: state => state.phone,
  // dCloud session information, including configuration
  sessionInfo: state => state.sessionInfo,
  // dCloud session configuration
  sessionConfig: (state, getters) => getters.sessionInfo.configuration || {},
  // is chat bot enabled?
  chatBotEnabled: (state, getters) => getters.verticalConfig.chatBotEnabled,
  // is this a UCCX demo?
  isUccx: (state, getters) => getters.sessionInfo.demo === 'uccx',
  // is this a PCCE demo?
  isPcce: (state, getters) => getters.sessionInfo.demo === 'pcce',
  // is this an instant demo?
  isInstantDemo: (state, getters) => getters.sessionInfo.instant === true,
  // is the configured multichannel type ECE?
  isEce: (state, getters) => !getters.sessionConfig.multichannel || getters.sessionConfig.multichannel === 'ece',
  // brand ID (also known as vertical ID)
  brand: (state, getters) => getters.sessionConfig.vertical,
  // full vertical config
  verticalConfig: state => state.verticalConfig,
  // just the website branding-specific config in the vertical config
  // websiteConfig: state => state.verticalConfig.brand,
  // null if no errors, object if errors getting dCloud session info
  sessionInfoError: state => state.sessionInfoError,
  // is this Webex CC v4 Production (Abilene) demo?
  isWebexV4Prod: (state, getters) => {
    try {
      return getters.sessionInfo.demo.toLowerCase() === 'webex' && state.sessionInfo.version.toLowerCase() === 'v4prod'
    } catch (e) {
      return false
    }
  },
  dids: (state, getters) => {
    try {
      return getters.sessionInfo.dids
    } catch (e) {
      return {}
    }
  },
  demoVersion: state => {
    return state.sessionInfo.version
  },
  demoBaseConfig: state => {
    return state.demoBaseConfig
  },
  multichannelOptions: state => state.multichannelOptions,
  hasSessionInput: state => {
    // true if user input looks valid enough to ask server for session info
    return state.datacenter.length === 3 &&
      state.sessionId.length > 0 &&
      state.userId.length === 4 &&
      state.phone.length >= 4 &&
      state.username.length > 2
  }
}

const mutations = {
  [types.SET_SESSION_ID] (state, data) {
    state.sessionId = data
  },
  [types.SET_DATACENTER] (state, data) {
    state.datacenter = data
  },
  [types.SET_USER_ID] (state, data) {
    state.userId = data
  },
  [types.SET_PHONE] (state, data) {
    state.phone = data
  },
  [types.SET_USERNAME] (state, data) {
    state.username = data
  },
  [types.SET_SESSION_INFO] (state, data) {
    state.sessionInfo = data
  },
  [types.SET_BRAND_CONFIG] (state, data) {
    state.verticalConfig = data
    // if brand not set, set to empty object
    if (!state.verticalConfig.brand) {
      Vue.set(state.verticalConfig, 'brand', {})
    }
  },
  [types.SET_SESSION_INFO_ERROR] (state, data) {
    state.sessionInfoError = data
  },
  [types.SET_DEMO_BASE_CONFIG] (state, data) {
    state.demoBaseConfig = data[0]
  },
  [types.SET_MULTICHANNEL_OPTIONS] (state, data) {
    state.multichannelOptions = data.channels
  }
}

const actions = {
  async uploadPhoto ({dispatch, getters}, photo) {
    // add photo as form data to make a multipart/form-data request
    const body = new FormData()
    body.append('file', photo)
    body.append('ani', getters.phone)
    const url = getters.endpoints.photo
    console.log('fetch', url)
    const response = await dispatch('fetch', {
      url,
      group: 'dcloud',
      type: 'photo',
      options: {
        method: 'POST',
        body
      }
    })
    if (response instanceof Error) {
      // error
      console.log('error uploading photo', response.message)
      throw response
    } else {
      // success
      console.log('successfully uploaded photo')
    }
  },
  async uploadAnswers ({dispatch, getters}, data) {
    const body = {
      dataCenter: getters.datacenter,
      sessionId: getters.sessionId,
      os: 'web',
      company: '',
      userName: getters.username,
      emailAddress: '',
      phoneNumber: getters.phone,
      podId: getters.userId,
      verticalOwner: getters.verticalConfig.owner || '',
      verticalName: getters.verticalConfig.name,
      verticalId: getters.verticalConfig.id,
      verticalOption: {
        name: data.caption,
        index: data.index
      },
      gpsLatitude: data.latitude,
      gpsLongitude: data.longitude,
      verticalOptions: []
    }
    // build vertical options array
    for (let x = 0; x < data.verticalOptions.length; x++) {
      const questionQuestions = []
      let fields
      // is this the set of questions answered by the user?
      if (x === data.index) {
        // user answer data
        fields = data.fields
      } else {
        // this is just default data...
        fields = data.verticalOptions[x].fields
      }
      // build set of question/answer data
      for (const field of fields) {
        questionQuestions.push({
          questionLabel: field.name,
          questionAnswer: field.value
        })
      }
      // push question/answer data into verticalOptions property
      body.verticalOptions.push({
        questionLabel: x.caption,
        questionQuestions
      })
    }
    // console.log('uploadAnswers', body)
    const url = getters.endpoints.answers
    const response = await dispatch('fetch', {
      url,
      group: 'dcloud',
      type: 'answers',
      options: {
        method: 'POST',
        body
      }
    })
    if (response instanceof Error) {
      // error
      console.log('error uploading answers', response.message)
      throw response
    } else {
      // success
      console.log('successfully uploaded answers')
    }
  },
  setUserId ({commit}, data = '') {
    commit(types.SET_USER_ID, data)
    setUrlQueryParameter('userId', data)
  },
  setPhone ({commit}, data = '') {
    commit(types.SET_PHONE, data)
    setUrlQueryParameter('phone', data)
  },
  setUsername ({commit}, data = '') {
    commit(types.SET_USERNAME, data)
    setUrlQueryParameter('username', data)
  },
  setSessionId ({commit}, data = '') {
    commit(types.SET_SESSION_ID, data)
    setUrlQueryParameter('sessionId', data)
  },
  setDatacenter ({commit}, data = '') {
    commit(types.SET_DATACENTER, data)
    setUrlQueryParameter('datacenter', data)
  },
  async getSessionInfo ({getters, commit, dispatch}) {
    const response = await dispatch('fetch', {
      url: getters.endpoints.session,
      group: 'dcloud',
      type: 'sessionInfo',
      mutation: types.SET_SESSION_INFO,
      options: {
        query: {
          session: getters.sessionId,
          datacenter: getters.datacenter,
          userId: getters.userId
        }
      }
    })
    if (response instanceof Error) {
      // error
      console.log('error loading dcloud session info:', response)
      commit(types.SET_SESSION_INFO_ERROR, response)
    } else {
      // success
      commit(types.SET_SESSION_INFO_ERROR, null)
      dispatch('getBrand')
      dispatch('getDemoBaseConfig')
      dispatch('getMultichannelOptions')
    }
  },
  async getBrand ({getters, dispatch}) {
    const response = await dispatch('fetch', {
      url: getters.endpoints.brand,
      group: 'dcloud',
      type: 'brand',
      mutation: types.SET_BRAND_CONFIG,
      options: {
        query: {
          id: getters.brand
        }
      }
    })
    if (response instanceof Error) {
      // error
      Toast.open({
        duration: 7000,
        message: 'Failed to load dCloud brand configuration for ' + getters.brand + ': ' + response.message,
        type: 'is-danger'
      })
    }
  },
  async getDemoBaseConfig ({getters, dispatch}) {
    // get the base config for this demo type (UCCX 12.0v2, PCCE 12.5v1, etc.)
    const operation = 'load base demo config'
    const response = await dispatch('fetch', {
      url: getters.endpoints.demo,
      group: 'dcloud',
      type: 'demo',
      message: operation,
      mutation: types.SET_DEMO_BASE_CONFIG,
      options: {
        query: {
          demo: getters.sessionInfo.demo,
          version: getters.sessionInfo.version,
          instant: getters.isInstantDemo
        }
      }
    })
    if (response instanceof Error) {
      // error
      Toast.open({
        duration: 7000,
        message: 'Failed to load dCloud demo base configuration: ' + response.message,
        type: 'is-danger'
      })
    }
  },
  getMultichannelOptions ({getters, dispatch}) {
    console.log('getMultichannelOptions', getters.sessionConfig.multichannel)
    // default to ECE multichannel
    const multichannel = getters.sessionConfig.multichannel || 'ece'
    return dispatch('fetch', {
      group: 'admin',
      type: 'multichannel',
      url: getters.endpoints.multichannel + '/' + multichannel,
      message: 'get multichannel options',
      mutation: types.SET_MULTICHANNEL_OPTIONS
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
