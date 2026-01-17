import { createStore } from 'vuex'
import customers from './modules/customers'

export default createStore({
  state: {
    appName: 'Vue CRM',
    sidebarOpen: true,
    loading: false,
    snackbar: {
      show: false,
      message: '',
      color: 'success'
    }
  },

  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SHOW_SNACKBAR(state, { message, color = 'success' }) {
      state.snackbar = { show: true, message, color }
    },
    HIDE_SNACKBAR(state) {
      state.snackbar.show = false
    }
  },

  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    showNotification({ commit }, payload) {
      commit('SHOW_SNACKBAR', payload)
      setTimeout(() => commit('HIDE_SNACKBAR'), 3000)
    }
  },

  modules: {
    customers
  }
})