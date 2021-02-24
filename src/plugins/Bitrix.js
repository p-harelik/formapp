export default {
  callMethod (method, params) {
    return new Promise((resolve, reject) => {
      window.BX24.callMethod(method, params, (res) => {
        if (res.error()) {
          reject(res.error())
        } else {
          resolve(res.data())
        }
      })
    })
  },

  callBatch (object, bHaltOnError = false) {
    return new Promise((resolve, reject) => {
      window.BX24.callBatch(object, (res) => {}, bHaltOnError)
    })
  },

  selectUsers (callback) {
    return new Promise(resolve => {
        window.BX24.selectUsers((res) => {
          resolve(res)
        })
    })
  },
  selectUser (callback) {
    return new Promise(resolve => {
        window.BX24.selectUser((res) => {
          resolve(res)
        })
    })
  },
  сurrentUser () {
    return new Promise(resolve => {
      window.BX24.init(() => {
        window.BX24.callMethod('user.current', {}, (res) => {
          resolve(res)
        })
      })
    })
  },

  selectCRM (params) {
  return new Promise(resolve => {
    window.BX24.init(() => {
      window.BX24.selectCRM(params, (res) => {
        console.log(res, 'из функции')
        resolve(res)
      })
    })
  })
  },

  select (params, callback) {
    return window.BX24.selectCRM(params, callback)
  },

  toBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.replace(/^data:.+;base64,/, ''))
      reader.onerror = error => reject(error)
    })
  },

  fitWindow () {
    const iframeSizes = window.BX24.getScrollSize()
    window.BX24.fitWindow(() => {
      window.BX24.resizeWindow(iframeSizes.scrollWidth, iframeSizes.scrollHeight + 500, function () {
      })
    })
  },

  async loadFiles (data) {
    const files = data
    const addFilesResult = []
    const attachFiles = {
      n0: []
    }
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const fileBase64 = await this.toBase64(files[i])
        const fileInfo = await this.callMethod('disk.folder.uploadfile', {
          id: 320939,
          data: {
            NAME: Date.now() + '_' + files[i].name
          },
          fileContent: [files[i].name, fileBase64]
        })
        addFilesResult.push(fileInfo)
      }
    }
    addFilesResult.forEach((item, index) => {
      attachFiles.n0.push('n' + item.ID)
    })
    return attachFiles
  }
}
