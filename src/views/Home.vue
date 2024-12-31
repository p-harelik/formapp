<template>
  <v-container>
    <h1>Формы заявок <sup class="text-subtitle-1">(beta)</sup></h1>
    <p>Добро пожаловать в формы заявок! Здесь вы сможете оставить заявки в различные отделы компании.<br>
    В данное время ведется внедрение различных форм обращений.
    </p>
    <hr><br>
    <p>Вы можете направлять пожелания по расширению функционала своему руководителю</p>
    <p class="font-weight-medium">Замечания, пожелания и предложения по работе приложения можете оставить в форме обратной связи</p>
    <iframe id="inlineFrameExample"
            title="Inline Frame Example"
            width="100%"
            height="650"
            frameborder="0"
            src="https://b24-gptytd.bitrix24.site/crm_form5/">
    </iframe>

  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Home',
    computed: {
      ...mapGetters(['getGroup'])
    }
  }
</script>

<style lang="scss" scoped>

</style>
