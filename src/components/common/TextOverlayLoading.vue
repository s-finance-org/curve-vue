<template>
  <b-overlay :show="show" spinner-variant="danger" spinner-type="grow" spinner-small>
    <slot></slot>
  </b-overlay>
</template>

<script>
	export default {
		props: ['show'],
		computed: {
		},
		methods: {
		}
	}
</script>

<style scoped>

</style>