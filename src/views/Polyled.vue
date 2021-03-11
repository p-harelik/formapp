<template>
<div>
  <h1 class="ma-5 display-1">Расчет PolyLED</h1>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-step
        :complete="currentStep > 1"
        step="1"
      >
        Информация по проекту
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
        :complete="currentStep > 2"
        step="2"
      >
        Регистрация проекта
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
        :complete="currentStep > 3"
        step="3">
        Информация об экране
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
        step="4">
        Дополнительная информация
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <form>
      <v-stepper-content step="1">
        <v-card class="mb-12">
          <v-card-text>
            <v-text-field
              v-model="projectName"
              label="Название и номер проекта из 1С (+тип объекта)"
              hint="Для идентификации внутри компании. Например, Мультифункциональный зал_Альфабанк AV190493."
            ></v-text-field>
            <v-text-field
              v-model="gip"
              label="Кто составил?(ГИП?) "
              hint="Пример: Матов Ю.В."
            ></v-text-field>
            <v-text-field
              v-model="projectManager"
              label="Менеджер проекта"
              hint="Пример: Князева М.А."
            ></v-text-field>
            <v-radio-group
              v-model="isRegistrationRequired"
              column
              mandatory
            >
              <template v-slot:label>
                <div>Потребуется ли регистрация сейчас?</div>
              </template>
              <v-radio label="Да" :value="true"></v-radio>
              <v-radio label="Нет" :value="false"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>
        <v-btn
          color="primary"
          @click="isRegistrationRequired ? currentStep = 2 : currentStep = 3"
        >
          Далее
        </v-btn>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card
          class="mb-12"
        >
          <v-card-text>
            <v-text-field
              v-model="project"
              label="Полное наименование проекта (объекта) (необязательно)"
              hint="Без аббревиатур"
            ></v-text-field>
            <v-text-field
              v-model="customer"
              label="Заказчик (необязательно)"
              hint="Без аббревиатур"
            ></v-text-field>
            <v-text-field
              v-model="installationAddress"
              label="Адрес инсталляции (необязательно)"
              hint="Индекс, Населенный пункт, Улица, Дом"
            ></v-text-field>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="implementationDateText"
                      label="Дата реализации"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="implementationDate"
                    :min="new Date().toISOString().substr(0, 10)"
                    locale="ru"
                    first-day-of-week="1"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-radio-group
              v-model="whoseProject"
              column
              mandatory
            >
              <template v-slot:label>
                <div>Чей проект?</div>
              </template>
              <v-radio
                v-for="n in whoseProjectItems"
                :key="n.value"
                :label="n.label"
                :value="n.value"
              >
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <v-btn
          color="primary"
          @click="currentStep = 3"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="currentStep = 4"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="currentStep = 1"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
      </form>
    </v-stepper-items>
  </v-stepper>
</div>
</template>

<script>
export default {
  name: 'Polyled',
  data: () => ({
    currentStep: 1,

    projectName: '',
    gip: '',
    projectManager: '',
    isRegistrationRequired: false,

    project: null,
    customer: '',
    installationAddress: '',
    implementationDate: '',
    menu1: false,
    whoseProject: '',
    whoseProjectItems: [
      {
        value: 1,
        label: 'Полимедиа'
      },
      {
        value: 2,
        label: 'Дилер'
      }
    ]
  }),
  computed: {
    implementationDateText () {
      return this.implementationDate.split('-').reverse().join('-')
    }
  }
}
</script>

<style scoped>

</style>
