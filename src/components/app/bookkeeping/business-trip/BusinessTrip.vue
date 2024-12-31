<template>
  <v-container fluid>
    <v-breadcrumbs
      :items="crumbs"
      divider="/"
    >
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          exact
          :disabled="item.disabled"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <h1 class="display-1 px-10 pb-5">
      {{title}}
    </h1>

    <BusinessTripForm/>
  </v-container>
</template>

<script>
  import crumbs from '../../../../mixins/crumbs'
  import BusinessTripForm from './BusinessTripForm'

  export default {
    name: 'BusinessTrip',
    mixins: [crumbs],
    components: { BusinessTripForm },
    data () {
      return {
        title: 'Оформление командировки'
      }
    },
    created () {
      this.updateCrumbs()
    }
  }
</script>
