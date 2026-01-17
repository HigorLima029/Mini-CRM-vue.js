<template>
  <v-card elevation="2" class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <div>
        <p class="text-caption text-grey mb-1">{{ title }}</p>
        <p class="text-h4 font-weight-bold">{{ value }}</p>
        <p v-if="trend" class="text-caption text-success mt-2">
          <v-icon size="14" color="success">mdi-trending-up</v-icon>
          {{ trend }}
        </p>
      </div>
      <v-avatar :color="color" size="56">
        <v-icon color="white" size="28">{{ icon }}</v-icon>
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: 'mdi-chart-line'
    },
    color: {
      type: String,
      default: 'primary'
    },
    trend: {
      type: String,
      default: null
    }
  }
}
</script>