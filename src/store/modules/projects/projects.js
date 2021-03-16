import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async isoResourceRequest (ctx, data) {
      try {
        console.log(data, 'iso')
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 283,
          IBLOCK_ID: 211,
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов ИСО',
            PROPERTY_1561: resource.numberPeople, // количество чел
            PROPERTY_1563: resource.dates[0], // дата с
            PROPERTY_1565: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1567: data.projectId || 0, // ид проекта
            PROPERTY_1569: data.projectName // название
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
        console.log(data, 'mto')
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 283,
          IBLOCK_ID: '213',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов МТО',
            PROPERTY_1571: resource.numberPeople, // количество чел
            PROPERTY_1573: resource.dates[0], // дата с
            PROPERTY_1575: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1577: data.projectId || 0, // ид проекта
            PROPERTY_1579: data.projectName // название
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
        console.log(data, 'prog')
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 283,
          IBLOCK_ID: '215',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов Программисты',
            PROPERTY_1581: resource.numberPeople, // количество чел
            PROPERTY_1583: resource.dates[0], // дата с
            PROPERTY_1585: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1587: data.projectId || 0, // ид проекта
            PROPERTY_1589: data.projectName // название
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
        console.log(data, 'rp')
        const resource = data.resource
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          SOCNET_GROUP_ID: 283,
          IBLOCK_ID: '217',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Запрос ресурсов Программисты',
            PROPERTY_1591: resource.numberPeople, // количество чел
            PROPERTY_1593: resource.dates[0], // дата с
            PROPERTY_1595: resource.dates[1] || resource.dates[0], // дата по
            PROPERTY_1597: data.projectId || 0, // ид проекта
            PROPERTY_1599: data.projectName // название
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
