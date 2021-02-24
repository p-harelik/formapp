import Bitrix from '../plugins/Bitrix'

function getNumber (string) {
  const regexp = /\d+/g
  return string.match(regexp)[0]
}

export default {
  data: () => ({
    deals: []
  }),
  methods: {
    async selectDeal () {
      const res = await Bitrix.selectCRM({ entityType: ['deal'] })
      for (const item in res.deal) {
        this.deals = [{
          ID: getNumber(res.deal[item].id),
          TITLE: res.deal[item].title
        }]
      }
    },
    selectCompany: async function () {
      const res = await Bitrix.selectCRM({ entityType: ['company'] })
      const company = []
      for (const item in res.company) {
        return [{
          ID: getNumber(res.company[item].id),
          TITLE: res.company[item].title,
          IMG: res.company[item].image
        }]
      }
      return company
    },
    removeDeal (id) {
      console.log(this.deals)
      this.deals = this.deals.filter(deal => deal.ID !== id)
    }
  }
}
