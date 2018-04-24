<template>
  <el-form ref="upLoadData" :model="upLoadData" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="upLoadData.tiltle"></el-input>
    </el-form-item>
    <el-form-item label="注意事项">
      <el-input type="textarea" v-model="upLoadData.content"></el-input>
    </el-form-item>

    <el-upload 
        class='ensure ensureButt' 
        :action="importFileUrl" 
        :data="upLoadData" 
        name="importfile" 
        :auto-upload="false"
        :onError="uploadError"
        :onSuccess="uploadSuccess" 
        :on-change="coutfl"
        :beforeUpload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        importFileUrl: 'http://127.0.0.1:8089/',
        upLoadData: {
          tiltle: '',
          content: '',
          files:''
        },
        courses: [],
        filesList:[],
        zuoyes: []
      }
    },
    computed: {
      /* isKong: function () {
        console.log(fileList);
      } */
    },
    methods: {
      coutfl : function (file,fileList) {
        console.log(file);
        console.log(fileList);

      },
      uploadError: function () {
        ;
      },
      uploadSuccess: function () {
        ;
      },
      beforeAvatarUpload: function () {
        ;
      }
    },
  }
</script>