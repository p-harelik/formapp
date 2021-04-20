<template>
      <component :is="layout"/>
</template>

<script>
  import MainLayout from './layouts/MainLayout'
  import TestLayout from './layouts/TestLayout'
  import { mapActions } from 'vuex'

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
      ...mapActions([
        'placementInfo',
        'getProjects',
        'GET_DEALS',
        'GET_COMPANIES',
        'GET_BITRIX_USERS'
      ])
    },
    mounted () {
      this.placementInfo()
      this.getProjects()
      this.GET_DEALS()
      this.GET_COMPANIES()
      this.GET_BITRIX_USERS()
    }
  }
</script>

<style lang="scss">

</style>
