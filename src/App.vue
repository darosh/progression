<template>
  <router-view />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App'
})
</script>
<style>
html .v-application *, html .v-application .title, html .v-application svg * {
  font-family: "M PLUS Rounded 1c", sans-serif !important;
}

html .v-application .title {
  opacity: 0.6;
  font-size: 22px !important;
}
</style>
