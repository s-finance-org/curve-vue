<template>
  <b-overlay :show="show" :class="mixClass" spinner-variant="danger" spinner-type="grow" spinner-small>
    <slot></slot>
  </b-overlay>
</template>

<script>
	export default {
		props: {
      show: {
        type: Boolean,
        default: true
      },
      inline: {
        type: Boolean,
        default: false
      }
    },
		computed: {
      mixClass () {
        const inline = this.inline ? 'inline-block' : ''

        return [inline]
      }
		},
		methods: {
		}
	}
</script>

<style scoped>
  .inline-block {
    display: inline-block;
  }
</style>