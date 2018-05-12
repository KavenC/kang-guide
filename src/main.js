// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'onsenui/css/onsenui-core.css'
import './css/onsen-css-components.min.css'
import './css/theme.css'

import Vue from 'vue'
import $ons from 'vue-onsenui/esm'
import * as VOns from './vue-onsen-components'
import App from './App'

import * as firebase from 'firebase'
import {firestore} from './firebase'
import store from './store'

Vue.config.productionTip = false

Vue.use($ons)

Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))
$ons.disableAutoStyling()

// Event Bus
Vue.use({
  install (V) {
    let bus = new Vue()
    V.prototype.$bus = bus
    V.bus = bus
  }
})

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.userLogin(user)
    Vue.bus.$emit('userLogin', {
      user: user
    })

    // check if it is admin user
    firestore.collection('admins').doc(user.uid).get().then(
      snapshot => {
        if (snapshot.exists) {
          store.setAdminUser()
          Vue.bus.$emit('adminLogin', {user})
        }
      })
  } else {
    store.userLogout()
    Vue.bus.$emit('userLogout')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
