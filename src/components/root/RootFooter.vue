<template>
  <b-container>
    <footer class="my-2">
      <a href="https://twitter.com/SFinanceEx" target="_blank">{{ $t('social.twitter') }}</a>
      <template v-if="$i18n.locale === 'zh-CN'">
        <a id="popover-qrcode" href="javascript:void(0);">{{ $t('social.wechat') }}</a>
        <b-popover target="popover-qrcode" triggers="hover" placement="top">
          <img class="qrcode" src="/qrcode_wechat@2x.png" />
        </b-popover>
        <a href="https://t.me/SFinanceCN" target="_blank">{{ $t('social.telegram') }}</a>
        <a href="https://www.yuque.com/mudui/sfin/swrcks" target="_blank">{{ $t('social.tutorial') }}</a>
        <a href="https://www.yuque.com/mudui/sfin" target="_blank">{{ $t('social.communitySupport') }}</a>
      </template>
      <template v-else>
        <a href="https://t.me/SFinanceEN" target="_blank">{{ $t('social.telegram') }}</a>
        <!-- <a href="https://medium.com/p/a82858fd4c4c/" target="_blank">{{ $t('social.tutorial') }}</a> -->
      </template>
      <a href="https://discord.gg/rc49Dzu" target="_blank">{{ $t('social.discord') }}</a>
      <a href="https://medium.com/s-finance" target="_blank">Medium</a>
      <a href="https://github.com/s-finance-org/curve-vue" target="_blank">Github</a>
      <a href="https://defipulse.com/" target="_blank">DefiPulse</a>
    </footer>
  </b-container>
</template>

<script>
  export default {
    computed: {
    }
  }
</script>

<style scoped>
  footer a {
    color: rgba(0,0,0,0.45);
    line-height: 22px;
    display: inline-block;
    margin: 4px 48px 4px 0;
  }
  footer a:hover {
    color: rgba(0,0,0,0.45);
  }

  .qrcode {
    width: 116px;
    height: 116px;
  }
</style>