<template>
  <v-ons-page>
    <v-ons-navigator :options="{animation: 'fade'}"
                     :page-stack="pageStack"
                     @push-page="pageStack.push($event)"
                     @postpush="postPush">
    </v-ons-navigator>
  </v-ons-page>
</template>

<script>
import PostList from './components/PostList'

export default {
  data () {
    return {
      pageStack: [PostList]
    }
  },
  methods: {
    popPage () {
      if (this.pageStack.length > 1) {
        this.pageStack.pop()
      }
    },
    postPush (e) {
      window.history.pushState({ name: e.key }, e.key)
    }
  },
  created () {
    window.onpopstate = this.popPage
    this.$bus.$on('popPage', this.popPage)
  }
}
</script>

<style>
.page {
  font-family: 'Noto Sans TC', sans-serif;
}
.card {
  font-family: inherit;
}
</style>
