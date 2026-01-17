<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Relatórios</h1>
        <p class="text-grey">Análises e métricas do seu CRM</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-download">
        Exportar PDF
      </v-btn>
    </div>

    <!-- Métricas -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="primary" theme="dark" class="pa-4">
          <p class="text-subtitle-2">Taxa de Conversão</p>
          <p class="text-h3 font-weight-bold mt-2">68%</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="success" theme="dark" class="pa-4">
          <p class="text-subtitle-2">Satisfação</p>
          <p class="text-h3 font-weight-bold mt-2">4.8/5</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" theme="dark" class="pa-4">
          <p class="text-subtitle-2">Tempo Resposta</p>
          <p class="text-h3 font-weight-bold mt-2">2.3h</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="info" theme="dark" class="pa-4">
          <p class="text-subtitle-2">Retenção</p>
          <p class="text-h3 font-weight-bold mt-2">87%</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráfico -->
    <v-card elevation="2">
      <v-card-title>
        <v-icon class="mr-2">mdi-chart-bar</v-icon>
        Performance Mensal
      </v-card-title>
      <v-card-text>
        <Bar :data="chartData" :options="chartOptions" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: 'ReportsView',
  components: { Bar },
  setup() {
    const chartData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Vendas (R$)',
          data: [45000, 52000, 48000, 61000, 55000, 67000],
          backgroundColor: '#6366f1'
        }
      ]
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }

    return { chartData, chartOptions }
  }
}
</script>