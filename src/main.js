import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import "./plugins/iview.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

Vue.config.productionTip = false

//将axios挂载到原型上
Vue.prototype.$axios = axios;

const _vue = new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

