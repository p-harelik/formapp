import Bitrix from '../../plugins/Bitrix'

export default {
  actions: {
    async planningInScheduleRequest (ctx, data) {
      try {
        const files = await Bitrix.loadFiles(data.files)

        const params = {
          IBLOCK_TYPE_ID: 'lists',
          IBLOCK_ID: '47',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Планирование в график отсутствий',
            PROPERTY_235: data.users, // кого запланировать
            PROPERTY_2025: data.planningDates[0], // с какого числа
            PROPERTY_239: data.planningDates[1] || data.planningDates[0], // по какое число
            PROPERTY_325: data.planningType, // тип планирования
            PROPERTY_1975: data.company, // компания
            PROPERTY_2083: data.isNeedActOfWork ? 1253 : 1255, // нужен ли акт выполненных работ
            PROPERTY_1977: data.contactData, // контактная информация
            PROPERTY_301: data.planningWorks, // планируемые работы
            PROPERTY_1979: files, // файлы
            PROPERTY_241: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1981: 'application' // источник
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
