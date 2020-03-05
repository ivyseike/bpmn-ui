<template>
	<input type="file" @change="loadTextFromFile"  id="fileLoader" style="visibility: hidden; position: absolute;">
</template>

<script>
	export default {
		data: function() {
			return {
				value: ''
			}
		},
		methods: {
			loadTextFromFile: function(e) {
				const ele = document.querySelector('#fileLoader')
				if (ele.value != "") {
					const reader = new FileReader
					reader.onload = (e) => {
						this.$emit('loadFile', e.target.result)
						ele.value = ""//每次使用后，将组件值恢复为空，这样能解决第二次导入无法打开的问题
					}
					const file = e.target.files[0]
					reader.readAsText(file)
				}
			}
		}
	}
</script>

<style>
</style>
