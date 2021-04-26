<template>
  <div>
    <v-autocomplete
      v-model="dealValue"
      :label="title"
      placeholder="Начните вводить название сделки или id"
      prepend-icon="mdi-handshake"
      :items="DEALS"
      item-text="title"
      return-object
      :filter="customFilter"
      hide-no-data
      chips
      clearable
      cache-items
      :error-messages="errorMessages"
      @change="$emit('valueChange', $event)"
    >
      <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
            <v-list-item-subtitle>{{item.categoryName}}</v-list-item-subtitle>
          </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DealInputSync',
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    title: {
      type: String,
      default: 'Сделка'
    },
    errorMessages: {
      type: Array,
      default() {
        return []
      }
    }
  },
  model: {
    prop: 'value',
    event: 'valueChange'
  },
  computed: {
    ...mapGetters([
      'DEALS',
      'getDeal'
    ]),
    dealValue: {
      get() {
        return this.value
      },
      set(newDeal) {
        const deal = {
          id: newDeal.id,
          title: newDeal.title,
          buyerOrder: newDeal.buyerOrder
        }
        this.$emit('valueChange', deal)
        return deal
      }
    }
  },
  methods: {
    customFilter(item, queryText, itemText) {
      return itemText.toLowerCase().indexOf(queryText.toLowerCase()) > -1 || item.id === queryText
    }
  },
  created() {
    if (this.getDeal.id) {
      this.dealValue = this.getDeal
    }
  }
}
</script>
