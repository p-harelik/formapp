import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async addDeliveryEquipmentRequest (ctx, data) {
      try {
        const files = await Bitrix.loadFiles(data.files)
        let observers = []
        if (data.observers) {
          observers = data.observers.map(item => item.id)
        }
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '179',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Доставка оборудования',
            PROPERTY_1431: data.senderCompany, // компания отправитель
            PROPERTY_1217: data.senderAddress, // адрес отправителя
            PROPERTY_1487: data.senderPerson, // контактное лицо отправителя
            PROPERTY_1315: data.senderPersonPhone, // телефон отправителя
            PROPERTY_1485: data.recipientCompany, // компания получатель
            PROPERTY_1209: data.recipientCompanyAddress, // адрес получателя
            PROPERTY_1207: data.recipientPerson, // контактное лицо получателя
            PROPERTY_1317: data.recipientPersonPhone, // телефон получателя
            PROPERTY_1331: data.atWhoseExpense, // за чей счет отправка
            PROPERTY_1223: data.buyerOrder, // заказ покупателя
            PROPERTY_1203: data.date.split('-').reverse().join('.'),
            PROPERTY_1333: data.delivery,
            PROPERTY_1219: data.dimensions, // габариты
            PROPERTY_1225: data.weight, // вес
            PROPERTY_1221: data.isLathing ? 761 : 763, // обрешетка
            PROPERTY_1319: data.isInsurance ? 809 : 811, // страховка
            DETAIL_TEXT: data.description,
            PROPERTY_1213: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1211: files, // файл
            PROPERTY_1481: observers, // наблюдатели
            PROPERTY_1215: data.taskId // номер родительской задачи
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
