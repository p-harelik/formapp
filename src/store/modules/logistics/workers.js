import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async workersRequest (ctx, data) {
      try {
        let observers = []
        if (data.observers) {
          observers = data.observers.map(item => item.id)
        }
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '185',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: data.place, // место исполнения
            PROPERTY_1335: data.workersCount, // количество грузчиков
            PROPERTY_1297: data.date.split('-').reverse().join('.'), // дата исполнения
            DETAIL_TEXT: data.description,
            PROPERTY_1291: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1489: observers, // наблюдатели
            PROPERTY_1293: data.taskId // номер родительской задачи
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
