<template>
  <component :is="currentForm">
  </component>
</template>

<script>
import IssuanceOfFunds from '../../components/app/bookkeeping/issuance-of-funds/IssuanceOfFunds'
import Compensation from '../../components/app/bookkeeping/compensation/Compensation'
import Payment from '../../components/app/bookkeeping/payment/Payment'
import Absent from '../../components/app/bookkeeping/absent/Absent'
import Vacation from '../../components/app/bookkeeping/vacation/Vacation'
import BusinessTrip from '../../components/app/bookkeeping/business-trip/BusinessTrip'
import NewEmployee from '../../components/app/bookkeeping/new-employee/NewEmployee'
  export default {
    name: 'BookkeepingDepFormItem',
    components: {
      IssuanceOfFunds,
      Compensation,
      Payment,
      Absent,
      Vacation,
      BusinessTrip,
      NewEmployee
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
