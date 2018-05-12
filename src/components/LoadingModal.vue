<template>
  <div>
    <v-ons-modal :visible="visible">
      <v-ons-progress-circular indeterminate></v-ons-progress-circular>
      <br>
      {{ text }}
    </v-ons-modal>
  </div>
</template>

<script>
export default {
  props: {
    visible: {required: true},
    text: {required: false, default: ''}
  }
}
</script>
