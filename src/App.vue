<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="!sidebarOpen"
      permanent
      color="primary"
      theme="dark"
    >
      <!-- Logo -->
      <v-list-item
        :prepend-icon="sidebarOpen ? '' : 'mdi-domain'"
        :title="sidebarOpen ? 'Vue CRM' : ''"
        class="py-4"
      >
        <template v-slot:prepend v-if="sidebarOpen">
          <v-icon size="32" class="mr-2">mdi-domain</v-icon>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Menu de Navegação -->
      <v-list nav density="compact">
        <v-list-item
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="xl"
          class="my-1"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>
        <v-list-item
          v-if="sidebarOpen"
          prepend-icon="mdi-account-circle"
          title="Admin User"
          subtitle="admin@crm.com"
          class="py-4"
        ></v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar flat color="white" elevation="1">
      <v-app-bar-nav-icon @click="toggleSidebar">
        <v-icon>{{ sidebarOpen ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="font-weight-bold">
        {{ currentPageTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="mr-2">
        <v-badge color="error" content="3" floating>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Conteúdo Principal -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Snackbar Global -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="hideSnackbar">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Loading Global -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const route = useRoute()

    const drawer = computed(() => true)
    const sidebarOpen = computed(() => store.state.sidebarOpen)
    const loading = computed(() => store.state.loading)
    const snackbar = computed(() => store.state.snackbar)

    const currentPageTitle = computed(() => route.meta?.title || 'Dashboard')

    const menuItems = [
      { path: '/', title: 'Dashboard', icon: 'mdi-view-dashboard' },
      { path: '/customers', title: 'Clientes', icon: 'mdi-account-group' },
      { path: '/pipeline', title: 'Pipeline', icon: 'mdi-pipe' },
      { path: '/reports', title: 'Relatórios', icon: 'mdi-chart-bar' }
    ]

    const toggleSidebar = () => {
      store.dispatch('toggleSidebar')
    }

    const hideSnackbar = () => {
      store.commit('HIDE_SNACKBAR')
    }

    return {
      drawer,
      sidebarOpen,
      loading,
      snackbar,
      currentPageTitle,
      menuItems,
      toggleSidebar,
      hideSnackbar
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>