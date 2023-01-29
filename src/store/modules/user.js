import { login, logout, getInfo } from 'api/index'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userData: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERDATA: (state, userData = {}) => {
    state.userData = userData
  }
}

const actions = {
  login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }
        localStorage.setItem('userData', JSON.stringify(response.data))
        commit('SET_USERDATA', response.data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        localStorage.removeItem('userData')
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
