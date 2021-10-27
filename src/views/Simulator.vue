<template>
	<div id="simulator">
		<el-container>
			<el-header height="36px">

				<el-button-group>
					<el-button type="primary" size="medium" class="el-icon-upload2" @click="handleImportButton">
						本地
						<fileLoader id="fileLoader" @loadFile="loadBpmnFromFile" />
					</el-button>
					<el-dropdown>
						<el-button type="primary" size="medium"><i class="el-icon-circle-check"/> 样例</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item ><a @click="handleSampleOne">样例一</a></el-dropdown-item>
							<el-dropdown-item ><a @click="handleSampleTwo">样例二</a></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

				</el-button-group>
				<el-button-group>
					<el-button type="primary" size="medium" @click="beginSimulator"><i class="el-icon-video-play"></i> 模拟</el-button>
					<el-button type="primary" size="medium" @click="saveBPMN">保存</el-button>
				</el-button-group>
			</el-header>
			<el-main>
				<div class="bpmnContainer">
					<div id="BpmnCanvas" ref="canvas"></div>
				</div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'
	import tokenSimulation from 'bpmn-js-token-simulation/lib/viewer'
	import fileLoader from '../components/Editor/fileLoader.vue'
	//引入一个Bpmn模板
	import Sample from '../bpmn/samples/xmlStr-simulation.js'


	export default {
		name: "Simulator",
		data: function() {
			return {
				bpmnViewer: null,
				
				xmlStr: null
			}
		},
		components: {
			fileLoader: fileLoader,
		},
		methods: {
			init: function() {
				this.bpmnViewer = new BpmnViewer({
					container: "#BpmnCanvas",
					additionalModules: [
						tokenSimulation
					]
				})
				this.xmlStr = this.$store.state.BpmnXml
				this.bpmnViewer.importXML(this.xmlStr)
				
			},

			// 文件导入
			//通过click()点击调用fileLoader组件，该组件不会显示在页面中
			handleImportButton: function() {
				const element = document.getElementById("fileLoader")
				element.click()
			},
			//组件接收到文件以后，会将字符串返回，发出loadFile事件
			//监听到loadFile事件后，调用loadBpmnFromFile方法将字符串显示到页面
			loadBpmnFromFile: function(bpmnFile) {
				this.xmlStr = bpmnFile
				this.bpmnViewer.importXML(this.xmlStr)
			},

			//样例导入
			//导入样例一
			handleSampleOne: function() {
				this.xmlStr = Sample.One
				this.bpmnViewer.importXML(this.xmlStr)
			},
			//导入样例二
			handleSampleTwo: function() {
				this.xmlStr = Sample.Two
				this.bpmnViewer.importXML(this.xmlStr)
			},
			//模拟按钮
			beginSimulator: function() {
				const beginBtn = document.querySelector("#BpmnCanvas > div > div > div.toggle-mode")
				beginBtn.click()
			},
			//保存
			saveBPMN: function() {
				console.log("save");
					this.$store.dispatch("editXml", this.xmlStr)
			},

		},
		mounted: function() {
			this.init()
		},
		activated:function(){
			//每次Simulator组件被激活，就说明切换了一次页面，导入Vuex保存的BPMN图
			this.xmlStr = this.$store.state.BpmnXml
			this.bpmnViewer.importXML(this.xmlStr)
		}
	}
</script>

<style>
	@import '~bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

	#simulator {
		position: fixed;
		margin: auto;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height:100%;
		width: 100%;
	}
	.el-header {
    padding: 0px;
}
.el-button {
  background-color: #3F4254;
}
	#simulator .el-container {

		height: 100%;
		width: 100%;
	}
	.el-main {
    
    padding: 00px;
}
	#simulator .el-container .el-main {

		height: 100%;
		weight: 100%
	}

	#simulator .el-container .el-main .bpmnContainer {
		border: #000 solid 1px;
		height: 100%;
		weight: 100%
	}

	#simulator .el-container .el-main .bpmnContainer #BpmnCanvas {
		height: 100%;
		weight: 100%
	}

	.bjs-container.simulation {
		border: none;
	}
</style>
