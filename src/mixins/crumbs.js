export default {
  data: () => ({
    crumbs: []
  }),
  methods: {
    updateCrumbs() {
      let crumbs = [{
        text: 'Главная',
        to: '/'
      }]
      crumbs = crumbs.concat(this.$route.meta.breadcrumb)
      crumbs.push({ text: this.title, disabled: true })
      this.crumbs = crumbs
    }
  }
}
