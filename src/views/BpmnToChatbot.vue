<template>
  <div id="chatbot">
    <el-container>
      <el-header height="36px">
        <el-button-group>
          <el-button
            type="primary"
            size="medium"
            class="el-icon-top-left"
            @click="handleImportButton"
          >导入
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
			      <a @click="downloadBpmnToAIML">下载.aiml文件</a>
			    </el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
          <el-button type="primary" size="medium" @click="resetBPMN">重置</el-button>
          <el-button type="primary" size="medium" @click="convertToAIML">转换为AIML文件</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-row>
           <el-col :span="12">
            <div class="chatbotContainer">
              <div id="chat-logs">      
                  <div v-for="(msg,i) in chatRecords" :key="i" :class="'msg-'+msg.author">
                    <h1 v-if="msg.author=='bot'">
                      <img  src="@/assets/lxc_bot.png" />
                      <p class="front" v-html="msg.text"> {{msg.text}} </p>
                    </h1>
                    <h1 v-else-if="msg.author=='user'">
                      <p class="front">{{ msg.text }}</p>
                      <img  src="@/assets/user.png"/>
                    </h1>
                  </div>           
         
              </div>


              <div id="chat-input">
                  <label for="input-text"></label><input type="text" id="input-text" v-model="message" placeholder="请输入信息来和Chatbot对话" @keyup.enter="respond">
              <button type="submit" id="input-btn" @click="respond">发送</button>
              </div>
            </div>

            </el-col>
            <el-col :span="12">
              <div class="bpmnContainer">
                <div id="BpmnCanvas" ref="canvas"></div>
                <div id="BpmnProperties" ref="canvas"></div>
              </div>
            </el-col>
        </el-row>



	
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
import {request, requestForChatbot} from '../network/request'
//验证具
import lintModule from "bpmn-js-bpmnlint";
import bpmnlintConfig from "../bpmn/lint/.bpmnlintrc";
//空白Bpmn模板
import BlankStr from "../bpmn/samples/blank.js";
import  qs from 'qs';
export default {
  name: "BpmnToChatbot",
  data: function() {
    return {
      xmlStr: '',
      isCollapse: false,
      bpmnModeler: null,
      container: null,
	  	isShowUploadWindow: false,
      chatRecords: [
        {text: "等待加载中...", author: "bot"},
        //{text: "我想工作！", author: "user"},
      ],
      message:"",
      activeAIML: false
    };
  },
  components: {
    fileLoader: fileLoader,
  },

  methods: {
      
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
        //this.$alert('导入成功')
        //this.bpmnModeler.importXML(this.xmlStr);
      },
      //当前的this.xmlStr重新替换为空白模板
      resetBPMN: function() {
        this.xmlStr = BlankStr;
        this.bpmnModeler.importXML(this.xmlStr)
        this.chatRecords = [{text: "等待加载中...", author: "bot"}]
        this.activeAIML = false
      },
      convertToAIML: function(){
        this.bpmnModeler.saveXML( {format : true}, (err, xml) => { this.xmlStr = xml; });
      	if(this.xmlStr == ''){
      		this.$alert('需要导入BPMN文件', '错误提示', {
                        confirmButtonText: '确定'
          });
      	}
      	else{
      		requestForChatbot({
            url: "/xmlUpload",
            method: "post",
            data: {bpmnXML: this.xmlStr}
          }).then(res => {
                    if(res.data == "nothing"){
                        this.$alert('未知错误', '错误提示', {
                            confirmButtonText: '确定'
                        });
                    }
                    else{
                        this.$alert("转换成功，现在可以开始对话");
                        //this.bpmnModeler.importXML(res.data);
                        this.chatRecords.push({
                          text: "加载成功，快和我对话吧！",
                          author: "bot"
                        })
                    }
          }).catch(err => {
            console.log("发送失败")
          })
      	}
      },
      respond: function(){
        if(this.input == ''){
          this.$alert("需要输入文字",'错误提示',{
                      confirmButtonText: '确定'
          });
        }
        else{
          this.chatRecords.push({
            text:this.message,
            author:"user"
          })
          requestForChatbot({
            url: "/ask",
            method: "get",
            params: {
                    question: this.message
                }
          }).then(res => {
              console.log(res.data)
              let response = res.data

              const myArr = response.split("-");
              for(let i =0; i < myArr.length-1; i++){
                for(let j = 0; j < myArr[i].length; j++){
                  if(myArr[i][j] != ' '){
                    this.chatRecords.push({
                      text: myArr[i],
                        author: "bot"
                    })
                    break;
                  }
                }
              }
              this.message = "";
          }).catch(err => {
            console.log("发送失败")
          })
        }
      },
      updated() {
        const chatLogs = document.querySelector("#chat-logs")
        chatLogs.scrollTop = chatLogs.scrollHeight
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
	  //下载AIML文件
	  downloadBpmnToAIML: function() {
	    requestForChatbot({
        url:  "/downloadaiml",
        method: "get"
      }).then(res => {
        this.download("1.aiml", res.data)

      })
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


.el-input{
    border-radius:3px;
    border:solid;
    border-width:1px;
    border-color:dimgray;
    margin-top: 10px;
    margin-left: 5px;
    width: 99%;
}

#chatbot .el-container {
  position: relative;
  margin: auto;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 10px;

}

#chatbot .el-header {
  display: inline-flex;
  height: 00px;
  padding: 00px;
}

#chatbot .el-header .el-button-group {
  display: inherit;
}

.el-main {
    padding: 00px;
}

.el-row{

  width: 100%;
}

#chatbot .chatbotContainer {
  position: relative;
  margin: auto;
  margin-top:3px;
  height: 800px;

  border: black 2px solid;
}

#chatbot .bpmnContainer {
  position: relative;
  margin: auto;
  margin-top:3px;
  height: 800px;

  border: solid;
  border-width:1px;
  border-color: dimgrey;
  border-radius:4px;
}

#chatbot #BpmnCanvas {
  /* 主窗口区域 */
  width: 100%;
  height: 100%;
}
#chatbot #BpmnProperties {
  /* 右侧元素属性菜单 */
  position:absolute;
  top:10px;
  right:0px;
  width:00px;
  height:0px;
  overflow-y:scroll;
  background-color: rgba(0, 0, 0, 0);
}


.front {
font-size: 15px;
}

#chat-box {
  position: fixed;
  /* position: left; */
  left: 20%;
  top: 15%;
  height: 800px;
  width: 500px;
  border: black 2px solid;
}

#chat-logs {
  overflow: auto;
  position: relative;
  height: 87%;
  width: 100%;
  border-bottom: black 2px solid;
}

#chat-logs div p {
  display: inline-block;
  border: skyblue 1px solid;
  border-radius: 5px;
  margin: 5px 10px;
  padding: 5px;
}

#chat-logs div[class$="bot"] {
  text-align: left;

}

#chat-logs div[class$="user"] {
  text-align: right;
}

#chat-logs div[class$="bot"] p:before {
  display: inline-block;
  content: "";
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid;
  border-color: transparent skyblue transparent transparent;
  position: relative;
  left: -16px;
  bottom: -7px;
}


#chat-logs div[class$="user"] p:after {
  display: inline-block;
  content: "";
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent skyblue;
  position: relative;
  right: -16px;
  bottom: -7px;
}

#chat-input {
  position: relative;
  height: 10%;
  width: 100%;
}

#chat-input #input-text {
  margin: 0;
  padding: 0 0 0 5px;
  border: 0;
  float: left;
  height: 48px;
  width: 80%;
  outline-style: none;
  font-size: 16px;
  color: black;
}

#chat-input #input-text::-moz-placeholder {
  color: #DCDCDC;
}

#chat-input #input-btn {
  display: inline-block;
  background-color: cornflowerblue;
  outline-style: none;
  margin: 0;
  padding: 0;
  border: 0;
  float: right;
  height: 48px;
  width: 18%;
}

/*滚动条样式*/
*::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}

*::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 0, 0.15);
}

*::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}



@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "~bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
@import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
</style>
