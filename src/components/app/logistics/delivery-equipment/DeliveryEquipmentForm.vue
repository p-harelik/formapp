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
          <p>Габариты и вес</p>
              <v-row>
                <v-col
                >
                  <v-select
                    label="Ед. измерения"
                    :items="unitItems"
                    v-model="unitSelect"
                  ></v-select>
                </v-col>
                <v-col
                >
                  <v-text-field
                    v-model="length"
                    label="Длина"
                    error-count="2"
                    ref="length"
                    :error-messages="lengthErrors"
                    @input="$v.length.$touch()"
                    @blur="$v.length.$touch()"
                  >
                    <template v-slot:append-outer>
                      x
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                >
                  <v-text-field
                    v-model="width"
                    label="Ширина"
                    ref="width"
                    :error-messages="widthErrors"
                    @input="$v.width.$touch()"
                    @blur="$v.width.$touch()"
                  >
                    <template v-slot:append-outer>
                      x
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                >
                  <v-text-field
                    v-model="height"
                    label="Высота"
                    ref="height"
                    :error-messages="heightErrors"
                    @input="$v.height.$touch()"
                    @blur="$v.height.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col
                >
                  <v-text-field
                    v-model="weight"
                    label="Вес"
                    suffix="кг"
                    ref="weight"
                    :error-messages="weightErrors"
                    @input="$v.weight.$touch()"
                    @blur="$v.weight.$touch()"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
        </div>
        <v-textarea
          v-model.trim="description"
          :error-messages="descriptionErrors"
          ref="description"
          label="Описание оборудования"
          placeholder="Укажите наименования перевозимого обородования"
          auto-grow
          rows="3"
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
        ></v-textarea>
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
        <CompanyInputSync
          v-model="sender.companyInfo"
          label="Компания отправитель"
          :error-messages="senderCompanyErrors"
          :blur="$v.sender.companyInfo.title.$touch"
        />
        <ContactInputSync
          :company-id="sender.companyInfo.id"
          :contact-name="sender.contactName"
          :contact-phone="sender.phoneNumber"
          @contact-changed="updateSenderName"
          @phone-changed="updateSenderPhone"
          :contact-name-errors="senderContactNameErrors"
          :contact-phone-errors="senderContactPhoneErrors"
        />
        <v-text-field
          v-model="sender.companyInfo.address"
          label="Адрес отправителя"
          ref="senderAddress"
          prepend-icon="mdi-map-marker"
          :error-messages="senderAddressErrors"
          @blur="$v.sender.companyInfo.address.$touch"
        ></v-text-field>
        <p class="title font-weight-medium black--text mt-4 mb-4">Данные получателя</p>
        <CompanyInputSync
          v-model="recipient.companyInfo"
          label="Компания получатель"
          :error-messages="recipientCompanyErrors"
          ref="recipientCompany"
        />
        <ContactInputSync
          :company-id="recipient.companyInfo.id"
          :contact-name="recipient.contactName"
          :contact-phone="recipient.phoneNumber"
          @contact-changed="updateRecipientName"
          @phone-changed="updateRecipientPhone"
          :contact-name-errors="recipientContactNameErrors"
          :contact-phone-errors="recipientContactPhoneErrors"
        />
        <v-text-field
          v-model="recipient.companyInfo.address"
          label="Адрес получателя"
          ref="recipientCompanyAddress"
          prepend-icon="mdi-map-marker"
          :error-messages="recipientCompanyAddressErrors"
          @input="$v.recipient.companyInfo.address.$touch"
          @blur="$v.recipient.companyInfo.address.$touch"
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
                  :error-messages="dateErrors"
                  label="Дата передачи в доставку"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                :min="new Date().toISOString().substr(0, 10)"
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
        <p>Дополнительные параметры</p>
        <v-checkbox
          class="pb-0 mb-0"
          v-model="isInsurance"
          label="Оформить страховку"
        ></v-checkbox>
        <v-text-field
          v-if="isInsurance"
          v-model="costOfCargo"
          label="Оценочная стоимость груза"
          :error-messages="costOfCargoErrors"
          @blur="$v.costOfCargo.$touch"
        ></v-text-field>
        <v-checkbox
          class="py-0 my-0"
          v-model="isLathing"
          label="Упаковать в обрешетку"
        ></v-checkbox>
<!--        <v-checkbox-->
<!--          class="py-0 my-0"-->
<!--          v-model="isSkin"-->
<!--          label="Упаковать в воздушно-пузырьковую пленку"-->
<!--        ></v-checkbox>-->
        <v-textarea
          v-model.trim="description"
          :error-messages="descriptionErrors"
          label="Описание доставки"
          hint="Укажите нюансы доставки"
          rows="4"
          auto-grow
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
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
          :error-messages="buyerOrderErrors"
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
  import { required, requiredIf, decimal, minValue } from 'vuelidate/lib/validators'
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
      length: { required, decimal, minValue: minValue(0.1) },
      width: { required, decimal, minValue: minValue(0.1) },
      height: { required, decimal, minValue: minValue(0.1) },
      weight: { required },
      description: { required },
      sender: {
        companyInfo: {
          title: { required },
          address: { required }
        },
        contactName: { required },
        phoneNumber: { required }
      },
      recipient: {
        companyInfo: {
          title: { required },
          address: { required }
        },
        contactName: { required },
        phoneNumber: { required }
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

      sender: {
        companyInfo: {
          id: '581',
          title: 'ООО "ПОЛИСЕРВИС"',
          address: 'Москва, ул. Большая Черемушкинская дом 25, стр. 97, офис 6,7,8',
          logoURL: 'https://polyservice.bitrix24.ru/bitrix/components/bitrix/crm.company.show/show_file.php?ownerId=581&fieldName=LOGO&dynamic=N&fileId=144107'
        },
        contactName: '',
        phoneNumber: ''
      },

      recipient: {
        companyInfo: {
          id: '',
          title: '',
          address: '',
          logoURL: ''
        },
        contactName: '',
        phoneNumber: ''
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

      length: '',
      width: '',
      height: '',
      unitSelect: 1,
      unitItems: [
        { text: 'метр', value: 1 },
        { text: 'сантиметр', value: 2 }
      ],
      weight: '',
      equipmentDescription: '',
      costOfCargo: '',
      isLathing: false,
      isInsurance: false,
      isSkin: false,
      description: '',
      files: [],

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
      },
      senderCompanyErrors() {
        const errors = []
        if (!this.$v.sender.companyInfo.title.$dirty) return errors
        !this.$v.sender.companyInfo.title.required && errors.push('Необходимо указать компанию отправитель34534')
        return errors
      },
      senderAddressErrors () {
        const errors = []
        if (!this.$v.sender.companyInfo.address.$dirty) return errors
        !this.$v.sender.companyInfo.address.required && errors.push('Необходимо указать адрес отправителя')
        return errors
      },
      senderContactNameErrors () {
        const errors = []
        if (!this.$v.sender.contactName.$dirty) return errors
        !this.$v.sender.contactName.required && errors.push('Необходимо указать контактное лицо отправителя23423')
        return errors
      },
      senderContactPhoneErrors () {
        const errors = []
        if (!this.$v.sender.phoneNumber.$dirty) return errors
        !this.$v.sender.phoneNumber.required && errors.push('Необходимо указать телефон отправителя22222222')
        return errors
      },
      recipientCompanyErrors () {
        const errors = []
        if (!this.$v.recipient.companyInfo.title.$dirty) return errors
        !this.$v.recipient.companyInfo.title.required && errors.push('Необходимо указать компанию получатель')
        return errors
      },
      recipientCompanyAddressErrors () {
        const errors = []
        if (!this.$v.recipient.companyInfo.address.$dirty) return errors
        !this.$v.recipient.companyInfo.address.required && errors.push('Необходимо указать адрес компании получателя')
        return errors
      },
      recipientContactNameErrors () {
        const errors = []
        if (!this.$v.recipient.contactName.$dirty) return errors
        !this.$v.recipient.contactName.required && errors.push('Необходимо указать контакт получателя')
        return errors
      },
      recipientContactPhoneErrors () {
        const errors = []
        if (!this.$v.recipient.phoneNumber.$dirty) return errors
        !this.$v.recipient.phoneNumber.required && errors.push('Необходимо указать телефон получателя')
        return errors
      },
      buyerOrderErrors () {
        const errors = []
        if (!this.$v.buyerOrder.$dirty) return errors
        !this.$v.buyerOrder.required && errors.push('Необходимо указать заказ покупателя')
        return errors
      },
      costOfCargoErrors() {
        const errors = []
        if (!this.$v.costOfCargo.$dirty) return errors
        !this.$v.costOfCargo.required && errors.push('Необходимо указать оценочную стоимость груза')
        return errors
      },
      dateErrors () {
        const errors = []
        if (!this.$v.date.$dirty) return errors
        !this.$v.date.required && errors.push('Необходимо указать дату доставки')
        return errors
      },
      lengthErrors () {
        const errors = []
        if (!this.$v.length.$dirty) return errors
        !this.$v.length.decimal && errors.push('Укажите число')
        !this.$v.length.minValue && errors.push('Минимально 0.1')
        !this.$v.length.required && errors.push('Укажите длину (например 1 или 0.5)')
        return errors
      },
      widthErrors () {
        const errors = []
        if (!this.$v.width.$dirty) return errors
        !this.$v.width.decimal && errors.push('Укажите число')
        !this.$v.width.minValue && errors.push('Минимально 0.1')
        !this.$v.width.required && errors.push('Укажите ширину (например 1 или 0.5)')
        return errors
      },
      heightErrors () {
        const errors = []
        if (!this.$v.height.$dirty) return errors
        !this.$v.height.decimal && errors.push('Укажите число')
        !this.$v.height.minValue && errors.push('Минимально 0.1')
        !this.$v.height.required && errors.push('Укажите высоту (например 1 или 0.5)')
        return errors
      },
      weightErrors () {
        const errors = []
        if (!this.$v.weight.$dirty) return errors
        !this.$v.weight.required && errors.push('Укажите вес содержимого')
        return errors
      },
      descriptionErrors () {
        const errors = []
        if (!this.$v.description.$dirty) return errors
        !this.$v.description.required && errors.push('Необходимо добавить какое-либо описание')
        return errors
      }
    },
    watch: {
      'sender.companyInfo.address'(val) {
        val && (this.sender.companyInfo.address = this.trimCoordinates(val))
      },
      'recipient.companyInfo.address'(val) {
        val && (this.recipient.companyInfo.address = this.trimCoordinates(val))
      },
      'sender.companyInfo.title'(val) {
        this.atWhoseExpenseItems[0].label = `отправителя (${val})`
      },
      'recipient.companyInfo.title'(val) {
        this.atWhoseExpenseItems[1].label = `получателя (${val})`
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
      async submit () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.isValidationError = true
          // for (const key in Object.keys(this.$v)) {
          //   const input = Object.keys(this.$v)[key]
          //   if (input.includes('$')) return false
          //   if (this.$v[input].$error) {
          //     this.$refs[input].focus()
          //     break
          //   }
          // }
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const formData = {
            senderCompany: this.sender.companyInfo.title,
            senderAddress: this.sender.companyInfo.address,
            senderContactName: this.sender.contactName,
            senderPhoneNumber: this.sender.phoneNumber,
            recipientCompany: this.recipient.companyInfo.title,
            recipientAddress: this.recipient.companyInfo.address,
            recipientContactName: this.recipient.contactName,
            recipientPhoneNumber: this.recipient.phoneNumber,
            atWhoseExpense: this.atWhoseExpenseSelect,
            delivery: this.deliverySelect,
            date: this.date,
            buyerOrder: this.buyerOrder,
            dimensions: `${this.length} x ${this.width} x ${this.height} ${this.unitItems.filter(item => item.value === this.unitSelect)[0].text}`,
            isLathing: this.isLathing,
            isInsurance: this.isInsurance,
            costOfCargo: this.costOfCargo,
            weight: this.weight + ' кг',
            description: this.description,
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
            this.description = this.senderPerson = this.senderPersonPhone = this.recipientPerson = this.recipientPersonPhone = this.length = this.width = this.height = this.weight = ''
            this.files = this.observers = []
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
