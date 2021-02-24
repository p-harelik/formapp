import Bitrix from '../plugins/Bitrix'

export default {
  data: () => ({
    user: {
      id: 139,
      name: 'Павел Гарелик'
    }
  }),
  methods: {
    async updateUser() {
      const user = await Bitrix.selectUser()
      if (user) {
        this.user = {
          id: user.id,
          name: user.name,
          photo: user.photo
        }
      }
      console.log(user)
      // console.log('sdsd')
    }
  }
}
