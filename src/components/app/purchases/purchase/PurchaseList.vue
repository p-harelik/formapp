<template>
  <div class="wrap">
    <h2 class="red--text">Данный раздел находится в разработке</h2>
    <v-text-field
      v-model="search"
      append-icon="mdi-book-search"
      label="Поиск"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="elements"
      :search="search"
      class="elevation-1"
      no-data-text="Список пустой"
      :footer-props = "{
      'items-per-page-text':'Строк на странице',
      'items-per-page-all-text': 'Все'}"
    >
    </v-data-table>
  </div>
</template>

<script>
  import Bitrix from '../../../../plugins/Bitrix'
  export default {
    name: 'PurchaseList',
    data () {
      return {
        search: '',
        headers: [],
        elements: [],
        fieldValues: {}
      }
    },
    methods: {
      async getHeaders () {
        const fields = await Bitrix.callMethod('lists.field.get', {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 19,
          IBLOCK_ID: 55
        })
        const headers = [{
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'ID'
        }]
        for (const prop in fields) {
          headers.push({
            text: fields[prop].NAME,
            align: 'start',
            sortable: true,
            value: fields[prop].FIELD_ID
          })
          if (fields[prop].DISPLAY_VALUES_FORM) {
            this.fieldValues = { ...this.fieldValues, ...fields[prop].DISPLAY_VALUES_FORM }
          }
        }
        this.headers = headers
      },
      async getElements () {
        const elements = await Bitrix.callMethod('lists.element.get', {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 19,
          IBLOCK_ID: 55,
          FILTER: {
            '>=DATE_CREATE': '27.12.2020 00:00:00'
          }
        })
        this.elements = elements
        return elements
      }
    },
    async created () {
     // await this.getHeaders()
     //  console.log(this.fieldValues)
     //  console.log(await this.getElements())
    }
  }
</script>

<style scoped>

</style>
