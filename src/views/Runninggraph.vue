<template>
    <div class="search" >
<!--        <el-autocomplete class="inputBox"-->
<!--                         v-model="state"-->
<!--                         :fetch-suggestions="querySearchAsync"-->
<!--                         placeholder="请输入内容"-->
<!--                         :trigger-on-focus="false"-->
<!--                         @select="handleSelect"-->
<!--                         @keyup.enter.native="search"-->
<!--                          >-->
          <!--el-autocomplete class="inputBox"
                           v-model="state"
                           placeholder="请输入所需api种类"
                           :trigger-on-focus="false"
          >
        </el-autocomplete-->

        <el-cascader 
        :options="all_field"
        :props= "{ multiple: 'true'}"
        ref="cascader"
        placeholder="请选择"
        v-model='state'
        >
        

        </el-cascader>
        <el-button type="primary" @click="searchApi">确定</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </div>
</template>

<script>
    import axios from "axios";
    import {request} from "../network/request";
    export default {
        data() {
            return {
                restaurants: [],
                state: '',
                all_field:[],
                selected_field:[],
            };
        },
        methods: {
            cancel(){this.$emit('childFn', this.popup);},
            search(){console.log("search")},
            get_api: async function(){
                
                console.log(this.selected_field)
                await Promise.all(this.selected_field.forEach(async (tmp) =>{
                await axios({
                url: "/api/hnust/findByRequest",
                method: "get",
                params: {
                  message: tmp
                }}).then(res => {
                  console.log(res.status)
                  console.log(res.statusText)
                  console.log("res is:",res.data)
                var recomapi={}
                recomapi[tmp]=res.data
                // 向父组件传递数据
                console.log(res.data)
                this.$emit('transferapi',recomapi)
                if(tmp==this.selected_field[this.selected_field.length-1]){

                this.$emit('childFn', this.popup)}
                this.$message({
                    type: 'success',
                    message: '成功获取'+tmp+' api推荐'
                })
              }).catch(e=>{
                this.$message({
                    type: 'error',
                    message: '获取失败，请检查拼写或使用其他api'
                })
              })
          }));
            },
            searchApi:function(){
                
                console.log("输入语义",this.state[0][0])
                this.$emit('wfname',this.state[0][0])
                var nodes=this.$refs['cascader'].getCheckedNodes()
                console.log(nodes)
                this.selected_field=[]
                for (var i in nodes){
                    this.selected_field.push(nodes[i]['data']['value'])
                }
                console.log(this.selected_field)
                //var tmp=new Set(this.selected_field)
                //this.$emit("clear_options",tmp)
                this.get_api()
              // 通过语义推荐api
              
              
            },
            querySearchAsync(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                //cb(results);
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            loadAll() {
                return [
                    { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
                    { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
                    { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
                    { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
                    { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
                    { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
                    { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
                    { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
                    { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
                    { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
                    { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
                    { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
                    { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
                    { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
                    { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
                    { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
                    { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
                    { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
                    { "value": "枪会山", "address": "上海市普陀区棕榈路" },
                    { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
                    { "value": "钱记", "address": "上海市长宁区天山西路" },
                    { "value": "壹杯加", "address": "上海市长宁区通协路" },
                    { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
                    { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
                    { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
                    { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
                    { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
                    { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
                    { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
                    { "value": "凡仔汉堡（老真北���店）", "address": "上海市普陀区老真北路160号" },
                    { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
                    { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
                    { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
                    { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
                    { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
                    { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
                    { "value": "浏阳蒸菜", "address": "天山西路430号" },
                    { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
                    { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
                    { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
                    { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
                    { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
                    { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
                    { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
                    { "value": "阳阳麻辣烫", "address": "天山西路389号" },
                    { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
                ];
            },
            handleSelect(item) {
                console.log(item);
            },
        },
        mounted() {
            this.restaurants = this.loadAll();
            /*axios({
                url: "/api/hnust/GetAllField",
                method: "get",
                params: {
                  message: ''
                }}).then(res => {
                    this.all_field=[]
                    for(var i in res){
                        this.all_field.push({label:res[i],value:i})
                    }
                })*/
    var res={'Movie':'电影','CarbonFootprint':'碳足迹','Post':'求职','Billboard':'广告牌','Fitness':'饮食'}
    this.all_field=[]
    for(var i in res){
        this.all_field.push({label:res[i],value:i})
    }
   /*this.all_field=[{
      label:'电影',
      value:'Movies'
    },
    {
      label:'饮食',
      value:'Fitness'
    },
    {
      label:'碳足迹',
      value:'CarbonFootprint'
    },
    {
      label:'广告',
      value:'Billboard'
    }
    ]*/
            console.log(this.all_field)
        }
    }
</script>

<style>

    .name {
        text-overflow: ellipsis;
        overflow: hidden;
        float: left;
    }
    .addr {
        font-size: 12px;
        color: red;
        text-align:right;
        float: right;
    }
    .inputBox{
        width:400px
    }
    .search{
        position: fixed;
        border-radius: 0.25rem;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }
</style>
/code # cat src/views/Runninggraph.vue 
<template>
    <div id="graph">
        <el-container>
            <el-main>

                <div class="bpmnContainer">
                    <div  v-for="item in icon_list">

<!-- <el-popover placement="top-start" title="运行日志"  trigger='click' width='500' >
<p class='logtxt' >{{item.log}}</p> -->
                        <el-button  slot="reference" :style="item.style" :class="item.class" :type="item.type" circle size="small" v-show="item.show" :title='item.state' @click="curlog=item.log;serviceTask=true"></el-button>
  <!-- </el-popover> -->

                    </div>
                    <div id="BpmnCanvas" ref="canvas"></div>
                </div>
            </el-main>
        </el-container>
        <Drawer
      title="api选择与参数设置"
      v-model="serviceTask"
      width="720"
      :mask-closable="true"
    >
    <div class="demo-drawer-footer">
        <!--Button style="margin-right: 8px" @click="serviceTask = false;"
          >Cancel</Button
        -->
        <Input
            type="textarea"
            v-model="curlog"
            :rows="32"
            placeholder
            readonly='readonly'
          />
        <Button type="primary" @click="serviceTask = false">关闭</Button>
      </div>
      </Drawer>
    </div>
</template>

<script>
    import BpmnViewer from 'bpmn-js/lib/Viewer'
    import axios from 'axios';

    export default {
        name: "Graph",
        data: function() {
            return {
              curlog:'',
              serviceTask:false,
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
            console.log(this.place)
            for(var i in this.place){
               this.statelist[i]='Waiting';
               this.icon_list[i]={"style":"position: absolute; top:"+this.place[i]['y']+"px; left: "+this.place[i]['x']+"px; z-index:10;","class":"el-icon-refresh-right","type":"primary",'show':false,'log':'','id':'',name:i,'state':'点击查看日志'}
           }
           console.log(this.statelist)

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
    var res = []
    for(var i in this.icon_list){
          res.push(this.icon_list[i])
    }
        await Promise.all(res.forEach(async (tmp) =>{
  console.log(res)
  console.log(tmp)
  if(tmp.id==''){
    return
  }
          await axios.get('/api/getlog/'+this.bpmn_name+'/'+tmp.id+'/main-logs').then(log_res => {
              
              this.icon_list[tmp['name']]['log']=log_res.data
            
            })
        }));
},
sysncengine:function () {

{
   axios.get('/api/argost/argo/'+this.bpmn_name).then(res=> {
     var tmplist=JSON.parse(JSON.stringify(this.icon_list))
     for (var i in res.data["status"]['nodes']){
      var state=res.data["status"]['nodes'][i]["phase"];
      var name=this.name_map[res.data["status"]['nodes'][i]["displayName"]];
      var id=res.data["status"]['nodes'][i]["id"]
      console.log(name)
      if(this.not_in_list(name,this.statelist)){
       continue;
      }
      console.log(tmplist[name]['id'])
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
       console.log('ftyft')
      }else if(state=="Failed" || state=="Error"){
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
    this.refresh_log()
    if(res.data["status"]["phase"]=='Succeeded'){
    clearInterval(this.timer);
    this.$message({
     type: 'success',
     message: '顺利完成!'})
}else if(res.data["status"]["phase"]=='Failed'){
  clearInterval(this.timer);
    this.$message.error("执行出错！");
}else if(res.data["status"]["phase"]=='Error'){
  clearInterval(this.timer);
    this.$message.error("执行出错！");
}
   }).catch(function (error) {
       console.log(error);
   });
}

//if(this.all_finished()){


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
this.name_map=this.$store.state.name_map
return }
    }

this.xmlStr = this.$route.query.xml
this.place = this.$route.query.place
this.bpmn_name=this.$route.query.bpmn_name
this.name_map=this.$route.query.name_map
this.$store.state.place=this.place 
this.$store.state.bpmn_name=this.bpmn_name
this.$store.state.xmlStr=this.xmlStr
this.$store.state.name_map=this.name_map
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