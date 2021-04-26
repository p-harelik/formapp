<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на доставку оборудования № {{result.elementId}} успешно создана!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="successSnackbar = false"
        >
          ОК
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="errorSnackbar"
      top
      :timeout="-1"
      color="error"
    >
      Ошибка ({{result}}) обратитесь к администратору!!!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="errorSnackbar = false"
        >
          ОК
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      color="error"
      v-model="isValidationError"
      top
      right
    >
      Ошибка валидации формы, проверьте поля
    </v-snackbar>
    <div class="wrapper-form">
      <form @submit.prevent >
        <p class="title font-weight-medium black--text mt-4 mb-4">Параметры оборудования</p>
        <div>
          <div
            v-for="(place, index) in $v.places.$each.$iter"
            :key="index"
          >
            <v-divider
              v-if="+index"
              class="mb-6"
            ></v-divider>
            <p class="mb-0">Место {{+index + 1}}
              <v-tooltip
                right
                max-width="250"
                color="rgba(0,0,0,0)"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    x-small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon color="blue lighten-1">
                      mdi-help-circle-outline
                    </v-icon>
                  </v-btn>
                </template>
                <v-card
                  dark
                  color="#363636"
                >
                  <v-card-title>
                    Место
                  </v-card-title>
                  <v-card-text>
                    Груз состоит из одного предмета: свёртка,
                    мешка, коробки, ящика, заполненного палета
                    и т.п. вне зависимости от размера.
                  </v-card-text>
                </v-card>
              </v-tooltip>
              <v-btn
                title="Дублировать место"
                icon
                color="primary"
                @click="copyPlace(+index)"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                v-if="+index"
                title="Удалить место"
                icon
                color="red"
                @click="removePlace(+index)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </p>
            <v-row>
              <v-col
                cols="12"
                md="3"
                sm="6"
                xs="12"
              >
                <v-text-field
                  v-model="place.$model.length"
                  label="Длина"
                  error-count="2"
                  suffix="см"
                  type="number"
                  min="1"
                  :error-messages="placeError(place.length, 'Укажите длину')"
                  @blur="place.length.$touch"
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="6"
                xs="12"
              >
                <v-text-field
                  v-model="place.$model.width"
                  label="Ширина"
                  type="number"
                  suffix="см"
                  min="1"
                  :error-messages="placeError(place.width, 'Укажите ширину')"
                  @blur="place.width.$touch"
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="6"
                xs="12"
              >
                <v-text-field
                  v-model="place.$model.height"
                  label="Высота"
                  type="number"
                  suffix="см"
                  min="1"
                  :error-messages="placeError(place.height, 'Укажите высоту')"
                  @blur="place.height.$touch"
                ></v-text-field>
              </v-col>
              <v-col
                md="3"
                sm="6"
              >
                <v-text-field
                  v-model="place.$model.weight"
                  label="Вес"
                  type="number"
                  suffix="кг"
                  step="0.1"
                  min="0.1"
                  :error-messages="placeError(place.weight, 'Укажите вес')"
                  @blur="place.weight.$touch"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-model.trim="place.$model.natureOfCargo"
              label="Наименование оборудования"
              :error-messages="placeError(place.natureOfCargo, 'Укажите наименование оборудования')"
              @blur="place.natureOfCargo.$touch"
            >
            </v-text-field>
          </div>
          <v-btn
            class="mb-6"
            outlined
            color="primary"
            @click="addPlace">Добавить место</v-btn>
        </div>
        <v-file-input
          v-model="files"
          multiple
          id="test_file_input"
          label="Добавить фото (документы)"
          counter
          prepend-icon="mdi-paperclip"
        >
          <template v-slot:selection="{ text }">
            <v-chip
              small
              label
              color="primary"
            >
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
        <p class="title font-weight-medium black--text mt-4 mb-4">Данные отправителя</p>
        <v-tabs
          v-model="sender.tab"
          color="white"
          active-class="grey lighten-1"
          grow
          hide-slider
        >
          <v-tab>Компания</v-tab>
          <v-tab>Физ. лицо</v-tab>
          <v-tabs-items
            v-model="sender.tab"
            class="mt-10 tabs-items--active"
          >
            <v-tab-item>
              <CompanyInputSync
                v-model="sender.companyInfo"
                label="Компания отправитель"
                :error-messages="requiredError($v.sender.companyInfo.title, 'Укажите компанию отправителя')"
                :blur="$v.sender.companyInfo.title.$touch"
              />
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="sender.passportData"
                label="Паспортные данные физ. лица"
                rows="2"
              >
              </v-textarea>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
        <ContactInputSync
          :company-id="sender.companyInfo.id"
          :contact-name="sender.contactName"
          :contact-phone="sender.phoneNumber"
          @contact-changed="updateSenderName"
          @phone-changed="updateSenderPhone"
          :contact-name-errors="requiredError($v.sender.contactName, 'Укажите контакт отправителя')"
          :contact-phone-errors="requiredError($v.sender.phoneNumber, 'Укажите телефон отправителя')"
        />
        <v-text-field
          v-model="sender.address"
          label="Адрес отправителя"
          ref="senderAddress"
          prepend-icon="mdi-map-marker"
          :error-messages="requiredError($v.sender.address, 'Укажите адрес отправителя')"
          @blur="$v.sender.address.$touch"
        ></v-text-field>
        <p class="title font-weight-medium black--text mt-4 mb-4">Данные получателя</p>
        <v-tabs
          v-model="recipient.tab"
          color="white"
          active-class="grey lighten-1"
          grow
          hide-slider
        >
          <v-tab>Компания</v-tab>
          <v-tab>Физ. лицо</v-tab>
          <v-tabs-items
            v-model="recipient.tab"
            class="mt-10 tabs-items--active"
          >
            <v-tab-item>
              <CompanyInputSync
                v-model="recipient.companyInfo"
                label="Компания получатель"
                :error-messages="requiredError($v.recipient.companyInfo.title, 'Укажите компанию получателя')"
                :blur="$v.recipient.companyInfo.title.$touch"
              />
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="recipient.passportData"
                label="Паспортные данные физ. лица"
                rows="2"
              >
              </v-textarea>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
        <ContactInputSync
          :company-id="recipient.companyInfo.id"
          :contact-name="recipient.contactName"
          :contact-phone="recipient.phoneNumber"
          @contact-changed="updateRecipientName"
          @phone-changed="updateRecipientPhone"
          :contact-name-errors="requiredError($v.recipient.contactName, 'Укажите контакт получателя')"
          :contact-phone-errors="requiredError($v.recipient.phoneNumber, 'Укажите телефон получателя')"
        />
        <v-text-field
          v-model="recipient.address"
          label="Адрес получателя"
          ref="recipientCompanyAddress"
          prepend-icon="mdi-map-marker"
          :error-messages="requiredError($v.recipient.address, 'Укажите адрес получателя')"
          @blur="$v.recipient.address.$touch"
        ></v-text-field>
        <p class="title font-weight-medium black--text mt-4 mb-4">Информация по доставке</p>
        <v-radio-group
          v-model="atWhoseExpenseSelect"
          mandatory
          column
        >
          <template v-slot:label>
            <div>Доставка за счет</div>
          </template>
          <v-radio
            v-for="n in atWhoseExpenseItems"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          >
          </v-radio>
        </v-radio-group>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateText"
                  :error-messages="requiredError($v.date, 'Необходимо указать дату доставки')"
                  label="Дата передачи в доставку"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                :min="date"
                locale="ru"
                first-day-of-week="1"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-select
          v-model="deliverySelect"
          :items="deliveryItems"
          label="Сервис доставки"
          prepend-icon="mdi-truck-fast"
        ></v-select>
        <p>Дополнительные услуги</p>
        <v-checkbox
          class="pb-0 mb-0"
          v-model="isInsurance"
          label="Оформить страховку"
        ></v-checkbox>
        <v-row v-if="isInsurance">
          <v-col
            class="my-0 py-0"
            md="4"
            sm="6"
            xs="12"
          >
            <v-text-field
              v-model="costOfCargo"
              v-money="costOfCargo"
              suffix="руб"
              label="Оценочная стоимость груза"
              :error-messages="requiredError($v.costOfCargo, 'Укажите оценочную стоимость груза')"
              @blur="$v.costOfCargo.$touch"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-checkbox
          class="py-0 my-0"
          v-model="isLathing"
          label="Упаковать в обрешетку"
        ></v-checkbox>
        <v-textarea
          v-model.trim="deliveryComment"
          label="Комментарии к доставки"
          hint="Укажите нюансы доставки"
          rows="3"
          auto-grow
        ></v-textarea>
        <p class="title font-weight-medium black--text mt-4 mb-4">Дополнительная информация</p>
        <DealInputSync
          v-model="deal"
          title="Сделка (необязательно)"
        />
        <v-text-field
          v-model="buyerOrder"
          label="Заказ покупателя с которого будет оплачиваться доставка"
          ref="buyerOrder"
          :error-messages="requiredError($v.buyerOrder, 'Укажите заказ покупателя')"
          @blur="$v.buyerOrder.$touch"
        ></v-text-field>
        <ProjectInput v-model="project"/>
        <TaskInput v-model="taskId"/>
        <v-input>
          <template>
            <v-row>
              <v-col>
                <v-btn
                  depressed
                  color="secondary lighten-1"
                  @click="addObserver"
                >
                  <v-icon class="mr-4"
                  >
                    mdi-account
                  </v-icon>
                  Добавить наблюдателей
                </v-btn>
              </v-col>
              <v-col>
                <template
                  v-if="observers.length"
                >
                  <v-chip
                    v-for="observer of observers"
                    :key="observer.id"
                    class="ma-1"
                    small
                    close
                    @click:close="removeObserver(observer.id)"
                  >
                    <v-avatar left>
                      <img :src="observer.photo" alt="">
                    </v-avatar>
                     {{observer.name}}
                  </v-chip>
                </template>
              </v-col>
            </v-row>
          </template>
        </v-input>
        <v-btn
          class="mr-4 mb-4"
          color="primary"
          @click="submit"
          type="submit"
          :loading="loading"
        >
          Оставить заявку
        </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
  import { required, requiredIf } from 'vuelidate/lib/validators'
  import { mapGetters, mapActions } from 'vuex'
  import selectObservers from '../../../../mixins/selectObservers'
  import searchCompany from '../../../../mixins/searchCompany'
  import ProjectInput from '../../ProjectInput'
  import TaskInput from '../../TaskInput'
  import DealInputSync from '@/components/DealInputSync'
  import CompanyInputSync from '@/components/CompanyInputSync'
  import ContactInputSync from '@/components/ContactInputSync'

  export default {
    name: 'DeliveryEquipmentForm',
    components: { ContactInputSync, CompanyInputSync, DealInputSync, TaskInput, ProjectInput },
    mixins: [searchCompany, selectObservers],
    validations: {
      places: {
        $each: {
          length: { required },
          width: { required },
          height: { required },
          weight: { required },
          natureOfCargo: { required }
        }
      },
      sender: {
        companyInfo: {
          title: {
            required: requiredIf(function () {
              return this.sender.tab === 0
            })
          }
        },
        contactName: { required },
        phoneNumber: { required },
        address: { required }
      },
      recipient: {
        companyInfo: {
          title: {
            required: requiredIf(function () {
              return this.recipient.tab === 0
            })
          }
        },
        contactName: { required },
        phoneNumber: { required },
        address: { required }
      },
      costOfCargo: {
        required: requiredIf(function (nestedModel) {
          return nestedModel.isInsurance
        })
      },
      buyerOrder: { required },
      date: { required }
    },

    data: () => ({
      isValidationError: false,

      places: [
        {
          unitSelect: 1,
          length: '',
          width: '',
          height: '',
          weight: '',
          natureOfCargo: ''
        }
      ],
      files: [],

      sender: {
        tab: null,
        companyInfo: {
          id: '581',
          title: 'ООО "ПОЛИСЕРВИС"',
          address: 'Москва, ул. Большая Черемушкинская дом 25, стр. 97, офис 6,7,8',
          logoURL: 'https://polyservice.bitrix24.ru/bitrix/components/bitrix/crm.company.show/show_file.php?ownerId=581&fieldName=LOGO&dynamic=N&fileId=144107'
        },
        passportData: 'ФИО: \nСерия и номер: ',
        contactName: '',
        phoneNumber: '',
        address: 'Москва, ул. Большая Черемушкинская дом 25, стр. 97, офис 6,7,8'
      },

      recipient: {
        tab: null,
        companyInfo: {
          id: '',
          title: '',
          address: '',
          logoURL: ''
        },
        passportData: 'ФИО: \nСерия и номер: ',
        contactName: '',
        phoneNumber: '',
        address: ''
      },

      atWhoseExpenseSelect: 817,
      atWhoseExpenseItems: [
        {
          value: 817,
          label: 'отправителя (ООО "ПОЛИСЕРВИС")'
        },
        {
          value: 819,
          label: 'получателя'
        },
        {
          value: 927,
          label: 'третьего лица'
        }
      ],

      date: new Date().toISOString().substr(0, 10),
      menu: false,

      deliverySelect: 831,
      deliveryItems: [
        {
          value: 823,
          text: 'Dostavista'
        },
        {
          value: 1031,
          text: 'PonyExpress'
        },
        {
          value: 1029,
          text: 'Байкал Сервис'
        },
        {
          value: 925,
          text: 'ГрузовичкоФ'
        },
        {
          value: 1027,
          text: 'Деловые Линии'
        },
        {
          value: 829,
          text: 'Курьер Polymedia'
        },
        {
          value: 827,
          text: 'Почта России'
        },
        {
          value: 1035,
          text: 'EMS Почта России'
        },
        {
          value: 1033,
          text: 'ПЭК:'
        },
        {
          value: 821,
          text: 'СДЭК'
        },
        {
          value: 923,
          text: 'Транспортный отдел Polymedia'
        },
        {
          value: 825,
          text: 'Яндекс.Такси'
        },
        {
          value: 831,
          text: '--Любой--'
        },
        {
          value: 833,
          text: '--Иной--'
        }
      ],

      isInsurance: false,
      costOfCargo: '',
      isLathing: false,
      deliveryComment: '',

      deal: {
        id: '',
        title: '',
        buyerOrder: ''
      },
      buyerOrder: '',
      project: null,
      taskId: '',
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      ...mapGetters(['getUser', 'COMPANIES']),
      dateText () {
        return this.date.split('-').reverse().join('-')
      }
    },
    watch: {
      'sender.companyInfo.address'(val) {
        val && (this.sender.address = this.trimCoordinates(val))
      },
      'sender.tab'(val) {
        if (val === 1) {
          this.sender.companyInfo.title = ''
        }
      },
      'recipient.tab'(val) {
        if (val === 1) {
          this.recipient.companyInfo.title = ''
        }
      },
      'recipient.companyInfo.address'(val) {
        val && (this.recipient.address = this.trimCoordinates(val))
      },
      'sender.companyInfo.title'(val) {
        val
          ? this.atWhoseExpenseItems[0].label = `отправителя (${val})`
          : this.atWhoseExpenseItems[0].label = 'отправителя'
      },
      'recipient.companyInfo.title'(val) {
        val
          ? this.atWhoseExpenseItems[1].label = `получателя (${val})`
          : this.atWhoseExpenseItems[1].label = 'получателя'
      },
      isInsurance() {
        if (!this.isInsurance) {
          this.costOfCargo = ''
        }
      },
      'deal.buyerOrder'(val) {
        this.buyerOrder = val
      }
    },
    methods: {
      ...mapActions(['addDeliveryEquipmentRequest']),
      trimCoordinates(value = '') {
        return value.replace(/\|.*/, '')
      },
      updateSenderName(data) {
        this.sender.contactName = data
      },
      updateSenderPhone(data) {
        this.sender.phoneNumber = data
      },
      updateRecipientName(data) {
        this.recipient.contactName = data
      },
      updateRecipientPhone(data) {
        this.recipient.phoneNumber = data
      },
      addPlace() {
        this.places.push({
          unitSelect: 1,
          length: '',
          width: '',
          height: '',
          weight: '',
          natureOfCargo: ''
        })
      },
      removePlace(id) {
        this.places = this.places.filter((item, index) => index !== id)
      },
      copyPlace(id) {
        this.places = [...this.places.slice(0, id), Object.assign({}, this.places[id]), ...this.places.slice(id)]
        // this.places.push(Object.assign({}, this.places[id]))
      },
      placeError(field, text) {
        const errors = []
        if (!field.$dirty) return errors
        !field.required && errors.push(text)
        return errors
      },
      requiredError(field, text) {
        const errors = []
        if (!field.$dirty) return errors
        !field.required && errors.push(text)
        return errors
      },
      async submit () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.isValidationError = true
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const formData = {
            sender: this.sender,
            recipient: this.recipient,
            places: this.places,
            atWhoseExpense: this.atWhoseExpenseSelect,
            delivery: this.deliverySelect,
            date: this.date,
            buyerOrder: this.buyerOrder,
            isLathing: this.isLathing,
            isInsurance: this.isInsurance,
            costOfCargo: this.costOfCargo,
            deliveryComment: this.deliveryComment,
            files: this.files,
            deal: this.deal,
            taskId: this.taskId,
            observers: this.observers
          }
          const result = await this.addDeliveryEquipmentRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.places = [
              {
                unitSelect: 1,
                length: '',
                width: '',
                height: '',
                weight: '',
                natureOfCargo: ''
              }
            ]
            this.isInsurance = this.isLathing = false
            this.deliveryComment = ''
            this.files = this.observers = []
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
<style scoped>
.tabs-items--active {
  background-color: inherit !important;
}
</style>
