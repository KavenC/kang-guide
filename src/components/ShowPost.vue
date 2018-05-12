<template>
  <base-page>
    <template slot="title">{{ restaurant.name }}</template>
    <template slot="content">
      <v-ons-card>
        <v-ons-list>
          <v-ons-list-item>
            <div class="left">
              <i class="material-icons">location_on</i>
            </div>
            <div class="center">
              {{ restaurant.address }}
            </div>
          </v-ons-list-item>
          <v-ons-list-item>
            <div class="left">
              <i class="material-icons">call</i>
            </div>
            <div class="center">
              {{ restaurant.phone }}
            </div>
          </v-ons-list-item>
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
              <i class="material-icons">attachment</i>
            </div>
            <div class="center">
              <tag :item="{tag}" v-for="(_, tag) in restaurant.tags" :key="tag"></tag>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </v-ons-card>
      <div align="center">
        <v-ons-progress-circular 
           v-if="loading" indeterminate>
        </v-ons-progress-circular>
        <v-ons-card v-for="visit in visits" :key="visit.id">
          <v-ons-list>
            <v-ons-list-header>
              <div class="left">
                <div class="visit-date">
                  <i class="material-icons visit-date-icon">event</i>
                  {{ moment(visit.date).format('YYYY-MM-DD') }}
                </div>
              </div>
            </v-ons-list-header>
            <v-ons-list-item modifier="nodivider">
              <p class="context">
                {{ visit.comment }}
              </p>
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-card>
      </div>
    </template>
    <template slot="toolbar-icons">
      <i class="material-icons toolbar-icons" 
        v-if="state.login.admin"
        @click="editRestaurant">edit</i>
      <i class="material-icons toolbar-icons"
        v-if="state.login.admin"
        @click="addVisit">note_add</i>
    </template>
  </base-page>
</template>

<script>
import BasePage from './BasePage'
import EditPost from './EditPost'
import Tag from './TagComponent'
import Rating from './RatingComponent'
import store from '../store'

export default {
  props: {
    restaurant: {required: true}
  },
  created () {
    this.$bus.$on('visitUpdate', this.loadVisits)
    this.$bus.$emit('visitUpdate')
  },
  components: {
    BasePage,
    Tag,
    Rating
  },
  data () {
    return {
      visits: [],
      loading: false,
      moment: require('moment'),
      state: store.state
    }
  },
  methods: {
    loadVisits () {
      this.loading = true
      this.visits = []
      this.restaurant.ref.collection('visits').orderBy('date', 'desc')
        .get().then(snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data()
            data.id = doc.id
            this.visits.push(data)
          })
          this.loading = false
        })
    },
    editRestaurant () {
      this.$emit('push-page', {
        extends: EditPost,
        onsNavigatorProps: {
          mode: 'editRestaurant',
          restaurant: this.restaurant
        }
      })
    },
    addVisit () {
      this.$emit('push-page', {
        extends: EditPost,
        onsNavigatorProps: {
          mode: 'newVisit',
          restaurant: this.restaurant
        }
      })
    }
  }
}
</script>

<style>
.context {
  letter-spacing: 1px;
  line-height: 1.5;
}
.visit-date-icon {
  font-size: 14px;
  vertical-align: sub;
}
</style>
