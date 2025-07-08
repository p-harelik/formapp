<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на оплату счетов № {{result.elementId}} успешно создана!
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
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по оплате</p>
        <v-combobox
          v-model.trim="purpose"
          :items="purposeItems"
          ref="purpose"
          autofocus
          label="Назначение платежа"
          :error-messages="purposeErrors"
          append-icon=""
          dense
          @blur="$v.purpose.$touch()"
        ></v-combobox>
        <v-row>
          <v-col
            class="my-0 py-0"
            sm="4"
            xm="12"
          >
            <v-text-field
              v-model="money"
              v-money="money"
              ref="money"
              label="Сумма"
              :error-messages="moneyErrors"
              @blur="$v.money.$touch()"
              suffix="руб"
              prepend-icon="mdi-cash-multiple"
            ></v-text-field>
          </v-col>
        </v-row>
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
                  label="Требуемая дата оплаты"
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
        <v-textarea
          v-model.trim="description"
          label="Комментарий к оплате (необязательно)"
          auto-grow
        ></v-textarea>
        <CustomFileInput
          class="mb-8"
          v-model="files"
          label="Документы (необязательно)"
        />
        <p class="subtitle-1 font-weight-medium black--text mt-10 mb-4">Дополнительная информация</p>
        <DealInput v-model="deal"/>
        <ProjectInput v-model="project"/>
        <TaskInput v-model="taskId"></TaskInput>
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
  import { mapActions } from 'vuex'
  import { required } from 'vuelidate/lib/validators'
  import DealInput from '../../DealInput'
  import ProjectInput from '../../ProjectInput'
  import TaskInput from '../../TaskInput'
  import CustomFileInput from '../../../CustomFileInput'
  export default {
    name: 'PaymentForm',
    components: { TaskInput, ProjectInput, DealInput, CustomFileInput },
    validations: {
      purpose: { required },
      money: { required }
    },
    data: () => ({
      purpose: null,
      purposeItems: [
        'Оплата депозита',
        'Оплата Банковской гарантии',
        'Субподряд и субаренда',
        'Расходные материалы и малоценка'
      ],
      money: null,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      description: null,
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
      dateText () {
        return this.date.split('-').reverse().join('-')
      },
      purposeErrors () {
        const errors = []
        if (!this.$v.purpose.$dirty) return errors
        !this.$v.purpose.required && errors.push('Укажите назначение платежа')
        return errors
      },
      moneyErrors () {
        const errors = []
        if (!this.$v.money.$dirty) return errors
        !this.$v.money.required && errors.push('Укажите необходимую сумму')
        return errors
      }
    },
    methods: {
      ...mapActions(['paymentRequest']),
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
            purpose: this.purpose,
            date: this.date,
            money: this.money.replace(/\s/g, ''),
            description: this.description,
            files: this.files,
            deal: this.deal,
            taskId: this.taskId
          }
          const result = await this.paymentRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.description = this.money = this.taskId = this.purpose = null
            this.files = []
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
