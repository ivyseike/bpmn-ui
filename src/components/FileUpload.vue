<template>
    <div class="file-upload-window">
        <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :http-request="uploadSectionFile"
                multiple
                :file-list="fileList"
                :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <!--  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
    </div>

</template>

<script>
    export default {
        name: "FileUpload",
        data() {
            return {
                //fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
                formData:[],
                fileList:[]
            };
        },
        methods: {
            submitUpload() {
                console.log("submitUpload");
                this.formData = new FormData();
                this.$refs.upload.submit();
                console.log("AFTERSUBMIT");
                console.log(this.formData);

                if(this.fileList.length>0){
                    this.$axios({
                        method: 'post',
                        url: 'http://localhost:8090/upload/uploadFiles',
                        // headers: {
                        //     'Content-Type': 'multipart/form-data'
                        // },
                        data: this.formData
                    })
                }

            },

            uploadSectionFile(param) {
                console.log(param.file);
                this.fileList.push(param.file)
                console.log("uploadSectionFile");
                this.formData.append('files',param.file)
                //var fileObj = param.file;
            }
        }
    }
</script>

<style scoped>
    .file-upload-window {        
        width: 400px;
    }
</style>