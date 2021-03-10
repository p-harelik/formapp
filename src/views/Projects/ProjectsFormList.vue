<template>
  <v-container>
    <h1 class="ma-5 display-1">Реализация проектов</h1>
    <v-row dense>
      <v-col
        v-for="item in items"
        :key="item.title"
        cols="12"
        xs="12"
        sm="6"
        md="4"
      >
        <v-card
          :to="{name: 'ProjectsFormItem', params: { formid:item.url, title:item.title }}"
          :title="item.title"
          hover
          height="100%"
          class="pt-5"
        >
          <v-img
            :src="item.img"
            height="110px"
            contain
            class="opaсity"
          >
          </v-img>
          <v-card-title class="py-8">
            <h3 class="black--text">{{item.title}}</h3>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ProjectFormsList',
    data: () => ({
      items: [
        {
          title: 'Запрос ресурсов',
          url: 'request-resource',
          img: './img/human-resources.svg'
        },
        {
          title: 'Расходные материалы',
          url: 'consumables',
          img: './img/consumer-research.svg'
        }
      ]
    })

  }
</script>

<style scoped>

</style>
