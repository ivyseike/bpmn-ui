<template>
    <div id="graph">
        <el-container>
            <el-main>

                <div class="bpmnContainer">
                    <div  v-for="item in icon_list">
                        <el-button :style="item.style" :class="item.class" :type="item.type" circle size="small" v-show="item.show"></el-button>
                    </div>
                    <div id="BpmnCanvas" ref="canvas"></div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
    import axios from 'axios';

    export default {
        name: "Graph",
        data: function() {
            return {
                bpmnViewer: null,
                timer:'',
                xmlStr: null,
                icon_list:{},
                place:{},
                statelist:{},
                bpmn_name:'',
            }
        },

        methods: {
            init: function() {
                this.bpmnViewer = new BpmnViewer({
                    container: "#BpmnCanvas",
                })
                /*axios.get('/api/getexp/tt').then(res=>{
                 this.bpmn_name=res.data
                }).catch(function (error) {
                console.log(error);
            });*/
            this.xmlStr = this.$route.query.xml
            this.bpmnViewer.importXML(this.xmlStr)
            this.place = this.$route.query.place
            this.bpmn_name=this.$route.query.bpmn_name
            this.statelist={}
            this.icon_list={}
            for(var i in this.place){
               this.statelist[i]='Waiting';
               this.icon_list[i]={"style":"position: absolute; top:"+this.place[i]['y']+"px; left: "+this.place[i]['x']+"px; z-index:10;","class":"el-icon-refresh-right","type":"primary",'show':false}
           }
       },
       not_in_list:function(item,list){
          for(var i in list){
           if(i==item){
            return false;
        }
    }
    return true;
},
not_all_succeed:function(){
  for(var i in this.statelist){
   if(this.statelist[i]!='Succeeded'){return true}
}
return false;
},
sysncengine:function () {
  if(this.not_all_succeed()){
   axios.get('/api/argost/argo/'+this.bpmn_name).then(res=> {
     var tmplist=JSON.parse(JSON.stringify(this.icon_list))
     for (var i in res.data["status"]['nodes']){
      var state=res.data["status"]['nodes'][i]["phase"];
      var name=res.data["status"]['nodes'][i]["displayName"];
      if(this.not_in_list(name,this.statelist)){
       continue;
   }
   this.statelist[name]=state;
   if(state=='Succeeded'){
       tmplist[name]['class']="el-icon-check"
       tmplist[name]['type']="success"
       tmplist[name]['show']=true
   }else if(state=="Running"){
       tmplist[name]['class']="el-icon-refresh-right"
       tmplist[name]['type']="primary"
       tmplist[name]['show']=true
   }
}
this.icon_list=tmplist
})
   .catch(function (error) {
       console.log(error);
   });
}else {
    clearInterval(this.timer);
    this.$message({
     type: 'success',
     message: '顺利完成!'})
}

},

sysnstart:function () {
    this.$message({
        type: 'success',
        message: '开始调用映射图生成组件'})
    this.timer= setInterval(this.sysncengine,500)
}

},
mounted: function() {
    this.init()
    this.sysnstart()
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
