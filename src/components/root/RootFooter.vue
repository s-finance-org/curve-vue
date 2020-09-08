<template>
  <b-container>
    <footer>
      <a :href=item.href v-for="(item, idx) in footer_nav" :key="`footer_nav_${ idx }`">{{ item.cont }}</a>
    </footer>
  </b-container>
</template>

<script>
  export default {
    computed: {
      footer_nav () {
        return [
          { cont: 'Twitter', href: 'https://twitter.com/SFinanceEx' },
          { cont: 'Telegram', href: 'https://t.me/SFinanceEN' },
          { cont: 'Telegram CN', href: 'https://t.me/SFinanceCN' },
          { cont: 'Discord', href: 'https://discord.gg/rc49Dzu' },
          { cont: 'Mdeium', href: 'https://medium.com/s-finance' },
          { cont: 'git', href: 'https://github.com/s-finance-org/curve-vue' },
        ]
      }
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