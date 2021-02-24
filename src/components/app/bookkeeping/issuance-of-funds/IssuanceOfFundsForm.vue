<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на выдачу денежных средств под отчет № {{result.elementId}} успешно создана!
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
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по заявке</p>
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
              autofocus
              :error-messages="moneyErrors"
              @blur="$v.money.$touch()"
              suffix="руб"
              prepend-icon="mdi-cash-multiple"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-radio-group
          v-model="formOfReceipt"
          mandatory
          column
        >
          <template v-slot:label>
            <div>Форма получения</div>
          </template>
          <v-radio
            v-for="n in formOfReceiptItems"
            :key="n.value"
            :label="n.text"
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
                  label="Дата, к которой требуются деньги"
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
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-textarea
          v-model.trim="description"
          :error-messages="descriptionErrors"
          ref="description"
          label="Описание заявки"
          auto-grow
          hint="Укажите для каких целей необходимы деньги. Если деньги под проект, то укажите номер проекта или название (в случае оформления заявки не из проекта)."
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
        ></v-textarea>
        <p class="subtitle-1 font-weight-medium black--text mt-10 mb-4">Дополнительная информация</p>
        <DealInput v-model="deal"/>
        <ProjectInput v-model="project"/>
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

  export default {
    name: 'IssuanceOfFundsForm',
    components: { ProjectInput, DealInput },
    validations: {
      money: { required },
      description: { required }
    },
    data: () => ({
      money: null,
      formOfReceipt: 425,
      formOfReceiptItems: [
        {
          value: 421,
          text: 'наличные'
        },
        {
          value: 423,
          text: 'безналичные'
        },
        {
          value: 425,
          text: 'наличные / безналичные'
        }
      ],
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      description: null,
      deal: null,
      project: null,
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      moneyErrors () {
        const errors = []
        if (!this.$v.money.$dirty) return errors
        !this.$v.money.required && errors.push('Укажите необходимую сумму')
        return errors
      },
      dateText () {
        return this.date.split('-').reverse().join('-')
      },
      descriptionErrors () {
        const errors = []
        if (!this.$v.description.$dirty) return errors
        !this.$v.description.required && errors.push('Необходимо добавить какое-либо описание')
        return errors
      }
    },
    methods: {
      ...mapActions(['issuanceOfFundsRequest']),
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
            money: this.money.replace(/\s/g, ''),
            formOfReceipt: this.formOfReceipt,
            date: this.date,
            description: this.description,
            deal: this.deal
          }
          const result = await this.issuanceOfFundsRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.description = this.money = null
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
