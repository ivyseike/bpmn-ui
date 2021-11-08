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
		disableHostCheck: true,
		proxy: {
			'/api/text2bpmn': {
				target: 'http://0.0.0.0:9090', //要请求的地址
				changeOrigin: true, //如果需要跨域
				ws: true,
				pathRewrite: {
					'^/api/text2bpmn': '/bpmn', //^/api/text2bpmn 会重写为 target/bpmn
					}
				},
			'/api/hnust': {
					target: 'http://8.129.113.40:8882/', //要请求的地址
						changeOrigin: true, //如果需要跨域
						ws: true,
						pathRewrite: {
						'^/api/hnust': ''
						}
					}
				}

		}

	}

