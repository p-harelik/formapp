<template>
  <v-container>
    <h1 class="ma-5 display-1">Отдел логистики</h1>
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
          :to="{name: 'LogisticsFormItem', params: {formid:item.url, title:item.title}}"
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
    name: 'LogisticsDepFormList',
    data: () => ({
      items: [
        {
          title: 'Доставка документов',
          url: 'sending-documents',
          img: './img/folder-and-files.svg'
        },
        {
          title: 'Доставка оборудования',
          url: 'delivery-equipment',
          img: './img/delivery-box.svg'
        },
        {
          title: 'Заказ грузчиков',
          url: 'workers',
          img: './img/loader.svg'
        }
        // {
        //   title: 'Расчет логистики',
        //   url: 'sending-documents',
        //   img: './img/delivery.svg'
        // },
        // {
        //   title: 'Заказ такси',
        //   url: 'sending-documents',
        //   img: './img/taxi.svg'
        // }
      ]
    })

  }
</script>

<style scoped>

</style>
