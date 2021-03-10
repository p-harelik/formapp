<template>
  <component :is="currentForm">
  </component>
</template>

<script>
import RequestResource from '../../components/app/projects/resource/RequestResource'
import Consumables from '../../components/app/projects/consumables/Consumables'

  export default {
    name: 'ProjectsFormItem',
    components: { RequestResource, Consumables },
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
