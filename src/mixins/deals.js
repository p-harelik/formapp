import Bitrix from '../plugins/Bitrix'

function getNumber (string) {
  const regexp = /\d+/g
  return string.match(regexp)[0]
}

export default {
  data () {
    return ({
      deal: null,
      isDealPlacement: false,
      isLoadingDeal: false,
      searchDeal: null,
      dealItems: []
    })
  },
  watch: {
    searchDeal () {
      // Items have already been loaded
      if (this.dealItems.length > 0) return

      // Items have already been requested
      if (this.isLoadingDeal) return

      this.isLoadingDeal = true

      // Lazily load input items
      fetch('https://formapp.polyservice.ru/api/deals')
        .then(res => res.json())
        .then(res => {
          this.dealItems = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingDeal = false))
    }
  },
  methods: {
    async selectDeal () {
      const res = await Bitrix.selectCRM({ entityType: ['deal'] })
      console.log('result', res)
      for (const item in res.deal) {
        this.deal = {
          id: getNumber(res.deal[item].id),
          title: res.deal[item].title
        }
      }
    }
  }
}
