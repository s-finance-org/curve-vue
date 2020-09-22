<template>
  <b-container>
    <footer>
      <a href="https://twitter.com/SFinanceEx" target="_blank">Twitter</a>
      <template v-if="$i18n.locale === 'zh-CN'">
        <a href="https://t.me/SFinanceCN" target="_blank">Telegram</a>
        <a href="https://www.yuque.com/mudui/sfin" target="_blank">社区支持</a>
      </template>
      <template v-else>
        <a href="https://t.me/SFinanceEN" target="_blank">Telegram</a>
      </template>
      <a href="https://discord.gg/rc49Dzu" target="_blank">Discord</a>
      <a href="https://medium.com/s-finance" target="_blank">Medium</a>
      <a href="https://github.com/s-finance-org/curve-vue" target="_blank">git</a>
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
    margin: 20px 48px 20px 0;
  }
  footer a:hover {
    color: rgba(0,0,0,0.45);
  }
</style>