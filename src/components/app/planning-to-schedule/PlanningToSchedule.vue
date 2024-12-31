<template>
  <v-container fluid>
    <h1 class="display-1 ma-6">
      {{title}}
    </h1>

    <PlanningToScheduleForm/>
  </v-container>
</template>

<script>
  import PlanningToScheduleForm from './PlanningToScheduleForm.vue'

  export default {
    name: 'PlanningToSchedule',
    components: {
      PlanningToScheduleForm
    },
    data () {
      return {
        title: 'Планирование в график отсутствий'
      }
    }
  }
</script>
