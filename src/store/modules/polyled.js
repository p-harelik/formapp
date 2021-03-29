import Bitrix from '@/plugins/Bitrix'

export default {
  actions: {
    async addPolyledRequest (ctx, data) {
      try {
        const files = await Bitrix.loadFiles(data.files)
        const params = {
          IBLOCK_TYPE_ID: 'lists_socnet',
          IBLOCK_ID: 219,
          SOCNET_GROUP_ID: 309,
          ELEMENT_CODE: Date.now(),
          FIELDS: {
            NAME: 'Расчет PolyLED',
            PROPERTY_1617: data.projectName, // Название и номер проекта из 1С (+тип объекта)
            PROPERTY_1621: data.projectManager, // Менеджер проекта
            PROPERTY_1623: data.isRegistrationRequired ? 'Да' : 'Нет', // Потребуется ли регистрация сейчас?
            PROPERTY_1625: data.isRegistrationRequired ? data.fullProjectName : '', // Полное наименование проекта (объекта)
            PROPERTY_1627: data.isRegistrationRequired ? data.customer : '', // Заказчик
            PROPERTY_1629: data.isRegistrationRequired ? data.installationAddress : '', // Адрес инсталляции
            PROPERTY_1631: data.isRegistrationRequired ? data.implementationDate : '', // Дата реализации
            PROPERTY_1633: data.isRegistrationRequired ? data.whoseProject : '', // Чей проект? Полимедии или Дилера?
            PROPERTY_1635: `${data.width.accuracy} ${data.width.item} м`, // Ширина
            PROPERTY_1637: `${data.height.accuracy} ${data.height.item} м`, // Высота
            PROPERTY_1639: `${data.pixelPitch} мм`, // Шаг пикселя (в мм)
            PROPERTY_1641: data.installationSite, // Место установки
            PROPERTY_1643: data.typeOfUse, // Тип использования
            PROPERTY_1645: data.formFactor, // Форм-фактор светодиодного кабинета
            PROPERTY_1647: data.typeOfServices, // Тип обслуживани
            PROPERTY_1649: data.priceCategory, // Ценовая категория+Вес поставщика
            PROPERTY_1651: data.mountType, // Тип крепления
            PROPERTY_1653: data.typeOfContentShow, // Тип демонстрируемого контента
            PROPERTY_1655: data.distanceFromScreenToServer, // На каком расстоянии от экрана находится серверная/аппаратная?
            PROPERTY_1659: data.minBrightness, // Минимальная яркость
            PROPERTY_1661: data.weightLimit ? `${data.weightLimit} кг` : '', // Максимальный вес экрана или кабинета (кг)
            PROPERTY_1663: data.maxPowerConsumption ? `${data.maxPowerConsumption} Ватт` : '', // Максимальное энергопотребление экрана или за 1м2(Ватт)
            PROPERTY_1665: data.screenResolution, // Требуемое разрешение экрана
            PROPERTY_1667: data.updateFrequency, // Частота обновления (Гц)
            PROPERTY_1669: data.additionalRequirements, // Дополнительные требования
            PROPERTY_1671: files // файлы
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
