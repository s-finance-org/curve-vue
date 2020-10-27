<template>
	<div>
    <div class="total-bg">
      <b-container class="d-flex py-4  align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">{{ $t('global.sFinance') }}<br/>{{ $t('global.announcements') }}</h3>
      </b-container>
    </div>

    <b-container>
      <root-sub />

      <div class="box mt-5 mb-4 px-4" v-for="(item, i) of notices" :key="'notice-'+ i">
        <h4 class="my-3 pb-3 line-bottom d-flex flex-wrap align-items-end">
          <span class="mr-auto" v-html="item[$i18n.locale].title"></span>
          <small class="text-black-65">{{ item[$i18n.locale].createAt }}</small>
        </h4>
        <p class="text-black-65" v-html="item[$i18n.locale].content"></p>
      </div>
    </b-container>
  </div>
</template>

<script>
  import { getters } from '../contract'
  import RootSub from '../components/root/RootSub.vue'
  import store from '../store'

  export default {
    components: {
      RootSub
    },
    computed: {
      ...getters,
      notices () {
        const { $i18n } = this
        const { notices } = store.announcement

        return notices
      }
    },
  }
</script>

<style scoped>
</style>