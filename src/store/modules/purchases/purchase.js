import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async addPurchaseRequest (ctx, data) {
      try {
        console.log('data', data)
        const files = await Bitrix.loadFiles(data.files)
        let observers = []
        if (data.observers) {
          observers = data.observers.map(item => item.id)
        }
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '55',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: data.shortTitle,
            // CREATED_BY: this.getters.getUser.ID,
            PROPERTY_279: data.requestType, // тип запроса,
            PROPERTY_1015: data.productType, // тип товара
            PROPERTY_281: data.condition, // состояние
            PROPERTY_283: data.urgencyOfPurchase, // срочность
            PROPERTY_1011: data.whatCompanyPurchase, // от какой компании
            DETAIL_TEXT: data.description,
            PROPERTY_1433: data.isReserve ? 879 : 881, // резервирование
            PROPERTY_291: data.deal ? data.deal.id : '', // сделка
            PROPERTY_287: files, // файл
            PROPERTY_295: observers, // наблюдатели
            PROPERTY_1081: data.taskId // номер родительской задачи
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
