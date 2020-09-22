<template>
  <select v-model="locale">
    <option v-for="(lang, i) in supportLanguage" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
  </select>
</template>

<script>
  import Vue from 'vue'
  import store from '../../store'

  export default {
	  data: () => ({
      supportLanguage: store.i18n.supportLanguage,
      locale: ''
    }),
    mounted () {
      this.locale = this.$i18n.locale
    },
    watch: {
      locale (val) {
        store.i18n.locale = val
        this.$i18n.locale = val
      }
    }
  }
</script>