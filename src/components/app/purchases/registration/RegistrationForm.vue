<template>
  <div>
    <v-snackbar
      v-model="successSnackbar"
      :timeout="4000"
      top
      transition="scroll-y-transition"
      color="success"
    >
      Заявка № {{result.elementId}} на регистрацию под проект успешно создана!
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
      <p class="subtitle-1 font-weight-medium black--text mt-4 mb-4">Информация по регистрации</p>
      <v-combobox
        v-model="customerName"
        label="Наименование заказчика"
        :items="companyItems"
        item-text="title"
        :loading="isLoadingCompany"
        :search-input.sync="searchCompany"
        :error-messages="customerNameErrors"
        ref="customerName"
        chips
        clearable
        @input="$v.customerName.$touch()"
        @blur="$v.customerName.$touch()"
      >
        <template v-slot:selection="{ item }">
          <v-chip
            :href="`${item.id ? 'https://polyservice.bitrix24.ru/crm/company/details/' + item.id +'/': ''}`"
            target="_blank"
            @click.native.stop
          >
            <v-avatar left v-if="item.logoURL">
              <img :src="'https://polyservice.bitrix24.ru/'+item.logoURL" alt="">
            </v-avatar>
            {{item.title || item}}
          </v-chip>
        </template>
      </v-combobox>
      <v-text-field
        v-model.trim="individualNumber"
        label="ИНН (необязательно)"
      ></v-text-field>
      <v-text-field
        v-model.trim="objectName"
        ref="objectName"
        :error-messages="objectNameErrors"
        label="Объект"
        @input="$v.objectName.$touch()"
        @blur="$v.objectName.$touch()"
      ></v-text-field>
      <v-text-field
      v-model.trim="objectAddress"
      ref="objectAddress"
      :error-messages="objectAddressErrors"
      label="Адрес объекта"
      @input="$v.objectAddress.$touch()"
      @blur="$v.objectAddress.$touch()"
    ></v-text-field>
      <v-text-field
        v-model.trim="projectName"
        ref="projectName"
        :error-messages="projectNameErrors"
        label="Проект"
        @input="$v.projectName.$touch()"
        @blur="$v.projectName.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="projectManager"
        ref="quarterNumber"
        label="Менеджер проекта (необязательно)"
      ></v-text-field>
      <v-radio-group
        v-model="quarterNumber"
        row
        :error-messages="quarterNumberErrors"
      >
        <template v-slot:label>
          <div>Квартал реализации</div>
        </template>
        <v-radio
          v-for="n in 5"
          :key="n"
          :label="n === 5 ? '-' : n.toString()"
          :value="n === 5 ? '-' : n"
        >
        </v-radio>
      </v-radio-group>
      <v-radio-group
        v-model="whatCompanyRegistrationSelect"
        row
      >
        <template v-slot:label>
          Регистрация от компании
        </template>
        <v-radio
          v-for="n in whatCompanyRegistrationItems"
          :key="n.value"
          :label="n.label"
          :value="n.value"
        >
        </v-radio>
      </v-radio-group>
      <v-textarea
        v-model.trim="description"
        ref="description"
        :error-messages="descriptionErrors"
        label="Описание регистрации"
        auto-grow
        hint="В описании укажите Наименование, Производителя, Код производителя. В случае необходимости прикрепите файл с данными полями"
        @input="$v.description.$touch()"
        @blur="$v.description.$touch()"
      ></v-textarea>
      <v-file-input
        v-model="files"
        multiple
        id="test_file_input"
        label="Документы (необязательно)"
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
      <TaskInput v-model="taskId"/>
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
    </div>
  </div>
</template>

<script>
  import { required } from 'vuelidate/lib/validators'
  import { mapGetters, mapActions } from 'vuex'
  import selectObservers from '../../../../mixins/selectObservers'
  import DealInput from '../../DealInput'
  import ProjectInput from '../../ProjectInput'
  import TaskInput from '../../TaskInput'

  export default {
    name: 'RegistrationForm',
    components: { TaskInput, ProjectInput, DealInput },
    mixins: [selectObservers],
    validations: {
      customerName: { required },
      objectName: { required },
      objectAddress: { required },
      projectName: { required },
      quarterNumber: { required },
      description: { required }
    },

    data: () => ({
      customerName: '',
      individualNumber: '',
      objectName: '',
      objectAddress: '',
      projectName: '',
      projectManager: '',
      quarterNumber: '',
      whatCompanyRegistrationSelect: 883,
      whatCompanyRegistrationItems: [
        {
          value: 883,
          label: 'PolyService'
        },
        {
          value: 885,
          label: 'Polymedia'
        }
      ],
      description: '',
      files: [],
      deal: null,
      project: null,
      taskId: '',
      result: '',
      loading: false,
      successSnackbar: false,
      errorSnackbar: false
    }),
    computed: {
      ...mapGetters(['getDeal', 'getTask', 'getGroup']),
      customerNameErrors () {
        const errors = []
        if (!this.$v.customerName.$dirty) return errors
        !this.$v.customerName.required && errors.push('Обязательное поле')
        return errors
      },
      objectNameErrors () {
        const errors = []
        if (!this.$v.objectName.$dirty) return errors
        !this.$v.objectName.required && errors.push('Необходимо указать название объекта')
        return errors
      },
      objectAddressErrors () {
        const errors = []
        if (!this.$v.objectAddress.$dirty) return errors
        !this.$v.objectAddress.required && errors.push('Необходимо указать адрес объекта')
        return errors
      },
      projectNameErrors () {
        const errors = []
        if (!this.$v.projectName.$dirty) return errors
        !this.$v.projectName.required && errors.push('Необходимо указать проект')
        return errors
      },
      quarterNumberErrors () {
        const errors = []
        if (!this.$v.quarterNumber.$dirty) return errors
        !this.$v.quarterNumber.required && errors.push('Необходимо выбрать одно из значений')
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
      ...mapActions(['addRegistrationRequest']),
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
            customerName: this.customerName.title || this.customerName,
            customerId: this.customerName.id,
            individualNumber: this.individualNumber,
            objectName: this.objectName,
            objectAddress: this.objectAddress,
            projectName: this.projectName,
            projectManager: this.projectManager,
            quarterNumber: this.quarterNumber,
            whatCompanyRegistration: this.whatCompanyRegistrationSelect,
            description: this.description,
            files: this.files,
            deal: this.deal,
            taskId: this.taskId,
            observers: this.observers
          }
          const result = await this.addRegistrationRequest(formData)
          this.result = result
          this.loading = false
          if (result.elementId) {
            this.successSnackbar = true
            this.customerName = this.individualNumber = this.objectName = this.objectAddress = this.projectName = this.projectManager = this.quarterNumber = this.taskId = this.description = ''
            this.files = this.observers = []
          } else {
            this.errorSnackbar = true
          }
        }
      }
    }
  }
</script>
