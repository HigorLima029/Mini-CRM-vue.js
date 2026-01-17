import api from '@/services/api'

// Estado inicial
const state = {
  customers: [],
  selectedCustomer: null,
  filters: {
    search: '',
    status: 'all',
    stage: 'all'
  },
  stats: {
    total: 0,
    active: 0,
    totalValue: 0,
    avgValue: 0
  }
}

// Getters - Computações do estado
const getters = {
  // Clientes filtrados
  filteredCustomers: (state) => {
    return state.customers.filter(customer => {
      const matchSearch = customer.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                         customer.email.toLowerCase().includes(state.filters.search.toLowerCase())
      const matchStatus = state.filters.status === 'all' || customer.status === state.filters.status
      const matchStage = state.filters.stage === 'all' || customer.stage === state.filters.stage
      return matchSearch && matchStatus && matchStage
    })
  },

  // Clientes por estágio do pipeline
  customersByStage: (state) => (stage) => {
    return state.customers.filter(c => c.stage === stage)
  },

  // Estatísticas calculadas
  dashboardStats: (state) => {
    const total = state.customers.length
    const active = state.customers.filter(c => c.status === 'active').length
    const totalValue = state.customers.reduce((sum, c) => sum + c.value, 0)
    const avgValue = total > 0 ? totalValue / total : 0
    const leads = state.customers.filter(c => c.stage === 'lead').length
    const closed = state.customers.filter(c => c.stage === 'closed').length

    return { total, active, totalValue, avgValue, leads, closed }
  },

  // Dados para gráfico de status
  statusChartData: (state) => {
    const active = state.customers.filter(c => c.status === 'active').length
    const inactive = state.customers.filter(c => c.status === 'inactive').length
    const pending = state.customers.filter(c => c.status === 'pending').length
    return { active, inactive, pending }
  }
}

// Mutations - Modificam o estado
const mutations = {
  SET_CUSTOMERS(state, customers) {
    state.customers = customers
  },

  ADD_CUSTOMER(state, customer) {
    state.customers.push(customer)
  },

  UPDATE_CUSTOMER(state, updatedCustomer) {
    const index = state.customers.findIndex(c => c.id === updatedCustomer.id)
    if (index !== -1) {
      state.customers.splice(index, 1, updatedCustomer)
    }
  },

  DELETE_CUSTOMER(state, customerId) {
    state.customers = state.customers.filter(c => c.id !== customerId)
  },

  SET_SELECTED_CUSTOMER(state, customer) {
    state.selectedCustomer = customer
  },

  SET_FILTER(state, { key, value }) {
    state.filters[key] = value
  },

  UPDATE_CUSTOMER_STAGE(state, { customerId, newStage }) {
    const customer = state.customers.find(c => c.id === customerId)
    if (customer) {
      customer.stage = newStage
      customer.updatedAt = new Date().toISOString()
    }
  }
}

// Actions - Lógica assíncrona
const actions = {
  // Buscar clientes (simulado com Axios)
  async fetchCustomers({ commit }) {
    try {
      // Em produção, usar: const response = await api.get('/customers')
      // Dados mockados para demonstração
      const mockCustomers = [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 98765-4321',
          company: 'Tech Solutions',
          status: 'active',
          stage: 'lead',
          value: 15000,
          createdAt: '2025-01-10',
          updatedAt: '2025-01-10',
          notes: 'Cliente interessado em plano enterprise'
        },
        {
          id: 2,
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(21) 91234-5678',
          company: 'Digital Marketing',
          status: 'active',
          stage: 'contact',
          value: 25000,
          createdAt: '2025-01-08',
          updatedAt: '2025-01-12',
          notes: 'Reunião agendada para próxima semana'
        },
        {
          id: 3,
          name: 'Pedro Costa',
          email: 'pedro@email.com',
          phone: '(31) 99876-5432',
          company: 'Costa Empreendimentos',
          status: 'inactive',
          stage: 'closed',
          value: 8000,
          createdAt: '2024-12-15',
          updatedAt: '2024-12-20',
          notes: 'Contrato finalizado'
        },
        {
          id: 4,
          name: 'Ana Oliveira',
          email: 'ana@email.com',
          phone: '(41) 98123-4567',
          company: 'Oliveira & Associados',
          status: 'active',
          stage: 'contact',
          value: 32000,
          createdAt: '2025-01-05',
          updatedAt: '2025-01-11',
          notes: 'Proposta enviada'
        },
        {
          id: 5,
          name: 'Carlos Souza',
          email: 'carlos@email.com',
          phone: '(51) 97654-3210',
          company: 'Souza Tech',
          status: 'pending',
          stage: 'lead',
          value: 12000,
          createdAt: '2025-01-12',
          updatedAt: '2025-01-12',
          notes: 'Aguardando retorno'
        },
        {
          id: 6,
          name: 'Fernanda Lima',
          email: 'fernanda@email.com',
          phone: '(61) 98888-7777',
          company: 'Lima Consultoria',
          status: 'active',
          stage: 'closed',
          value: 45000,
          createdAt: '2024-12-01',
          updatedAt: '2025-01-05',
          notes: 'Cliente premium - renovação anual'
        }
      ]

      commit('SET_CUSTOMERS', mockCustomers)
      return mockCustomers
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      throw error
    }
  },

  // Adicionar cliente
  async addCustomer({ commit, dispatch }, customerData) {
    try {
      const newCustomer = {
        ...customerData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      // Em produção: await api.post('/customers', newCustomer)
      commit('ADD_CUSTOMER', newCustomer)
      dispatch('showNotification', { message: 'Cliente cadastrado com sucesso!' }, { root: true })
      return newCustomer
    } catch (error) {
      dispatch('showNotification', { message: 'Erro ao cadastrar cliente', color: 'error' }, { root: true })
      throw error
    }
  },

  // Atualizar cliente
  async updateCustomer({ commit, dispatch }, customerData) {
    try {
      const updatedCustomer = {
        ...customerData,
        updatedAt: new Date().toISOString()
      }
      // Em produção: await api.put(`/customers/${customerData.id}`, updatedCustomer)
      commit('UPDATE_CUSTOMER', updatedCustomer)
      dispatch('showNotification', { message: 'Cliente atualizado com sucesso!' }, { root: true })
      return updatedCustomer
    } catch (error) {
      dispatch('showNotification', { message: 'Erro ao atualizar cliente', color: 'error' }, { root: true })
      throw error
    }
  },

  // Deletar cliente
  async deleteCustomer({ commit, dispatch }, customerId) {
    try {
      // Em produção: await api.delete(`/customers/${customerId}`)
      commit('DELETE_CUSTOMER', customerId)
      dispatch('showNotification', { message: 'Cliente excluído com sucesso!' }, { root: true })
    } catch (error) {
      dispatch('showNotification', { message: 'Erro ao excluir cliente', color: 'error' }, { root: true })
      throw error
    }
  },

  // Mover cliente no pipeline
  async moveCustomerStage({ commit, dispatch }, { customerId, newStage }) {
    try {
      commit('UPDATE_CUSTOMER_STAGE', { customerId, newStage })
      dispatch('showNotification', { message: 'Pipeline atualizado!' }, { root: true })
    } catch (error) {
      dispatch('showNotification', { message: 'Erro ao mover cliente', color: 'error' }, { root: true })
      throw error
    }
  },

  // Aplicar filtros
  setFilter({ commit }, payload) {
    commit('SET_FILTER', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}