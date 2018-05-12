<template>
  <div>
    <span class="notification notification--material">
      {{ item.tag }}
      <span class="notification notification--material notification--sub" v-if="item.count">
        {{ item.count }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    item: {required: true}
  }
}
</script>

<style>
.notification {
  background-color: var(--highlight-color);
}
.notification--sub {
  background-color: rgba(255, 255, 255, 0.4);
  font-size: 80%;
  padding: 0;
  margin: 2px 0px 0px 2px;
  height: 16px;
  border-radius: 8px;
  line-height: 15px;
}
</style>
