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
    <v-tabs
      v-model="tab"
      color="primary"
    >
      <v-tab
        v-for="item in tabsItem"
        :key="item.title"
      >
        <v-icon class="mr-3">{{item.icon}}</v-icon>
        {{ item.title }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in tabsItem"
        :key="item.title"
      >
        <v-card>
          <v-card-text>
            <component v-bind:is="item.body"></component>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import PurchaseForm from './PurchaseForm'
  import PurchaseList from './PurchaseList'
  import crumbs from '../../../../mixins/crumbs'

  export default {
    name: 'Purchase',
    mixins: [crumbs],
    components: {
      PurchaseForm,
      PurchaseList
    },
    data () {
      return {
        tab: null,
        title: 'Закупка',
        tabsItem: [
          {
            id: 1,
            title: 'Форма заявки',
            icon: 'mdi-file-document-edit',
            body: 'PurchaseForm'
          },
          {
            id: 2,
            title: 'Список заявок',
            icon: 'mdi-view-list',
            body: 'PurchaseList'
          }
        ]
      }
    },
    created () {
      this.updateCrumbs()
    }
  }
</script>

<style scoped>

</style>
