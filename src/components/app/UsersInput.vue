<template>
  <v-combobox
    v-model="users"
    :label=label
    prepend-icon="mdi-account-group"
    @click="changeUsers"
    readonly
    multiple
    :error-messages="errorMessages"
    ref="users"
  >
    <template v-slot:selection="{ item }">
      <v-chip>
        <v-avatar left v-if="item.photo">
          <img :src="item.photo" alt="">
        </v-avatar>
        {{item.name}}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
  import Bitrix from '../../plugins/Bitrix'

  export default {
    name: 'UsersInput',
    model: {
      prop: 'value',
      event: 'valueChange'
    },
    props: {
      value: [Array, null],
      label: {
        type: String,
        default: 'Сотрудники'
      },
      errorMessages: Array
    },
    computed: {
      users: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('valueChange', value)
        }
      }
    },
    methods: {
      focus: function () {
        this.$refs.users.focus()
      },
      async changeUsers() {
        const users = await Bitrix.selectUsers()
        if (users.length) {
          this.users = users.map(user => ({
            id: user.id,
            name: user.name,
            photo: user.photo
          }))
        }
      },
      removeUser(id) {
        this.users = this.users.filter(user => user.id !== id)
      }
    }
  }
</script>

<style scoped>

</style>
