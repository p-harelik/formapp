import Bitrix from '../../../plugins/Bitrix'

export default {
  actions: {
    async addRegistrationRequest (ctx, data) {
      try {
        const files = await Bitrix.loadFiles(data.files)
        let observers = []
        if (data.observers) {
          observers = data.observers.map(item => item.id)
        }
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: '193',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: data.customerName, // наименование заказчика
            PROPERTY_1491: data.customerId, // ид компании заказчика
            PROPERTY_1437: data.individualNumber, // ИНН заказчика
            PROPERTY_1439: data.objectName, // объект
            PROPERTY_1441: data.objectAddress, // адрес объекта
            PROPERTY_1443: data.projectName, // проект
            PROPERTY_1445: data.projectManager, // менеджер проекта
            PROPERTY_1447: data.quarterNumber, // квартал реализации
            PROPERTY_1451: data.whatCompanyRegistration, // регистрация от компании
            DETAIL_TEXT: data.description, // описание
            PROPERTY_1449: files, // файл
            PROPERTY_1453: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1457: observers,
            PROPERTY_1455: data.taskId // номер задачи
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
