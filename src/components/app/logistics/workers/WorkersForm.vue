<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка на грузчиков № {{result.elementId}} успешно создана!
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
        <v-text-field
          v-model="place"
          ref="place"
          label="Место проведения погрузочно-разгрузочных работ"
          :error-messages="placeErrors"
          @input="$v.place.$touch()"
          @blur="$v.place.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="workersCount"
          ref="workersCount"
          label="Количество грузчиков"
          :error-messages="workersCountErrors"
          @input="$v.workersCount.$touch()"
          @blur="$v.workersCount.$touch()"
        ></v-text-field>
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
                  label="Дата исполнения"
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
                first-day-of-week="1"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-textarea
          v-model.trim="description"
          :error-messages="descriptionErrors"
          ref="description"
          label="Описание работ"
          auto-grow
          @input="$v.description.$touch()"
          @blur="$v.description.$touch()"
        ></v-textarea>
        <p class="subtitle-1 font-weight-medium black--text mt-10 mb-4">Дополнительная информация</p>
        <DealInput v-model="deal"/>
        <ProjectInput v-model="project"/>
        <v-text-field
          type="number"
          min="1"
          v-model="taskId"
          prefix="№"
          label="Сделать подзадачей к задаче"
          hint="Будет добавлено в виде подзадачи к указанной задаче"
        ></v-text-field>
        <v-input>
          <template>
            <v-row>
              <v-col>
                <v-btn
                  depressed
                  color="secondary lighten-1"
                  @click="addObserver"
                >
                  <v-icon class="mr-4"
                  >
                    mdi-account
                  </v-icon>
                  Добавить наблюдателей
                </v-btn>
              </v-col>
              <v-col>
                <template
                  v-if="observers.length"
                >
                  <v-chip
                    v-for="observer of observers"
                    :key="observer.id"
                    class="ma-1"
                    small
                    close
                    @click:close="removeObserver(observer.id)"
                  >
                    <v-avatar left>
                      <img :src="observer.photo" alt="">
                    </v-avatar>
                     {{observer.name}}
                  </v-chip>
                </template>
              </v-col>
            </v-row>
          </template>
        </v-input>
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
  import { required } from 'vuelidate/lib/validators'
  import { mapGetters, mapActions } from 'vuex'
  import selectObservers from '../../../../mixins/selectObservers'
  import deals from '../../../../mixins/deals'
  import project from '../../../../mixins/project'
  import DealInput from '../../DealInput'
  import ProjectInput from '../../ProjectInput'

  export default {
    name: 'WorkersForm',
    components: { ProjectInput, DealInput },
    mixins: [deals, project, selectObservers],
    validations: {
      place: { required },
      workersCount: { required },
      description: { required }
    },

    data: () => ({
      place: '',
      workersCount: '',
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      description: '',
      deal: null,
      project: null,
      taskId: '',
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      ...mapGetters(['getDeal', 'getTask', 'getUser', 'getGroup']),
      dateText () {
        return this.date.split('-').reverse().join('-')
      },
      placeErrors () {
        const errors = []
        if (!this.$v.place.$dirty) return errors
        !this.$v.place.required && errors.push('Необходимо указать место проведения погрузочно-разгрузочных работ')
        return errors
      },
      workersCountErrors () {
        const errors = []
        if (!this.$v.workersCount.$dirty) return errors
        !this.$v.workersCount.required && errors.push('Необходимо указать количество грузчиков')
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
      ...mapActions(['workersRequest']),
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
            place: this.place,
            workersCount: this.workersCount,
            date: this.date,
            description: this.description,
            deal: this.deal,
            taskId: this.taskId,
            observers: this.observers
          }
          const result = await this.workersRequest(formData)
          this.loading = false
          this.result = result
          if (result.elementId) {
            this.successSnackbar = true
            this.place = this.workersCount = this.description = ''
            this.date = new Date().toISOString().substr(0, 10)
          } else {
            this.errorSnackbar = true
          }
        }
      }
    },
    created () {
      this.taskId = this.getTask.id
    }
  }
</script>

<!--productTypeSelect: { required },-->
<!--conditionSelect: {-->
<!--required: requiredIf(function () {-->
<!--return this.productTypeSelect !== 567-->
<!--})-->
