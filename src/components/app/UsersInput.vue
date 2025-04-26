<template>
  <v-autocomplete
    v-model="users"
    :label=label
    prepend-icon="mdi-account-group"
    outlined
    :items="formattedItems"
    item-value="ID"
    item-text="fullName"
    :filter="customFilter"
    multiple
    :error-messages="errorMessages"
    ref="users"
    no-data-text="Пользователь не найден"
    return-object
    :search-input.sync="search"
    @change="search = ''"
  >
    <template v-slot:selection="{ item, parent }">
      <v-chip>
        <v-avatar
        v-if="item.PERSONAL_PHOTO"
        left>
          <img :src="item.PERSONAL_PHOTO" alt="">
        </v-avatar>
        {{item.LAST_NAME}} {{item.NAME}}
        <v-icon
            small
            @click.stop="parent.selectItem(item)"
          >
            $delete
          </v-icon>
      </v-chip>
    </template>

    <template v-slot:item="{index, item }">
        <div class="user-input__item">
          <div class="user-input__item-row">
            <v-avatar
             v-if="item.PERSONAL_PHOTO"
             size="36px"
             >
              <img
              class="user-input__item-avatar-image"
              :src="item.PERSONAL_PHOTO"
              alt="avatar"
              >
            </v-avatar>
            <span class="user-input">{{item.LAST_NAME}} {{item.NAME}}</span>
          </div>
          <div
          v-if="item.UF_USR_1739181812002?.length"
          class="user-input__item-row">
            <v-chip
            class="user-input__item-skill"
            v-for="skill in item.UF_USR_1739181812002.flat(Infinity).toString().split(',')"
            :key="skill"
            >
            {{skill}}
            </v-chip>
          </div>

        </div>
      </template>
  </v-autocomplete>
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
    async created() {
      this.items = await Bitrix.getList({
        method: 'user.get',
        params: {
          ORDER: 'ASC',
          SORT: 'LAST_NAME',
          FILTER: {
            ACTIVE: true
          }
        }
      })
    },
    computed: {
      users: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('valueChange', value)
        }
      },
      formattedItems() {
        return this.items.map(item => ({
          ...item,
          fullName: `${item.LAST_NAME} ${item.NAME}`,
          id: item.ID
        }))
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
      },
      customFilter(item, queryText) {
        const searchText = queryText.toLowerCase()
        const fullName = `${item.LAST_NAME} ${item.NAME}`.toLowerCase()
        const skills = Array.isArray(item.UF_USR_1739181812002)
          ? item.UF_USR_1739181812002.flat(Infinity).toString().toLowerCase()
          : ''

        return fullName.includes(searchText) || skills.includes(searchText)
      }
    },
    data: () => ({
      items: [],
      search: ''
    })
  }
</script>

<style lang="scss">
.user-input__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
}
.user-input__item-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.user-input__item-avatar-image {
  width: 100%;
  height: auto;
}

.user-input__item-skill {
  cursor: pointer;
}

</style>
