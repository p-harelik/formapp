import Vue from 'vue'

Vue.filter('trimExtraSymbols', value => {
  if (value.length > 40) {
    return value.slice(0, 40) + '...'
  }
  return value
})
