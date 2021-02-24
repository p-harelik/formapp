<template>
  <v-combobox
    v-model="user"
    label="Сотрудник"
    prepend-icon="mdi-account"
    @click="changeUser"
    readonly
    :error-messages="errorMessages"
  >
    <template v-slot:selection="{ item }">
      <v-chip v-if="item.id">
        <v-avatar left v-if="item.photo">
          <img :src="item.photo" alt="">
        </v-avatar>
        {{item.name}}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Bitrix from '../../plugins/Bitrix'

  export default {
    name: 'UserInput',
    model: {
      prop: 'value',
      event: 'valueChange'
    },
    props: {
      value: [Object, null],
      errorMessages: Array
    },
    computed: {
      ...mapGetters(['getUser']),
      user: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('valueChange', value)
        }
      }
    },
    methods: {
      async changeUser() {
        const user = await Bitrix.selectUser()
        if (user) {
          this.user = {
            id: user.id,
            name: user.name,
            photo: user.photo
          }
        }
      }
    },
    created () {
      if (this.getUser.id) {
        this.user = {
          id: this.getUser.id,
          name: `${this.getUser.lastName} ${this.getUser.name}`,
          photo: this.getUser.photo
        }
      }
    }
  }
</script>
