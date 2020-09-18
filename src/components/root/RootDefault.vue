<template>
  <b-container fluid id="app" class="px-0">
    <root-header />
    <router-view />
    <root-footer />
  </b-container>
</template>

<script>
  import { getters, contract as currentContract } from '../../contract'
  import init, { onboard } from '../../init'
  import * as volumeStore from '@/components/common/volumeStore'

  import store from '../../store'

  import RootHeader from './RootHeader.vue'
  import RootFooter from './RootFooter.vue'

  export default {
    metaInfo: store.metaInfo.getData(),
    components: {
      RootHeader,
      RootFooter,
    },
    computed: {
      ...getters
    },
    methods: {
    },
  }
</script>

<style scoped>

</style>