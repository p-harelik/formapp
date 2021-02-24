<template>
  <v-combobox
    v-if="isProjectPlacement"
    v-model="project"
    label="Проект (группа)"
    prepend-icon="mdi-file-cad"
    disabled
  >
    <template v-slot:selection="{ item }">
      <v-chip v-if="item.title">
        {{item.title}}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'ProjectInput',
    model: {
      prop: 'value',
      event: 'valueChange'
    },
    props: {
      value: [Object, null]
    },
    data: () => ({
      isProjectPlacement: false
    }),
    computed: {
      ...mapGetters(['getGroup']),
      project: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('valueChange', value)
        }
      }
    },
    created () {
      if (this.getGroup.id) {
        this.project = this.getGroup
        this.isProjectPlacement = true
      }
    }
  }
</script>
