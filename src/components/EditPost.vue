<template>
  <base-page>
    <template slot="title">{{ title }}</template>
    <template slot="content">
      <v-ons-card>
        <v-ons-list-item modifier="nodivider" v-if="showRestaurant">
          <div class="left">
            <i class="material-icons">home</i>
          </div>
          <div class="center"
            <v-ons-input
              placeholder="餐廳名稱"
              modifier="material"
              v-model="restaurantName"></v-ons-input>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider" v-if="showRestaurant">
          <div class="left">
            <i class="material-icons">local_dining</i>
          </div>
          <div class="center">
            <i class="material-icons" 
               style="color: #ff8577"
               v-for="f in rating.value" 
               :key="f"
               @click="setRating(f)">favorite</i>
            <i class="material-icons" 
               style="color: #ff8577"
               v-for="f in (rating.max-rating.value)"
               :key="f+rating.value"
               @click="setRating(f+rating.value)">favorite_border</i>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider" v-if="showRestaurant">
          <div class="left">
            <i class="material-icons">attachment</i>
          </div>
          <div class="center">
            <tag 
               :item="{tag}"
               v-for="(tag, index) in selectedTags"
               :key="tag"
               @click.native="removeTag(index)"></tag>
            <v-autocomplete 
               :items="autoCompItems" 
               :component-item='autoCompItemTemplate' 
               :min-len="0"
               :auto-select-one-item="false"
               :input-attrs="{type: 'text', class: 'text-input text-input--material tag-search'}"
               :get-label="item => {return ''}"
               :wait="300"
               placeholder="新增標籤"                
               @update-items="updateAutoCompItems"
               @item-selected="addTag"
               @item-clicked="addTag"></v-autocomplete>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider" v-if="showRestaurant">
          <div class="left">
            <i class="material-icons">location_on</i>
          </div>
          <div class="center">
            <v-ons-input placeholder="地址" modifier="material"
                                            v-model="address"></v-ons-input>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider" v-if="showRestaurant">
          <div class="left">
            <i class="material-icons">call</i>
          </div>
          <div class="center">
            <v-ons-input placeholder="聯絡電話" modifier="material"
                                                v-model="phone"></v-ons-input>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider" v-if="showVisit">
          <div class="left">
            <i class="material-icons">event</i>
          </div>
          <div class="center">
            <datepicker
              v-model="date" 
              input-class="text-input text-input--material"
              wrapper-class="datepicker-wrapper"
              :format="dateToString"
              required></datepicker>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider" v-if="showVisit">
          <div class="left">
            <i class="material-icons">insert_comment</i>
          </div>
          <div class="center">
            <textarea class="textarea" rows="8" placeholder="評論" v-model="comment"></textarea>
          </div>
        </v-ons-list-item>
        <v-ons-list-item modifier="nodivider">
          <div class="right">
            <v-ons-button modifier="quiet" @click="publish">發布</v-ons-button>
          </div>
        </v-ons-list-item>
        </v-ons-list>
      </v-ons-card>
      <loading-modal :visible="modalVisible" text="更新中"></loading-modal>
    </template>
  </base-page>
</template>

<script>
import BasePage from './BasePage'
import Datepicker from 'vuejs-datepicker'
import LoadingModal from './LoadingModal'
import Vue from 'vue'
import Autocomplete from 'v-autocomplete'
import 'v-autocomplete/dist/v-autocomplete.css'
import Tag from './TagComponent'
import {firestore} from '../firebase'
import fuzzysearch from 'fuzzysearch'

Vue.use(Autocomplete)
export default {
  props: {
    mode: {required: true},
    restaurant: {required: false},
    visit: {required: false}
  },
  data () {
    return {
      title: '',
      restaurantName: '',
      address: '',
      phone: '',
      rating: {
        value: 1,
        max: 4
      },
      originalTags: [],
      selectedTags: [],
      date: new Date(),
      comment: '',
      showRestaurant: false,
      showVisit: false,
      autoCompItemTemplate: Tag,
      tags: [],
      autoCompItems: [],
      modalVisible: false
    }
  },
  created () {
    firestore.collection('tags').orderBy('count', 'desc')
      .get().then(snapshot => {
        snapshot.forEach(doc => {
          this.tags.push({
            tag: doc.id,
            count: doc.data().count
          })
        })
        this.autoCompItems = this.tags
      })

    if (this.mode === 'new') {
      this.title = '新增餐廳評價'
      this.showRestaurant = true
      this.showVisit = true
    } else if (this.mode === 'editRestaurant') {
      this.title = '編輯餐廳'
      this.restaurantName = this.restaurant.name
      this.address = this.restaurant.address
      this.phone = this.restaurant.phone
      this.rating.value = this.restaurant.rating
      this.originalTags = Object.keys(this.restaurant.tags)
      this.selectedTags = Object.keys(this.restaurant.tags)
      this.showRestaurant = true
    } else if (this.mode === 'editVisit') {
      this.title = '編輯評價'
      this.date = this.visit.date
      this.comment = this.visit.comment
      this.showVisit = true
    } else if (this.mode === 'newVisit') {
      this.title = '新增評價'
      this.showVisit = true
    }
  },
  methods: {
    updateAutoCompItems (text) {
      this.autoCompItems = this.tags.filter(item => {
        return fuzzysearch(text, item.tag)
      })
      if ((this.autoCompItems.length === 1 && this.autoCompItems[0].tags !== text) ||
          this.autoCompItems.length === 0) {
        this.autoCompItems.push({tag: text, count: 'new'})
      }
    },
    addTag (item) {
      this.updateAutoCompItems('')
      if (this.selectedTags.includes(item.tag)) {
        return
      }
      this.selectedTags.push(item.tag)
    },
    removeTag (index) {
      this.selectedTags.splice(index, 1)
    },
    setRating (value) {
      if (value === 1 && this.rating.value === 1) {
        this.rating.value = 0
      } else {
        this.rating.value = value
      }
    },
    dateToString (date) {
      let moment = require('moment')
      return moment(date).format('YYYY-MM-DD')
    },
    stringToDate (dateString) {
      let moment = require('moment')
      console.log(moment(dateString, 'YYYY-MM-DD').toDate())
    },
    publish () {
      this.modalVisible = true
      let restaurantRef
      let postPromise = []

      if (this.mode === 'new' || this.mode === 'editRestaurant') {
        let data = {
          address: this.address,
          last_visit: this.date,
          name: this.restaurantName,
          phone: this.phone,
          rating: this.rating.value,
          tags: {}
        }
        for (let index = 0; index < this.selectedTags.length; index++) {
          data.tags[this.selectedTags[index]] = true
        }

        if (this.mode === 'editRestaurant') {
          restaurantRef = this.restaurant.ref
        } else {
          restaurantRef = firestore.collection('restaurants').doc()
        }

        // TODO: potential un-sync issue
        postPromise.push(restaurantRef.set(data))

        for (let index = 0; index < this.selectedTags.length; index++) {
          let tagRef = firestore.collection('tags').doc(this.selectedTags[index])
          firestore.runTransaction(transaction => {
            return transaction.get(tagRef).then(tagDoc => {
              let data
              if (tagDoc.exists) {
                data = tagDoc.data()
                data.count += 1
              } else {
                data = {count: 1}
              }
              transaction.set(tagRef, data)
            })
          })
        }

        this.$bus.$emit('restaurantUpdate')
      }

      // add visits comment
      if (this.mode === 'new' || this.mode === 'editVisit' || this.mode === 'newVisit') {
        let visitRef
        if (this.mode === 'editVisit') {
          visitRef = this.editing.ref
        } else if (this.mode === 'new') {
          visitRef = restaurantRef.collection('visits').doc()
        } else {
          // newVisit
          visitRef = this.restaurant.ref.collection('visits').doc()
        }

        let data = {
          date: this.date,
          comment: this.comment
        }
        postPromise.push(visitRef.set(data))

        // update last visit field of restaurant
        if (this.mode === 'editVisit' || this.mode === 'newVisit') {
          let visitsRef = this.editing.ref.parent
          visitsRef.orderBy('date', 'desc').limit(1).get().then(snapshot => {
            let data = {
              last_visit: snapshot.docs[0].data().date
            }
            postPromise.push(visitsRef.parent.set(data, {merge: true}))
          })
        }

        this.$bus.$emit('visitUpdate')
      }

      Promise.all(postPromise).then(this.afterPost)
    },
    afterPost () {
      this.modalVisible = false
      this.$bus.$emit('popPage')
    }
  },
  components: {
    BasePage,
    Datepicker,
    Tag,
    LoadingModal
  }
}
</script>

<style>
.v-autocomplete * {
  z-index: 200;
}
.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item.v-autocomplete-item-active {
  background-color: transparent;
}
.v-autocomplete-list-item {
  opacity: 0.75;
}
.v-autocomplete-list-item:hover {
  opacity: 1;
}
.tag-search {
  width: 85px;
}
</style>

<style scoped>
.text-input {
  width: 100%;
}
ons-input {
  width: 100%;
}
textarea {
  width: 100%;
}
.list-item__right {
  padding: 12px 12px 0 0;
}
</style>
