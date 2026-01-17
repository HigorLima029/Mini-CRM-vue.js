<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Pipeline de Vendas</h1>
        <p class="text-grey">Arraste os cards para mover clientes entre estágios</p>
      </div>
    </div>

    <!-- Pipeline Board -->
    <v-row>
      <v-col
        v-for="stage in stages"
        :key="stage.id"
        cols="12"
        md="4"
      >
        <v-card
          :color="stage.color"
          variant="tonal"
          class="pipeline-column"
          min-height="500"
        >
          <!-- Header da Coluna -->
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="mr-2">{{ stage.icon }}</v-icon>
              {{ stage.title }}
            </div>
            <v-chip size="small" :color="stage.color">
              {{ getCustomersByStage(stage.id).length }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-2">
            <!-- Cards dos Clientes -->
            <div
              v-for="customer in getCustomersByStage(stage.id)"
              :key="customer.id"
              class="pipeline-card mb-3"
            >
              <v-card elevation="2" class="cursor-pointer" @click="viewCustomer(customer)">
                <v-card-text class="pb-2">
                  <div class="d-flex justify-space-between align-start mb-2">
                    <div class="d-flex align-center">
                      <v-avatar color="primary" size="32" class="mr-2">
                        {{ customer.name.charAt(0) }}
                      </v-avatar>
                      <div>
                        <p class="font-weight-medium mb-0 text-body-2">{{ customer.name }}</p>
                        <p class="text-caption text-grey mb-0">{{ customer.company }}</p>
                      </div>
                    </div>
                    <v-chip :color="getStatusColor(customer.status)" size="x-small" label>
                      {{ getStatusLabel(customer.status) }}
                    </v-chip>
                  </div>

                  <v-divider class="my-2"></v-divider>

                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-grey">
                      <v-icon size="12" class="mr-1">mdi-currency-usd</v-icon>
                      {{ formatCurrency(customer.value) }}
                    </span>
                    <span class="text-caption text-grey">
                      <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(customer.updatedAt) }}
                    </span>
                  </div>
                </v-card-text>

                <!-- Ações do Card -->
                <v-card-actions class="pt-0">
                  <v-btn
                    v-if="stage.id !== 'lead'"
                    size="x-small"
                    variant="text"
                    @click.stop="moveCustomer(customer, getPrevStage(stage.id))"
                  >
                    <v-icon size="16">mdi-arrow-left</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="stage.id !== 'closed'"
                    size="x-small"
                    variant="text"
                    color="primary"
                    @click.stop="moveCustomer(customer, getNextStage(stage.id))"
                  >
                    <v-icon size="16">mdi-arrow-right</v-icon>
                    Avançar
                  </v-btn>
                  <v-chip
                    v-else
                    size="x-small"
                    color="success"
                    label
                  >
                    <v-icon size="12" class="mr-1">mdi-check</v-icon>
                    Concluído
                  </v-chip>
                </v-card-actions>
              </v-card>
            </div>

            <!-- Empty State -->
            <div
              v-if="getCustomersByStage(stage.id).length === 0"
              class="text-center py-8"
            >
              <v-icon size="48" color="grey-lighten-1">mdi-account-off</v-icon>
              <p class="text-caption text-grey mt-2">Nenhum cliente neste estágio</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de Visualização -->
    <v-dialog v-model="viewDialog" max-width="500">
      <v-card v-if="selectedCustomer">
        <v-card-title>
          <v-icon class="mr-2">mdi-account</v-icon>
          Detalhes do Cliente
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="primary" size="48">
                  {{ selectedCustomer.name.charAt(0) }}
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ selectedCustomer.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedCustomer.company }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Email</p>
              <p class="font-weight-medium">{{ selectedCustomer.email }}</p>
            </v-col>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Telefone</p>
              <p class="font-weight-medium">{{ selectedCustomer.phone }}</p>
            </v-col>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Valor</p>
              <p class="font-weight-medium">{{ formatCurrency(selectedCustomer.value) }}</p>
            </v-col>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Status</p>
              <v-chip :color="getStatusColor(selectedCustomer.status)" size="small" label>
                {{ getStatusLabel(selectedCustomer.status) }}
              </v-chip>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <p class="text-caption text-grey mb-1">Notas</p>
          <p>{{ selectedCustomer.notes || 'Nenhuma nota registrada' }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="viewDialog = false">Fechar</v-btn>
          <v-btn color="primary" variant="flat" to="/customers">
            Editar Cliente
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'PipelineView',
  setup() {
    const store = useStore()

    const viewDialog = ref(false)
    const selectedCustomer = ref(null)

    // Estágios do pipeline
    const stages = [
      { id: 'lead', title: 'Leads', icon: 'mdi-account-search', color: 'info' },
      { id: 'contact', title: 'Em Contato', icon: 'mdi-phone', color: 'warning' },
      { id: 'closed', title: 'Fechados', icon: 'mdi-check-circle', color: 'success' }
    ]

    // Getter para clientes por estágio
    const getCustomersByStage = (stage) => {
      return store.getters['customers/customersByStage'](stage)
    }

    // Mover cliente para outro estágio
    const moveCustomer = (customer, newStage) => {
      store.dispatch('customers/moveCustomerStage', {
        customerId: customer.id,
        newStage
      })
    }

    // Obter próximo estágio
    const getNextStage = (currentStage) => {
      const order = ['lead', 'contact', 'closed']
      const currentIndex = order.indexOf(currentStage)
      return order[currentIndex + 1] || currentStage
    }

    // Obter estágio anterior
    const getPrevStage = (currentStage) => {
      const order = ['lead', 'contact', 'closed']
      const currentIndex = order.indexOf(currentStage)
      return order[currentIndex - 1] || currentStage
    }

    // Visualizar cliente
    const viewCustomer = (customer) => {
      selectedCustomer.value = customer
      viewDialog.value = true
    }

    // Helpers
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR')
    }

    const getStatusColor = (status) => {
      const colors = { active: 'success', inactive: 'error', pending: 'warning' }
      return colors[status] || 'grey'
    }

    const getStatusLabel = (status) => {
      const labels = { active: 'Ativo', inactive: 'Inativo', pending: 'Pendente' }
      return labels[status] || status
    }

    return {
      stages,
      viewDialog,
      selectedCustomer,
      getCustomersByStage,
      moveCustomer,
      getNextStage,
      getPrevStage,
      viewCustomer,
      formatCurrency,
      formatDate,
      getStatusColor,
      getStatusLabel
    }
  }
}
</script>

<style scoped>
.pipeline-column {
  min-height: 500px;
}

.pipeline-card {
  transition: transform 0.2s ease;
}

.pipeline-card:hover {
  transform: translateY(-2px);
}

.cursor-pointer {
  cursor: pointer;
}
</style>