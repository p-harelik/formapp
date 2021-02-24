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
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по компенсации</p>
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
        <v-textarea
          v-model.trim="description"
          :error-messages="descriptionErrors"
          ref="description"
          label="Описание компенсации"
          auto-grow
          hint="Укажите на что были потрачены денежные средства. Если компенсация в рамках проекта, то укажите номер проекта или название."
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
        ></v-textarea>
        <v-file-input
          v-model="files"
          multiple
          id="test_file_input"
          label="Чеки, квитанции... (необязательно)"
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
    name: 'CompensationForm',
    components: { ProjectInput, DealInput },
    validations: {
      money: { required },
      description: { required }
    },
    data: () => ({
      money: '',
      files: [],
      deal: null,
      project: null,
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      description () {
        return `Прошу компенсировать расходы в указанной сумме.
Название проекта: ${this.project?.title ?? ''}`
      },
      moneyErrors () {
        const errors = []
        if (!this.$v.money.$dirty) return errors
        !this.$v.money.required && errors.push('Укажите необходимую сумму')
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
      ...mapActions(['compensationRequest']),
      async submit () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          for (const key in Object.keys(this.$v)) {
            const input = Object.keys(this.$v)[key]
            if (input.includes('$')) return false
            if (this.$v[input].$error) {
              console.log(this.$refs[input])
              this.$refs[input].focus()
              break
            }
          }
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const formData = {
            money: this.money.replace(/\s|-/g, ''),
            description: this.description,
            files: this.files,
            deal: this.deal
          }
          const result = await this.compensationRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.description = this.money = null
            this.files = []
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
