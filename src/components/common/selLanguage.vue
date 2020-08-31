<template>
  <select v-model="$i18n.locale">
    <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
  </select>
</template>

<script>
	import Vue from 'vue'

  export default {
	  data: () => ({
      langs: ['zh-CN', 'en-US']
    })
  }
</script>