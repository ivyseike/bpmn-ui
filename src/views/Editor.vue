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
          <el-button
            type="primary"
            size="medium"
            class="el-icon-magic-stick"
            @click="textTransform"
          >NLP</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="primary" size="medium" @click="resetBPMN">重置</el-button>
          <el-button type="primary" size="medium" @click="checkBPMN">检查</el-button>
          <el-button type="primary" size="medium" @click="saveBPMN">保存</el-button>
        </el-button-group>
      </el-header>
      <el-main>
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
//文件导入器
import fileLoader from "../components/Editor/fileLoader.vue";
//验证工具
import lintModule from "bpmn-js-bpmnlint";
import bpmnlintConfig from "../bpmn/lint/.bpmnlintrc";
//空白Bpmn模板
import BlankStr from "../bpmn/samples/blank.js";

export default {
  name: "Editor",
  data: function() {
    return {
      xmlStr: this.$store.state.BpmnXml,
      isCollapse: false,
      bpmnModeler: null,
      container: null
    };
  },
  components: {
    fileLoader: fileLoader
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
        }
      );
    },

    //检查
    checkBPMN: function() {
      /*使用形式化验证会在底部出现Toggle Lint按钮，检查只需要点击响应的按钮即可*/
      const bjslButton = document.querySelector(".bjsl-button");
      bjslButton.click();
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
    }
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
#editor .el-container {
  position: fixed;
  margin: auto;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 90%;
}

#editor .el-header {
  display: inline-flex;
  height: 40px;
}

#editor .el-header .el-button-group {
  display: inherit;
}

#editor .bpmnContainer {
  position: relative;
  margin: auto;
  left: 1px;
  right: 1px;
  bottom: 0px;
  height: 95%;
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
  width:300px;
  height:450px;
  overflow-y:scroll;
}

@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "~bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
@import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
</style>
