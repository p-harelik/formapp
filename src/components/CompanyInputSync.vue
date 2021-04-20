<template>
  <div>
    <v-combobox
      v-model="companyValue"
      :label="label"
      :items="COMPANIES"
      item-text="title"
      prepend-icon="mdi-city-variant"
      :error-messages="errorMessages"
      clearable
      ref="company"
      @blur="blur"
    >
      <template v-slot:selection="{ item }">
        <v-chip
          v-if="item.title"
          :href="`${item.id ? 'https://polyservice.bitrix24.ru/crm/company/details/' + item.id +'/': ''}`"
          target="_blank"
          @click.native.stop=""
        >
          <v-avatar
            v-if="item.logoURL"
            left
            rounded
            tile
          >
            <v-img
              :src="item.logoURL"
              contain
            >
            </v-img>
          </v-avatar>
          {{ item.title }}
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          rounded
          tile
        >
          <v-img
            :src="item.logoURL"
            contain
          >
          </v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </template>
    </v-combobox>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CompanyInputSync',
  props: {
    value: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    label: {
      type: String,
      default() {
        return 'Компания'
      }
    },
    errorMessages: {
      type: Array,
      default() {
        return []
      }
    },
    blur: {
      type: Function,
      default: () => {}
    }
  },
  model: {
    prop: 'value',
    event: 'valueChange'
  },
  computed: {
    ...mapGetters(['COMPANIES']),
    companyValue: {
      get() {
        return this.value
      },
      set(newCompany) {
        const company = {
          id: newCompany?.id || '',
          title: newCompany?.title || newCompany,
          logoURL: newCompany?.logoURL || '',
          address: newCompany?.address || ''
        }
        this.$emit('valueChange', company)
        return company
      }
    }
  },
  methods: {
    focus: function () {
      this.$refs.company.focus()
    }
  }
}
</script>
