<template>
    <div>
      <v-snackbar
        v-model="successSnackbar"
        :timeout="4000"
        top
        transition="scroll-y-transition"
        color="success"
      >
        Заявка на расходные материалы № {{result.elementId}} успешно создана!
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
        <form @submit.prevent>
          <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по перечню расходников</p>
          <v-combobox
            v-model = consumables
            :items="consumblesList"
            label="Перечень расходных материалов"
            hint="Перечислите требуемые расходные материалы"
            small-chips
            multiple
            deletable-chips
            hide-selected
            :search-input.sync="searchInput"
            @change="searchInput = ''"
            return-object
            :error-messages="consumablesErrors"
          >
          </v-combobox>
          <template v-if="consumables.length">
            <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по количеству расходников</p>
            <v-text-field
              v-for="(item, index) of $v.consumables.$each.$iter" :key="index"
              v-model="item.$model.count"
              :label="item.$model.text"
              :error-messages="countErrors(item)"
              hint="Например: 1 шт / 5 метров / 1 пара ..."
              @blur="item.count.$touch()"
            >
            </v-text-field>
            <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Дополнительная информация</p>
            <v-textarea
              v-model.trim="description"
              label="Комментарий к заявке (необязательно)"
              auto-grow
            ></v-textarea>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="5"
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
                      v-model="deliveryDateText"
                      label="Дата поставки на объект"
                      :error-messages="deliveryDateErrors"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="deliveryDate"
                    :min="new Date().toISOString().substr(0, 10)"
                    locale="ru"
                    first-day-of-week="1"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <ProjectInputSync v-model="project" :error-messages="projectErrors"/>
          </template>
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
  import { consumables } from '../../../../mocks/consumablesList'
  import { required } from 'vuelidate/lib/validators'
  import { mapActions } from 'vuex'
  import ProjectInputSync from '@/components/app/ProjectInputSync'

  export default {
    name: 'ConsumablesForm',
    components: { ProjectInputSync },
    validations: {
      consumables: {
        required,
        $each: {
          count: { required }
        }
      },
      deliveryDate: { required },
      project: { required }
    },
    data: () => ({
      consumables: [],
      searchInput: '',

      description: '',

      project: '',

      deliveryDate: '',
      menu: false,

      loading: false,
      isValidationError: false,
      successSnackbar: false,
      errorSnackbar: false,
      result: {}
    }),
    computed: {
      consumblesList () {
        return consumables
      },
      deliveryDateText () {
        return this.deliveryDate.split('-').reverse().join('-')
      },
      consumablesErrors () {
        const errors = []
        if (!this.$v.consumables.$dirty) return errors
        !this.$v.consumables.required && errors.push('Укажите какой-нибудь расходник')
        return errors
      },
      deliveryDateErrors () {
        const errors = []
        if (!this.$v.deliveryDate.$dirty) return errors
        !this.$v.deliveryDate.required && errors.push('Укажите дату поставки на объект')
        return errors
      },
      projectErrors () {
        const errors = []
        if (!this.$v.project.$dirty) return errors
        !this.$v.project.required && errors.push('Укажите название и номер проекта')
        return errors
      }
    },
    watch: {
      consumables (val, prev) {
        if (val.length === prev.length) return
        this.consumables = val.map(v => {
          if (typeof v === 'string') {
            v = {
              text: v,
              count: null
            }
          }
          return v
        })
      },
      result () {
        if (this.result.elementId) {
          this.successSnackbar = true
          this.consumables = []
          this.description = ''
        } else {
          this.errorSnackbar = true
        }
      }
    },
    methods: {
      ...mapActions(['consumablesRequest']),
      async submit () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.isValidationError = true
          console.log(this.$v)
          for (const key in Object.keys(this.$v)) {
            const input = Object.keys(this.$v)[key]
            if (input.includes('$')) return false
            if (this.$v[input].$error) {
              // this.$refs[input].focus()
              break
            }
          }
          this.isValidationError = true
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const formData = {
            consumables: this.consumables,
            description: this.description,
            deliveryDate: this.deliveryDate,
            project: this.project?.NAME || this.project
          }
          const result = await this.consumablesRequest(formData)
          this.loading = false
          this.result = result
        }
      },
      show (el) {
        console.log(el)
      },
      countErrors (el) {
        const errors = []
        if (!el.count.$dirty) return errors
        !el.count.required && errors.push('Укажите требуемое количество (например: 1 шт.)')
        return errors
      }
    }
  }
</script>

<style scoped>

</style>
