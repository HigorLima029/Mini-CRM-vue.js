import axios from 'axios'
import store from '@/store'

// Criar instância do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de Request
api.interceptors.request.use(
  (config) => {
    store.commit('SET_LOADING', true)
    
    // Adicionar token se existir
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    store.commit('SET_LOADING', false)
    return Promise.reject(error)
  }
)

// Interceptor de Response
api.interceptors.response.use(
  (response) => {
    store.commit('SET_LOADING', false)
    return response
  },
  (error) => {
    store.commit('SET_LOADING', false)
    
    // Tratar erros
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch('showNotification', { 
            message: 'Sessão expirada. Faça login novamente.', 
            color: 'error' 
          })
          break
        case 404:
          store.dispatch('showNotification', { 
            message: 'Recurso não encontrado.', 
            color: 'error' 
          })
          break
        case 500:
          store.dispatch('showNotification', { 
            message: 'Erro interno do servidor.', 
            color: 'error' 
          })
          break
        default:
          store.dispatch('showNotification', { 
            message: 'Ocorreu um erro. Tente novamente.', 
            color: 'error' 
          })
      }
    }
    
    return Promise.reject(error)
  }
)

export default api