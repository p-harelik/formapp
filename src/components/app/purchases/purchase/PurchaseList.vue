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
      :items="elementsList"
      :search="search"
      class="elevation-1"
      no-data-text="Список пустой"
      :footer-props="{
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
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'ID'
        },
        {
          text: 'Дата создания',
          align: 'start',
          sortable: true,
          value: 'DATE_CREATE'
        },
        {
          text: 'Задача',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_375'
        },
        {
          text: 'Краткое название',
          align: 'start',
          sortable: true,
          value: 'NAME'
        },
        {
          text: 'Тип запроса',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_279'
        },
        {
          text: 'Вид продукта',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_1015'
        },
        {
          text: 'Состояние',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_281'
        },
        {
          text: 'Срочность',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_283'
        },
        {
          text: 'Резервирование',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_1433'
        },
        {
          text: 'От какой организации требуется закупка',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_1011'
        },
        {
          text: 'Требуется ли регистрация',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_1013'
        },
        {
          text: 'Описание',
          align: 'start',
          sortable: true,
          value: 'DETAIL_TEXT'
        },
        {
          text: 'Документ',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_287'
        },
        {
          text: 'Сделка',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_291'
        },
        {
          text: 'Наблюдатели',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_295'
        },
        {
          text: 'Автор',
          align: 'start',
          sortable: true,
          value: 'CREATED_BY'
        },
        {
          text: 'Сделать подзадачей (указать № родительской задачи)',
          align: 'start',
          sortable: true,
          value: 'PROPERTY_1081'
        }
      ],
      elements: [],
      fieldValues: {
        PROPERTY_281: {
          FIELD_ID: 'PROPERTY_281',
          SORT: 60,
          NAME: 'Состояние',
          IS_REQUIRED: 'N',
          MULTIPLE: 'N',
          DEFAULT_VALUE: null,
          TYPE: 'L',
          PROPERTY_TYPE: 'L',
          PROPERTY_USER_TYPE: false,
          CODE: 'SOSTOYANIE',
          ID: '281',
          LINK_IBLOCK_ID: null,
          ROW_COUNT: '1',
          COL_COUNT: '30',
          IBLOCK_ID: 55,
          DISPLAY_VALUES_FORM: {
            195: 'Новое',
            197: 'БУ',
            199: 'Новое или БУ'
          }
        }
      },
      elementsList: [
        {
          IBLOCK_ID: '55',
          ID: '1323',
          NAME: 'Шкаф напольный 19-дюймовый',
          IBLOCK_SECTION_ID: null,
          CREATED_BY: '51',
          BP_PUBLISHED: 'Y',
          CODE: null,
          DATE_CREATE: '09.12.2019 13:02:04',
          DETAIL_TEXT: 'какое-то описание',
          CREATED_USER_NAME: '(popkov@polyservice.ru) Николай Попков',
          DETAIL_TEXT_TYPE: 'text',
          PROPERTY_279: {
            5983: '191'
          },
          PROPERTY_281: {
            5985: '199'
          },
          PROPERTY_283: {
            5987: '201'
          },
          PROPERTY_291: {
            5991: '505'
          }
        },
        {
          ID: '1325',
          IBLOCK_ID: '55',
          NAME: 'Шкаф напольный 19-дюймовый 1',
          IBLOCK_SECTION_ID: null,
          CREATED_BY: '51',
          BP_PUBLISHED: 'Y',
          CODE: null,
          DATE_CREATE: '09.12.2019 13:02:07',
          DETAIL_TEXT: 'какое-то описание 1',
          CREATED_USER_NAME: '(popkov@polyservice.ru) Николай Попков',
          DETAIL_TEXT_TYPE: 'text',
          PROPERTY_279: {
            5983: '191'
          },
          PROPERTY_281: {
            5985: '199'
          },
          PROPERTY_283: {
            5987: '201'
          },
          PROPERTY_291: {
            5991: '505'
          }
        }
      ]
    }
  },
  methods: {
    async getHeaders() {
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
    async getElements() {
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
    },
    setItem() {
      this.elementsList.forEach((element, index) => {
        for (const [key] of Object.entries(element)) {
          if (key in this.fieldValues) {
            const value = Object.entries(this.elementsList[index][key])
            console.log(value)
            this.elementsList[index][key] = this.fieldValues[key].DISPLAY_VALUES_FORM[value[0][1]]
          }
        }
      })
    }
  },
  async created() {
    // await this.getHeaders()
    // console.log(this.fieldValues)
    // console.log(await this.getElements())
    this.setItem()
  }
}
</script>

<style scoped>

</style>
