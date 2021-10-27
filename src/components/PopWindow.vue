<template>
    <div></div>
</template>

<script>
    import {request} from '../network/request'

    export default {
        methods: {
            open() {
                this.$prompt('', '信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    showInput:true,
                    inputPlaceholder:"请输入信息",
                    inputType:"textarea",
                    //inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    //inputErrorMessage: '邮箱格式不正确'
                }).then(({ value })=>{
                    this.$message({
                        type: 'success',
                        message: '你的输入是: ' + (value == null ? "" : value)
                    })
                    //发送数据
                    // request({
                    //     url:"/hello/getMessage",
                    //     method:"get",
                    //     params:{
                    //         message:value
                    //     }
                    // }).then(res=>{
                    //     console.log("发送成功")
                    // }).catch(err=>{
                    //     console.log("发送失败")
                    // })
                    request({
                        url:"/hello/setMessage",
                        method:"post",
                        data:{
                         name:"wupeng",
                         age:18,
                         sex:"男"
                        },
                        params:{
                            par:value == null?"":value
                        }
                    }).then(res=>{
                        console.log("发送成功")
                    }).catch(err=>{
                        console.log("发送失败")
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                })
        }
    }}
</script>