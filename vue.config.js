// vue.config.js
module.exports = {
	chainWebpack: config => {
		config.module
			.rule('bpmnlintrc')
			.test(/\.bpmnlintrc$/)
			.use('bpmnlint-loader')
			.loader('bpmnlint-loader')
			.end()
	}
}
