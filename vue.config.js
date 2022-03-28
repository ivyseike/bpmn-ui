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
				target: 'http://bpmnbackend.ingress.isa.buaanlsde.cn/', //要请求的地址
				changeOrigin: true, //如果需要跨域
				ws: true,
				pathRewrite: {
					'^/api/hnust': ''
				}
			},
            '/api/runwf':{
                target: 'http://scheme-generation.ingress.isa.buaanlsde.cn', //要请求的地址
                changeOrigin: true, //如果需要跨域
                ws: true,
            },
            '/api/test': {
				target: 'http://cgg.ingress.isa.buaanlsde.cn', //要请求的地址
				changeOrigin: true, //如果需要跨域
				ws: true,
			},
			'/api/argost':{
				target : 'http://argo-serve.ingress.isa.buaanlsde.cn/api/v1/workflows/',
				changeOrigin: true, //如果需要跨域
				ws: true,
				pathRewrite: {
					'^/api/argost': ''
				}
			},
			'/api/getexp':{
				target : 'http://scheme-generation.ingress.isa.buaanlsde.cn/',
				changeOrigin: true, //如果需要跨域
				ws: true,
				pathRewrite: {
					'/api/getexp': ''
				}
			},
			'/api/getlog':{
				target : 'http://argo-serve.ingress.isa.buaanlsde.cn/artifacts/argo/',
				changeOrigin: true, //如果需要跨域
				ws: true,
				pathRewrite: {
					'/api/getlog': ''
				}
			},
		}

	}

}

