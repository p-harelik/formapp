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
          v-model="users"
          label="Планируемые сотрудники"
          ref="users"
          :error-messages="usersErrors"
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

              <v-date-picker
                v-model="planningDates"
                range
                locale="ru"
                selected-items-text='период'
                first-day-of-week="1"
              >
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
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

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

        <DealInput
          v-model="deal"
          :errorMessages="dealErrors"
          ref="deal"
          :error-messages="usersErrors"/>

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
      users: { required },
      planningType: { required },
      planningDateRangeText: { required },
      deal: { required }
    },

    async mounted() {
      const parentDealId = this.deal?.parentDealId

      if (parentDealId && (!this.deal?.contactInfo.length || !this.deal?.objectAddresses.length)) {
        const parentDeal = await Bitrix.callMethod('crm.deal.get', { id: parentDealId })
        const { UF_CRM_1574062883453: parentContactInfo, UF_CRM_1574079925624: parentObjectAddresses } = parentDeal

        const contactInfo = this.deal?.contactInfo.length ? this.deal?.contactInfo : parentContactInfo
        const addresses = this.deal?.objectAddresses.length ? this.deal?.objectAddresses : parentObjectAddresses

        this.contactData = `${contactInfo.join('\n')} \n ${addresses.join('\n').replaceAll('&quot;', '"')}`
      } else if (this.deal?.contactInfo.length || this.deal?.objectAddresses.length) {
        this.contactData = `${this.deal?.contactInfo.join('\n')} \n ${this.deal?.objectAddresses.join('\n').replaceAll('&quot;', '"')}`
      }
    },
    components: {
      UsersInput,
      DealInput,
      CustomFileInput
     },
    data: () => ({
      users: [],
      planningDates: [],
      menu1: false,
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
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      planningDateRangeText () {
        if (this.planningDates[1]) {
          let dates = this.planningDates
          if (dates[0] > dates[1]) {
            dates = dates.reverse()
          }
          return `c ${dates[0].split('-').reverse().join('-')} по ${dates[1].split('-').reverse().join('-')}`
        }
        if (this.planningDates[0]) {
          return this.planningDates[0].split('-').reverse().join('-')
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
        !this.$v.planningDateRangeText.required && errors.push('Укажите даты планирования')
        return errors
      },
      usersErrors () {
        const errors = []
        if (!this.$v.users.$dirty) return errors
        !this.$v.users.required && errors.push('Укажите планируемых сотрудников')
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
            this.files = []
            this.users = []
            this.contactData = null
            this.planningWorks = null
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
          const formData = {
            users: this.users.map(user => user.id),
            planningDates: this.planningDates,
            planningType: this.planningType,
            company: this.company,
            contactData: this.contactData,
            planningWorks: this.planningWorks,
            files: this.files,
            deal: this.deal,
            isNeedActOfWork: this.isNeedActOfWork
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
