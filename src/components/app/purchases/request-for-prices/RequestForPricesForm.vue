<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на запрос цен № {{result.elementId}} успешно создана!
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
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по запросу</p>
        <v-text-field
          v-model.trim="shortTitle"
          ref="shortTitle"
          autofocus
          :error-messages="shortTitleErrors"
          label="Краткое наименование заявки"
          @input="$v.shortTitle.$touch()"
          @blur="$v.shortTitle.$touch()"
        ></v-text-field>
        <v-radio-group
          v-model="productTypeSelect"
          column
          mandatory
        >
          <template v-slot:label>
            <div>Тип продукта</div>
          </template>
          <v-radio
            v-for="n in productTypeItems"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          >
          </v-radio>
        </v-radio-group>
        <v-radio-group
          v-if="productTypeSelect === 565"
          v-model="conditionSelect"
          column
          mandatory
        >
          <template v-slot:label>
            <div>Состояние товара</div>
          </template>
          <v-radio
            v-for="n in conditionItems"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          >
          </v-radio>
        </v-radio-group>
        <v-switch
          v-model="isReserve"
          :label="`Резервирование ${isReserve ? 'требуется': 'не требуется'}`"
        ></v-switch>
        <v-textarea
          v-model.trim="description"
          :error-messages="descriptionErrors"
          ref="description"
          label="Описание запроса"
          auto-grow
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
        ></v-textarea>
        <CustomFileInput
          class="mb-8"
          v-model="files"
          label="Документы (необязательно)"
        />
        <v-radio-group
          v-model="whatCompanyPurchaseSelect"
          column
          mandatory
        >
          <template v-slot:label>
            Запрос от компании
          </template>
          <v-radio
            v-for="n in whatCompanyPurchaseItems"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          >
          </v-radio>
        </v-radio-group>
        <v-radio-group
          v-model="urgencyOfPurchaseSelect"
          column
          mandatory
        >
          <template v-slot:label>
            <v-icon small>mdi-calendar-clock</v-icon> Срочность запроса
          </template>
          <v-radio
            v-for="n in urgencyOfPurchaseItems"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          >
          </v-radio>
        </v-radio-group>
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
  import { required } from 'vuelidate/lib/validators'
  import { mapActions } from 'vuex'
  import selectObservers from '../../../../mixins/selectObservers'
  import DealInput from '../../DealInput'
  import ProjectInput from '../../ProjectInput'
  import TaskInput from '../../TaskInput'
  import CustomFileInput from '../../../CustomFileInput'
  export default {
    name: 'RequestForPricesForm',
    components: { TaskInput, ProjectInput, DealInput, CustomFileInput },
    mixins: [selectObservers],
    validations: {
      shortTitle: { required },
      description: { required }
    },
    data: () => ({
      shortTitle: '',
      productTypeSelect: 565,
      productTypeItems: [
        {
          value: 565,
          label: 'Товар'
        },
        {
          value: 567,
          label: 'Лицензия'
        }
      ],
      conditionSelect: 195,
      conditionItems: [
        {
          value: 195,
          label: 'Новое'
        },
        {
          value: 197,
          label: 'БУ'
        },
        {
          value: 199,
          label: 'Новое или БУ'
        }
      ],
      isReserve: false,
      urgencyOfPurchaseSelect: 203,
      urgencyOfPurchaseItems: [
        {
          value: 201,
          label: 'Срочно (1-3 рабочих дня)'
        },
        {
          value: 203,
          label: 'Средней срочности (3-7 рабочих дней)'
        },
        {
          value: 205,
          label: 'Не срочно (от 7 рабочих дней)'
        }
      ],
      description: '',
      files: [],
      whatCompanyPurchaseSelect: 557,
      whatCompanyPurchaseItems: [
        {
          value: 557,
          label: 'PolyService'
        },
        {
          value: 559,
          label: 'Polymedia'
        }
      ],
      deal: null,
      project: null,
      taskId: '',
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      shortTitleErrors () {
        const errors = []
        if (!this.$v.shortTitle.$dirty) return errors
        !this.$v.shortTitle.required && errors.push('Обязательное поле')
        return errors
      },
      descriptionErrors () {
        const errors = []
        if (!this.$v.description.$dirty) return errors
        !this.$v.description.required && errors.push('Необходимо добавить какое-либо описание')
        return errors
      }
    },
    methods: {
      ...mapActions(['addPurchaseRequest']),
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
            requestType: 193,
            shortTitle: this.shortTitle,
            productType: this.productTypeSelect,
            condition: this.conditionSelect,
            urgencyOfPurchase: this.urgencyOfPurchaseSelect,
            whatCompanyPurchase: this.whatCompanyPurchaseSelect,
            isProductRegistration: this.isProductRegistration,
            isReserve: this.isReserve,
            description: this.description,
            files: this.files,
            deal: this.deal,
            taskId: this.taskId,
            observers: this.observers
          }
          const result = await this.addPurchaseRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.shortTitle = this.productTypeSelect = this.conditionSelect = this.description = ''
            this.files = this.observers = []
            this.urgencyOfPurchaseSelect = 203
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
