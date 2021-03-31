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
      ...mapActions(['placementInfo', 'getProjects'])
    },
    mounted () {
      this.placementInfo()
      this.getProjects()
    }
  }
</script>

<style lang="scss">

</style>
