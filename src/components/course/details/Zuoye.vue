<template>
  <div>
    <el-collapse v-if="this.$store.state.user.userlevel==1" style="margin-right: 50px;" @change="collapseChange">
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
              <router-link v-if="$store.state.user.userlevel==1" style="text-decoration:none" :to="{ name: 'TZyDetails', query: { taskId: zuoye.id }}">
                <h3 class="work-title">{{zuoye.title}}</h3>
              </router-link>
              <router-link v-else-if="$store.state.user.userlevel==0" style="text-decoration:none" :to="{ name: 'SZyDetails', query: { taskId: zuoye }}">
                <h3 class="work-title">{{zuoye.title}}</h3>
              </router-link>
            </span>
          </el-col>
          <el-col :span="9">
            <el-button v-if="$store.state.user.userlevel==0" style="margin-right: 30px;float: right;" size="small" :type="btType(zuoye.stuStatus)"
              @click="switchs(zuoye.stuStatus,zuoye)">{{ zuoye.stuStatus }}</el-button>
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
        <el-col v-for="zy in (zuoye.files_links.split('|'))" :key="zy.length">
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
          <div style="margin-bottom:5px">
            <a :href="zy">{{zy.substring(zy.lastIndexOf("/")+1)}} </a>
          </div>
        </el-col>
      </el-row>



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
          //console.log(resp.data);
          if (this.$store.state.user.userlevel == 0) {

            for (let zuoye in _this.zuoyes) {
              _this.postRequest("/task/stutasks", {
                tasskId: _this.zuoyes[zuoye].id,
                uid: _this.$store.state.user.id
              }).then(resp => {
                if (resp && resp.status == 200) {
                  _this.$set(_this.zuoyes[zuoye], 'stuStatus', resp.data);

                }
              });
            }
          }
          console.log(_this.zuoyes);
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

      btType: function (type) {
        if (type == "未提交") return "warning";
        else if (type == "已批改") return "success";
        else if (type == "未批改") return "info";
      },
      switchs: function (type, zy) {
        console.log(zy.title);
        this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: type } });
        // if (type == "未提交") this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: 1 } });
        // else if (type == "未批改") this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: 2 } });
        // else if (type == "已批改") this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: 3 } });
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