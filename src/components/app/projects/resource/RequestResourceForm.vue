<template>
    <div>
      <v-snackbar
        v-model="errorSnackbar"
        top
        :timeout="-1"
        color="error"
      >
        <template v-slot:default>
          <span v-html="falseResultText"></span>
        </template>
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
          v-model="successSnackbar"
          top
          :timeout="-1"
          transition="scroll-y-transition"
          color="success"
        >
          <template v-slot:default>
            <span v-html="trueResultText"></span>
          </template>
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
        color="error"
        v-model="isValidationError"
        top
        right
      >
        Ошибка валидации формы, проверьте поля
      </v-snackbar>
      <div class="wrapper-form">
        <form @submit.prevent>
          <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по ресурсам</p>
          <template v-for="(resource) in $v.resources.$each.$iter">
          <v-checkbox
            :key="resource.$model.id"
            :label="resource.$model.title"
            v-model="resource.$model.isChecked"
            class="my-0"
          ></v-checkbox>
            <template v-if="resource.$model.isChecked">
              <v-row :key="resource.$model.id">
                <v-col
                  class="my-0 py-0"
                  cols="12"
                  xs="12"
                  sm="8"
                  md="6"
                >
                  <v-text-field
                    v-model="resource.numberPeople.$model"
                    label="Количество человек"
                    type="number"
                    min="1"
                    :error-messages="numberPeopleErrors(resource)"
                    prepend-icon="mdi-account-group"
                    @blur="resource.numberPeople.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row :key="resource.$model.value">
                <v-col
                  class="my-0 py-0"
                  cols="12"
                  xs="12"
                  sm="8"
                  md="6"
                >
                  <v-menu
                    v-model="resource.$model.menu"
                    :ref="'menu-'+resource.$model.value"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="resource.dateRangeText.$model"
                        label="Даты участия"
                        prepend-icon="mdi-calendar"
                        readonly
                        :error-messages="dateRangeTextErrors(resource)"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="resource.$model.dates"
                      range
                      locale="ru"
                      selected-items-text = 'период'
                      first-day-of-week="1"
                      :min="new Date().toISOString().substr(0, 10)"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="resource.$model.menu = false"
                      >
                        Отмена
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="saveDate(resource.$model)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </template>
          </template>
          <ProjectInput v-model="project"/>
          <v-text-field
            v-if="typeof project === 'string'"
            v-model="project"
            type="number"
            label="Идентификатор проекта (группы)"
            prepend-icon="mdi-file-cad"
            hint="Идентификатор можно посмотреть в url адресе проекта (группы) https://polyservice.bitrix24.ru/workgroups/group/1025/
            ИД: 1025"
            :error-messages="projectErrors"
            @blur="$v.project.$touch()"
          ></v-text-field>
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
  import ProjectInput from '../../ProjectInput'
  import { required, requiredIf } from 'vuelidate/lib/validators'
  import { mapActions } from 'vuex'

  export default {
    name: 'RequestResourceForm',
    components: { ProjectInput },
    validations: {
      project: { required },
      whatChecked: { required },
      resources: {
        required,
        $each: {
          numberPeople: {
            required: requiredIf(function (nestedModel) {
              return nestedModel.isChecked
            })
          },
          dateRangeText: {
            required: requiredIf(function (nestedModel) {
              return nestedModel.isChecked
            })
          }
        }
      }
    },
    data: () => ({
      resources: [
        {
          value: 'iso',
          title: 'ИСО',
          isChecked: false,
          numberPeople: '',
          dates: [],
          dateRangeText: '',
          menu: false
        },
        {
          value: 'mto',
          title: 'МТО',
          isChecked: false,
          numberPeople: '',
          dates: [],
          dateRangeText: '',
          menu: false
        },
        {
          value: 'programmers',
          title: 'Программисты',
          isChecked: false,
          numberPeople: '',
          dates: [],
          dateRangeText: '',
          menu: false
        },
        {
          value: 'rp',
          title: 'РП',
          isChecked: false,
          numberPeople: '',
          dates: [],
          dateRangeText: '',
          menu: false
        }
      ],
      project: '',
      result: [],
      isValidationError: false,
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      whatChecked () {
        console.log('ds')
        console.log(this.resources.filter(item => item.isChecked === true), 'cheched')
        return []
      },
      trueResultText () {
        let resultText = ''
        this.result.forEach(el => {
          if (el.elementId) {
            resultText = resultText + `Заявка на ${el.listTitle} № ${el.elementId} успешно создана! <br>`
          }
        })
        return resultText
      },
      falseResultText () {
        let resultText = ''
        this.result.forEach(el => {
          if (el.error) {
            resultText = resultText + `Заявка на ${el.listTitle} не создана. Ошибка ${el.error}! <br>`
          }
        })
        return resultText
      },
      projectErrors () {
        const errors = []
        if (!this.$v.project.$dirty) return errors
        !this.$v.project.required && errors.push('Укажите идентификатор проекта (группы)')
        return errors
      }
    },
    watch: {
      result () {
        this.result.forEach(el => {
          if (el.error) {
            this.errorSnackbar = true
          } else if (el.elementId) {
            this.successSnackbar = true
          }
        })
      }
    },
    methods: {
      ...mapActions(['isoResourceRequest', 'mtoResourceRequest', 'programmersResourceRequest', 'rpResourceRequest']),
      numberPeopleErrors (el) {
        const errors = []
        if (!el.numberPeople.$dirty) return errors
        !el.numberPeople.required && errors.push('Укажите количетво человек')
        return errors
      },
      dateRangeTextErrors (el) {
        const errors = []
        if (!el.dateRangeText.$dirty) return errors
        !el.dateRangeText.required && errors.push('Укажите даты участия в работах')
        return errors
      },
      saveDate (resource) {
        this.$refs['menu-' + resource.value][0].save(resource.dates)
        if (resource.dates[1]) {
          let dates = resource.dates
          if (dates[0] > dates[1]) {
            dates = dates.reverse()
          }
          resource.dateRangeText = `c ${dates[0].split('-').reverse().join('-')} по ${dates[1].split('-').reverse().join('-')}`
        } else if (resource.dates[0]) {
          resource.dateRangeText = resource.dates[0].split('-').reverse().join('-')
        }
      },
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
          alert('не валидна')
          return false
        } else {
          this.$v.$reset()
          this.loading = true
          const results = []
          for (const el of this.resources) {
            if (el.isChecked) {
              const formData = {
                resource: el,
                project: this.project?.id || this.project
              }
              switch (el.value) {
                case 'iso': {
                  results.push(await this.isoResourceRequest(formData))
                  break
                }
                case 'mto': {
                  results.push(await this.mtoResourceRequest(formData))
                  break
                }
                case 'programmers': {
                  results.push(await this.programmersResourceRequest(formData))
                  break
                }
                case 'rp': {
                  results.push(await this.rpResourceRequest(formData))
                  break
                }
              }
            }
          }
          console.log(results, 'results')
          this.loading = false
          this.result = results
        }
      }
    }
  }
</script>
