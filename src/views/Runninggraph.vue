<template>
    <div id="graph">
        <el-container>
            <el-main>

                <div class="bpmnContainer">
<!--                    <div  id="refresh" >-->
<!--                        <el-button :style="button_style" class="el-icon-refresh-right" type="success" circle size="small"></el-button>-->
<!--                    </div>-->
                    <el-button type="info" size="medium" class="el-icon-refresh" @click="sysnstart">同步运行状态</el-button>
                    <div id = "refresh" v-for="item in icon_list" v-show="buttonvisible">
                        <el-button :style="item.style" :class="item.class" :type="item.type" circle size="small"></el-button>

                    </div>
                    <div id="BpmnCanvas" ref="canvas"></div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'



    export default {
        name: "Graph",
        data: function() {
            return {
                bpmnViewer: null,
                timer:'',
                xmlStr: null,
                button_style: null,
                icon_list:[],
                buttonvisible:false,
                place:[],
                left:[],
                top:[],
                count: 0
            }
        },

        methods: {
            init: function() {
                this.bpmnViewer = new BpmnViewer({
                    container: "#BpmnCanvas",
                })
                this.xmlStr = this.$route.query.xml
                this.bpmnViewer.importXML(this.xmlStr)
                this.place = this.$route.query.place
                console.log(this.place)

            },

            sysncengine:function () {

                this.buttonvisible=true
                if(this.count >0){
                    var pre = this.count-1
                    var pre_button_style="position: absolute; top:"+this.top[pre]+"px; left: "+this.left[pre]+"px; z-index:10;"
                    this.icon_list[pre].class = "el-icon-check"
                    this.icon_list[pre].type = "success"
                    console.log(pre)
                    console.log(this.icon_list[pre])
                }
                if(this.count<this.place.length){
                    this.left.push(this.place[this.count]["x"])
                    this.top.push(this.place[this.count]["y"])
                    var button_style="position: absolute; top:"+this.top[this.count]+"px; left: "+this.left[this.count]+"px; z-index:10;"
                    var style_tmp = {"style":button_style,"class":"el-icon-refresh-right","type":"primary"}
                    this.icon_list.push(style_tmp)
                    this.count++
                    console.log(this.count)

                }else {
                    clearInterval(this.timer);
                }

            },

            sysnstart:function () {
                this.$message({
                    type: 'success',
                    message: '开始调用映射图生成组件'})
                this.icon_list=[]
                this.timer= setInterval(this.sysncengine,600)
            }

        },
        mounted: function() {
            this.init()
        },
        activated:function(){
            this.xmlStr = this.$store.state.BpmnXml
            this.bpmnViewer.importXML(this.xmlStr)
        }
    }
</script>

<style>


    #graph {
        position: fixed;
        margin: auto;
        left: 0px;
        right: 0px;
        bottom: 0px;
        height: 100%;
        width: 100%;
    }
    .el-header {
        padding: 0px;
    }
    /*.el-button {*/
    /*    background-color: #3F4254;*/
    /*}*/
    #graph .el-container {

        height: 100%;
        width: 100%;
    }
    .el-main {

        padding: 00px;
    }
    #graph .el-container .el-main {

        height: 100%;
        weight: 100%
    }

    #graph .el-container .el-main .bpmnContainer {
        border: #000 solid 1px;
        height: 100%;
        weight: 100%
    }

    #graph .el-container .el-main .bpmnContainer #BpmnCanvas {
        height: 100%;
        weight: 100%
    }



    .bjs-container.simulation {
        border: none;
    }
</style>
