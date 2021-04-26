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

        const sender = data.sender.companyInfo.title
          ? data.sender.companyInfo.title
          : data.sender.passportData

        const recipient = data.recipient.companyInfo.title
          ? data.recipient.companyInfo.title
          : data.recipient.passportData

        const places = data.places.map((item, index) => {
          let row = ''
          if (index === 0) {
          row = row + '[TR][TH][b]Место[/b][/TH][TH][b]Наименование[/b][/TH][TH][b]Габариты ' +
             'Д x Ш x В (см)[/b][/TH][TH][b]Вес (кг)[/b][/TH][/TR]'
          }
          row = row + `[TR][TD]${index + 1}[/TD][TD]${item.natureOfCargo}[/TD][TD]${item.length}` +
          `x ${item.width} x ${item.height}[/TD][TD]${item.weight}[/TD][/TR]`
          return row
        }).join('')

        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '179',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Доставка оборудования',
            PROPERTY_1431: sender, // компания отправитель
            PROPERTY_1217: data.sender.address, // адрес отправителя
            PROPERTY_1487: data.sender.contactName, // контактное лицо отправителя
            PROPERTY_1315: data.sender.phoneNumber, // телефон отправителя
            PROPERTY_1485: recipient, // компания получатель
            PROPERTY_1209: data.recipient.address, // адрес получателя
            PROPERTY_1207: data.recipient.contactName, // контактное лицо получателя
            PROPERTY_1317: data.recipient.phoneNumber, // телефон получателя
            PROPERTY_1331: data.atWhoseExpense, // за чей счет отправка
            PROPERTY_1203: data.date, // .split('-').reverse().join('.'),
            PROPERTY_1333: data.delivery,
            PROPERTY_1221: data.isLathing ? 761 : 763, // обрешетка
            PROPERTY_1319: data.isInsurance ? 809 : 811, // страховка
            PROPERTY_1689: data.costOfCargo ? data.costOfCargo + ' руб' : '',
            PROPERTY_1691: data.deliveryComment, // комментарий к доставке
            PROPERTY_1223: data.buyerOrder, // заказ покупателя
            DETAIL_TEXT: places,
            PROPERTY_1213: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1211: files, // файл
            PROPERTY_1481: observers, // наблюдатели
            PROPERTY_1215: data.taskId, // номер родительской задачи
            PROPERTY_1703: 'application' // source
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
