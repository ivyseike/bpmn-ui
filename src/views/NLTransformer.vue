<template>
  <div id="rating">
    <el-container>
      <el-header height="36px">
        <el-button-group>
        <!--
			<el-dropdown>
			  <el-button type="primary" size="medium">
			    选择语言
			  </el-button>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item>
			      <a @click="changeLanguage(1)">英文</a>
			    </el-dropdown-item>
			    <el-dropdown-item>
			      <a @click="chanegLanguage(2)">中文</a>
			    </el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
        -->
			<!--
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
         -->
    
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
          <el-button type="primary" size="medium" @click="textTransform">转换为BPMN图</el-button>
		  
        </el-button-group>
      </el-header>
      <el-main>
    <el-input id="textinput"type="textarea" autosize placeholder="请输入一段流程描述" v-model="processText" ></el-input style="border-radius:4px">
        <div class="bpmnContainer">
          <div id="BpmnCanvas" ref="canvas"></div>
          <div id="BpmnProperties" ref="canvas"></div>
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
	  english:true,
	  chinese:false
    };
  },
  components: {
    fileLoader: fileLoader,
  },

  methods: {
	  changeLanguage(num){
		  if(num == 1){
			  this.english = true;
			  this.chinese = false;
		  }
		  else if(num == 2){
			  this.english = false;
			  this.chinese = true;
		  }
	  },
	  textTransform: function(){
			if(this.processText != ""){
				request({
					url: "/transform",
					method: "post",
					data: {processText: this.processText}
				}).then(res => {
                    if(res.data == "nothing"){
                        this.$alert('未知错误', '错误提示', {
                            confirmButtonText: '确定'
                        });
                    }
                    else{
                        console.log(res.data);
                        this.bpmnModeler.importXML(res.data);
                    }
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
