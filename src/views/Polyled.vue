<template>
  <div>
    <h1 class="ma-5 display-1">Расчет PolyLED</h1>
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <v-stepper-step
          :complete="currentStep > 1"
          step="1"
        >
          Информация по проекту
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="currentStep > 2 && isRegistrationRequired"
          step="2"
        >
          Регистрация проекта
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="currentStep > 3"
          step="3">
          Информация об экране
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          step="4">
          Дополнительная информация
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <form>
          <v-stepper-content step="1">
            <v-card class="mb-12">
              <v-card-text>
                <v-text-field
                  v-model="projectName"
                  label="Название и номер проекта из 1С (+тип объекта)"
                  hint="Для идентификации внутри компании. Например, Мультифункциональный зал_Альфабанк AV190493."
                ></v-text-field>
                <v-text-field
                  v-model="gip"
                  label="Кто составил?(ГИП?) "
                  hint="Пример: Матов Ю.В."
                ></v-text-field>
                <v-text-field
                  v-model="projectManager"
                  label="Менеджер проекта"
                  hint="Пример: Князева М.А."
                ></v-text-field>
                <v-radio-group
                  v-model="isRegistrationRequired"
                  column
                  mandatory
                >
                  <template v-slot:label>
                    <div>Потребуется ли регистрация сейчас?</div>
                  </template>
                  <v-radio label="Да" :value="true"></v-radio>
                  <v-radio label="Нет" :value="false"></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
            <v-btn
              color="primary"
              @click="isRegistrationRequired ? currentStep = 2 : currentStep = 3"
            >
              Далее
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card
              class="mb-12"
            >
              <v-card-text>
                <v-text-field
                  v-model="project"
                  label="Полное наименование проекта (объекта) (необязательно)"
                  hint="Без аббревиатур"
                ></v-text-field>
                <v-text-field
                  v-model="customer"
                  label="Заказчик (необязательно)"
                  hint="Без аббревиатур"
                ></v-text-field>
                <v-text-field
                  v-model="installationAddress"
                  label="Адрес инсталляции (необязательно)"
                  hint="Индекс, Населенный пункт, Улица, Дом"
                ></v-text-field>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="implementationDateText"
                          label="Дата реализации (необязательно)"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="implementationDate"
                        :min="new Date().toISOString().substr(0, 10)"
                        locale="ru"
                        first-day-of-week="1"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-radio-group
                  v-model="whoseProject"
                  column
                  mandatory
                >
                  <template v-slot:label>
                    <div>Чей проект?</div>
                  </template>
                  <v-radio
                    v-for="n in whoseProjectItems"
                    :key="n.value"
                    :label="n.label"
                    :value="n.value"
                  >
                  </v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
            <v-btn
              color="primary"
              @click="currentStep = 3"
            >
              Далее
            </v-btn>
            <v-btn
              text
              @click=" currentStep = 1"
            >
              Назад
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card
              class="mb-12 ma-5 pa-8"
            >
              <div class="v-text-field__slot">
                <label class="v-label theme--light"> Ширина (в метрах)
                  <v-row class="mt-0 pt-0">
                    <v-col
                      sm="2"
                      class="mt-0 pt-0"
                    >
                      <v-select
                        v-model="width.accuracy"
                        :items="accuracyItems"
                      ></v-select>
                    </v-col>
                    <v-col
                      class="mt-0 pt-0"
                    >
                      <v-text-field
                        v-model="width.item"
                        hint="В метрах"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </label>
              </div>
              <div class="v-text-field__slot">
                <label class="v-label theme--light"> Высота (в метрах)
                  <v-row class="mt-0 pt-0">
                    <v-col
                      sm="2"
                      class="mt-0 pt-0"
                    >
                      <v-select
                        v-model="height.accuracy"
                        :items="accuracyItems"
                      ></v-select>
                    </v-col>
                    <v-col
                      class="mt-0 pt-0"
                    >
                      <v-text-field
                        v-model="height.item"
                        hint="В метрах"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </label>
              </div>
              <v-text-field
                label="Шаг пикселя (в милиметрах)"
                v-model="pixelPitch"
              ></v-text-field>
              <v-select
                v-model="installationSite"
                :items="installationSiteItems"
                label="Место установки"
                hint="Внутри помещения (indoor) или снаружи (outdoor)"
              ></v-select>
              <v-select
                v-model="typeOfUse"
                :items="typeOfUseItems"
                label="Тип использования"
                hint="Стационарный, когда один раз собрал и забыл (Fixed) или мобильный, когда требуется часто разбирать, перемещать и заново собирать (Rental)"
              ></v-select>
              <div class="v-text-field__slot mt-4">
                <label class="v-label theme--light">
                  Форм-фактор светодиодного кабинета
                </label>
                <div class="v-messages theme--light mt-2">
                  Standard- Обычный сплошной кабинет, возможны разные соотношения сторон. Standard 16:9- Сплошной кабинет 16:9.
                  Mediafacade- Уличный прозрачный кабинет. Floor- Кабинеты для светодиодного пола. Custom form- Необычной формы. Flex- Гибкий.
                </div>
                <v-checkbox
                  v-model="formFactor"
                  label="Standard"
                  value="Standard"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Standard 16:9"
                  value="Standard 16:9"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Mediafacade"
                  value="Mediafacade"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Floor"
                  value="Floor"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Custom form"
                  value="Custom form"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Flex"
                  value="Flex"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Прозрачный"
                  value="Прозрачный"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="formFactor"
                  label="Any"
                  value="Any"
                  class="my-0 py-0"
                ></v-checkbox>
              </div>
              <v-select
                label="Тип обслуживания"
                v-model="typeOfServices"
                :items="typeOfServicesItems"
              ></v-select>
              <div class="v-text-field__slot mt-4">
                <label class="v-label theme--light">
                  Ценовая категория + Вес поставщика
                </label>
                <v-checkbox
                  v-model="priceCategory"
                  label="$$$ (Leyard, Unilumin, Absen)"
                  value="$$$ (Leyard, Unilumin, Absen)"
                ></v-checkbox>
                <v-checkbox
                  v-model="priceCategory"
                  label="$$ (Lightking, LAMP, Qstech)"
                  value="$$ (Lightking, LAMP, Qstech)"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="priceCategory"
                  label="$ (AET, Priva)"
                  value="$ (AET, Priva)"
                  class="my-0 py-0"
                ></v-checkbox>
                <v-checkbox
                  v-model="priceCategory"
                  label="0-$ (LEDsi, NoName)"
                  value="0-$ (LEDsi, NoName)"
                  class="my-0 py-0"
                ></v-checkbox>
              </div>
              <v-radio-group
                label="Хотите указать дополнительную информацию?"
                v-model="isAddAdditionalInfo"
              >
                <v-radio
                  label="Да"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="Нет, я указал всё, что знаю. Отправить форму."
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-card>
            <v-btn
              color="primary"
              @click="isAddAdditionalInfo ? currentStep = 4 : send()"
            >
              {{isAddAdditionalInfo ? 'Далее' : 'Отправить'}}
            </v-btn>
            <v-btn
              text
              @click="isRegistrationRequired ? currentStep = 2 : currentStep = 1"
            >
              Назад
            </v-btn>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>

            <v-btn
              color="primary"
              @click="currentStep = 1"
            >
              Continue
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>
        </form>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
export default {
  name: 'Polyled',
  data: () => ({
    currentStep: 1,

    projectName: '',
    gip: '',
    projectManager: '',
    isRegistrationRequired: false,

    project: null,
    customer: '',
    installationAddress: '',
    implementationDate: '',
    menu1: false,
    whoseProject: '',
    whoseProjectItems: [
      {
        value: 1,
        label: 'Полимедиа'
      },
      {
        value: 2,
        label: 'Дилер'
      }
    ],

    accuracyItems: [
      'Не более',
      'Не менее',
      'Примерно',
      'Ровно'
    ],
    width: {
      accuracy: 'Примерно',
      item: ''
    },
    height: {
      accuracy: 'Примерно',
      item: ''
    },
    pixelPitch: '',
    installationSite: '',
    installationSiteItems: [
      'Indoor',
      'Outdoor',
      'Any'
    ],
    typeOfUse: '',
    typeOfUseItems: [
      'Fixed',
      'Rental',
      'Any'
    ],
    formFactor: [],
    typeOfServices: '',
    typeOfServicesItems: [
      'Front',
      'Back',
      'Any'
    ],
    priceCategory: [],
    isAddAdditionalInfo: false

  }),
  computed: {
    implementationDateText () {
      return this.implementationDate.split('-').reverse().join('-')
    }
  },
  methods: {
    send() {
      console.log('Форма отправлена')
    }
  }
}
</script>

<style scoped>

</style>
