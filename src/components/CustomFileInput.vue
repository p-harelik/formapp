<template>
  <div class="custom-file-input">
    <input
      ref="fileInput"
      type="file"
      multiple
      class="d-none"
      @change="handleFileChange"
    >

    <v-card
        outlined
        class="pa-4 custom-file-input__card"
        @click="triggerFileInput"
        :class="{'has-files': files.length > 0}"
        :ripple="false"
    >
      <div class="d-flex align-center mb-2">
        <v-icon class="mr-2">mdi-paperclip</v-icon>
        <span class="text-subtitle-1">{{ label }}</span>
      </div>

      <div v-if="files.length > 0" class="file-chips mt-2">
        <v-chip
          v-for="(file, index) in files"
          :key="index"
          medium
          class="mr-2 mb-2"
          close
          color="primary"
          @click:close="removeFile(index)"
        >
          {{ file.name }}
        </v-chip>
      </div>

      <div v-else class="text-subtitle-2 text-grey">
        Нажмите, чтобы выбрать файлы
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'CustomFileInput',

  props: {
    value: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: 'Добавить файлы'
    }
  },

  data() {
    return {
      files: []
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.files = newValue || []
      }
    }
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handleFileChange(event) {
      const newFiles = Array.from(event.target.files || [])
      if (newFiles.length) {
        const uniqueNewFiles = newFiles.filter(newFile =>
          !this.files.some(existingFile => existingFile.name === newFile.name)
        )

        const updatedFiles = [...this.files, ...uniqueNewFiles]
        this.updateFiles(updatedFiles)
      }
      event.target.value = ''
    },

    removeFile(index) {
      const updatedFiles = this.files.filter((_, i) => i !== index)
      this.updateFiles(updatedFiles)
    },

    updateFiles(files) {
      this.files = files
      this.$emit('input', files)
      this.$emit('change', files)
    }
  }
}
</script>

<style scoped>
.custom-file-input {
  width: 100%;
}
.custom-file-input__card {
  cursor: pointer;
  min-height: 110px;
  border-color: rgba(0, 0, 0, .38)

}

.file-chips {
  display: flex;
  flex-wrap: wrap;
}
</style>
