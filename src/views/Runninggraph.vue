<template>
    <div id="graph">
        <el-container>
            <el-main>

                <div class="bpmnContainer">
                    <div  id="refresh" >
                        <el-button :style="button_style" class="el-icon-refresh-right" type="success" circle size="small"></el-button>
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

                xmlStr: null,
                button_style: null
            }
        },

        methods: {
            init: function() {
                this.bpmnViewer = new BpmnViewer({
                    container: "#BpmnCanvas",
                })
                this.xmlStr = this.$route.query.xml
                this.bpmnViewer.importXML(this.xmlStr)
                var tmp = this.$route.query.place
                console.log(tmp)
                for (var i=0;i < tmp.length;i++){
                    var left = tmp[i]["x"]
                    var top = tmp[i]["y"]
                    this.button_style="position: absolute; top:"+top+"px; left: "+left+"px; z-index:10;"
                }

            },

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
    .el-button {
        background-color: #3F4254;
    }
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
