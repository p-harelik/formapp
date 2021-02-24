<template>
  <v-combobox
    v-model="deal"
    ref="deal"
    label="Сделка"
    prepend-icon="mdi-handshake"
    chips
    readonly
    clearable
    :disabled="isDealPlacement"
    :error-messages="errorMessages"
    @click="setDeal"
    @focus="setDeal"
    type="input"
  >
    <template v-slot:selection="{ item }">
      <v-chip
        v-if="item.title"
        :href="`${item.id ? 'https://polyservice.bitrix24.ru/crm/deal/details/' + item.id +'/': ''}`"
        target="_blank"
        @click.native.stop
      >
        {{item.title}}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Bitrix from '../../plugins/Bitrix'

  export default {
    name: 'DealInput',
    model: {
      prop: 'value',
      event: 'valueChange'
    },
    props: {
      value: [Object, null],
      errorMessages: [Array]
    },
    data: () => ({
      isDealPlacement: false
    }),
    computed: {
      ...mapGetters(['getDeal']),
      deal: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('valueChange', value)
        }
      }
    },
    methods: {
      getNumber (string) {
        const regexp = /\d+/g
        return string.match(regexp)[0]
      },
      focus: function () {
        this.$refs.deal.focus()
      },
      async selectDeal () {
        const res = await Bitrix.selectCRM({ entityType: ['deal'] })
        let deal = {}
        for (const item in res.deal) {
          deal = {
            id: this.getNumber(res.deal[item].id),
            title: res.deal[item].title
          }
        }
        return deal
      },
      async setDeal () {
        const deal = await this.selectDeal()
        this.deal = {
          id: deal.id,
          title: deal.title
        }
      }
    },
    created () {
      if (this.getDeal.id) {
        this.deal = this.getDeal
        this.isDealPlacement = true
      }
    }
  }
</script>
