<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" md="7">
        <v-combobox
          v-model="contactValue"
          :items="contactItems"
          item-text="fullName"
          label="Контактное лицо"
          prepend-icon="mdi-account"
          :error-messages="contactNameErrors"
          return-object
          @blur="blurContactName"
        >
        </v-combobox>
      </v-col>
      <v-col>
        <v-combobox
          v-model="contactPhoneIn"
          :items="contactValue.phones"
          item-text="phone"
          label="Телефон"
          prepend-icon="mdi-phone"
          :error-messages="contactPhoneErrors"
          @blur="blurContactPhone"
        ></v-combobox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getContacts } from '@/api/BitrixAPI'
import { mapGetters } from 'vuex'

export default {
  name: 'ContactInputSync',
  props: {
    companyId: {
      type: [String, Number],
      default() {
        return 0
      }
    },
    contactName: {
      type: String,
      default() {
        return ''
      }
    },
    contactPhone: {
      type: String,
      default() {
        return ''
      }
    },
    contactNameErrors: {
      type: Array,
      default() {
        return []
      }
    },
    contactPhoneErrors: {
      type: Array,
      default() {
        return []
      }
    },
    blurContactName: {
      type: Function,
      default: () => {}
    },
    blurContactPhone: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      contactValue: {
        id: '',
        fullName: '',
        phones: []
      },
      contactItems: []
    }
  },
  computed: {
    ...mapGetters(['BITRIX_USERS']),
    contactNameIn: {
      get() {
        return this.contactName
      },
      set(newName) {
        this.$emit('contact-changed', newName)
        return newName
      }
    },
    contactPhoneIn: {
      get() {
        return this.contactPhone
      },
      set(newPhone) {
        this.$emit('phone-changed', newPhone)
        return newPhone
      }
    }
  },
  watch: {
    companyId(val) {
      this.contactValue = ''
      if (val === '581') {
        this.contactItems = this.BITRIX_USERS
      } else {
        val && this.getContactItems(val)
      }
    },
    contactValue(val) {
      this.contactNameIn = this.contactValue.fullName || this.contactValue
      this.contactPhoneIn = ''
    }
  },
  methods: {
    async getContactItems(companyId) {
      let contacts = await getContacts(companyId)
      if (contacts?.length) {
        contacts = contacts.map(contact => {
          const res = {
            id: contact.ID,
            fullName: `${contact.LAST_NAME ? contact.LAST_NAME : ''} ${contact.NAME ? contact.NAME : ''} ${contact.SECOND_NAME ? contact.SECOND_NAME : ''}`.trim()
          }
          if (contact.PHONE) {
            res.phones = contact.PHONE.map(phone => phone.VALUE)
          }
          return res
        })
      }
      this.contactItems = contacts
    }
  },
  mounted() {
    this.contactItems = this.BITRIX_USERS
  }
}
</script>
