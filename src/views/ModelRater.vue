<template>
  <div id="rating">
    <el-container>
      <el-header height="36px">
        <el-button-group>
			<el-dropdown>
			  <el-button type="primary" size="medium">
			    功能
			  </el-button>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item>
			      <a @click="changeToFunction(1)">模型评价</a>
			    </el-dropdown-item>
			    <el-dropdown-item>
			      <a @click="changeToFunction(2)">模型推荐</a>
			    </el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
          <el-button
            type="primary"
            size="medium"
            class="el-icon-top-left"
			v-show="function1"
            @click="handleImportButton"
          >
            导入
            <fileLoader id="fileLoader" @loadFile="loadBpmnFromFile" />
          </el-button>
    
        </el-button-group>
        <!--style="margin-left:10px"-->
        <el-button-group>
			<el-dropdown>
			  <el-button type="primary" size="medium">
			    下载
			    <i class="el-icon-bottom-right"></i>
			  </el-button>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item>
			      <a @click="downloadBpmnToFile">下载.bpmn文件</a>
			    </el-dropdown-item>
			    <el-dropdown-item>
			      <a @click="downloadBpmnToSVG">下载.svg文件</a>
			    </el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
          <el-button type="primary" size="medium" @click="resetBPMN">重置</el-button>
          <el-button type="primary" size="medium" @click="compare" v-show="function1">查询评价分数</el-button>
		  <el-button type="primary" size="medium" @click="findSimilar" v-show="function2">匹配流程图</el-button>
		  
        </el-button-group>
      </el-header>
      <el-main>
    <el-input id="textinput"type="textarea" autosize placeholder="请输入一段流程描述" v-model="processText" ></el-input style="border-radius:4px">
        <div class="bpmnContainer">
          <div id="BpmnCanvas" ref="canvas"></div>
          <div id="BpmnProperties" ref="canvas"></div>
        </div>
		<div class="hintText">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span v-show="function1">模型评价结果</span>
                <span v-show="function2">模型匹配结果</span>
			<el-button-group v-show="function2" style="float: right; margin-bottom:3px">
			  <el-button type="primary" icon="el-icon-arrow-left" 
				:disabled="diagramCount == 0? true: false" @click="lastOne">上一个</el-button>
			  <el-button type="primary" :disabled="diagramCount == this.diagrams.length-1 ? true:false" 
				@click="nextOne">下一个<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			</el-button-group>
            </div>
            <div>
			<p>当前流程描述为： {{ processDes }}</p>
			<p v-show="function2 == true && diagrams.length ? true : false ">当前BPMN图名称为：{{ curDiagram['name']}} ({{ diagramCount+1 }}/90)</p>
			<p>当前BPMN图与文字匹配分数为：{{ curDiagram['score'] }}</p>
			
            </div>
            </el-card>
		</div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
//右侧元素属性菜单
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import Search from  '../components/Search'
import FileUpload from '../components/FileUpload'
//文件导入器
import fileLoader from "../components/Editor/fileLoader.vue";
import {request} from '../network/request'
//验证具
import lintModule from "bpmn-js-bpmnlint";
import bpmnlintConfig from "../bpmn/lint/.bpmnlintrc";
//空白Bpmn模板
import BlankStr from "../bpmn/samples/blank.js";
import  qs from 'qs';
export default {
  name: "ModelRating",
  data: function() {
    return {
      xmlStr: this.$store.state.BpmnXml,
      isCollapse: false,
      bpmnModeler: null,
      container: null,
	  isShowUploadWindow: false,
	  processText:'',
	  processDes:'',
	  function1:true,
	  function2:false,
	  diagrams:[],
	  curDiagram:{'name':"", 'score':0, 'xmlStr':''},
	  diagramCount:0,
    };
  },
  components: {
    fileLoader: fileLoader,
  },

  methods: {
	  changeToFunction(num){
		  if(num == 1){
			  this.function1 = true;
			  this.function2 = false;
		  }
		  else if(num == 2){
			  this.function1 = false;
			  this.function2 = true;
		  }
	  },
	  compare: function(){

        this.bpmnModeler.saveXML( {format : true}, (err, xml) => { this.xmlStr = xml; });
        if(this.xmlStr != this.$store.state.BpmnXml && this.processText != ""){
            request({
                url: "/compare",
                method: "post",
                data: {bpmnXML: this.xmlStr, processText: this.processText}
            }).then(res => {
                if(res.data == "nothing"){
                    this.$alert('文字描述需为中文', '错误提示', {
                        confirmButtonText: '确定'
                    });
                }
                else{
                    this.curDiagram['score']= (res.data * 100).toFixed(2);
                    this.processDes = this.processText;
                }
                
                /* this.bpmnModeler.importXML(this.xmlStr); */
            }).catch(err => {
                console.log("发送失败")
                })
        }
        else{
            this.$alert('需输入文字描述与BPMN图', '错误提示', {
                confirmButtonText: '确定'
            });
        }
		},
	  findSimilar: function(){
			if(this.processText != ""){
				request({
					url: "/findSimilar",
					method: "post",
					data: {processText: this.processText}
				}).then(res => {
                    if(res.data == "nothing"){
                        this.$alert('文字描述需为中文', '错误提示', {
                            confirmButtonText: '确定'
                        });
                    }
                    else{
                        this.diagrams = res.data;
                        this.curDiagram = {'xmlStr':res.data[0]['bpmnXML'], 
                            'name':res.data[0]['name'],
                            'score': (res.data[0]['score'] * 100).toFixed(2)}
                            
                        this.bpmnModeler.importXML(this.curDiagram['xmlStr']);
                        this.processDes = this.processText;
                    }
					//console.log(this.nextDiagrams[0]['bpmnXML']);
					
					//console.log(res.data);
					
				}).catch(err => {
					console.log("发送失败")
					})
			}
			else{
				this.$alert('需输入文字描述','错误提示',{
					confirmButtonText: '确定'
				});
			}
	  },
	  lastOne: function() {
		  this.diagramCount -= 1;
		  
		  this.curDiagram = {'xmlStr':this.diagrams[this.diagramCount]['bpmnXML'],
		  	'name':this.diagrams[this.diagramCount]['name'],
		  	'score': (this.diagrams[this.diagramCount]['score'] * 100).toFixed(2)}
		  
		  	
		  this.bpmnModeler.importXML(this.curDiagram['xmlStr']);
	  },
	  nextOne: function(){
		  this.diagramCount += 1;
		  
		  this.curDiagram = {'xmlStr':this.diagrams[this.diagramCount]['bpmnXML'],
		  	'name':this.diagrams[this.diagramCount]['name'],
		  	'score': (this.diagrams[this.diagramCount]['score'] * 100).toFixed(2)}
		  
	
		  this.bpmnModeler.importXML(this.curDiagram['xmlStr']);

		  
	  },
      // 初始化函数
      initBpmn: function() {
        this.bpmnModeler = new BpmnModeler({
          container: "#BpmnCanvas", //主窗口挂载点
          propertiesPanel: {
            parent: '#BpmnProperties'//右侧属性菜单挂载点
          },
          additionalModules: [
            lintModule,//验证插件
            //右侧属性菜单差插件
            propertiesPanelModule,
            propertiesProviderModule
          ],
          linting: {
            bpmnlint: bpmnlintConfig
            // active: getUrlParam('linting')
          }
        });
        this.bpmnModeler.importXML(this.xmlStr); //载入空白模板
      },
  
      // 文件导入
      //通过click()点击调用fileLoader组件，该组件不会显示在页面中
      handleImportButton: function() {
        const element = document.getElementById("fileLoader");
        element.click();
      },
      //组件接收到文件以后，会将字符串返回，发出loadFile事件
      //监听到loadFile事件后，调用loadBpmnFromFile方法将字符串显示到页面
      loadBpmnFromFile: function(bpmnFile) {
        this.xmlStr = bpmnFile;
        this.bpmnModeler.importXML(this.xmlStr);
      },
      //当前的this.xmlStr重新替换为空白模板
      resetBPMN: function() {
        this.xmlStr = BlankStr;
        this.bpmnModeler.importXML(this.xmlStr);
		this.processText = "";
      },
	  //下载BPMN为.BPMN格式（本质上是xml格式）
	  downloadBpmnToFile: function() {
	    this.bpmnModeler.saveXML(
	      {
	        format: true
	      },
	      (err, xml) => {
	        this.download("1.bpmn", xml);
	      }
	    );
	  },
	  //下载BPMN为.SVG格式
	  downloadBpmnToSVG: function() {
	    this.bpmnModeler.saveSVG(
	      {
	        format: true
	      },
	      (err, data) => {
	        this.download("bpmn.svg", data);
	      }
	    );
	  },
	  //下载其实是调用了这个函数进行的，感觉还可以再简写一下
	  download: function(filename, text) {
	    let element = document.createElement("a");
	    element.style.display = "none";
	    element.setAttribute(
	      "href",
	      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
	    );
	    element.setAttribute("download", filename);
	    document.body.appendChild(element);
	    element.click();
	    document.body.removeChild(element);
	  },
  

    },
  
    //生命周期函数 - 组件载入后, Vue 实例挂载到实际的 DOM 操作完成前执行该操作，不能在created()时初始化
    mounted: function() {
      this.initBpmn();
	  
    },
    activated: function() {
      this.xmlStr = this.$store.state.BpmnXml;
      this.bpmnModeler.importXML(this.xmlStr);
    }
};
</script>

<style>
.el-button {
  background-color: #3F4254;
}

.box-card{
    margin-left: 5px;
    margin-top: 2px;
    width: 600px;
    height: 180px;
    border: groove;
    border-width:1px;
    /* margin: 0 auto; */

}

#textinput{
    border-radius:4px;
    border:solid;
    border-width:2px;
    border-color:dimgray;
    margin-left: 2px;
    margin-right: 2px;
}
#rating .el-container {
  position: fixed;
  margin: auto;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 100%;
}

#rating .el-header {
  display: inline-flex;
  height: 00px;
  padding: 00px;
}

#rating .el-header .el-button-group {
  display: inherit;
}
.el-main {
    padding: 00px;
}
#rating .bpmnContainer {
  position: relative;
  margin: auto;
  margin-top:3px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  width: 100%;
  height: 70%;
  border: solid;
  border-width:2px;
  border-color: dimgrey;
  border-radius:4px;
}

#rating #BpmnCanvas {
  /* 主窗口区域 */
  width: 100%;
  height: 100%;
}
#rating #BpmnProperties {
  /* 右侧元素属性菜单 */
  position:absolute;
  top:10px;
  right:0px;
  width:00px;
  height:0px;
  overflow-y:scroll;
  background-color: rgba(0, 0, 0, 0);
}


@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "~bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
@import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
</style>
