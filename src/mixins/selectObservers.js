import Bitrix from '../plugins/Bitrix'

export default {
  data: () => ({
    observers: []
  }),
  methods: {
    async addObserver() {
      const observers = await Bitrix.selectUsers()
      if (observers[0]) {
        this.observers = this.observers.concat(observers)
      }
      console.log(this.observers)
    },
    // addObserver() {
    //   window.BX24.selectUsers((res) => {
    //     if (res[0]) {
    //       this.observers = this.observers.concat(res)
    //     }
    //     console.log(this.observers)
    //   })
    // },
    removeObserver(id) {
      this.observers = this.observers.filter(observer => observer.id !== id)
    }
  }
}
