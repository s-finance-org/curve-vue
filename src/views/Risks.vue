<template>
	<div>
    <div class="total-bg">
      <b-container class="d-flex py-4 total-cont align-items-center">
        <img class="logo_lg mr-4" :src="publicPath + 'res/icons/logo/logo_sm.svg'">
        <h3 class="mb-0">{{ $t('global.sFinance') }}<br/>{{ $t('global.risks') }}</h3>
      </b-container>
    </div>

    <b-container>
      <root-sub />

      <h2 class="mt-5 mb-5">{{ $t('risk.title') }}</h2>
      <div class="box mb-4 px-4">
        <h4 class="my-3">{{ $t('risk.auditTitle') }}</h4>
        <p class="text-black-65" v-html="$t('risk.auditContHtml')"></p>
        <p>
          <template v-if="$i18n.locale === 'zh-CN'">
            <b-button size="sm" variant="link" href="/audits/InitializableAdminUpgradeabilityProxy 智能合约安全审计报告 v1.0.pdf" target="_blank">InitializableAdminUpgradeabilityProxy 智能合约安全审计报告 v1.0.pdf</b-button><br/>
            <b-button size="sm" variant="link" href="/audits/SfgToken智能合约安全审计报告 v1.0.pdf" target="_blank">SfgToken智能合约安全审计报告 v1.0.pdf</b-button><br/>
            <b-button size="sm" variant="link" href="/audits/SMinter智能合约安全审计报告 v1.0.pdf" target="_blank">SMinter智能合约安全审计报告 v1.0.pdf</b-button><br/>
            <b-button size="sm" variant="link" href="/audits/SNestGauge智能合约安全审计报告 v1.0.pdf" target="_blank">SNestGauge智能合约安全审计报告 v1.0.pdf</b-button><br/>
          </template>
          <template v-else>
            <b-button size="sm" variant="link" href="/audits/InitializableAdminUpgradeabilityProxy Smart Contract Audit Report.pdf" target="_blank">InitializableAdminUpgradeabilityProxy Smart Contract Audit Report.pdf</b-button><br/>
            <b-button size="sm" variant="link" href="/audits/SfgToken Smart Contract Audit Report.pdf" target="_blank">SfgToken Smart Contract Audit Report.pdf</b-button><br/>
            <b-button size="sm" variant="link" href="/audits/SMinter Smart Contract Audit Report.pdf" target="_blank">SMinter Smart Contract Audit Report.pdf</b-button><br/>
            <b-button size="sm" variant="link" href="/audits/SNestGauge Smart Contract Audit Report.pdf" target="_blank">SNestGauge Smart Contract Audit Report.pdf</b-button><br/>
          </template>
        </p>
      </div>
      <div class="box mb-4 px-4">
        <h4 class="my-3">{{ $t('risk.adminKeyTitle') }}</h4>
        <p class="text-black-65" v-html="$t('risk.adminKeyContHtml')"></p>
      </div>
      <div class="box mb-4 px-4">
        <h4 class="my-3">{{ $t('risk.lossTitle') }}</h4>
        <p class="text-black-65" v-html="$t('risk.lossContHtml')"></p>
      </div>
      <div class="box mb-4 px-4">
        <h4 class="my-3">{{ $t('risk.stakingTitle') }}</h4>
        <p class="text-black-65" v-html="$t('risk.stakingContHtml')"></p>
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