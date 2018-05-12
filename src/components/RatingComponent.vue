<template>
  <div class="rating">
    <i class="material-icons"
       style="color: #ff8577"
       v-for="n in rating" :key="n">
      favorite
    </i>
    <i class="material-icons"
       style="color: #ff8577"
       v-for="n in (maxRating - rating)" :key="(rating+n)">
      favorite_border
    </i>
  </div>
</template>

<script>
export default {
  props: {
    rating: {required: true}
  },
  data () {
    return {
      maxRating: 4
    }
  }
}
</script>

<style>
.rating {
  word-spacing: -4px;
}
</style>
