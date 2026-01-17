<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Clientes</h1>
        <p class="text-grey">Gerencie sua base de clientes</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog('add')">
        Novo Cliente
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar clientes..."
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStage"
              :items="stageOptions"
              label="Estágio"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              color="grey"
              variant="outlined"
              block
              @click="clearFilters"
            >
              Limpar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabela de Clientes -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredCustomers"
        :search="search"
        hover
        class="elevation-0"
      >
        <!-- Nome -->
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary" size="36" class="mr-3">
              <span class="text-white">{{ item.name.charAt(0) }}</span>
            </v-avatar>
            <div>
              <p class="font-weight-medium mb-0">{{ item.name }}</p>
              <p class="text-caption text-grey mb-0">{{ item.company }}</p>
            </div>
          </div>
        </template>

        <!-- Contato -->
        <template v-slot:item.contact="{ item }">
          <div>
            <p class="mb-0">{{ item.email }}</p>
            <p class="text-caption text-grey mb-0">{{ item.phone }}</p>
          </div>
        </template>

        <!-- Status -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" label>
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <!-- Estágio -->
        <template v-slot:item.stage="{ item }">
          <v-chip :color="getStageColor(item.stage)" size="small" variant="outlined">
            {{ getStageLabel(item.stage) }}
          </v-chip>
        </template>

        <!-- Valor -->
        <template v-slot:item.value="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.value) }}</span>
        </template>

        <!-- Ações -->
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" variant="text" color="info" @click="openDialog('view', item)">
            <v-icon>mdi-eye</v-icon>
            <v-tooltip activator="parent" location="top">Visualizar</v-tooltip>
          </v-btn>
          <v-btn icon size="small" variant="text" color="success" @click="openDialog('edit', item)">
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">Editar</v-tooltip>
          </v-btn>
          <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Excluir</v-tooltip>
          </v-btn>
        </template>

        <!-- Empty State -->
        <template v-slot:no-data>
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-account-search</v-icon>
            <p class="text-h6 mt-4">Nenhum cliente encontrado</p>
            <p class="text-grey">Tente ajustar os filtros ou adicione um novo cliente</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Cliente -->
    <customer-dialog
      v-model="dialog"
      :mode="dialogMode"
      :customer="selectedCustomer"
      @save="handleSave"
    />

    <!-- Dialog de Confirmação -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o cliente 
          <strong>{{ customerToDelete?.name }}</strong>?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="deleteCustomer">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import CustomerDialog from '@/components/customers/CustomerDialog.vue'

export default {
  name: 'CustomersView',
  components: {
    CustomerDialog
  },
  setup() {
    const store = useStore()

    // Estado local
    const search = ref('')
    const filterStatus = ref('all')
    const filterStage = ref('all')
    const dialog = ref(false)
    const dialogMode = ref('add')
    const selectedCustomer = ref(null)
    const deleteDialog = ref(false)
    const customerToDelete = ref(null)

    // Headers da tabela
    const headers = [
      { title: 'Cliente', key: 'name', sortable: true },
      { title: 'Contato', key: 'contact', sortable: false },
      { title: 'Status', key: 'status', sortable: true },
      { title: 'Estágio', key: 'stage', sortable: true },
      { title: 'Valor', key: 'value', sortable: true },
      { title: 'Ações', key: 'actions', sortable: false, align: 'center' }
    ]

    // Opções de filtro
    const statusOptions = [
      { title: 'Todos', value: 'all' },
      { title: 'Ativo', value: 'active' },
      { title: 'Inativo', value: 'inactive' },
      { title: 'Pendente', value: 'pending' }
    ]

    const stageOptions = [
      { title: 'Todos', value: 'all' },
      { title: 'Lead', value: 'lead' },
      { title: 'Contato', value: 'contact' },
      { title: 'Fechado', value: 'closed' }
    ]

    // Computed
    const filteredCustomers = computed(() => store.getters['customers/filteredCustomers'])

    // Watchers para filtros
    watch([filterStatus, filterStage], ([status, stage]) => {
      store.dispatch('customers/setFilter', { key: 'status', value: status })
      store.dispatch('customers/setFilter', { key: 'stage', value: stage })
    })

    watch(search, (value) => {
      store.dispatch('customers/setFilter', { key: 'search', value: value || '' })
    })

    // Métodos
    const openDialog = (mode, customer = null) => {
      dialogMode.value = mode
      selectedCustomer.value = customer ? { ...customer } : null
      dialog.value = true
    }

    const handleSave = async (customerData) => {
      if (dialogMode.value === 'add') {
        await store.dispatch('customers/addCustomer', customerData)
      } else if (dialogMode.value === 'edit') {
        await store.dispatch('customers/updateCustomer', customerData)
      }
      dialog.value = false
    }

    const confirmDelete = (customer) => {
      customerToDelete.value = customer
      deleteDialog.value = true
    }

    const deleteCustomer = async () => {
      await store.dispatch('customers/deleteCustomer', customerToDelete.value.id)
      deleteDialog.value = false
      customerToDelete.value = null
    }

    const clearFilters = () => {
      search.value = ''
      filterStatus.value = 'all'
      filterStage.value = 'all'
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

    // Lifecycle
    onMounted(() => {
      store.dispatch('customers/fetchCustomers')
    })

    return {
      search,
      filterStatus,
      filterStage,
      dialog,
      dialogMode,
      selectedCustomer,
      deleteDialog,
      customerToDelete,
      headers,
      statusOptions,
      stageOptions,
      filteredCustomers,
      openDialog,
      handleSave,
      confirmDelete,
      deleteCustomer,
      clearFilters,
      formatCurrency,
      getStatusColor,
      getStatusLabel,
      getStageColor,
      getStageLabel
    }
  }
}
</script>