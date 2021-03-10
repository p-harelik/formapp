<template>
    <v-container>
      <h1 class="ma-5 display-1">Отдел закупок Полисервис</h1>
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
            :to="{name: 'PurchasesFormItem', params: {formid:item.url, title:item.title}}"
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
    name: 'PurchasesDepFormsList',
    data: () => ({
      items: [
        {
          title: 'Закупка',
          url: 'purchase',
          img: './img/shop.svg'
        },
        {
          title: 'Запрос цен',
          url: 'request-for-prices',
          img: './img/tag.svg'
        },
        {
          title: 'Регистрация под проект',
          url: 'registration',
          img: './img/briefing.svg'
        }
      ]
    })
  }
</script>

<style scoped>
.op {
  color: rgba(255, 0, 0, 0.5);
}
</style>
