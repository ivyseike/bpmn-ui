import Vue from 'vue'
import Vuex from 'vuex'
//空白Bpmn模板
import BlankStr from '../bpmn/samples/blank.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		BpmnXml: BlankStr
	},
	mutations: {
		editXml(state, NewXml) {
			state.BpmnXml = NewXml
		}
	},
	actions: {
		editXml(context,NewXml) {
			context.commit('editXml',NewXml)
		}
	},
	modules: {}
})
