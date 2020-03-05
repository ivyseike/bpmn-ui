<template>
	<div id="simulator">
		<div class="bpmnContainers">
			<div id="BpmnCanvas" ref="canvas"></div>
		</div>

	</div>
</template>

<script>
	import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'
	import tokenSimulation from 'bpmn-js-token-simulation/lib/viewer'
	//引入一个Bpmn模板
	import {
		xmlStr
	} from '../bpmn/samples/xmlStr-simulation1.js'


	export default {
		data: function() {
			return {
				bpmnViewer: null,
				xmlStr: xmlStr
			}
		},
		methods: {
			init: function() {
				this.bpmnViewer = new BpmnViewer({
					container: "#BpmnCanvas",
					additionalModules: [
						tokenSimulation
					]
				})
				this.bpmnViewer.importXML(this.xmlStr)
			}
		},
		mounted: function() {
			this.init()
		}
	}
</script>

<style lang="scss" >
	@import '~bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

	#simulator {
		position: fixed;
		margin: auto;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 90%; 
		width: 100%;
	}

	#simulator .bpmnContainers {
		position: relative;
		margin: auto;
		left: 1px;
		right: 1px;
		bottom: 0px;
		width: 95%;
		height: 95%;
		border-style: solid;
		border-width: 1px;
	}

	#BpmnCanvas {
		width: 100%;
		height: 100%;
	}
	.bjs-container.simulation {
	border-width: 0px;
}
</style>
