<template>
    <div>
      <v-snackbar
        v-model="successSnackbar"
        :timeout="4000"
        top
        transition="scroll-y-transition"
        color="success"
      >
        Заявка на оформление нового сотрудника № {{result.elementId}} успешно создана!
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
          <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по новому сотруднику</p>
          <v-row>
            <v-col
              class="my-0 py-0"
              cols="12"
              xs="12"
              sm="8"
              md="6"
            >
              <v-text-field
                v-model="surname"
                label="Фамилия"
                ref="surname"
                :error-messages="surnameErrors"
                @blur="$v.surname.$touch()"
              />
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
              <v-text-field
                v-model="name"
                label="Имя"
                ref="name"
                :error-messages="nameErrors"
                @blur="$v.name.$touch()"
              />
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
              <v-text-field
                v-model="patronymic"
                label="Отчество"
                ref="patronymic"
                :error-messages="patronymicErrors"
                @blur="$v.patronymic.$touch()"
              />
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
              <v-text-field
                v-model="email"
                label="Контактный Email"
                ref="email"
                :error-messages="emailErrors"
                @blur="$v.email.$touch()"
              />
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
              <v-text-field
                v-model="phone"
                label="Контактный телефон"
                ref="phone"
                :error-messages="phoneErrors"
                @blur="$v.phone.$touch()"
              />
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
              <v-text-field
                v-model="vacancy"
                label="Должность"
                ref="vacancy"
                :error-messages="vacancyErrors"
                @blur="$v.vacancy.$touch()"
              />
            </v-col>
          </v-row>
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

  export default {
    name: 'NewEmployeeForm',
    validations: {
      surname: { required },
      name: { required },
      patronymic: { required },
      email: { required },
      phone: { required },
      vacancy: { required }
    },
    data: () => ({
      name: null,
      surname: null,
      patronymic: null,
      email: null,
      phone: null,
      vacancy: null,
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('Укажите имя')
        return errors
      },
      surnameErrors () {
        const errors = []
        if (!this.$v.surname.$dirty) return errors
        !this.$v.surname.required && errors.push('Укажите фамилию')
        return errors
      },
      patronymicErrors () {
        const errors = []
        if (!this.$v.patronymic.$dirty) return errors
        !this.$v.patronymic.required && errors.push('Укажите отчество')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.required && errors.push('Укажите контактный email')
        return errors
      },
      phoneErrors () {
        const errors = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.required && errors.push('Укажите контактный телефон')
        return errors
      },
      vacancyErrors () {
        const errors = []
        if (!this.$v.vacancy.$dirty) return errors
        !this.$v.vacancy.required && errors.push('Укажите должность')
        return errors
      }
    },
    methods: {
      ...mapActions(['newEmployeeRequest']),
      async submit () {
        console.log(this.$refs)
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
            surname: this.surname,
            name: this.name,
            patronymic: this.patronymic,
            email: this.email,
            phone: this.phone,
            vacancy: this.vacancy
          }
          const result = await this.newEmployeeRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.surname = this.name = this.patronymic = this.email = this.phone = this.vacancy = null
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
