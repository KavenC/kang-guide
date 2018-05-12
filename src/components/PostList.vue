<template>
  <base-page>
    <template slot="title">小康美食指南</template>
    <template slot="content">
      <div align="center">
        <v-ons-progress-circular 
           v-if="loading" indeterminate>
        </v-ons-progress-circular>
        <div v-else>
          <v-ons-card v-for="restaurant in restaurants"
                      :key="restaurant.id"
                      @click="showPost(restaurant)">
            <div class="post-title">{{ restaurant.name }}</div>
            <v-ons-list>
              <v-ons-list-item>
                <div class="left">
                  <i class="material-icons">local_dining</i>
                </div>
                <div class="center">
                  <rating :rating="restaurant.rating"></rating>
                </div>
              </v-ons-list-item>
              <v-ons-list-item>
                <div class="left">
                  <i class="material-icons">event</i>
                </div>
                <div class="center">
                  {{ moment(restaurant.last_visit).format('YYYY-MM-DD') }} 
                </div>
              </v-ons-list-item>
              <v-ons-list-item>
                <div class="left">
                  <i class="material-icons">attachment</i>
                </div>
                <div class="center">
                  <tag :item="{tag}" v-for="(_, tag) in restaurant.tags" :key="tag">
                  </tag>
                </div>
              </v-ons-list-item>
            </v-ons-list>
          </v-ons-card>
        </div>
      </div>
    </template>
    <template slot="toolbar-icons">
      <i class="material-icons toolbar-icons" 
         v-if="state.login.admin"
         @click="createPost">
        note_add
      </i>
    </template>
  </base-page>
</template>

<script>
import {firestore} from '../firebase'
import store from '../store'
import BasePage from './BasePage'
import ShowPost from './ShowPost'
import EditPost from './EditPost'
import Tag from './TagComponent'
import Rating from './RatingComponent'

export default {
  created () {
    this.$bus.$on('restaurantUpdate', this.loadPage)
    this.$bus.$emit('restaurantUpdate')
  },
  data () {
    return {
      loading: true,
      restaurants: {},
      showingRestaurant: {},
      showingId: '',
      moment: require('moment'),
      state: store.state
    }
  },
  methods: {
    loadPage () {
      this.loading = true
      this.restaurants = {}
      // Get restaurant lists
      firestore.collection('restaurants').orderBy('last_visit', 'desc')
        .get().then(snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data()
            data.id = doc.id
            data.ref = doc.ref
            this.restaurants[data.id] = data
            if (this.showingId === data.id) {
              Object.assign(this.showingRestaurant, data)
            }
          })
          this.loading = false
        })
    },
    adminLoginCallback () {
      this.addPostIconVisible = true
    },
    logoutCallback () {
      this.addPostIconVisible = false
    },
    showPost (restaurant) {
      this.showingId = restaurant.id
      this.showingRestaurant = this.restaurants[this.showingId]
      this.$emit('push-page', {
        extends: ShowPost,
        onsNavigatorProps: {
          restaurant: this.showingRestaurant
        }
      })
    },
    createPost () {
      this.$emit('push-page', {
        extends: EditPost,
        onsNavigatorProps: {
          mode: 'new'
        }
      })
    }
  },
  components: {
    BasePage,
    Tag,
    Rating
  }
}
</script>

<style>
.post-title {
  font-size: 18px;
  margin: 0 0 6px 0;
  font-weight: 500;
}
ons-progress-circular {
  margin: 32px;
}
.notification {
  padding: 1px 8px 0 8px;
  border-radius: 22px;
  height: 22px;
  font-size: 14px;
  margin: 1px;
}
.list-item__icon {
  font-size: 20px
}
.list-item__left {
  padding: 0 8px 0 0;
  min-width: 20px;
  min-height: 20px;
}
.list-item {
  padding: 0 0 0 2px;
}
.list-item__center {
  padding: 0 6px 0 6px;
  min-height: 40px;
}
</style>
