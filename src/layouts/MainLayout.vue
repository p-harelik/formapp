<template>
  <v-app>
    <div class="app grey lighten-4" id="app">
    <Sidebar/>
    <v-main>
        <router-view/>
    </v-main>
    </div>
  </v-app>
</template>

<script>
  import Sidebar from '../components/app/Sidebar'

  export default {
    name: 'main-layout',
    components: {
      Sidebar
    }
  }
</script>

<style>
.app {
  min-height: 100vh;
}
.wrapper-form {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 2rem;
  border-radius: .45rem;
  background-color: #FAFAFA;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
}
.v-card__title {
  word-break: normal !important;
}
.opaсity {
  opacity: 0.7;
}
</style>
