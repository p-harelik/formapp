<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на оформление отсутствия № {{result.elementId}} успешно создана!
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
      <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по отсутствию</p>
      <v-row>
        <v-col
          class="my-0 py-0"
          cols="12"
          xs="12"
          sm="8"
          md="6"
        >
          <UserInput v-model="user" :error-messages="userErrors"></UserInput>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          class="my-0 py-0"
          cols="12"
          xs="12"
          sm="8"
          md="6"
        >
          <v-menu
            v-model="menu"
            ref="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Даты отсутствия"
                prepend-icon="mdi-calendar"
                :error-messages="dateRangeTextErrors"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dates"
              range
              locale="ru"
              selected-items-text = 'период'
              first-day-of-week="1"
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu = false"
              >
                Отмена
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(dates)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-select
        v-model="reasonAbsence"
        :items="reasonAbsenceItems"
        label="Причина отсутствия"
      ></v-select>
      <v-textarea
        v-model.trim="description"
        label="Комментарий (необязательно)"
        auto-grow
        @input="$v.description.$touch()"
        @blur="$v.description.$touch()"
      ></v-textarea>
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
  import UserInput from '../../UserInput'

  export default {
    name: 'AbsentForm',
    components: { UserInput },
    validations: {
      user: { required },
      dateRangeText: { required }
    },
    data: () => ({
      user: {},
      dates: [],
      menu: false,
      reasonAbsence: 131,
      reasonAbsenceItems: [
        {
          value: 123,
          text: 'Больничный'
        },
        {
          value: 131,
          text: 'Работа на удаленке'
        },
        {
          value: 125,
          text: 'Отгул за ранее отработанное время'
        },
        {
          value: 929,
          text: 'НЕОПЛАЧИВАЕМЫЙ отгул за свой счет'
        }
      ],
      description: null,
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      dateRangeText () {
        if (this.dates[1]) {
          let dates = this.dates
          if (dates[0] > dates[1]) {
            dates = dates.reverse()
          }
          return `c ${dates[0].split('-').reverse().join('-')} по ${dates[1].split('-').reverse().join('-')}`
        }
        if (this.dates[0]) {
          return this.dates[0].split('-').reverse().join('-')
        }
        return []
      },
      userErrors () {
        const errors = []
        if (!this.$v.user.$dirty) return errors
        !this.$v.user.required && errors.push('Укажите сотрудника')
        return errors
      },
      dateRangeTextErrors () {
        const errors = []
        if (!this.$v.dateRangeText.$dirty) return errors
        !this.$v.dateRangeText.required && errors.push('Укажите даты отсутствия')
        return errors
      }
    },
    methods: {
      ...mapActions(['absentRequest']),
      async submit () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          for (const key in Object.keys(this.$v)) {
            const input = Object.keys(this.$v)[key]
            if (input.includes('$')) return false
            if (this.$v[input].$error) {
              // this.$refs[input].focus()
              break
            }
          }
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const formData = {
            user: this.user.id,
            dates: this.dates,
            reasonAbsence: this.reasonAbsence,
            description: this.description
          }
          const result = await this.absentRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.description = null
            this.dates = []
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
