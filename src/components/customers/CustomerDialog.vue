<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>
          <v-icon class="mr-2">{{ titleIcon }}</v-icon>
          {{ title }}
        </span>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Modo Visualização -->
        <div v-if="mode === 'view' && customer">
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="primary" size="48">
                  {{ customer.name?.charAt(0) }}
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ customer.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ customer.company }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Email</p>
              <p class="font-weight-medium">{{ customer.email }}</p>
            </v-col>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Telefone</p>
              <p class="font-weight-medium">{{ customer.phone }}</p>
            </v-col>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Valor</p>
              <p class="font-weight-medium">R$ {{ customer.value?.toLocaleString('pt-BR') }}</p>
            </v-col>
            <v-col cols="6">
              <p class="text-caption text-grey mb-1">Status</p>
              <v-chip :color="getStatusColor(customer.status)" size="small" label>
                {{ getStatusLabel(customer.status) }}
              </v-chip>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <p class="text-caption text-grey mb-1">Notas</p>
          <p>{{ customer.notes || 'Nenhuma nota registrada' }}</p>
        </div>

        <!-- Modo Adicionar/Editar -->
        <v-form v-else ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Nome *"
                :rules="[rules.required]"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.company"
                label="Empresa"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email *"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                label="Telefone"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.stage"
                :items="stageOptions"
                label="Estágio"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.value"
                label="Valor (R$)"
                type="number"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.notes"
                label="Notas"
                variant="outlined"
                density="compact"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">
          {{ mode === 'view' ? 'Fechar' : 'Cancelar' }}
        </v-btn>
        <v-btn
          v-if="mode !== 'view'"
          color="primary"
          variant="flat"
          :disabled="!valid"
          @click="save"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'CustomerDialog',
  props: {
    modelValue: Boolean,
    mode: {
      type: String,
      default: 'add' // 'add', 'edit', 'view'
    },
    customer: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue', 'save'],
  setup(props, { emit }) {
    const valid = ref(false)
    const form = ref({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'active',
      stage: 'lead',
      value: 0,
      notes: ''
    })

    const rules = {
      required: v => !!v || 'Campo obrigatório',
      email: v => /.+@.+\..+/.test(v) || 'Email inválido'
    }

    const statusOptions = [
      { title: 'Ativo', value: 'active' },
      { title: 'Inativo', value: 'inactive' },
      { title: 'Pendente', value: 'pending' }
    ]

    const stageOptions = [
      { title: 'Lead', value: 'lead' },
      { title: 'Contato', value: 'contact' },
      { title: 'Fechado', value: 'closed' }
    ]

    const title = computed(() => {
      const titles = {
        add: 'Novo Cliente',
        edit: 'Editar Cliente',
        view: 'Detalhes do Cliente'
      }
      return titles[props.mode] || 'Cliente'
    })

    const titleIcon = computed(() => {
      const icons = {
        add: 'mdi-account-plus',
        edit: 'mdi-account-edit',
        view: 'mdi-account'
      }
      return icons[props.mode] || 'mdi-account'
    })

    // Watch para preencher form quando editar
    watch(() => props.customer, (newCustomer) => {
      if (newCustomer && props.mode === 'edit') {
        form.value = { ...newCustomer }
      } else if (props.mode === 'add') {
        form.value = {
          name: '',
          company: '',
          email: '',
          phone: '',
          status: 'active',
          stage: 'lead',
          value: 0,
          notes: ''
        }
      }
    }, { immediate: true })

    const close = () => {
      emit('update:modelValue', false)
    }

    const save = () => {
      emit('save', { ...form.value, id: props.customer?.id })
      close()
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
      valid,
      form,
      rules,
      statusOptions,
      stageOptions,
      title,
      titleIcon,
      close,
      save,
      getStatusColor,
      getStatusLabel
    }
  }
}
</script>