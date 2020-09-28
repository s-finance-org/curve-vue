<template>
	<div>
    <div class="total-bg">
      <b-container class="d-flex py-4 total-cont align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">{{ $t('global.sFinance') }}<br/>{{ $t('global.statemented') }}</h3>
      </b-container>
    </div>

    <b-container>
      <root-sub />

      <div class="box mt-5 mb-4 px-4">
        <h4 class="my-3 line-bottom" v-html="$t('statement.noticeTitleHtml')"></h4>
        <p class="text-black-65" v-html="$t('statement.noticeContHtml')"></p>
      </div>
    </b-container>
  </div>
</template>

<script>
  import { getters } from '../contract'
  import RootSub from '../components/root/RootSub.vue'

  export default {
    components: {
      RootSub
    },
    computed: {
      ...getters,
    },
  }
</script>

<style scoped>
</style>