// vue.config.js
module.exports = {
	chainWebpack: config => {
		config.module
			.rule('bpmnlintrc')
			.test(/\.bpmnlintrc$/)
			.use('bpmnlint-loader')
			.loader('bpmnlint-loader')
			.end()
	},
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:9090', //要请求的地址
				changeOrigin: true, //如果需要跨域
				ws: true,
				pathRewrite: {
					'^/api': '', //调用接口直接写‘/api/user/add’即可
				}
			}
		},
	}
}
