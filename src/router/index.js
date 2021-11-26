import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../views/Home.vue"
//懒加载模式
const Editor = ()=>import('../views/Editor.vue')
const Simulator = ()=>import('../views/Simulator.vue')
const Mapper = ()=>import('../views/Mapper.vue')
const ModelRater = ()=>import('../views/ModelRater.vue')
const NLTransformer = ()=>import('../views/NLTransformer')
const BpmnToChatbot = ()=>import('../views/BpmnToChatbot')
const Graph = ()=>import('../views/Runninggraph.vue')


Vue.use(VueRouter)

const routes = [

	{
		path: '/',
		redirect: '/editor'
	},
	{
		path: '/home',
		component: Home
	},

	{
		path: '/editor',
		component: Editor
	},
	{
		path: '/simulator',
		component: Simulator
	},
	{
		path: '/mapper',
		component: Mapper
	},
	{
		path: '/rater',
		component: ModelRater
	},
	{
		path: '/transformer',
		component: NLTransformer
	},
	{
		path: '/bpmnToChatbot',
		component: BpmnToChatbot
	},
	{
		path: '/graph',
		component: Graph
	},
	
]

const router = new VueRouter({
	routes: routes,
	mode: 'history'
})

export default router
