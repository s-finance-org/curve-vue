<template>
  <div>
    <div v-if='errMsg'>
      {{ errMsg }}
    </div>
    <div class='mt-4' v-if='hasConnectedWallet'>
      <span class="mr-2" >{{ $t('wallet.notConnected') }}</span>
      <button @click='changeWallets'>
        {{ $t('wallet.connect') }}
      </button>
    </div>
    <!-- <div>
      <button @click = 'changeWallets'>Change wallet</button>
      <button id='changeAccounts'
        v-show="['ledger', 'trezor'].includes(walletName)" 
        @click = 'changeAccounts'
        >Change accounts</button>
    </div> -->
  </div>
</template>

<script>
  import { getters, contract as currentContract, changeContract, poolMenu } from '../../contract'
  import init, { onboard, changeWallets } from '../../init'
  import * as volumeStore from '@/components/common/volumeStore'

  export default {
    props: {
      errMsg: {
        type: String,
        default: ''
      }
    },
    methods: {
      async changeWallets() {
        changeWallets()
      },
      async changeAccounts() {
        return onboard.accountSelect();
      }
    },
    computed: {
      ...getters,
      hasConnectedWallet() {
        return this.default_account == '0x0000000000000000000000000000000000000000' 
                && !['Donate', 'StatsDaily', 'Audits', 'Stats', 'Contracts', 'FAQ', 'RootFAQ'].includes(this.$route.name)
      },
      plsReturn() {
        return currentContract.currentContract.toLowerCase() == '0x72c20f89008729c91b6bb85f3104fda942494cef'.toLowerCase()
      },
    }
  }
</script>

<style>

</style>