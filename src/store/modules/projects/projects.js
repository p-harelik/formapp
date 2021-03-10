import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async isoResourceRequest (ctx, data) {
      try {
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '195',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов ИСО',
            PROPERTY_1503: resource.numberPeople, // количество чел
            PROPERTY_1505: resource.dates[0], // дата с
            PROPERTY_1507: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1509: data.project // ид проекта
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return {
          listTitle: resource.title,
          elementId: res
        }
      } catch (e) {
        return {
          listTitle: data.resource.title,
          error: e
        }
      }
    },
    async mtoResourceRequest (ctx, data) {
      try {
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 1347,
          IBLOCK_ID: '205',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов МТО',
            PROPERTY_1535: resource.numberPeople, // количество чел
            PROPERTY_1537: resource.dates[0], // дата с
            PROPERTY_1539: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1541: data.project // ид проекта
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return {
          listTitle: resource.title,
          elementId: res
        }
      } catch (e) {
        return {
          listTitle: data.resource.title,
          error: e
        }
      }
    },
    async programmersResourceRequest (ctx, data) {
      try {
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '199',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов Программисты',
            PROPERTY_1511: resource.numberPeople, // количество чел
            PROPERTY_1513: resource.dates[0], // дата с
            PROPERTY_1515: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1517: data.project // ид проекта
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return {
          listTitle: resource.title,
          elementId: res
        }
      } catch (e) {
        return {
          listTitle: data.resource.title,
          error: e
        }
      }
    },
    async rpResourceRequest (ctx, data) {
      try {
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 1345,
          IBLOCK_ID: '201',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов Программисты',
            PROPERTY_1519: resource.numberPeople, // количество чел
            PROPERTY_1521: resource.dates[0], // дата с
            PROPERTY_1523: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1525: data.project // ид проекта
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return {
          listTitle: resource.title,
          elementId: res
        }
      } catch (e) {
        return {
          listTitle: data.resource.title,
          error: e
        }
      }
    },
    async consumablesRequest (ctx, data) {
      try {
        const consumbles = data.consumables.map(item => {
          return `${item.text}: ${item.count}`
        }).join('\n')
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 135,
          IBLOCK_ID: 207,
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос расходных материалов',
            PREVIEW_TEXT: consumbles, // перечень расходных материалов
            DETAIL_TEXT: data.description, // комментарий
            PROPERTY_1547: data.project, // номер и название проекта
            PROPERTY_1549: data.deal?.id || '' // сделка
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return { elementId: res }
      } catch (e) {
        return e
      }
    }
  }
}
