import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  data() {
    return ({
      isLoadingCompany: false,
      searchCompany: null,
      companyItems: []
    })
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    searchCompany (val) {
      // Items have already been loaded
      if (this.companyItems.length > 0) return

      // Items have already been requested
      if (this.isLoadingCompany) return

      this.isLoadingCompany = true
      const config = {
        params: {
          authData: {
            member_id: this.getUser.auth.member_id
          }
        }
      }
      axios.get('https://formapp.polyservice.ru/api/company', config)
        .then(res => {
          this.companyItems = res.data.map((company) => {
            return {
              id: company.ID,
              title: company.TITLE,
              address: company.ADDRESS,
              logoURL: company.LOGO_URL
            }
          })
        })
        .catch(err => console.log(err))
        .finally(() => (this.isLoadingCompany = false))

      // Lazily load input items
      // fetch('https://formapp.polyservice.ru/api/company')
      //   .then(res => res.json())
      //   .then(res => {
      //     this.companyItems = res.map((company) => {
      //       return {
      //         id: company.ID,
      //         title: company.TITLE,
      //         address: company.ADDRESS,
      //         logoURL: company.LOGO_URL
      //       }
      //     })
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
      //   .finally(() => (this.isLoadingCompany = false))
    }
  }
}
