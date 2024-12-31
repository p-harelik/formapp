<template>
  <component :is="currentForm">
  </component>
</template>

<script>
import RequestResource from '../../components/app/projects/resource/RequestResource'
import Consumables from '../../components/app/projects/consumables/Consumables'
import BusinessTrip from '../../components/app/bookkeeping/business-trip/BusinessTrip'
import PlanningToSchedule from '../../components/app/planning-to-schedule/PlanningToSchedule.vue'

  export default {
    name: 'ProjectsFormItem',
    components: {
      RequestResource,
      Consumables,
      BusinessTrip,
      PlanningToSchedule
    },
    data: () => ({
      currentForm: ''
    }),
    created () {
      this.currentForm = this.$route.params.formid
    }
  }
</script>

<style scoped>

</style>
