<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">
        <slot name="title"></slot>
      </div>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="right">
        <div v-if="state.login.valid">
          <slot name="toolbar-icons"></slot>
          <i class="material-icons toolbar-icons"
             @click="login" v-if="!state.login.user">lock_open</i>
          <i class="material-icons toolbar-icons"
             @click="logoutDialogVisible = true" v-else>lock</i>
        </div>
      </div>
    </v-ons-toolbar>
    <v-ons-alert-dialog modifier="rowfooter"
                        :title="'登出'"
                        :footer="{
                          取消: () => logoutDialogVisible = false,
                          確定: logout
                        }"
                        :visible.sync="logoutDialogVisible">
      <div v-if="state.login.user">
      目前登入身份：{{ state.login.user.email }}
      <br>
      確定要登出嗎？
      </div>
    </v-ons-alert-dialog>
    <loading-modal :visible="modalVisible" :text="modalText"></loading-modal>
    <slot name="content"></slot>
  </v-ons-page>
</template>

<script>
import LoadingModal from './LoadingModal'
import * as firebase from 'firebase'
import store from '../store'
import $ons from 'vue-onsenui/esm'

export default {
  data () {
    return {
      state: store.state,
      logoutDialogVisible: false,
      modalVisible: false,
      modalText: ''
    }
  },
  methods: {
    login () {
      this.modalText = '登入中'
      this.modalVisible = true
      var provider = new firebase.auth.GoogleAuthProvider()
      provider.setCustomParameters({
        'prompt': 'select_account'
      })
      firebase.auth().languageCode = 'zh-tw'
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(
        function () {
          firebase.auth().signInWithRedirect(provider)
        })
    },
    postLogout () {
      this.userLogin = false
      this.modalVisible = false
      $ons.notification.toast('登出成功', {timeout: 800, animation: 'lift'})
    },
    logout () {
      this.modalText = '登出中'
      this.modalVisible = true
      this.logoutDialogVisible = false
      firebase.auth().signOut().then(this.postLogout)
        .catch(function (error) {
          console.error(error)
        })
    }
  },
  components: {
    LoadingModal
  }
}
</script>

<style>
.toolbar-icons {
  font-size: 18px;
  margin: 10px 10px 0 0;
}
</style>
