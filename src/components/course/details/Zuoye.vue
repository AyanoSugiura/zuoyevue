<template>
  <div>
    <el-collapse style="margin-right: 50px;" @change="collapseChange">
      <el-collapse-item title="十发布作业" name="1">
        <el-form ref="upLoadData" :model="upLoadData" label-width="80px">
          <el-form-item label="标题" style="margin-right: 20px;">
            <el-input v-model="upLoadData.title"></el-input>
          </el-form-item>
          <el-form-item label="要求" style="margin-right: 20px;">
            <el-input type="textarea" v-model="upLoadData.content"></el-input>
          </el-form-item>

          <el-upload class='ensure ensureButt' style="width: 500px;margin-left: 35px;" :action="importFileUrl" :onError="uploadError"
            :onSuccess="uploadSuccess" :on-change="onChanges" :before-remove="bRemove" :beforeUpload="beforeAvatarUpload">
            <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-bind:disabled="isKong">发布作业</el-button>
          </el-upload>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <br/>

    <el-card v-for="zuoye in zuoyes" :key="zuoye.id" style=" margin-right: 50px; margin-bottom:15px ">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="15">
            <span>
              <h3 class="work-title">{{zuoye.title}}</h3>
            </span>
          </el-col>

          <el-col :span="9">

          </el-col>
        </el-row>
      </div>

      

      <div class="word">
        <div class="p">{{zuoye.content}}</div>
      </div>
      <br/>
     <!-- <el-row>
        <el-col :span="3" v-for="zy in (zuoye.files_links.split('|'))"  :key="zy.length" >
           <a> {{zy}} </a>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col  v-for="zy in (zuoye.files_links.split('|'))"  :key="zy.length" >
          <!-- {{zy.substring(zy.lastIndexOf("."))}} -->
           <!-- <div align="left" v-if="(zy.substring(zy.lastIndexOf('|')))=='.doc' ">
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_xlsx.png">
           </div>
           <div align="left" v-else-if="(zy.substring(zy.lastIndexOf('|')))=='.docx' ">
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_xlsx.png">
           </div>
           <div align="left" v-else-if="(zy.substring(zy.lastIndexOf('|')))=='.pdf' ">
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_pdf.png">
           </div>
           <div align="left" v-else>
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_pdf.png">
           </div> -->
           <div style="margin-bottom:5px"> <a  :href="zy">{{zy.substring(zy.lastIndexOf("/")+1)}} </a> </div>
        </el-col>
      </el-row>

      <!-- <div align="left">
        <ul class="clearfix">

          <li data-id="MDAwMDAwMDAwMLSsrd6HucmwhctyoQ" data-size="6.47KB">
            <a href="javascript:;" data-name="新建 Microsoft Excel 工作表.xlsx" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmwhctyoQ/expires/4647055914/sign/c35c69f1bf08e9f45192c9356b409273513c6b7a.html"
              data-popurl="" data-down="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmwhctyoQ/expires/4647055914/sign/c35c69f1bf08e9f45192c9356b409273513c6b7a.html"
              data-ispic="" data-isvideo="" data-isonline="" data-issb="" class="fileext preview">
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_xlsx.png" data-src="">
            </a>
            <h4>
              <a href="javascript:;" data-name="新建 Microsoft Excel 工作表.xlsx" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmwhctyoQ/expires/4647055914/sign/c35c69f1bf08e9f45192c9356b409273513c6b7a.html"
                data-popurl="" data-src="" data-ispic="" data-isvideo="" data-isonline="" data-issb="" class="fileext preview"
                title="新建 Microsoft Excel 工作表.xlsx">
                新建 Microsoft Excel 工作表.xlsx
              </a>
            </h4>
            <a href="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmwhctyoQ/expires/4647055914/sign/c35c69f1bf08e9f45192c9356b409273513c6b7a.html"
              class="download">下载</a>
          </li>

          <li data-id="MDAwMDAwMDAwMLSsrd6HucmxhMtyoQ" data-size="292KB">
            <a href="javascript:;" data-name="3 2017届毕业设计（论文）开题报告.doc" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmxhMtyoQ/expires/4647055914/sign/9684c38d787c552efd1d152c4139e7c1fb6e955e.html"
              data-popurl="" data-down="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmxhMtyoQ/expires/4647055914/sign/9684c38d787c552efd1d152c4139e7c1fb6e955e.html"
              data-ispic="" data-isvideo="" data-isonline="" data-issb="" class="fileext preview">
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_xlsx.png" data-src="">
            </a>
            <h4>
              <a href="javascript:;" data-name="3 2017届毕业设计（论文）开题报告.doc" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmxhMtyoQ/expires/4647055914/sign/9684c38d787c552efd1d152c4139e7c1fb6e955e.html"
                data-popurl="" data-src="" data-ispic="" data-isvideo="" data-isonline="" data-issb="" class="fileext preview"
                title="3 2017届毕业设计（论文）开题报告.doc">
                3 2017届毕业设计（论文）开题报告.doc
              </a>
            </h4>
            <a href="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmxhMtyoQ/expires/4647055914/sign/9684c38d787c552efd1d152c4139e7c1fb6e955e.html"
              class="download">下载</a>
          </li>

          <li data-id="MDAwMDAwMDAwMLSsrd6HucmxhbVyoQ" data-size="134B">
            <a href="javascript:;" data-name="新建文本文档.txt" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmxhbVyoQ/expires/4647055914/sign/96c75b4f588a0f59e1301dad0596800eac1e9d05.html"
              data-popurl="" data-down="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmxhbVyoQ/expires/4647055914/sign/96c75b4f588a0f59e1301dad0596800eac1e9d05.html"
              data-ispic="" data-isvideo="" data-isonline="" data-issb="" class="fileext preview">
              <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_txt.png" data-src="">
            </a>
            <h4>
              <a href="javascript:;" data-name="新建文本文档.txt" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmxhbVyoQ/expires/4647055914/sign/96c75b4f588a0f59e1301dad0596800eac1e9d05.html"
                data-popurl="" data-src="" data-ispic="" data-isvideo="" data-isonline="" data-issb="" class="fileext preview"
                title="新建文本文档.txt">
                新建文本文档.txt
              </a>
            </h4>
            <a href="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmxhbVyoQ/expires/4647055914/sign/96c75b4f588a0f59e1301dad0596800eac1e9d05.html"
              class="download">下载</a>
          </li>

          <li data-id="MDAwMDAwMDAwMLSsrd6HucmxhdtyoQ" data-size="23.49KB">
            <a href="javascript:;" data-name="g2-ypTky_400x400.jpg" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmxhdtyoQ/expires/4647055914/sign/c1a2c3a29573c7622bc9d19208864149c1092c97.html"
              data-popurl="" data-down="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmxhdtyoQ/expires/4647055914/sign/c1a2c3a29573c7622bc9d19208864149c1092c97.html"
              data-ispic="1" data-isvideo="" data-isonline="" data-issb="" class="fileext preview">
              <img src="//img.ketangpai.com/ketangpai.aliapp.com/1/webroot/Uploads/Download/2018-04-29/5ae579fdcd514.jpg%40%2164-64?OSSAccessKeyId=LTAItfPkNIKJFibY&amp;Expires=1525596714&amp;Signature=t2oQ52T1e9yOwgtiBuux1SH4QS4%3D"
                data-src="//img.ketangpai.com/ketangpai.aliapp.com/1/webroot/Uploads/Download/2018-04-29/5ae579fdcd514.jpg?OSSAccessKeyId=LTAItfPkNIKJFibY&amp;Expires=1628671914&amp;Signature=g0FPjJFAKCYE9qDAj7aMKG7ZTEY%3D">
            </a>
            <h4>
              <a href="javascript:;" data-name="g2-ypTky_400x400.jpg" data-url="/PluginApp/to/id/MDAwMDAwMDAwMLSsrd6HucmxhdtyoQ/expires/4647055914/sign/c1a2c3a29573c7622bc9d19208864149c1092c97.html"
                data-popurl="" data-src="//img.ketangpai.com/ketangpai.aliapp.com/1/webroot/Uploads/Download/2018-04-29/5ae579fdcd514.jpg?OSSAccessKeyId=LTAItfPkNIKJFibY&amp;Expires=1628671914&amp;Signature=g0FPjJFAKCYE9qDAj7aMKG7ZTEY%3D"
                data-ispic="1" data-isvideo="" data-isonline="" data-issb="" class="fileext preview" title="g2-ypTky_400x400.jpg">
                g2-ypTky_400x400.jpg
              </a>
            </h4>
            <a href="/File/download/id/MDAwMDAwMDAwMLSsrd6HucmxhdtyoQ/expires/4647055914/sign/c1a2c3a29573c7622bc9d19208864149c1092c97.html"
              class="download">下载</a>
          </li>

        </ul>
      </div> -->

    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        importFileUrl: "http://localhost:8089/files/save",
        files_links: "",
        upLoadData: {
          title: "",
          content: "",
          files: ""
        },
        courses: [],
        filesList: [],
        filesList2: [],
        zuoyes: []
      };
    },
    created: function () {
      var _this = this;

      this.postRequest("/task/taskbc", {
        cid: this.$store.state.courseId
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.zuoyes = resp.data;
          console.log( resp.data);
        }
      });
    },
    computed: {
      isKong: function () {
        return this.upLoadData.title === "";
      }
    },
    methods: {
      collapseChange: function () {
        console.log(this.$store.state.courseId);
        this.upLoadData.title = "";
      },

      submitUpload: function () {
        var _this = this;
        for (let fl in this.filesList) {
          this.filesList2.push(this.filesList[fl].response);
        }
        this.postRequest("/task/add", {
          cid: this.$store.state.courseId,
          files_links: this.filesList2.join("|"),
          title: this.upLoadData.title,
          content: this.upLoadData.content
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data == "发布成功") {
            _this.$notify({
              title: "成功",
              message: "作业发布成功",
              type: "success",
              duration: 2000
            });

            this.postRequest("/task/taskbc", {
              cid: this.$store.state.courseId
            }).then(resp => {
              if (resp && resp.status == 200) {
                _this.zuoyes = resp.data;
              }
            });
          } else
            _this.$notify.error({
              title: "保存失败",
              message: "请联系管理员"
            });
        });
      },

      onChanges: function (file, fileList) {
        //console.log(file);
        this.filesList = fileList;
      },
      uploadError: function () { },
      bRemove: function (file, fileList) {
        this.filesList = fileList;
      },
      uploadSuccess: function (response, file, fileList) {
        console.log(fileList);
      },
      beforeAvatarUpload: function () { }
    }
  };
</script>
<style>
  .announce-cont-box .announce-cont .word .p {
    color: #5b5b5b;
    overflow: hidden;
    line-height: 1.8;
  }

  .word {
    height: auto;
    overflow: auto;
    max-height: inherit;
  }

  h3 {
    color: #5b5b5b;
    display: block;
    font-size: 1.05em;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }

  .clearfix {
    zoom: 1;
  }

  .download {
    color: #4d90fe;
    font-size: 12px;
    display: none;
    line-height: 24px;
  }
</style>