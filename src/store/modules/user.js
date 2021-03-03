import * as types from '../mutation-types'

const state = {
  user: {}
}

const mutations = {
  [types.SET_USER] (state, data) {
    state.user = data
  }
}

const getters = {
  user: state => state.user,
  isLoggedIn: state => {
    try {
      return state.user.id.length === 4
    } catch (e) {
      return false
    }
  }
}

const actions = {
  setUser ({commit}, user) {
    commit(types.SET_USER, user)
  },
  logout ({commit}) {
    commit(types.SET_USER, {})
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
