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
    <div class="wrapper-form">
      <form @submit.prevent>
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по отправителю</p>
        <v-combobox
          v-model="senderCompany"
          label="Компания отправитель"
          :items="companyItems"
          item-text="title"
          :loading="isLoadingCompany"
          :search-input.sync="searchCompany"
          :error-messages="senderCompanyErrors"
          ref="senderCompany"
          chips
          clearable
          @input="$v.senderCompany.$touch()"
          @blur="$v.senderCompany.$touch()"
        >
          <template v-slot:selection="{ item }">
            <v-chip
              :href="`${item.id ? 'https://polyservice.bitrix24.ru/crm/company/details/' + item.id +'/': ''}`"
              target="_blank"
              @click.native.stop
            >
              <v-avatar left v-if="item.logoURL">
                <img :src="'https://polyservice.bitrix24.ru/'+item.logoURL" alt="">
              </v-avatar>
              {{item.title || item}}
            </v-chip>
          </template>
        </v-combobox>
        <v-text-field
          v-model="senderAddress"
          label="Адрес отправителя"
          ref="senderAddress"
          prepend-icon="mdi-map-marker"
          :error-messages="senderAddressErrors"
          @input="$v.senderAddress.$touch()"
          @blur="$v.senderAddress.$touch()"
        ></v-text-field>
        <v-row>
          <v-col
            cols="12"
            xs="12"
            sm="6"
          >
            <v-text-field
              v-model="senderPerson"
              label="Контактное лицо"
              prepend-icon="mdi-account"
              ref="senderPerson"
              :error-messages="senderPersonErrors"
              @input="$v.senderPerson.$touch()"
              @blur="$v.senderPerson.$touch()"
            >
            </v-text-field>
          </v-col>
          <v-col
          >
            <v-text-field
              v-model="senderPersonPhone"
              label="Телефон"
              ref="senderPersonPhone"
              prepend-icon="mdi-phone"
              :error-messages="senderPersonPhoneErrors"
              @input="$v.senderPersonPhone.$touch()"
              @blur="$v.senderPersonPhone.$touch()"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по получателю</p>
        <v-combobox
          v-model="recipientCompany"
          label="Компания получатель"
          :items="companyItems"
          item-text="title"
          :loading="isLoadingCompany"
          :search-input.sync="searchCompany"
          :error-messages="recipientCompanyErrors"
          ref="recipientCompany"
          chips
          clearable
          @input="$v.recipientCompany.$touch()"
          @blur="$v.recipientCompany.$touch()"
        >
          <template v-slot:selection="{ item }">
            <v-chip
              :href="`${item.id ? 'https://polyservice.bitrix24.ru/crm/company/details/' + item.id +'/': ''}`"
              target="_blank"
              @click.native.stop
            >
              <v-avatar left v-if="item.logoURL">
                <img :src="'https://polyservice.bitrix24.ru/'+item.logoURL" alt="">
              </v-avatar>
              {{item.title || item}}
            </v-chip>
          </template>
        </v-combobox>
        <v-text-field
          v-model="recipientCompanyAddress"
          label="Адрес получателя"
          ref="recipientCompanyAddress"
          prepend-icon="mdi-map-marker"
          :error-messages="recipientCompanyAddressErrors"
          @input="$v.recipientCompanyAddress.$touch()"
          @blur="$v.recipientCompanyAddress.$touch()"
        ></v-text-field>
        <v-row>
          <v-col
            cols="12"
            xs="12"
            sm="6"
          >
            <v-text-field
              v-model="recipientPerson"
              label="Контактное лицо"
              prepend-icon="mdi-account"
              ref="recipientPerson"
              :error-messages="recipientPersonErrors"
              @input="$v.recipientPerson.$touch()"
              @blur="$v.recipientPerson.$touch()"
            >
            </v-text-field>
          </v-col>
          <v-col
          >
            <v-text-field
              v-model="recipientPersonPhone"
              label="Телефон"
              ref="recipientPersonPhone"
              prepend-icon="mdi-phone"
              :error-messages="recipientPersonPhoneErrors"
              @input="$v.recipientPersonPhone.$touch()"
              @blur="$v.recipientPersonPhone.$touch()"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по доставке</p>
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
          prepend-icon="mdi-moped"
        ></v-select>
        <v-text-field
          v-model="buyerOrder"
          clearable
          label="Заказ покупателя с которого будет оплачиваться доставка (необязательно)"
        ></v-text-field>
        <v-row>
          <v-col class="py-0">
            <v-row>
              <v-col
                cols="12"
                sm="3"
              >
                <p class="v-label theme--light pt-6">Габариты</p>
              </v-col>
              <v-col
                cols="12"
                sm="2"
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
                cols="12"
                sm="2"
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
              cols="12"
              sm="2"
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
                cols="12"
                sm="2"
              >
                <v-select
                  :items="unitItems"
                  v-model="unitSelect"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            xs="6"
            sm="2"
            mb="12"
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
        <p class="v-label theme--light pt-6">Дополнительные параметры</p>
        <v-checkbox
          class="pb-0 mb-0"
          v-model="isLathing"
          label="Оформить страховку"
        ></v-checkbox>
        <v-checkbox
          class="py-0 my-0"
          v-model="isInsurance"
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
          ref="description"
          label="Описание доставки"
          auto-grow
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
        ></v-textarea>
        <v-file-input
          v-model="files"
          multiple
          id="test_file_input"
          label="Документы (необязательно)"
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
        <p class="subtitle-1 font-weight-medium black--text mt-10 mb-4">Дополнительная информация</p>
        <DealInput v-model="deal"/>
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
  import { required, decimal, minValue } from 'vuelidate/lib/validators'
  import { mapGetters, mapActions } from 'vuex'
  import selectObservers from '../../../../mixins/selectObservers'
  import searchCompany from '../../../../mixins/searchCompany'
  import DealInput from '../../DealInput'
  import ProjectInput from '../../ProjectInput'
  import TaskInput from '../../TaskInput'

  export default {
    name: 'SendingDocumentsForm',
    components: { TaskInput, ProjectInput, DealInput },
    mixins: [searchCompany, selectObservers],
    validations: {
      senderCompany: { required },
      senderAddress: { required },
      senderPerson: { required },
      senderPersonPhone: { required },
      recipientCompany: { required },
      recipientCompanyAddress: { required },
      recipientPerson: { required },
      recipientPersonPhone: { required },
      date: { required },
      length: { required, decimal, minValue: minValue(0.1) },
      width: { required, decimal, minValue: minValue(0.1) },
      height: { required, decimal, minValue: minValue(0.1) },
      weight: { required },
      description: { required }
    },

    data: () => ({
      senderCompany: {
        id: 581,
        title: 'ООО "ПОЛИСЕРВИС"',
        address: 'Москва, ул. Большая Черемушкинская дом 25, стр. 97, офис 6,7,8',
        logoURL: '/bitrix/components/bitrix/crm.company.show/show_file.php?ownerId=581&fieldName=LOGO&dynamic=N&fileId=144107'
      },
      senderAddress: 'Москва, ул. Большая Черемушскинская дом 25, стр. 97, офис 6,7,8',
      senderPerson: '',
      senderPersonPhone: '',
      recipientCompany: '',
      recipientCompanyAddress: '',
      recipientPerson: '',
      recipientPersonPhone: '',
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
          value: 821,
          text: 'СДЭК'
        },
        {
          value: 823,
          text: 'Dostavista'
        },
        {
          value: 825,
          text: 'Яндекс.Такси'
        },
        {
          value: 827,
          text: 'Почта России'
        },
        {
          value: 829,
          text: 'Курьер Polymedia'
        },
        {
          value: 923,
          text: 'Транспортный отдел Polymedia'
        },
        {
          value: 925,
          text: 'ГрузовичкоФ'
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
      buyerOrder: '',
      length: '',
      width: '',
      height: '',
      unitSelect: 1,
      unitItems: [
        { text: 'метров', value: 1 },
        { text: 'сантиметров', value: 2 }
      ],
      weight: '',
      isLathing: false,
      isInsurance: false,
      isSkin: false,
      description: '',
      files: [],
      deal: null,
      project: null,
      taskId: '',
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      ...mapGetters(['getUser']),
      dateText () {
        return this.date.split('-').reverse().join('-')
      },
      senderCompanyErrors () {
        const errors = []
        if (!this.$v.senderCompany.$dirty) return errors
        !this.$v.senderCompany.required && errors.push('Необходимо указать компанию отправитель')
        return errors
      },
      senderAddressErrors () {
        const errors = []
        if (!this.$v.senderAddress.$dirty) return errors
        !this.$v.senderAddress.required && errors.push('Необходимо указать адрес отправителя')
        return errors
      },
      senderPersonErrors () {
        const errors = []
        if (!this.$v.senderPerson.$dirty) return errors
        !this.$v.senderPerson.required && errors.push('Необходимо указать контактное лицо отправителя')
        return errors
      },
      senderPersonPhoneErrors () {
        const errors = []
        if (!this.$v.senderPersonPhone.$dirty) return errors
        !this.$v.senderPersonPhone.required && errors.push('Необходимо указать телефон отправителя')
        return errors
      },
      recipientCompanyErrors () {
        const errors = []
        if (!this.$v.recipientCompany.$dirty) return errors
        !this.$v.recipientCompany.required && errors.push('Необходимо указать компанию получатель')
        return errors
      },
      recipientCompanyAddressErrors () {
        const errors = []
        if (!this.$v.recipientCompanyAddress.$dirty) return errors
        !this.$v.recipientCompanyAddress.required && errors.push('Необходимо указать адрес компании получателя')
        return errors
      },
      recipientPersonErrors () {
        const errors = []
        if (!this.$v.recipientPerson.$dirty) return errors
        !this.$v.recipientPerson.required && errors.push('Необходимо указать контакт получателя')
        return errors
      },
      recipientPersonPhoneErrors () {
        const errors = []
        if (!this.$v.recipientPersonPhone.$dirty) return errors
        !this.$v.recipientPersonPhone.required && errors.push('Необходимо указать телефон получателя')
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
      senderCompany (val) {
        console.log(this.senderAddress)
        this.senderAddress = val.address.replace(/\|.*/, '')
        this.atWhoseExpenseItems[0].label = `отправителя (${val.title || val})`
      },
      recipientCompany (val) {
        this.recipientCompanyAddress = val.address.replace(/\|.*/, '')
        this.atWhoseExpenseItems[1].label = `получателя (${val.title || val})`
      }
    },
    methods: {
      ...mapActions(['addDeliveryEquipmentRequest']),
      async submit () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          for (const key in Object.keys(this.$v)) {
            const input = Object.keys(this.$v)[key]
            if (input.includes('$')) return false
            if (this.$v[input].$error) {
              this.$refs[input].focus()
              break
            }
          }
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const formData = {
            senderCompany: this.senderCompany.title || this.senderCompany,
            senderAddress: this.senderAddress,
            senderPerson: this.senderPerson,
            senderPersonPhone: this.senderPersonPhone,
            recipientCompany: this.recipientCompany.title || this.recipientCompany,
            recipientCompanyAddress: this.recipientCompanyAddress,
            recipientPerson: this.recipientPerson,
            recipientPersonPhone: this.recipientPersonPhone,
            atWhoseExpense: this.atWhoseExpenseSelect,
            delivery: this.deliverySelect,
            date: this.date,
            buyerOrder: this.buyerOrder,
            dimensions: `${this.length} x ${this.width} x ${this.height} ${this.unitItems.filter(item => item.value === this.unitSelect)[0].text}`,
            isLathing: this.isLathing,
            isInsurance: this.isInsurance,
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

<!--productTypeSelect: { required },-->
<!--conditionSelect: {-->
<!--required: requiredIf(function () {-->
<!--return this.productTypeSelect !== 567-->
<!--})-->
