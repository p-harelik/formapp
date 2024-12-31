import Bitrix from '../../plugins/Bitrix'

export default {
  actions: {
    async issuanceOfFundsRequest (ctx, data) {
      try {
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '15',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Выдача денежных средств под отчет',
            PROPERTY_869: data.money + '|RUB', // деньги
            PROPERTY_865: data.formOfReceipt, // форма получения денежных средств
            PREVIEW_TEXT: data.description,
            PROPERTY_51: data.date.split('-').reverse().join('.'), // дата
            PROPERTY_785: data.deal ? data.deal.id : '' // сделка
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return { elementId: res }
      } catch (e) {
        return e
      }
    },
    async compensationRequest (ctx, data) {
      try {
        const files = await Bitrix.loadFiles(data.files)
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '103',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Компенсация денежных средств',
            PROPERTY_461: data.money + '|RUB', // сумма
            PREVIEW_TEXT: data.description, // комментарий к оплате
            PROPERTY_463: files,
            PROPERTY_871: data.deal.id ? data.deal.id : '' // сделка
          }
        }
          const res = await Bitrix.callMethod('lists.element.add', params)
          return { elementId: res }
      } catch (e) {
        return e
      }
    },
    async paymentRequest (ctx, data) {
      try {
        console.log(data)
        const files = await Bitrix.loadFiles(data.files)
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '159',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Оплата счетов в бухгалтерии',
            PROPERTY_1009: files,
            PROPERTY_995: data.money + '|RUB', // сумма
            PROPERTY_997: data.purpose, // назначение
            PROPERTY_999: 551,
            PROPERTY_1001: data.date.split('-').reverse().join('.'), // дата
            PROPERTY_1007: data.deal ? data.deal.id : '', // сделка
            PROPERTY_1003: data.description, // комментарий к оплате
            PROPERTY_1493: data.taskId // ид задачи
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return { elementId: res }
      } catch (e) {
        return e
      }
    },
    async absentRequest (ctx, data) {
      try {
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '33',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Оформление отсутствия',
            PROPERTY_139: data.user, // сотрудник
            PROPERTY_141: data.dates[0], // дата начала
            PROPERTY_143: data.dates[1] ? data.dates[1] : data.dates[0], // дата окончания
            PROPERTY_137: data.reasonAbsence, // причина
            PROPERTY_227: data.description // комментарий
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return { elementId: res }
      } catch (e) {
        return e
      }
    },

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
