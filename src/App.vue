<template>
      <component :is="layout"/>
</template>

<script>
  import MainLayout from './layouts/MainLayout'
  import TestLayout from './layouts/TestLayout'
  import { mapActions } from 'vuex'
  import Bitrix from './plugins/Bitrix'

  export default {
    computed: {
      layout () {
        return (this.$route.meta.layout || 'main') + '-layout'
      }
    },
    components: {
      MainLayout, TestLayout
    },
    methods: {
      ...mapActions(['placementInfo'])
    },
    mounted () {
      this.placementInfo()
      Bitrix.сurrentUser().then(res => console.log(res))
    }
  }
</script>

<style lang="scss">

</style>
