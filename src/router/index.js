import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Editor from '../views/Editor.vue'
import Simulator from '../views/Simulator.vue'
import Mapper from '../views/Mapper.vue'
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
