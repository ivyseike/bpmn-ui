import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../views/Home.vue"
//懒加载模式
const Editor = ()=>import('../views/Editor.vue')
const Simulator = ()=>import('../views/Simulator.vue')
const Mapper = ()=>import('../views/Mapper.vue')


Vue.use(VueRouter)

const routes = [

	{
		path: '/',
		redirect: '/home'
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
	
]

const router = new VueRouter({
	routes: routes,
	mode: 'history'
})

export default router
