<template>
  <div>
    <v-snackbar
      color="error"
      v-model="isValidationError"
      top
      right
    >
      Ошибка валидации формы, проверьте поля
    </v-snackbar>
    <h1 class="ma-5 display-1">Расчет PolyLED</h1>
    <v-stepper v-model="currentStep" alt-labels>
      <v-stepper-header>
        <v-stepper-step
          :complete="currentStep > 1"
          step="1"
        >
          Информация по проекту
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="currentStep > 2 && step1Fields.isRegistrationRequired"
          step="2"
        >
          Регистрация проекта
          <small>Опционально</small>
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
          <v-card>
            <v-stepper-content step="1">
              <div class="wrapper-form my-2">
                <v-text-field
                  v-model="step1Fields.projectName"
                  label="Название и номер проекта из 1С (+тип объекта)"
                  hint="Для идентификации внутри компании. Например, Мультифункциональный зал_Альфабанк AV190493."
                  :error-messages="projectNameErrors"
                  @blur="$v.step1Fields.projectName.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="step1Fields.gip"
                  label="Кто составил? (ГИП) "
                  hint="Пример: Матов Ю.В."
                  :error-messages="gipErrors"
                  @blur="$v.step1Fields.gip.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="step1Fields.projectManager"
                  label="Менеджер проекта"
                  hint="Пример: Князева М.А."
                  :error-messages="projectManagerErrors"
                  @blur="$v.step1Fields.projectManager.$touch()"
                ></v-text-field>
                <v-radio-group
                  v-model="step1Fields.isRegistrationRequired"
                  column
                  mandatory
                >
                  <template v-slot:label>
                    <div>Зарегистрировать проект у поставщика?</div>
                  </template>
                  <v-radio label="Да" :value="true"></v-radio>
                  <v-radio label="Нет" :value="false"></v-radio>
                </v-radio-group>
                <v-btn
                  color="primary"
                  @click="nextStep()"
                >
                  Далее
                </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="2">
              <div class="wrapper-form my-2">
                <v-text-field
                  v-model="step2Fields.fullProjectName"
                  label="Полное наименование проекта (объекта)"
                  hint="Без аббревиатур"
                  :error-messages="fullProjectNameErrors"
                  @blur="$v.step2Fields.fullProjectName.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="step2Fields.customer"
                  label="Заказчик"
                  hint="Без аббревиатур"
                  :error-messages="customerErrors"
                  @blur="$v.step2Fields.customer.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="step2Fields.installationAddress"
                  label="Адрес инсталляции"
                  hint="Индекс, Населенный пункт, Улица, Дом"
                  :error-messages="installationAddressErrors"
                  @blur="$v.step2Fields.installationAddress.$touch()"
                ></v-text-field>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-menu
                      v-model="step2Fields.menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="implementationDateText"
                          label="Дата реализации"
                          prepend-icon="mdi-calendar"
                          :error-messages="implementationDateErrors"
                          @blur="$v.step2Fields.implementationDate.$touch()"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="step2Fields.implementationDate"
                        :min="new Date().toISOString().substr(0, 10)"
                        locale="ru"
                        first-day-of-week="1"
                        @input="step2Fields.menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-radio-group
                  v-model="step2Fields.whoseProject"
                  column
                  mandatory
                  label="Чей проект?"
                >
                  <v-radio
                    v-for="n in step2Fields.whoseProjectItems"
                    :key="n.value"
                    :label="n.label"
                    :value="n.label"
                  >
                  </v-radio>
                </v-radio-group>
                <v-btn
                  color="primary"
                  @click="nextStep()"
                >
                  Далее
                </v-btn>
                <v-btn
                  text
                  @click=" currentStep--"
                >
                  Назад
                </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="3">
              <div class="wrapper-form my-2">
                <div class="v-text-field__slot">
                  <label class="v-label theme--light text-14"> Ширина (в метрах)
                    <v-row class="mt-0 pt-0">
                      <v-col
                        sm="3"
                        class="mt-0 pt-0"
                      >
                        <v-select
                          v-model="step3Fields.width.accuracy"
                          :items="step3Fields.accuracyItems"
                        ></v-select>
                      </v-col>
                      <v-col
                        class="mt-0 pt-0"
                      >
                        <v-text-field
                          v-model="step3Fields.width.item"
                          hint="В метрах"
                          type="number"
                          :error-messages="widthItemErrors"
                          @blur="$v.step3Fields.width.item.$touch()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </label>
                </div>
                <div class="v-text-field__slot">
                  <label class="v-label theme--light text-14"> Высота (в метрах)
                    <v-row class="mt-0 pt-0">
                      <v-col
                        sm="3"
                        class="mt-0 pt-0"
                      >
                        <v-select
                          v-model="step3Fields.height.accuracy"
                          :items="step3Fields.accuracyItems"
                        ></v-select>
                      </v-col>
                      <v-col
                        class="mt-0 pt-0"
                      >
                        <v-text-field
                          v-model="step3Fields.height.item"
                          type="number"
                          hint="В метрах"
                          :error-messages="heightItemErrors"
                          @blur="$v.step3Fields.height.item.$touch()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </label>
                </div>
                <v-text-field
                  label="Шаг пикселя (в милиметрах)"
                  v-model="step3Fields.pixelPitch"
                  type="number"
                  :error-messages="pixelPitchErrors"
                  @blur="$v.step3Fields.pixelPitch.$touch()"
                ></v-text-field>
                <v-select
                  v-model="step3Fields.installationSite"
                  :items="step3Fields.installationSiteItems"
                  label="Место установки"
                  hint="Внутри помещения (indoor) или снаружи (outdoor)"
                  :error-messages="installationSiteErrors"
                  @blur="$v.step3Fields.installationSite.$touch()"
                ></v-select>
                <v-select
                  v-model="step3Fields.typeOfUse"
                  :items="step3Fields.typeOfUseItems"
                  label="Тип использования"
                  hint="Стационарный, когда один раз собрал и забыл (Fixed) или мобильный, когда требуется часто разбирать, перемещать и заново собирать (Rental)"
                  :error-messages="typeOfUseErrors"
                  @blur="$v.step3Fields.typeOfUse.$touch()"
                ></v-select>
                <div class="v-text-field__slot mt-4">
                  <label class="v-label theme--light text-14">
                    Форм-фактор светодиодного кабинета
                  </label>
                  <div class="v-messages theme--light my-2">
                    Standard- Обычный сплошной кабинет, возможны разные соотношения сторон. Standard 16:9- Сплошной
                    кабинет 16:9.
                    Mediafacade- Уличный прозрачный кабинет. Floor- Кабинеты для светодиодного пола. Custom form-
                    Необычной формы. Flex- Гибкий.
                  </div>
                  <v-checkbox
                    v-for="formFactorItem of step3Fields.formFactorItems"
                    v-model="step3Fields.formFactor"
                    :key="formFactorItem"
                    :label="formFactorItem"
                    :value="formFactorItem"
                    class="my-0 py-0"
                    :error="$v.step3Fields.formFactor.$invalid && $v.step3Fields.formFactor.$dirty"
                    @change="$v.step3Fields.formFactor.$touch()"
                  ></v-checkbox>
                  <v-input
                    :error-messages="formFactorErrors"
                  ></v-input>
                </div>
                <v-select
                  label="Тип обслуживания"
                  v-model="step3Fields.typeOfServices"
                  :items="step3Fields.typeOfServicesItems"
                  :error-messages="typeOfServicesErrors"
                  @blur="$v.step3Fields.typeOfServices.$touch()"
                ></v-select>
                <div class="v-text-field__slot mt-4">
                  <label class="v-label theme--light text-14">
                    Ценовая категория + Вес поставщика
                  </label>
                  <v-checkbox
                    v-for="item of step3Fields.priceCategoryItems"
                    v-model="step3Fields.priceCategory"
                    :key="item"
                    :label="item"
                    :value="item"
                    class="my-0 py-0"
                    :error="$v.step3Fields.priceCategory.$invalid && $v.step3Fields.priceCategory.$dirty"
                    @change="$v.step3Fields.priceCategory.$touch()"
                  ></v-checkbox>
                  <v-input
                    :error-messages="priceCategoryErrors"
                  ></v-input>
                </div>
                <v-radio-group
                  label="Хотите указать дополнительную информацию?"
                  v-model="step3Fields.isAddAdditionalInfo"
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
                <v-btn
                  color="primary"
                  @click="step3Fields.isAddAdditionalInfo ? nextStep() : send()"
                >
                  {{ step3Fields.isAddAdditionalInfo ? 'Далее' : 'Оставить заявку' }}
                </v-btn>
                <v-btn
                  text
                  @click="step1Fields.isRegistrationRequired ? currentStep-- : currentStep = 1"
                >
                  Назад
                </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="4">
              <div class="wrapper-form my-2">
                <div class="v-text-field__slot mt-4">
                  <label class="v-label theme--light text-14">
                    Тип крепления
                  </label>
                  <v-checkbox
                    v-model="mountType"
                    label="Настенный"
                    value="Настенный"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="mountType"
                    label="Напольный"
                    value="Напольный"
                    class="my-0 py-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="mountType"
                    label="Подвесной"
                    value="Подвесной"
                    class="my-0 py-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="mountType"
                    label="Распорная конструкция"
                    value="Распорная конструкция"
                    class="my-0 py-0"
                  ></v-checkbox>
                </div>
                <div class="v-text-field__slot mt-4">
                  <label class="v-label theme--light text-14">
                    Тип демонстрируемого контента
                  </label>
                  <v-checkbox
                    v-model="typeOfContentShow"
                    label="Реклама"
                    value="Реклама"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="typeOfContentShow"
                    label="Текст"
                    value="Текст"
                    class="my-0 py-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="typeOfContentShow"
                    label="Фото"
                    value="Фото"
                    class="my-0 py-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="typeOfContentShow"
                    label="Карты"
                    value="Карты"
                    class="my-0 py-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="typeOfContentShow"
                    label="Презентации"
                    value="Презентации"
                    class="my-0 py-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="typeOfContentShow"
                    label="Видео"
                    value="Видео"
                    class="my-0 py-0"
                  ></v-checkbox>
                </div>
                <v-radio-group
                  label="Расстояние от экрана до серверной/аппаратной"
                  v-model="distanceFromScreenToServer"
                >
                  <v-radio
                    label="До 20 м"
                    value="До 20 м"
                  ></v-radio>
                  <v-radio
                    label="20-100 м"
                    value="20-100 м"
                  ></v-radio>
                  <v-radio
                    label="Более 100 м"
                    value="Более 100 м"
                  ></v-radio>
                  <v-radio
                    label="Не знаю"
                    value="Не знаю"
                  ></v-radio>
                </v-radio-group>
                <v-text-field
                  label="Минимальная яркость"
                  v-model="minBrightness"
                ></v-text-field>
                <v-text-field
                  label="Максимальный вес экрана или кабинета (кг)"
                  v-model="weightLimit"
                  type="number"
                ></v-text-field>
                <v-text-field
                  label="Максимальное энергопотребление экрана или за 1м2(Ватт)"
                  v-model="maxPowerConsumption"
                ></v-text-field>
                <v-radio-group
                  label="Требуемое разрешение экрана"
                  v-model="screenResolution"
                >
                  <v-radio
                    label="Full HD (1920x1080) 16:9"
                    value="Full HD (1920x1080) 16:9"
                  ></v-radio>
                  <v-radio
                    label="4К UHD (3840х2160) 16:9"
                    value="4К UHD (3840х2160) 16:9"
                  ></v-radio>
                  <v-radio
                    label="Другое популярное"
                    value="Другое популярное"
                  ></v-radio>
                  <v-radio
                    label="Любое"
                    value="Любое"
                  ></v-radio>
                </v-radio-group>
                <v-radio-group
                  label="Частота обновления (Гц)"
                  v-model="updateFrequency  "
                >
                  <v-radio
                    label="1920 Гц"
                    value="1920 Гц"
                  ></v-radio>
                  <v-radio
                    label="3840 Гц"
                    value="3840 Гц"
                  ></v-radio>
                  <v-radio
                    label="Любая"
                    value="Любая"
                  ></v-radio>
                </v-radio-group>
                <v-textarea
                  v-model.trim="additionalRequirements"
                  label="Дополнительные требования"
                  auto-grow
                ></v-textarea>
                <v-btn
                  color="primary"
                  @click="send()"
                >
                  Оставить заявку
                </v-btn>

                <v-btn
                  text
                  @click="currentStep--"
                >
                  Назад
                </v-btn>
              </div>
            </v-stepper-content>
          </v-card>
        </form>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'Polyled',
  data: () => ({
    currentStep: 1,
    isValidationError: false,

    step1Fields: {
      projectName: '',
      gip: '',
      projectManager: '',
      isRegistrationRequired: false
    },

    step2Fields: {
      project: null,
      customer: '',
      installationAddress: '',
      implementationDate: '',
      menu1: false,
      whoseProject: '',
      whoseProjectItems: [
        {
          label: 'Полимедиа'
        },
        {
          label: 'Дилер'
        }
      ]
    },

    step3Fields: {
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
      formFactorItems: [
        'Standard',
        'Standard 16:9',
        'Mediafacade',
        'Floor',
        'Custom form',
        'Flex',
        'Прозрачный',
        'Any'
      ],
      typeOfServices: '',
      typeOfServicesItems: [
        'Front',
        'Back',
        'Any'
      ],
      priceCategory: [],
      priceCategoryItems: [
        '$$$ (Leyard, Unilumin, Absen)',
        '$$ (Lightking, LAMP, Qstech)',
        '$ (AET, Priva)',
        '0-$ (LEDsi, NoName)'
      ],
      isAddAdditionalInfo: false
    },

    mountType: [],
    typeOfContentShow: [],
    distanceFromScreenToServer: '',
    minBrightness: '',
    weightLimit: '',
    maxPowerConsumption: '',
    screenResolution: '',
    updateFrequency: '',
    additionalRequirements: ''

  }),
  validations: {
    step1Fields: {
      projectName: { required },
      gip: { required },
      projectManager: { required }
    },
    step2Fields: {
      fullProjectName: {
        required: requiredIf(function () {
          return this.step1Fields.isRegistrationRequired
        })
      },
      customer: {
        required: requiredIf(function () {
          return this.step1Fields.isRegistrationRequired
        })
      },
      installationAddress: {
        required: requiredIf(function () {
          return this.step1Fields.isRegistrationRequired
        })
      },
      implementationDate: {
        required: requiredIf(function () {
          return this.step1Fields.isRegistrationRequired
        })
      }
    },
    step3Fields: {
      width: {
        item: { required }
      },
      height: {
        item: { required }
      },
      pixelPitch: { required },
      installationSite: { required },
      typeOfUse: { required },
      formFactor: { required },
      typeOfServices: { required },
      priceCategory: { required }
    }

  },
  computed: {
    implementationDateText() {
      return this.step2Fields.implementationDate.split('-').reverse().join('-')
    },
    projectNameErrors() {
      const errors = []
      if (!this.$v.step1Fields.projectName.$dirty) return errors
      !this.$v.step1Fields.projectName.required && errors.push('Укажите название проекта')
      return errors
    },
    gipErrors() {
      const errors = []
      if (!this.$v.step1Fields.gip.$dirty) return errors
      !this.$v.step1Fields.gip.required && errors.push('Укажите ГИП')
      return errors
    },
    projectManagerErrors() {
      const errors = []
      if (!this.$v.step1Fields.projectManager.$dirty) return errors
      !this.$v.step1Fields.projectManager.required && errors.push('Укажите менеджера проекта')
      return errors
    },
    fullProjectNameErrors() {
      const errors = []
      if (!this.$v.step2Fields.fullProjectName.$dirty) return errors
      !this.$v.step2Fields.fullProjectName.required && errors.push('Укажите полное название проекта (объекта)')
      return errors
    },
    customerErrors() {
      const errors = []
      if (!this.$v.step2Fields.customer.$dirty) return errors
      !this.$v.step2Fields.customer.required && errors.push('Укажите заказчика')
      return errors
    },
    installationAddressErrors() {
      const errors = []
      if (!this.$v.step2Fields.installationAddress.$dirty) return errors
      !this.$v.step2Fields.installationAddress.required && errors.push('Укажите адрес инсталяции')
      return errors
    },
    implementationDateErrors() {
      const errors = []
      if (!this.$v.step2Fields.implementationDate.$dirty) return errors
      !this.$v.step2Fields.implementationDate.required && errors.push('Укажите дату реализации')
      return errors
    },
    widthItemErrors() {
      const errors = []
      if (!this.$v.step3Fields.width.item.$dirty) return errors
      !this.$v.step3Fields.width.item.required && errors.push('Укажите ширину')
      return errors
    },
    heightItemErrors() {
      const errors = []
      if (!this.$v.step3Fields.height.item.$dirty) return errors
      !this.$v.step3Fields.height.item.required && errors.push('Укажите высоту')
      return errors
    },
    pixelPitchErrors() {
      const errors = []
      if (!this.$v.step3Fields.pixelPitch.$dirty) return errors
      !this.$v.step3Fields.pixelPitch.required && errors.push('Укажите шаг пикселя в милиметрах')
      return errors
    },
    installationSiteErrors() {
      const errors = []
      if (!this.$v.step3Fields.installationSite.$dirty) return errors
      !this.$v.step3Fields.installationSite.required && errors.push('Укажите место установки')
      return errors
    },
    typeOfUseErrors() {
      const errors = []
      if (!this.$v.step3Fields.typeOfUse.$dirty) return errors
      !this.$v.step3Fields.typeOfUse.required && errors.push('Укажите тип использования')
      return errors
    },
    formFactorErrors() {
      const errors = []
      if (!this.$v.step3Fields.formFactor.$dirty) return errors
      !this.$v.step3Fields.formFactor.required && errors.push('Укажите форм-фактор светодиодного кабинета')
      return errors
    },
    typeOfServicesErrors() {
      const errors = []
      if (!this.$v.step3Fields.typeOfServices.$dirty) return errors
      !this.$v.step3Fields.typeOfServices.required && errors.push('Укажите тип обслуживания')
      return errors
    },
    priceCategoryErrors() {
      const errors = []
      if (!this.$v.step3Fields.priceCategory.$dirty) return errors
      !this.$v.step3Fields.priceCategory.required && errors.push('Укажите ценовые категории')
      return errors
    }

  },
  watch: {
    currentStep() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  },
  methods: {
    async send() {
      this.$v.$touch()
      console.log(this.$v)
      if (this.$v.$invalid) {
        this.isValidationError = true
        return
      }
      console.log('Форма отправлена')
    },
    nextStep() {
      let isInvalid = false
      if (this.currentStep === 1) {
        this.$v.step1Fields.$touch()
        isInvalid = this.$v.step1Fields.$invalid
      }
      if (this.currentStep === 2) {
        this.$v.step2Fields.$touch()
        isInvalid = this.$v.step2Fields.$invalid
      }
      if (this.currentStep === 3) {
        this.$v.step3Fields.$touch()
        isInvalid = this.$v.step3Fields.$invalid
      }
      if (isInvalid) {
        this.isValidationError = true
        return false
      } else {
        if (this.currentStep === 1 && !this.step1Fields.isRegistrationRequired) {
          this.currentStep = 3
        } else {
          this.currentStep++
        }
        this.$v.$reset()
      }
    }
  }
}
</script>

<style scoped>
.text-14 {
  font-size: 14px;
}
</style>
