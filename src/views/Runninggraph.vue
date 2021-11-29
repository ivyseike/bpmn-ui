<template>
    <div id="graph">
        <el-container>
            <el-main>

                <div class="bpmnContainer">
                    <div  v-for="item in icon_list">

<el-popover placement="top-start" title="运行日志"  trigger='click' width='500' >
<p class='logtxt' >{{item.log}}</p>
                        <el-button  slot="reference" :style="item.style" :class="item.class" :type="item.type" circle size="small" v-show="item.show" :title='item.state'></el-button>
  </el-popover>

                    </div>
                    <div id="BpmnCanvas" ref="canvas"></div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import BpmnViewer from 'bpmn-js/lib/Viewer'
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
                tmplist:{},
                bpmn_name:'',
                atBegin:true,
                log_draw:false
            }
        },

        methods: {
            init: function() {
                this.bpmnViewer = new BpmnViewer({
                    container: "#BpmnCanvas",
                })
            this.bpmnViewer.importXML(this.xmlStr)
            
            this.statelist={}
            this.icon_list={}
            this.tmplist={}
this.log_draw=false
            this.atBegin=true
            for(var i in this.place){
               this.statelist[i]='Waiting';
               this.icon_list[i]={"style":"position: absolute; top:"+this.place[i]['y']+"px; left: "+this.place[i]['x']+"px; z-index:10;","class":"el-icon-refresh-right","type":"primary",'show':false,'log':'','id':'',name:i,'state':'点击查看日志'}
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
all_finished:function(){
  if(this.atBegin){return false}
  for(var i in this.statelist){
   if(this.statelist[i]!='Succeeded' && this.statelist[i]!='Failed' && this.statelist[i]!='Omitted'){return false}
  }
  return true;
},
refresh_log: async function(){
    //this.tmplist=JSON.parse(JSON.stringify(this.icon_list))
    var res = []
    for(var i in this.icon_list){
          res.push(this.icon_list[i])
    }
        await Promise.all(res.forEach(async (tmp) =>{
          await axios.get('/api/getlog/'+this.bpmn_name+'/'+tmp.id+'/main-logs').then(log_res => {
              
              this.icon_list[tmp['name']]['log']=log_res.data
            
            })
        }));
},
sysncengine:function () {
this.refresh_log()
{
   axios.get('/api/argost/argo/'+this.bpmn_name).then(res=> {
     var tmplist=JSON.parse(JSON.stringify(this.icon_list))
     for (var i in res.data["status"]['nodes']){
      var state=res.data["status"]['nodes'][i]["phase"];
      var name=res.data["status"]['nodes'][i]["displayName"];
      var id=res.data["status"]['nodes'][i]["id"]
      if(this.not_in_list(name,this.statelist)){
       continue;
      }
      
      tmplist[name]['id']=id
      this.statelist[name]=state;
      if(state=='Succeeded'){
       tmplist[name]['class']="el-icon-check"
       tmplist[name]['type']="success"
       tmplist[name]['show']=true
       tmplist[name]['state']='执行成功!点击查看日志'
       this.atBegin=false
      }else if(state=="Running"){
       tmplist[name]['class']="el-icon-refresh-right"
       tmplist[name]['type']="primary"
       tmplist[name]['show']=true
       tmplist[name]['state']='正在执行...点击查看日志'
       this.atBegin=false
      }else if(state=="Failed"){
       tmplist[name]['class']="el-icon-error"
       tmplist[name]['type']="danger"
       tmplist[name]['show']=true
       tmplist[name]['state']='执行失败!点击查看日志'
       this.atBegin=false
      }else if(state=="Pending"){
       tmplist[name]['class']="el-icon-stopwatch"
       tmplist[name]['type']="primary"
       tmplist[name]['show']=true
       tmplist[name]['state']='正在初始化...'
       this.atBegin=false
      }
    }
    this.icon_list=tmplist
   }).catch(function (error) {
       console.log(error);
   });
}
if(this.all_finished()){
    clearInterval(this.timer);
    this.$message({
     type: 'success',
     message: '顺利完成!'})
}

},

sysnstart:function () {
    this.timer= setInterval(this.sysncengine,500)
}

},
mounted: function() {
    this.init()
    this.sysnstart()

},
created :function(){
if (sessionStorage.getItem('store')) {

      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
if(this.$store.state.bpmn_name==this.$route.query.bpmn_name){
this.xmlStr = this.$store.state.xmlStr
this.place = this.$store.state.place
this.bpmn_name=this.$store.state.bpmn_name
return }
    }

this.xmlStr = this.$route.query.xml
this.place = this.$route.query.place
this.bpmn_name=this.$route.query.bpmn_name
this.$store.state.place=this.place 
this.$store.state.bpmn_name=this.bpmn_name
this.$store.state.xmlStr=this.xmlStr
sessionStorage.setItem('store', JSON.stringify(this.$store.state))
this.$message({
        type: 'success',
        message: '开始调用映射图生成组件'})

}
}
</script>

<style>
.logtxt{
width:100%;
height:300px;
overflow: scroll;
}
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
