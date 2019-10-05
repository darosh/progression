<template>
  <!--  <router-view />-->
  <x-home />
</template>

<script>
import XHome from './views/Home'

export default {
  components: { XHome }
}
</script>
<style>
html {
  overflow-y: auto !important;
  user-select: none;
}

html .v-application *, html .v-application .title, html .v-application svg * {
  font-family: "M PLUS Rounded 1c", sans-serif !important;
}

html .v-application .title {
  opacity: 0.6;
  font-size: 22px !important;
}
</style>
