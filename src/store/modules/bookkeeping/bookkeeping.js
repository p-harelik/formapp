import Bitrix from '../../../plugins/Bitrix'

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
    async vacationRequest (ctx, data) {
      try {
        const files = await Bitrix.loadFiles(data.files)
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '21',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Основной отпуск',
            PROPERTY_1499: data.user, // сотрудник
            PROPERTY_83: data.dates[0], // дата начала
            PROPERTY_85: data.dates[1] ? data.dates[1] : data.dates[0], // дата окончания
            PROPERTY_1497: data.type, // тип
            PREVIEW_TEXT: data.description, // комментарий
            PROPERTY_1501: files // заявление
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return { elementId: res }
      } catch (e) {
        return e
      }
    },
    async businessTripRequest (ctx, data) {
      try {
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '39',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Командировка',
            PROPERTY_151: data.users, // командируемые
            PROPERTY_157: data.tripDates[0],
            PROPERTY_159: data.tripDates[1] || data.tripDates[0],
            PROPERTY_465: data.workDates[0],
            PROPERTY_467: data.workDates[1] || data.workDates[0],
            PROPERTY_161: data.purpose, // цель
            PROPERTY_259: data.address, // адрес
            PROPERTY_163: data.hotel,
            PROPERTY_165: data.tickets,
            PROPERTY_955: data.money,
            PROPERTY_183: data.deal ? data.deal.id : '', // сделка
            PROPERTY_185: data.description // комментарий
          }
        }
        const res = await Bitrix.callMethod('lists.element.add', params)
        return { elementId: res }
      } catch (e) {
        return e
      }
    },
    async newEmployeeRequest (ctx, data) {
      try {
        const params = {
          IBLOCK_TYPE_ID: 'bitrix_processes',
          IBLOCK_ID: '43',
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Оформление нового сотрудника',
            PROPERTY_189: data.surname,
            PROPERTY_187: data.name,
            PROPERTY_191: data.patronymic,
            PROPERTY_193: data.phone,
            PROPERTY_195: data.email,
            PROPERTY_197: data.vacancy
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
