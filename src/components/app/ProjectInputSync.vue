<template>
  <div>
    <v-autocomplete
      v-model="projectValue"
      label="Проект"
      placeholder="Начните вводить название"
      :items="projectItems"
      item-text="NAME"
      hide-no-data
      :loading="isLoadingProject"
      :search-input.sync="searchProject"
      return-object
      @change="$emit('valueChange', $event)"
    >
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar>
            <img :src="data.item.IMAGE|| '/img/project.svg'">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ data.item.NAME }}</v-list-item-title>
            <v-list-item-subtitle>{{ `${data.item.NUMBER_OF_MEMBERS} участников` }}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import Bitrix from '../../plugins/Bitrix'
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectInputSync',
  model: {
    prop: 'value',
    event: 'valueChange'
  },
  props: ['value'],
  data: () => ({
    projectValue: null,
    projectItems: [],
    searchProject: null,
    isLoadingProject: false
  }),
  watch: {
    searchProject (val) {
      // Items have already been loaded
      if (this.projectItems.length > 0) return

      // Items have already been requested
      if (this.isLoadingProject) return
      this.isLoadingProject = true
      const request = {
        method: 'sonet_group.get',
        params: {
          ORDER: {
            NAME: 'ASC'
          },
          IS_ADMIN: 'Y'
        }
      }
      Bitrix.getList(request).then(res => {
        console.log(res)
        this.projectItems = res
        this.isLoadingProject = false
      })
      // this.projectItems = [
      //   {
      //     ID: 1263,
      //     NAME: '140030 Брянскэнерго 1ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 6,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 1262,
      //     NAME: '140012 Брянскэнерго 2ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 4,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 1264,
      //     NAME: '1400312 Брянскэнерго 3ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 121241264,
      //     NAME: '1400312 Брянскэнерго 4ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 1223164,
      //     NAME: '1400312 Брянскэнерго 233ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 124164,
      //     NAME: '1400312 Брянскэнергasо 3ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 121264,
      //     NAME: '1400312 Брянскэнерasdго 3ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 12364,
      //     NAME: '1400312 Брянскэнерasdго 3ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 1212364,
      //     NAME: '1400312 Брянскэнadерго 3ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   },
      //   {
      //     ID: 12624,
      //     NAME: '1400312 Брянскэнasdерго 3ЦУС Хрущ ПС',
      //     NUMBER_OF_MEMBERS: 3,
      //     avatar: 'https://pngicon.ru/file/uploads/gory.png'
      //   }
      // ]
      // this.isLoadingProject = false
    }
  },
  computed: {
    ...mapGetters(['getGroup'])
  },
  created () {
    if (this.getGroup.id) {
      this.projectValue = {
        ID: this.getGroup.id,
        NAME: this.getGroup.title
      }
      this.searchProject = this.getGroup.title
      this.$emit('valueChange', this.projectValue)
    }
  }
}
</script>
