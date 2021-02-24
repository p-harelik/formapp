<template>
  <v-text-field
    type="number"
    min="1"
    v-model="taskId"
    prefix="№"
    label="Сделать подзадачей к задаче"
    hint="Будет добавлено в виде подзадачи к указанной задаче"
  ></v-text-field>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'TaskInput',
    model: {
      prop: 'value',
      event: 'valueChange'
    },
    props: {
      value: [Number, String]
    },
    computed: {
      ...mapGetters(['getTask']),
      taskId: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('valueChange', value)
        }
      }
    },
    created () {
      this.taskId = this.getTask.id
    }
  }
</script>

<style scoped>

</style>
