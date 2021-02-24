<template>
  <v-app class="grey lighten-4">
    <Sidebar/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
  import Sidebar from '../components/app/Sidebar'

  export default {
    name: 'test-layout',
    components: {
      Sidebar
    }
  }
</script>

<style lang="scss">

</style>
