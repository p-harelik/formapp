<template>
  <component :is="currentForm">
  </component>
</template>

<script>
  import SendingDocuments from '../../components/app/logistics/sending-documents/SendingDocuments'
  import DeliveryEquipment from '../../components/app/logistics/delivery-equipment/DeliveryEquipment'
  import Workers from '../../components/app/logistics/workers/Workers'

  export default {
    name: 'LogisticDepFormItem',
    data: () => ({
      currentForm: ''
    }),
    components: {
      SendingDocuments,
      DeliveryEquipment,
      Workers
    },
    created () {
      this.currentForm = this.$route.params.formid
    }
  }
</script>

<style scoped>

</style>
