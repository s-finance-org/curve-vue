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

      <div class="box mt-5 mb-4 px-4" v-for="(item, i) of notices" :key="'notice-'+ i">
        <h4 class="my-3 pb-3 line-bottom d-flex flex-wrap align-items-end">
          <span class="mr-auto" v-html="$t(item.title)"></span>
          <small class="text-black-65">{{ $t(item.date) }}</small>
        </h4>
        <p class="text-black-65" v-html="$t(item.cont)"></p>
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
      notices () {
        return [
          { title: 'statement.noticeTitleHtml', date: 'statement.noticeDateHtml', cont: 'statement.noticeContHtml' },
          { title: 'statemented.notice2.titleHtml', date: 'statemented.notice2.dateHtml', cont: 'statemented.notice2.contHtml' },
          { title: 'statemented.notice1.titleHtml', date: 'statemented.notice1.dateHtml', cont: 'statemented.notice1.contHtml' }
        ]
      }
    },
  }
</script>

<style scoped>
</style>