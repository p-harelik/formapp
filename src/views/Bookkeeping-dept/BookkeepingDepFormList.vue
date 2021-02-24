<template>
  <v-container>
    <h1 class="ma-5 display-1">Бухгалтерия</h1>
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
          :to="{name: 'BookkeepingFormItem', params: { formid:item.url, title:item.title }}"
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
    name: 'BookkeepingDepFormList',
    data: () => ({
      items: [
        {
          title: 'Выдача денежных средств под отчет',
          url: 'issuance-of-funds',
          img: './img/payment-method.svg'
        },
        {
          title: 'Компенсация расходов',
          url: 'compensation',
          img: './img/compensation.svg'
        },
        {
          title: 'Оформление командировки',
          url: 'business-trip',
          img: './img/business-trip.svg'
        },
        {
          title: 'Оформление отсутствия',
          url: 'absent',
          img: './img/house.svg'
        },
        {
          title: 'Оформление отпуска',
          url: 'vacation',
          img: './img/sunbed.svg'
        },
        {
          title: 'Оплата счетов',
          url: 'payment',
          img: './img/bill.svg'
        },
        {
          title: 'Оформление нового сотрудника',
          url: 'new-employee',
          img: './img/worker.svg'
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
