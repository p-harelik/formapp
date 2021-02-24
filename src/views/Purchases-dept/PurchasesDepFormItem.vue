<template>
    <component :is="currentForm">
    </component>
</template>

<script>
  import Purchase from '../../components/app/purchases/purchase/Purchase'
  import Registration from '../../components/app/purchases/registration/Registration'
  import RequestForPrices from '../../components/app/purchases/request-for-prices/RequestForPrices'
  export default {
    name: 'PurchasesDepFormItem',
    data: () => ({
      currentForm: ''
    }),
    components: {
      Purchase, Registration, RequestForPrices
    },
      created () {
      this.currentForm = this.$route.params.formid
    }
  }
</script>

<style scoped>

</style>
