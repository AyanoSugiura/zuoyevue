<template>
    <div>
        <el-collapse style="margin-right: 50px;" @change="collapseChange">
            <el-collapse-item title="十发布作业" name="1"  >
                <el-form ref="upLoadData" :model="upLoadData" label-width="80px">
                    <el-form-item label="标题" style="margin-right: 20px;">
                        <el-input v-model="upLoadData.tiltle"></el-input>
                    </el-form-item>
                    <el-form-item label="要求" style="margin-right: 20px;">
                        <el-input type="textarea" v-model="upLoadData.content"></el-input>
                    </el-form-item>

                    <el-upload class='ensure ensureButt' style="width: 500px;margin-left: 35px;"
                        :action="importFileUrl" 
                        :onError="uploadError" 
                        :onSuccess="uploadSuccess" 
                        :on-change="onChanges"
                        :before-remove="bRemove"
                        :beforeUpload="beforeAvatarUpload">
                        <el-button slot="trigger"  size="small" type="primary">点击上传</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-bind:disabled="isKong">发布作业</el-button>
                    </el-upload>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
   export default {
    data() {
      return {
        importFileUrl: 'http://localhost:8089/files/save',
        files_links:'',
        upLoadData: {
          tiltle: '',
          content: '',
          files:''
        },
        courses: [],
        filesList:[],
        filesList2:[],
        zuoyes: []
      }
    },
    computed: {
      isKong: function () {
        return this.upLoadData.tiltle==="";
      }
    },
    methods: {
      collapseChange : function(){
           console.log("额");
         this.upLoadData.tiltle="";
      },
      submitUpload : function(){
          for(fl in this.filesList){
              this.filesList2.push(fl.response);
          }
          this.postRequest("/task/add", {
          cid: this.$router.query.,
          files_links: this.filesList2.join("|"),
          password: this.registerForm.password,
          userlevel: userlevel,
          verify: verify
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data == "注册成功") {}});
      },
      onChanges : function (file,fileList) {
        //console.log(file);
        this.filesList=fileList;
      },
      uploadError: function () {
        ;
      },
      bRemove: function (file, fileList) {
        this.filesList=fileList;
      },
      uploadSuccess: function (response, file, fileList) {
        console.log(fileList);
      },
      beforeAvatarUpload: function () {
        ;
      }
    },
  }
</script>