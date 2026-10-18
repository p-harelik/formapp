<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Планирование № {{result.elementId}} успешно создано!
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

          <UsersInput
          :value="executor"
          label="Исполнитель"
           ref="executor"
           :multiple="false"
           :error-messages="executorErrors"
           @valueChange="userChange"
        />

        <UsersInput
          v-model="сoExecutors"
          label="Соисполнители"
          ref="coExecutors"
        />

        <v-row>
          <v-col
            class="my-0 py-0"
            cols="12"
            xs="12"
            sm="8"
            md="6"
          >
            <v-menu
              v-model="menu1"
              ref="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              :return-value.sync="planningDates"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="planningDateRangeText"
                  outlined
                  label="Даты планирования"
                  ref="planningDateRangeText"
                  prepend-icon="mdi-calendar"
                  :error-messages="planningDateRangeTextErrors"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>

              <v-card>
                <v-date-picker
                  v-model="planningDates"
                  range
                  locale="ru"
                  selected-items-text="период"
                  first-day-of-week="1"
                />

                <v-card-text class="pb-0">
                  <v-row>
                    <v-col cols="12" sm="6" class="py-0">
                      <v-text-field
                        v-model="planningStartTime"
                        type="time"
                        outlined
                        dense
                        label="Время начала"
                      />
                    </v-col>

                    <v-col cols="12" sm="6" class="py-0">
                      <v-text-field
                        v-model="planningEndTime"
                        type="time"
                        outlined
                        dense
                        label="Время окончания"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer/>

                  <v-btn
                    text
                    color="primary"
                    @click="menu1 = false"
                  >
                    Отмена
                  </v-btn>

                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu1.save(planningDates)"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>

        <v-switch
          v-model="splitPlanningByDays"
          label="Разбить планирование по дням"
        />

        <v-select
          v-model="planningType"
          :items="planningTypes"
          outlined
          :error-messages="planningTypeErrors"
          @change="$v.planningType.$touch()"
          @blur="$v.planningType.$touch()"
          multiple
          chips
          clearable
          label="Тип планирования"
        ></v-select>

        <v-radio-group
          v-model="company"
          mandatory
          column
        >
          <template v-slot:label>
            <div>Компания</div>
          </template>
          <v-radio
            v-for="n in companyItems"
            :key="n.value"
            :label="n.label"
            :value="n.value"
          >
          </v-radio>
        </v-radio-group>

        <v-checkbox
          v-model="isNeedActOfWork"
          label="Предоставить акт выполненных работ"
        />

        <v-textarea
          v-model.trim="contactData"
          ref="contactData"
          outlined
          label="Контактная информация"
          auto-grow/>

        <v-textarea
          v-model.trim="planningWorks"
          outlined
          ref="planningWorks"
          label="Планируемые работы"
          auto-grow/>

        <CustomFileInput
          class="mb-8"
          v-model="files"
          label="Добавить файлы (опционально)"
        />

        <v-select
        v-if="checkList.length"
          v-model="checkListValue"
          :items="checkList"
          outlined
          clearable
          label="Чек-лист"
        ></v-select>

        <DealInput
          v-model="deal"
          :errorMessages="dealErrors"
          ref="deal"
          :error-messages="executorErrors"/>

        <v-btn
          class="mr-4 mb-4"
          color="primary"
          @click="submit"
          type="submit"
          :loading="loading"
        >
          Добавить в планирование
        </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
  import { required } from 'vuelidate/lib/validators'
  import { mapActions } from 'vuex'
  import DealInput from '../DealInput'
  import UsersInput from '../UsersInput'
  import Bitrix from '../../../plugins/Bitrix'
  import CustomFileInput from '../../CustomFileInput'

  export default {
    name: 'PlanningToScheduleForm',
    validations: {
      executor: { required },
      planningType: { required },
      planningDateRangeText: {
        required,
        validTimeRange(value, vm) {
          const [startDate, endDate] = vm.orderedPlanningDates
          const startTime = vm.planningStartTime || '00:00:00'
          const endTime = vm.planningEndTime || '23:59:00'
          return (endDate && endDate !== startDate) || endTime > startTime
        }
      },
      deal: { required }
    },

    async mounted() {
      const parentDealId = this.deal?.parentDealId

      if (parentDealId && (!this.deal?.contactInfo.length || !this.deal?.objectAddresses.length)) {
        const parentDeal = await Bitrix.callMethod('crm.deal.get', { id: parentDealId })
        const { UF_CRM_1574062883453: parentContactInfo, UF_CRM_1574079925624: parentObjectAddresses } = parentDeal

        const contactInfo = this.deal?.contactInfo.length ? this.deal?.contactInfo : parentContactInfo
        const addresses = this.deal?.objectAddresses.length ? this.deal?.objectAddresses : parentObjectAddresses

        this.contactData = `${contactInfo.join('\n')} \n${addresses.map(address => address.split('|')[0]).join('\n').replaceAll('&quot;', '"')}`
      } else if (this.deal?.contactInfo.length || this.deal?.objectAddresses.length) {
        this.contactData = `${this.deal?.contactInfo.join('\n')} \n${this.deal?.objectAddresses.map(address => address.split('|')[0]).join('\n').replaceAll('&quot;', '"')}`
      }

      try {
        const listFields = await Bitrix.callMethod('lists.field.get', {
          IBLOCK_TYPE_ID: 'lists',
          IBLOCK_ID: 47
        })

        this.checkList = Object.keys(listFields.PROPERTY_2093?.DISPLAY_VALUES_FORM ?? {})
        .map((key) => ({ value: key, text: listFields.PROPERTY_2093?.DISPLAY_VALUES_FORM[key] }))
      } catch (error) {
        console.error(error)
      }
    },
    components: {
      UsersInput,
      DealInput,
      CustomFileInput
     },
    data: () => ({
      executor: null,
      сoExecutors: [],
      planningDates: [],
      planningStartTime: '09:00',
      planningEndTime: '18:00',
      menu1: false,
      splitPlanningByDays: true,
      planningType: [],
      planningTypes: [
        {
          value: 1239,
          text: 'Аудит'
        },
        {
          value: 1237,
          text: 'Аварийный выезд'
        },
        {
          value: 1243,
          text: 'Диагностика'
        },
        {
          value: 1245,
          text: 'Монтаж демонтаж'
        },
        {
          value: 1249,
          text: 'Регламентные работы'
        },
        // {
        //   value: 221,
        //   text: 'Реализация проекта'
        // },
        {
          value: 223,
          text: 'Ремонтные работы'
        },
        {
          value: 1247,
          text: 'ПНР'
        },
        {
          value: 1241,
          text: 'Дежурство'
        },
        {
          value: 935,
          text: 'Обучение'
        },
        {
          value: 845,
          text: 'Прочее'
        },
        {
          value: 1251,
          text: 'Сопровождение мероприятий'
        },
        {
          value: 245,
          text: 'Работы в офисе'
        },
        {
          value: 1415,
          text: 'Программирование'
        }
      ],
      company: 1213,
      companyItems: [
        {
          value: 1213,
          label: 'Polyservice'
        },
        {
          value: 1215,
          label: 'Polymedia'
        },
        {
          value: 1219,
          label: 'Polysystems'
        }
      ],
      isNeedActOfWork: false,
      deal: null,
      contactData: null,
      planningWorks: null,
      files: [],
      checkList: [],
      checkListValue: null,
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      orderedPlanningDates () {
        return [...this.planningDates].sort()
      },
      planningDateRangeText () {
        const [startDate, endDate] = this.orderedPlanningDates
        const startTime = ` ${this.planningStartTime || '00:00'}`
        const endTime = ` ${this.planningEndTime || '23:59'}`

        if (endDate) {
          return `c ${startDate.split('-').reverse().join('-')}${startTime} по ${endDate.split('-').reverse().join('-')}${endTime}`
        }
        if (startDate) {
          return `${startDate.split('-').reverse().join('-')}${startTime}${endTime ? `–${endTime.trim()}` : ''}`
        }
        return []
      },
      planningTypeErrors () {
        const errors = []
        if (!this.$v.planningType.$dirty) return errors
        !this.$v.planningType.required && errors.push('Укажите тип планирования')
        return errors
      },
      planningDateRangeTextErrors () {
        const errors = []
        if (!this.$v.planningDateRangeText.$dirty) return errors
        if (!this.$v.planningDateRangeText.required) {
          errors.push('Укажите даты планирования')
        } else if (!this.$v.planningDateRangeText.validTimeRange) {
          errors.push('Время окончания должно быть позже времени начала')
        }
        return errors
      },
      executorErrors () {
        const errors = []
        if (!this.$v.executor.$dirty) return errors
        !this.$v.executor.required && errors.push('Укажите планируемых сотрудников')
        return errors
      },
      dealErrors () {
        const errors = []
        if (!this.$v.deal.$dirty) return errors
        !this.$v.deal.required && errors.push('Укажите сделку')
        return errors
      }
    },
    methods: {
      ...mapActions(['planningInScheduleRequest']),
      resetFields() {
            this.planningDates = []
            this.planningStartTime = '09:00'
            this.planningEndTime = '18:00'
            this.files = []
            this.executor = null
            this.сoExecutors = []
            this.contactData = null
            this.planningWorks = null
            this.splitPlanningByDays = true
      },
      userChange(value) {
        this.executor = value || null
      },
      formatDateTime(date, time) {
        const timeWithSeconds = time.length === 5 ? `${time}:00` : time
        const offset = -new Date(`${date}T${timeWithSeconds}`).getTimezoneOffset()
        const sign = offset >= 0 ? '+' : '-'
        const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
        const minutes = String(Math.abs(offset) % 60).padStart(2, '0')

        return `${date}T${timeWithSeconds}${sign}${hours}:${minutes}`
      },
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
          const [startDate, endDate = startDate] = this.orderedPlanningDates
          const startTime = this.planningStartTime || '00:00:00'
          const endTime = this.planningEndTime || '23:59:00'
          const formData = {
            executor: this.executor.id,
            сoExecutors: this.сoExecutors.map(executor => executor.id),
            planningStartDateTime: this.formatDateTime(startDate, startTime),
            planningEndDateTime: this.formatDateTime(endDate, endTime),
            splitPlanningByDays: this.splitPlanningByDays,
            planningType: this.planningType,
            company: this.company,
            contactData: this.contactData,
            planningWorks: this.planningWorks,
            files: this.files,
            deal: this.deal,
            isNeedActOfWork: this.isNeedActOfWork,
            checkListValue: this.checkListValue
          }
          const result = await this.planningInScheduleRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.resetFields()
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
