<template>
  <div id="editor">
    <el-container>
      <el-header height="36px">
        <el-button-group>
          <el-button
            type="primary"
            size="medium"
            class="el-icon-top-left"
            @click="handleImportButton"
          >
            导入
            <fileLoader id="fileLoader" @loadFile="loadBpmnFromFile" />
          </el-button>
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
        </el-button-group>
        <el-button-group>
          <!--
          <el-button
            type="primary"
            size="medium"
            class="el-icon-magic-stick"
            @click="textTransform"
          >NLP</el-button>
          -->
        </el-button-group>
        <!--style="margin-left:10px"-->
        <el-button-group>
          <el-button type="primary" size="medium" @click="resetBPMN">重置</el-button>
          <el-button type="primary" size="medium" @click="checkBPMN">检查</el-button>
          <el-button type="primary" size="medium" @click="saveBPMN">保存</el-button>
          <el-button type="primary" size="medium" @click="recoBPMN">结构推荐</el-button>
          <el-button type="primary" size="medium" @click="showWindow">语义推荐</el-button>
          <el-button type="primary" size="medium" @click="showUploadWindow">上传文件</el-button>
          <!--<el-button type="primary" size="medium" @click="abc">流程规划</el-button>-->
          <el-button type="primary" size="medium" @click="dialogFormVisible = true">运行流程</el-button>
        </el-button-group>
      </el-header>
      <el-dialog title="请输入您的初始参数及设定的值" :visible.sync="dialogFormVisible" center>
        <el-form  ref="form" label-width="80px" >
          <div
                  class="binding-item"
                  v-for="(item, index) in batchForm"
                  :key="index"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="参数名：">
                  <el-input
                          v-model="item.name"
                          placeholder="请输入参数名"
                          width="120px"
                          style="display:inline"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参数值：">
                  <el-input
                          v-model="item.value"
                          placeholder="请输入参数值"
                          width="120px"
                          style="display:inline"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label-width="10px"  v-if="batchForm[index].index === batchFormNum">
                  <el-button type="primary" icon="el-icon-edit"  @click="batchAdd(index, batchForm[batchForm.length - 1].index)">继续添加</el-button>
<!--                <span-->
<!--                        class="el-icon-circle-plus binding-button-plus"-->
<!--                        @click="batchAdd(index, batchForm[batchForm.length - 1].index)"-->
<!--                ></span>-->
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item>
                  <!--                <el-form-item   v-if="item.name != '' || item.value!==''">-->
                  <el-button type="danger" icon="el-icon-delete"  @click="batchDel(index)">删除</el-button>
<!--                  <span-->
<!--                          class="el-icon-circle-close binding-button-close"-->
<!--                          @click="batchDel(index)"-->
<!--                  ></span>-->
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <el-button type="primary" size="medium" class="el-icon-check" @click="checknature">检验</el-button>
        <el-button type="primary" size="medium" class="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary" size="medium" @click="plan">运行流程</el-button>
        <el-button type="danger" size="medium" @click="dialogFormVisible = false">取消</el-button>
      </el-dialog>
      <el-main>
        <!--  //右上角查看规则&#45;&#45;弹窗开关
        <div class="righttop">
          <a class="rule" href="javascript:;" @click="showpopup"></a>
        </div>-->
<!--        弹窗模块-->
        <div v-show="popup" >
          <!--这里是要展示的内容层-->
          <Search @childFn="recevieChildParam"></Search>
          <!--这里是半透明背景层-->
          <div class="over"></div>
        </div>
 <!--       <div v-show="isShowSearchWindow">
          <Search></Search>
        </div>-->

        <div v-show="isShowSearchWindow">
    <Search></Search>
  </div>
  <div v-show="isShowUploadWindow">
    <FileUpload></FileUpload>
    </div>

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
//验证工具
import lintModule from "bpmn-js-bpmnlint";
import bpmnlintConfig from "../bpmn/lint/.bpmnlintrc";
//空白Bpmn模板
import BlankStr from "../bpmn/samples/blank.js";
import  qs from 'qs';
import axios from 'axios';

export default {
  name: "Editor",
  data: function() {
    return {
      xmlStr: this.$store.state.BpmnXml,
      isCollapse: false,
      bpmnModeler: null,
      container: null,
      isShowSearchWindow:false,
      isShowUploadWindow:false,
      popup: 0,
      dialogFormVisible: false,
      labelPosition: 'right',
      batchForm: [
        {
          name: "",
          value: "",
          index: 0,
        }
      ],
      batchFormNum: 0,
    };
  },
  components: {
    fileLoader: fileLoader,
    Search,FileUpload
  },

  methods: {
    showpopup() {
      this.popup = 1;
    },
    //子组件传来参数
    recevieChildParam(popup,xmlStr){
      this.popup = popup;
      this.xmlStr = xmlStr;
      this.bpmnModeler.importXML(xmlStr);
    },
    showUploadWindow(){
      this.isShowUploadWindow = !this.isShowUploadWindow
      //this.isShowSearchWindow = false
    },
    showSearch(){
      this.isShowSearchWindow = !this.isShowSearchWindow
      this.isShowUploadWindow = false
    },
    showWindow() {
       //const axios = this.$axios;
       //axios.defaults.withCredentials = true
        this.$prompt('', '请输入您的需求:', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            showInput: true,
            inputPlaceholder: "请输入信息",
            inputType: "textarea"
        }).then(({value}) => {
            this.$message({
                type: 'success',
                message: '你的输入是: ' + (value == null ? "" : value)
            })
            //发送数据
            request({
              
                url: "http://lxc-backend-java.ingress.isa.buaanlsde.cn/recommendation/RecommSemantics",
                method: "get",
                params: {
                    message: value
                }
            }).then(res => {
                //console.log(res.data)
                this.xmlStr = res.data;
                this.bpmnModeler.importXML(this.xmlStr);
            }).catch(err => {
                console.log("发送失败")
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '还没想好？'
            });
        })
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

    //重置
    //当前的this.xmlStr重新替换为空白模板
    resetBPMN: function() {
      this.xmlStr = BlankStr;
      this.bpmnModeler.importXML(this.xmlStr);
    },

    //保存
    saveBPMN: function() {            
      
      this.bpmnModeler.saveXML(
        {
          format: true
        },
        (err, xml) => {
          this.xmlStr = xml;
          this.$store.dispatch("editXml", this.xmlStr);
          
          this.$prompt('', '请输入文件名:', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      showInput: true,
      inputPlaceholder: "请输入信息",
      inputType: "textarea"
  }).then(({value}) => {            
      //发送数据
      request({
        
          url: "https://lxc-backend-java.ingress.isa.buaanlsde.cn/recommendation/saveBPMN",
          method: "post",
          /*params: {
              name:value,
             //message : xml
          },*/
          data:  qs.stringify({name:value,message :xml}),
          
          
      }).then(res => {
          //console.log(res.data)
          if(res.data==="0"){
            this.$message({
                type: 'success',
                message: '保存成功'
      });
          }
          //this.xmlStr = res.data;
          //this.bpmnModeler.importXML(this.xmlStr);
      }).catch(err => {
          console.log("发送失败")
      })
  }).catch(() => {
      this.$message({
          type: 'info',
          message: '还没想好？'
      });
  })

        }
      );
    },
     //流程规划
    checknature: function(){
      var nature = {};
      for (var i=0; i<=this.batchFormNum;i++){
        nature[this.batchForm[i].name]=this.batchForm[i].value
      }


      this.$alert(JSON.stringify(nature) ,'这是您输入的参数',{
        confirmButtonText: '确定',
        callback: action => {

        }
      });

    },

    resetForm: function(){
      for(var i=1; i<= this.batchFormNum; i++){
        this.batchForm.splice(i);
      }
      this.batchForm[0].name = "";
      this.batchForm[0].value = "";
      this.batchForm[0].index = 0;
      this.batchFormNum = 0;
    },

    plan: function() {
      this.dialogFormVisible = false;
      axios.post("/api/test", {xml: this.xmlStr},{ headers: { "Content-Type": "application/xml" } })
      .then(res => {
        console.log(res.data)
        this.$message({
                  type: 'success',
                  message: '开始调用映射图生成组件'})
        this.$router.push({
          path:'/graph',
          query:{
            xml: this.xmlStr,
            place : res.data
          }
        })
      })
      // this.$router.push({
      //   path: '/graph',
      //   query: {
      //     xml: this.xmlStr,
      //   }
      // })
        // axios({
        //       method: "get",
        //       url: "https://scheme-generation.ingress.isa.buaanlsde.cn/tt",
        //       //url: "http://backend-java:8090/recommendation/RecommStructure",
        //       //url: "http://localhost:8090/recommendation/RecommStructure",
        //       //data: qs.stringify({lxccontent:strXML})
        //     })
        //       .then(res => {
        //
        //       })
        //window.open('https://scheme-generation.ingress.isa.buaanlsde.cn/tt')
        // window.open('https://argo-serve.ingress.isa.buaanlsde.cn/workflows/argo/')
    },

    batchAdd(index, length) {
      if (this.batchForm[index].value !== ""&& this.batchForm[index].name !== "") {
        this.batchForm.push({ name: "", value: "", index: length + 1 });
        this.batchFormNum = length + 1;
      } else if(this.batchForm[index].name === "") {
        this.$message.error("参数名不能为空");
      }else{
        this.$message.error("参数值不能为空");
      }
    },
    batchDel(index) {
      if (this.batchForm.length <= 1) {
        this.batchForm[index].value = "";
        this.batchForm[index].name  = "";
        this.batchForm[index].index = 0;
        this.batchFormNum = 0;
      } else {
        //先删除当前下标的数据
        this.batchForm.splice(index, 1);
        let num = [];
        //循环找出所有下标,不找出最大值，不根据顺序删除会报错
        this.batchForm.forEach((item) => {
          num.push(item.index);
        });
        //查出数组中最大值，赋值给batchFormNum
        this.batchFormNum = Math.max(...num);
      }
    },

     //推荐     
     
    recoBPMN: function() {         
      const axios = this.$axios;
      axios.defaults.withCredentials = true
      var strXML;
      //Vue.prototype.$qs = qs         
      this.bpmnModeler.saveXML(
          {
            format: true
          },
          (err, xml) => {
            strXML= xml                      
          }
        );        
   axios({
          method: "post",              
          url: "http://lxc-backend-java.ingress.isa.buaanlsde.cn/recommendation/RecommStructure",   
          //url: "http://backend-java:8090/recommendation/RecommStructure",   
          //url: "http://localhost:8090/recommendation/RecommStructure",        
          data: qs.stringify({lxccontent:strXML})              
        })
          .then(res => {
            //console.log(content);
            this.xmlStr = res.data;
            this.bpmnModeler.importXML(this.xmlStr);
           
           
          })
     },

    //检查
    checkBPMN: function() {
      /*使用形式化验证会在底部出现Toggle Lint按钮，检查只需要点击响应的按钮即可*/
      const bjslButton = document.querySelector(".bjsl-button");
      bjslButton.click();
    },
    //文本转换
    /*
    textTransform: function() {
      const _bpmnModeler = this.bpmnModeler;
      const axios = this.$axios;
      this.$msgbox({
        title: "NLP",
        message: "请输入一段描述业务流程的文字",
        showInput: true,
        inputType: "textarea",
        confirmButtonText: "生成BPMN",
        beforeClose: (action, instance, done) => {
          //这个函数在调用接口之前先看一下原理，
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            //在发送前把数据打包，否则后端接收不到
            let _param = new URLSearchParams();
            _param.append(
              "str",
              instance.inputValue ? instance.inputValue : " "
            );
            // _param.append("name", "cbaymax")

            axios({
              method: "post",
              // test url: 'http://123.207.143.93:8081/anything',
              url: "/api/text2bpmn",
              data: _param
            })
              .then(res => {
                console.log(res);
                _bpmnModeler.importXML(res.data);
                instance.confirmButtonLoading = false;
                this.$message({
                  type: "success",
                  message: "执行成功"
                });
                done();
              })
              .catch(err => {
                instance.confirmButtonLoading = false;
                this.$message({
                  type: "error",
                  message: err
                });
                done();
              });
          } else {
            this.$message({
              type: "info",
              message: "已取消"
            });
            done();
          }
        }
      });
    }
    */
  },
  //文本转换
    textTransform: function() {
      const _bpmnModeler = this.bpmnModeler;
      const axios = this.$axios;
      this.$msgbox({
        title: "NLP",
        message: "请输入一段描述业务流程的文字",
        showInput: true,
        inputType: "textarea",
        confirmButtonText: "生成BPMN",
        beforeClose: (action, instance, done) => {
          //这个函数在调用接口之前先看一下原理，
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            //在发送前把数据打包，否则后端接收不到
            let _param = new URLSearchParams();
            _param.append(
              "str",
              instance.inputValue ? instance.inputValue : " "
            );
            // _param.append("name", "cbaymax")

            axios({
              method: "post",
              // test url: 'http://123.207.143.93:8081/anything',
              url: "/api/text2bpmn",
              data: _param
            })
              .then(res => {
                console.log(res);
                _bpmnModeler.importXML(res.data);
                instance.confirmButtonLoading = false;
                this.$message({
                  type: "success",
                  message: "执行成功"
                });
                done();
              })
              .catch(err => {
                instance.confirmButtonLoading = false;
                this.$message({
                  type: "error",
                  message: err
                });
                done();
              });
          } else {
            this.$message({
              type: "info",
              message: "已取消"
            });
            done();
          }
        }
      });
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
.rule {
  position: absolute;
  width: 0.82rem;
  height: 0.36rem;
  top: 0.08rem;
  right: 0rem;
  background: #111111;
}
.login {
  position: fixed;
  font-size: 24px;
  height: 360px;
  width: 240px;
  background-color: gold;
  border-radius: 0.25rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.over {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.3;
filter: alpha(opacity=30);
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #111111;
}
.el-button {
  background-color: #3F4254;
}
#editor .el-container {
  position: fixed;
  margin: auto;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 100%;
}

#editor .el-header {
  display: inline-flex;
  height: 00px;
  padding: 00px;
}

#editor .el-header .el-button-group {
  display: inherit;
}
.el-main {
    
    padding: 00px;
}
#editor .bpmnContainer {
  position: relative;
  margin: auto;
  left: 1px;
  right: 1px;
  bottom: 0px;
  height: 100%;
  border-style: solid;
  border-width: 1px;
}

#editor #BpmnCanvas {
  /* 主窗口区域 */
  width: 100%;
  height: 100%;
}
#editor #BpmnProperties {
  /* 右侧元素属性菜单 */
  position:absolute;
  top:10px;
  right:10px;
  width: 300px;
  height: 450px;
  overflow-y:scroll;
  /*background-color: rgba(0, 0, 0, 0);*/
}

@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "~bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
@import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
</style>
