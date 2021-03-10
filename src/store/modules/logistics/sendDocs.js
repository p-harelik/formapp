import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async addSendDocsRequest (ctx, data) {
      try {
        console.log(data, 'data')
        const files = await Bitrix.loadFiles(data.files)
        let observers = []
        if (data.observers) {
          observers = data.observers.map(item => item.id)
        }
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '177',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Отправка документов',
            PROPERTY_1429: data.senderCompany, // компания отправитель
            PROPERTY_1479: data.recipientCompany, // компания получатель
            PROPERTY_1191: data.recipientCompanyAddress, // адрес получателя
            PROPERTY_1193: data.recipientContactName, // контактное лицо получателя
            PROPERTY_1313: data.recipientContactPhones, // телефон получателя
            PROPERTY_1325: data.atWhoseExpenseSelect, // за чей счет отправка
            PROPERTY_1327: data.buyerOrder, // заказ покупателя
            PROPERTY_1197: data.date.split('-').reverse().join('.'),
            PROPERTY_1195: data.delivery,
            DETAIL_TEXT: data.description,
            PROPERTY_1183: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1181: files, // файл
            PROPERTY_1483: observers, // наблюдатели
            PROPERTY_1187: data.taskId // номер родительской задачи
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
