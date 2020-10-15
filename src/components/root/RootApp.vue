<template>
  <b-container fluid id="app" class="px-0">
    <root-header />
    <total-balances :totalVolume='totalVolume'/>

    <div id="screen">
      <b-container>
        <root-sub />
      </b-container>
      <router-view />
    </div>

    <root-footer />
  </b-container>
</template>

<script>
  import { getters, contract as currentContract, changeContract, poolMenu } from '../../contract'
  import init, { onboard, changeWallets } from '../../init'
  import * as volumeStore from '@/components/common/volumeStore'

  import store from '../../store'

  import RootHeader from './RootHeader.vue'
  import RootSub from './RootSub.vue'
  import RootFooter from './RootFooter.vue'
  import TotalBalances from './TotalBalances.vue'

  export default {
    metaInfo: store.metaInfo.getData(),
    components: {
      RootHeader,
      RootSub,
      RootFooter,
      TotalBalances
    },
    computed: {
      ...getters,
      poolMenu() {
        return poolMenu;
      },
      totalVolume() {
				return volumeStore.totalVolume()
      }
    },
    methods: {
      changePools(pool) {
        changeContract(pool)
      },
      async changeAccounts() {
        return onboard.accountSelect();
      }
    },
  }
</script>

<style scoped>

</style>