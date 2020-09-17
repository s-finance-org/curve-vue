<template>
	<div>
    <h2 class="mb-5">{{ $t('risk.title') }}</h2>
    <div class="box mb-4 px-4">
      <h4 class="my-3">{{ $t('risk.auditTitle') }}</h4>
      <p class="text-black-65" v-html="$t('risk.auditContHtml')"></p>
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
  </div>
</template>

<script>
    export default {
        computed: {
            publicPath() {
            return process.env.BASE_URL
          },
        },
    }
</script>

<style scoped>
    h2 {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    h2 img {
        margin-left: 0.7em;
        margin-right: 0.3em;
    }

    @media only screen and (max-device-width: 470px) {
        h2 img {
            margin-left: 0;
        }
    }
    .window.white a {
        border-bottom: 1px dashed gray;
    }
    .window.white a:hover {
        border-bottom: none;
    }
</style>