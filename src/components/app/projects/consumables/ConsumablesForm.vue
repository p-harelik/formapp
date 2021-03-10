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
              @blur="item.count.$touch()"
            >
              <template v-slot:append-outer>
                <v-btn
                  color="primary"
                  depressed
                  x-small
                  fab
                  @click="removeItem(Number(index))"
                >
                  x
                </v-btn>
              </template>
            </v-text-field>
            <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Дополнительная информация</p>
            <v-textarea
              v-model.trim="description"
              label="Комментарий к заявке (необязательно)"
              auto-grow
            ></v-textarea>
            <ProjectInput v-model="project"/>
            <v-text-field
              v-if="typeof project === 'string'"
              v-model="project"
              label="Название и номер проекта"
              prepend-icon="mdi-file-cad"
              hint="Например: AV 123456 Проект Москва"
              :error-messages="projectErrors"
              @blur="$v.project.$touch()"
            ></v-text-field>
            <DealInput v-model="deal"/>
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
  import ProjectInput from '../../ProjectInput'
  import DealInput from '../../DealInput'
  import { mapActions } from 'vuex'

  export default {
    name: 'ConsumablesForm',
    components: { DealInput, ProjectInput },
    validations: {
      consumables: {
        required,
        $each: {
          count: { required }
        }
      },
      project: { required }
    },
    data: () => ({
      consumables: [],
      searchInput: '',

      description: '',

      project: '',

      deal: null,

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
      consumablesErrors () {
        const errors = []
        if (!this.$v.consumables.$dirty) return errors
        !this.$v.consumables.required && errors.push('Укажите какой-нибудь расходник')
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
            project: this.project?.title || this.project,
            deal: this.deal
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
      },
      removeItem (index) {
        this.consumables = this.consumables.filter((item, i) => i !== index)
      }
    }
  }
</script>

<style scoped>

</style>
