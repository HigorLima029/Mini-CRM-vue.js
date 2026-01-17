<template>
  <div>
    <!-- Header da Página -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        <p class="text-grey">Visão geral do seu CRM</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshData">
        Atualizar
      </v-btn>
    </div>

    <!-- Cards de Estatísticas -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <stat-card
          title="Total de Clientes"
          :value="stats.total"
          icon="mdi-account-group"
          color="primary"
          trend="+12%"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <stat-card
          title="Clientes Ativos"
          :value="stats.active"
          icon="mdi-account-check"
          color="success"
          trend="+8%"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <stat-card
          title="Valor Total"
          :value="formatCurrency(stats.totalValue)"
          icon="mdi-currency-usd"
          color="secondary"
          trend="+15%"
        />
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <stat-card
          title="Ticket Médio"
          :value="formatCurrency(stats.avgValue)"
          icon="mdi-trending-up"
          color="warning"
          trend="+5%"
        />
      </v-col>
    </v-row>

    <!-- Gráficos -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Vendas por Mês
          </v-card-title>
          <v-card-text>
            <Line :data="salesChartData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-pie</v-icon>
            Status dos Clientes
          </v-card-title>
          <v-card-text>
            <Doughnut :data="statusChartData" :options="pieChartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pipeline Resumido -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-pipe</v-icon>
            Pipeline de Vendas
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" v-for="stage in pipelineStages" :key="stage.id">
                <v-card :color="stage.color" variant="tonal" class="pa-4">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <p class="text-subtitle-2 font-weight-bold">{{ stage.title }}</p>
                      <p class="text-h4 font-weight-bold mt-2">
                        {{ getCustomersByStage(stage.id).length }}
                      </p>
                    </div>
                    <v-icon size="48" :color="stage.color">{{ stage.icon }}</v-icon>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Clientes Recentes -->
    <v-card elevation="2">
      <v-card-title>
        <v-icon class="mr-2">mdi-account-clock</v-icon>
        Clientes Recentes
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" to="/customers">
          Ver todos
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Empresa</th>
              <th>Status</th>
              <th>Estágio</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in recentCustomers" :key="customer.id">
              <td class="font-weight-medium">{{ customer.name }}</td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.company }}</td>
              <td>
                <v-chip :color="getStatusColor(customer.status)" size="small" label>
                  {{ getStatusLabel(customer.status) }}
                </v-chip>
              </td>
              <td>
                <v-chip :color="getStageColor(customer.stage)" size="small" variant="outlined">
                  {{ getStageLabel(customer.stage) }}
                </v-chip>
              </td>
              <td class="font-weight-medium">{{ formatCurrency(customer.value) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import StatCard from '@/components/dashboard/StatCard.vue'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default {
  name: 'DashboardView',
  components: {
    StatCard,
    Line,
    Doughnut
  },
  setup() {
    const store = useStore()

    // Buscar dados ao montar
    onMounted(() => {
      store.dispatch('customers/fetchCustomers')
    })

    // Estatísticas do dashboard
    const stats = computed(() => store.getters['customers/dashboardStats'])
    
    // Dados de status para gráfico
    const statusData = computed(() => store.getters['customers/statusChartData'])
    
    // Clientes por estágio
    const getCustomersByStage = (stage) => {
      return store.getters['customers/customersByStage'](stage)
    }

    // Clientes recentes (últimos 5)
    const recentCustomers = computed(() => {
      return store.state.customers.customers.slice(0, 5)
    })

    // Estágios do pipeline
    const pipelineStages = [
      { id: 'lead', title: 'Leads', icon: 'mdi-account-search', color: 'info' },
      { id: 'contact', title: 'Em Contato', icon: 'mdi-phone', color: 'warning' },
      { id: 'closed', title: 'Fechados', icon: 'mdi-check-circle', color: 'success' }
    ]

    // Dados do gráfico de vendas
    const salesChartData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Vendas (R$)',
          data: [45000, 52000, 48000, 61000, 55000, 67000],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }

    // Dados do gráfico de status
    const statusChartData = computed(() => ({
      labels: ['Ativos', 'Inativos', 'Pendentes'],
      datasets: [
        {
          data: [statusData.value.active, statusData.value.inactive, statusData.value.pending],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
        }
      ]
    }))

    // Opções dos gráficos
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

    // Helpers
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    const getStatusColor = (status) => {
      const colors = { active: 'success', inactive: 'error', pending: 'warning' }
      return colors[status] || 'grey'
    }

    const getStatusLabel = (status) => {
      const labels = { active: 'Ativo', inactive: 'Inativo', pending: 'Pendente' }
      return labels[status] || status
    }

    const getStageColor = (stage) => {
      const colors = { lead: 'info', contact: 'warning', closed: 'success' }
      return colors[stage] || 'grey'
    }

    const getStageLabel = (stage) => {
      const labels = { lead: 'Lead', contact: 'Contato', closed: 'Fechado' }
      return labels[stage] || stage
    }

    const refreshData = () => {
      store.dispatch('customers/fetchCustomers')
    }

    return {
      stats,
      recentCustomers,
      pipelineStages,
      salesChartData,
      statusChartData,
      chartOptions,
      pieChartOptions,
      getCustomersByStage,
      formatCurrency,
      getStatusColor,
      getStatusLabel,
      getStageColor,
      getStageLabel,
      refreshData
    }
  }
}
</script>