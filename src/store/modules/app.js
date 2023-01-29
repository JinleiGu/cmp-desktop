const app = {
  state: {
    link: '',
    userData: {},
    dictData: '',
    moduleTitle: '',
    themeImg: ''
  },
  mutations: {
    SET_LINK (state, data) {
      state.link = data
    },
    SET_USERDATA (state, data) {
      state.userData = data
    },
    SET_DICTDATA (state, data) {
      state.dictData = data
    },
    SET_MODULETITLE (state, data) {
      state.moduleTitle = data
    },
    SET_THEMEIMG (state, data) {
      state.themeImg = data
    }
  }
}
export default app
