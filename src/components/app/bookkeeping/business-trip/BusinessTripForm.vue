<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на оформление командировки № {{result.elementId}} успешно создана!
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
        <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по командировке</p>
        <UsersInput
          v-model="users"
          label="Командируемые сотрудники"
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
              :return-value.sync="tripDates"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="tripDateRangeText"
                  label="Даты командировки"
                  ref="tripDateRangeText"
                  prepend-icon="mdi-calendar"
                  :error-messages="tripDateRangeTextErrors"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="tripDates"
                range
                locale="ru"
                selected-items-text='период'
                first-day-of-week="1"
              >
                <v-spacer></v-spacer>
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
                  @click="$refs.menu1.save(tripDates)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
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
              v-model="menu2"
              ref="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              :return-value.sync="workDates"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="workDateRangeText"
                  label="Даты работ на объекте"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="workDates"
                range
                :min=" tripDates[0] ? new Date(tripDates[0]).toISOString().substr(0, 10) : ''"
                :max=" tripDates[0] ? new Date(tripDates[1] || tripDates[0]).toISOString().substr(0, 10) : ''"
                locale="ru"
                selected-items-text='период'
                first-day-of-week="1"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="menu2 = false"
                >
                  Отмена
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu2.save(workDates)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-text-field
          v-model="address"
          label="Адрес объекта"
          ref="address"
          prepend-icon="mdi-map-marker"
          :error-messages="addressErrors"
          @blur="$v.address.$touch()"
        ></v-text-field>
        <v-combobox
          v-model="purpose"
          :items="purposeItems"
          label="Цель"
          append-icon=""
          dense
          ref="purpose"
          :error-messages="purposeErrors"
          @blur="$v.purpose.$touch()"
        ></v-combobox>
        <v-checkbox
          class="my-0"
          v-model="isHotel"
          label="Забронировать гостиницу"
        ></v-checkbox>
        <v-textarea
          v-model.trim="hotel"
          v-if="isHotel"
          label="Предпочтения по гостинице"
          :error-messages="hotelErrors"
          rows="1"
          ref="hotel"
          auto-grow
          @blur="$v.hotel.$touch()"
        ></v-textarea>
        <v-checkbox
          class="my-0"
          v-model="isTickets"
          label="Организовать трансфер"
        ></v-checkbox>
        <v-textarea
          v-model.trim="tickets"
          v-if="isTickets"
          label="Предпочтения по трансферу"
          rows="1"
          ref="tickets"
          :error-messages="ticketsErrors"
          @blur="$v.tickets.$touch()"
          auto-grow
        ></v-textarea>
        <v-checkbox
          class="my-0"
          v-model="isMoney"
          label="Выдать деньги на доп. расходы"
        ></v-checkbox>
        <v-textarea
          v-model.trim="money"
          v-if="isMoney"
          label="Требуемая сумма доп. расходов"
          rows="1"
          ref="money"
          :error-messages="moneyErrors"
          auto-grow
          @blur="$v.money.$touch()"
        ></v-textarea>
        <v-textarea
          v-model="description"
          label="Комментарий (необязательно)"
          rows="2"
          auto-grow
        ></v-textarea>
        <DealInput
          v-model="deal"
          :errorMessages="dealErrors"
          ref="deal"
          :error-messages="usersErrors"
        />
        <p class="subtitle-1 font-weight-medium black--text mt-10 mb-4" v-if="project">Дополнительная информация</p>
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
  import { required, requiredIf } from 'vuelidate/lib/validators'
  import { mapActions } from 'vuex'
  import DealInput from '../../DealInput'
  import ProjectInput from '../../ProjectInput'
  import UsersInput from '../../UsersInput'

  export default {
    name: 'BusinessTripForm',
    validations: {
      users: { required },
      tripDateRangeText: { required },
      address: { required },
      purpose: { required },
      hotel: {
        required: requiredIf(function () {
          return this.isHotel
        })
      },
      tickets: {
        required: requiredIf(function () {
          return this.isTickets
        })
      },
      money: {
        required: requiredIf(function () {
          return this.isMoney
        })
      },
      deal: { required }
    },
    components: { UsersInput, ProjectInput, DealInput },
    mounted() {
      if (this.deal) {
        this.address = this.deal.objectAddresses.join('; ')
      }
    },
    data: () => ({
      users: [],
      tripDates: [],
      menu1: false,
      workDates: [],
      menu2: false,
      purpose: null,
      purposeItems: [
        'Монтажно-наладочные работы',
        'Пусконаладочные работы',
        'Переговоры с заказчиком',
        'Реализация проекта',
        'Сервисное обслуживание',
        'Устранение неисправностей по ГО'
      ],
      address: null,
      isHotel: false,
      hotel: null,
      isTickets: false,
      tickets: null,
      isMoney: false,
      money: null,
      deal: null,
      description: null,
      project: null,
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      tripDateRangeText () {
        if (this.tripDates[1]) {
          let dates = this.tripDates
          if (dates[0] > dates[1]) {
            dates = dates.reverse()
          }
          return `c ${dates[0].split('-').reverse().join('-')} по ${dates[1].split('-').reverse().join('-')}`
        }
        if (this.tripDates[0]) {
          return this.tripDates[0].split('-').reverse().join('-')
        }
        return []
      },
      workDateRangeText () {
        if (this.workDates[1]) {
          let dates = this.workDates
          if (dates[0] > dates[1]) {
            dates = dates.reverse()
          }
          return `c ${dates[0].split('-').reverse().join('-')} по ${dates[1].split('-').reverse().join('-')}`
        }
        if (this.workDates[0]) {
          return this.workDates[0].split('-').reverse().join('-')
        }
        return []
      },
      tripDateRangeTextErrors () {
        const errors = []
        if (!this.$v.tripDateRangeText.$dirty) return errors
        !this.$v.tripDateRangeText.required && errors.push('Укажите даты командировки')
        return errors
      },
      usersErrors () {
        const errors = []
        if (!this.$v.users.$dirty) return errors
        !this.$v.users.required && errors.push('Укажите командируемых сотрудников')
        return errors
      },
      purposeErrors () {
        const errors = []
        if (!this.$v.purpose.$dirty) return errors
        !this.$v.purpose.required && errors.push('Укажите цель командировки')
        return errors
      },
      addressErrors () {
        const errors = []
        if (!this.$v.address.$dirty) return errors
        !this.$v.address.required && errors.push('Укажите адрес объекта')
        return errors
      },
      hotelErrors () {
        const errors = []
        if (!this.$v.hotel.$dirty) return errors
        !this.$v.hotel.required && errors.push('Укажите предпочтения по гостинице')
        return errors
      },
      ticketsErrors () {
        const errors = []
        if (!this.$v.tickets.$dirty) return errors
        !this.$v.tickets.required && errors.push('Укажите предпочтения по трансферу')
        return errors
      },
      moneyErrors () {
        const errors = []
        if (!this.$v.money.$dirty) return errors
        !this.$v.money.required && errors.push('Укажите требуемую сумму доп. расходов')
        return errors
      },
      dealErrors () {
        const errors = []
        if (!this.$v.deal.$dirty) return errors
        !this.$v.deal.required && errors.push('Укажите сделку')
        return errors
      }
    },
    watch: {
      tripDates (val) {
        this.workDates = val
      },
      isHotel (val) {
        if (!val) {
          this.hotel = null
        }
      },
      isTickets (val) {
        if (!val) {
          this.tickets = null
        }
      },
      isMoney (val) {
        if (!val) {
          this.money = null
        }
      }
    },
    methods: {
      ...mapActions(['businessTripRequest']),
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
            tripDates: this.tripDates,
            workDates: this.workDates,
            purpose: this.purpose,
            hotel: this.hotel,
            tickets: this.tickets,
            money: this.money,
            address: this.address,
            description: this.description,
            deal: this.deal
          }
          const result = await this.businessTripRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.description = this.purpose = null
            this.isHotel = this.isTickets = this.isMoney = false
            this.tripDates = this.workDates = []
            this.dates = []
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
