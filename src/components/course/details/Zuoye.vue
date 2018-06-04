<template>
  <div>
    <!-- 发布作业控件 -->
    <el-collapse v-if="this.$store.state.user.userlevel==1" style="margin-left: 50px;;margin-right: 50px;" @change="collapseChange">
      <el-collapse-item title="十发布作业" name="1">
        <el-form ref="upLoadData" :model="upLoadData" label-width="80px">
          <el-form-item label="标题" style="margin-right: 20px;">
            <el-input v-model="upLoadData.title"></el-input>
          </el-form-item>
          <el-form-item label="要求" style="margin-right: 20px;">
            <el-input type="textarea" v-model="upLoadData.content"></el-input>
          </el-form-item>

          <el-upload class='ensure ensureButt' style="width: 500px;margin-left: 35px;" :file-list="filesList" :action="importFileUrl" :onError="uploadError"
            :onSuccess="uploadSuccess" :on-change="onChanges" :before-remove="bRemove" :beforeUpload="beforeAvatarUpload">
            <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-bind:disabled="isKong">发布作业</el-button>
          </el-upload>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <br/>
    <!-- 每个任务修改对话框 -->
    <el-dialog v-if="$store.state.user.userlevel==1" :title="(zuoyes.length-ndx)+'、'+'  '+tassk.title" :visible.sync="dialogFormVisible"
      style="width: 1000px;margin-left: 300px ">
      <el-form :model="tassk" status-icon style="width: 100%;">
        <el-form-item label="标题" prop="name">
          <el-input v-model="tassk.title" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="要求">
          <el-input type="textarea" v-model="tassk.content" placeholder="作业简介，作业格式等要求"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload class='ensure ensureButt' :action="importFileUrl" :file-list="tasskFiles" :on-change="tasskFilesChanges" :before-remove="tasskFilesRemove">
            <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="editSubmit" v-bind:disabled="taskFilesIsKong">保存</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 遍历并展示所有控件 -->
    <el-card v-for="(zuoye,index) in zuoyes" :key="zuoye.id" style="margin-left: 50px; margin-right: 50px; margin-bottom:15px ">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="14">
            <span>
              <router-link v-if="$store.state.user.userlevel==1" style="text-decoration:none" :to="{ name: 'TZyDetails', query: { taskId: zuoye.id }}">
                <h3 class="work-title">{{(zuoyes.length-index)+'、'+' '+zuoye.title}}</h3>
              </router-link>
              <router-link v-else-if="$store.state.user.userlevel==0" style="text-decoration:none" :to="{ name: 'SZyDetails', query: { taskId: zuoye.id }}">
                <h3 class="work-title">{{zuoye.title}}</h3>
              </router-link>
            </span>
            <!-- <h3 class="work-title"><el-button style="float: right; " type="text">编辑</el-button></h3> -->
          </el-col>
          <el-col :span="2" style="padding-top: 0px">
            <h3 class="work-title">
              <el-button v-if="$store.state.user.userlevel==1" @click="editTask(zuoye,index)" style="float: right;padding-top: 0px " type="text">
                <i class="el-icon-edit">编辑</i>
              </el-button>
            </h3>
          </el-col>
          <el-col :span="8">
            <el-button v-if="$store.state.user.userlevel==0" style="margin-right: 30px;float: right;" size="small" :type="btType(zuoye.isSub)"
              @click="switchs(zuoye.isSub,zuoye)">{{ zuoye.isSub }}</el-button>

            <div v-if="$store.state.user.userlevel==1" style="float: right;margin-right: 15px">
              <div style="float: left;" class="total-cont">
                <p style=" color: #5b5b5b; font-size: 30px ;margin-top: 5px;margin-bottom: 0px;">{{zuoye.pgStatistics.isPg}}</p>
                <p style=" color: green; font-size: 15px ;margin-top: 5px;margin-bottom: 3px;">已批</p>
              </div>
              <div style="float: left;" class="total-cont">
                <p style=" color: #5b5b5b; font-size: 30px ;margin-top: 5px;margin-bottom: 0px;">{{zuoye.pgStatistics.noPg}}</p>
                <p style=" color: grey; font-size: 15px ;margin-top: 5px;margin-bottom: 3px;">未批</p>
              </div>
              <div style="float: left;" class="total-cont">
                <p style=" color: #5b5b5b; font-size: 30px ;margin-top: 5px;margin-bottom: 0px;">{{zuoye.pgStatistics.noSub}}</p>
                <p style=" color: red; font-size: 15px ;margin-top: 5px;margin-bottom: 3px;">未交</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="word">
        <div class="pr">{{zuoye.content}}</div>
      </div>
      <br/>
      <!-- <el-row>
        <el-col :span="3" v-for="zy in (zuoye.files_links.split('|'))"  :key="zy.length" >
           <a> {{zy}} </a>
        </el-col>
      </el-row> -->

      <div v-if="(zuoye.files_links)!=''">
        <div v-for="(zy,index) in (zuoye.files_links.split('|'))" :key="index" style="margin-right: 20px;margin-bottom:50px;float: left;">
          <div v-if="(zy.substring(zy.lastIndexOf('.')))=='.doc'||(zy.substring(zy.lastIndexOf('.')))=='.docx'||(zy.substring(zy.lastIndexOf('.')))=='.xls'||(zy.substring(zy.lastIndexOf('.')))=='.xlsx'||(zy.substring(zy.lastIndexOf('.')))=='.ppt'||(zy.substring(zy.lastIndexOf('.')))=='.pptx'||(zy.substring(zy.lastIndexOf('.')))=='.pdf'||(zy.substring(zy.lastIndexOf('.')))=='.txt'||(zy.substring(zy.lastIndexOf('.')))=='.zip'  ">
            <img :src="'https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_'+((zy.substring(zy.lastIndexOf('.'))).substr(1))+'.png'"
              height="80px" width="80px">
          </div>
          <div v-else>
            <img src="https://www.ketangpai.com/Public/Common/img/fileicon/file_ext_big_others.png" height="80px" width="80px">
          </div>
          <div>
            <a :href="zy" class="file_font" style="text-decoration:none">{{((zy.substring(zy.lastIndexOf("/")+1).length)>6?((zy.substring(zy.lastIndexOf("/")+1)).substring(0,6)):(zy.substring(zy.lastIndexOf("/")+1)))+'...'}}
            </a>
          </div>
        </div>
      </div>
      <!-- </el-row> -->
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

        tassk: {},
        ndx: null,
        tasskFiles: [],
        tasskFilesHelps: [],
        filee: {
          name: "",
          response: "",
          status: "success",
          url: ""
        },

        dialogFormVisible: false,
        courses: [],
        linshi: [],
        filesList: [],
        filesList2: [],
        zuoyes: []
      };
    },
    created: function () {
      var _this = this;

      this.postRequest("/szy/taskbc", {
        cid: this.$store.state.courseId,
        uid: this.$store.state.user.id,
        uLevel: this.$store.state.user.userlevel
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.zuoyes = resp.data;
          console.log(resp.data);
        }
      });

      console.log(this.zuoyes);
    },
    computed: {
      isKong: function () {
        return this.upLoadData.title === "";
      },
      taskFilesIsKong: function () {
        return this.tasskFiles.length == 0;
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
            _this.filesList=[];
            this.postRequest("/szy/taskbc", {
              cid: this.$store.state.courseId,
              uid: this.$store.state.user.id,
              uLevel: this.$store.state.user.userlevel
            }).then(resp => {
              if (resp && resp.status == 200) {
                //_this.$set(_this.zuoyes,resp.data)
                _this.zuoyes = resp.data;
                console.log(resp.data);
                _this.upLoadData.title = '';
                _this.upLoadData.content = '';
                _this.tasskFiles = '';
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
        this.$router.push({
          name: "SZyDetails",
          query: { taskId: zy.id }
        });
        // if (type == "未提交") this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: 1 } });
        // else if (type == "未批改") this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: 2 } });
        // else if (type == "已批改") this.$router.push({ name: 'SZyDetails', query: { taskId: zy.id, taskTitle: zy.title, stuStatus: 3 } });
      },


      //以下单个任务修改
      editTask: function (task, index) {
        this.tassk = task;
        this.ndx = index;
        this.tasskFiles = [];
        if (task.files_links != '') {
          var fls = task.files_links.split('|');
          for (let fl in fls) {
            this.filee = {};
            this.$set(this.filee, 'name', (fls[fl]).substring(fls[fl].lastIndexOf("/") + 1));
            this.$set(this.filee, 'response', fls[fl]);
            this.$set(this.filee, 'url', fls[fl]);
            this.$set(this.filee, 'status', 'success');
            console.log(this.filee);
            this.tasskFiles.push(this.filee);
          }
        }
        this.dialogFormVisible = true;
      },

      editSubmit: function () {
        var _this = this;
        this.tasskFilesHelps = [];
        for (let fl in this.tasskFiles) {
          this.tasskFilesHelps.push(this.tasskFiles[fl].response);
        }
        this.postRequest("/szy/taskalter", {
          cid: this.$store.state.courseId,
          id: this.tassk.id,
          title: this.tassk.title,
          content: this.tassk.content,
          files_links: this.tasskFilesHelps.join("|")
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data != "") {
            _this.$set(_this.zuoyes, _this.ndx, resp.data);
            _this.$notify({
              title: "成功",
              message: "作业修改成功",
              type: "success",
              duration: 2000
            });
            _this.tassk = {};
            _this.tasskFiles = [];
            _this.tasskFilesHelps = [];
            _this.ndx = null
            _this.filee = {};
            _this.dialogFormVisible = false;
          } else
            _this.$notify.error({
              title: "作业修改失败",
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
      beforeAvatarUpload: function () { },

      tasskFilesChanges: function (file, fileList) {
        this.tasskFiles = fileList;
        console.log(this.tasskFiles);
      },
      tasskFilesRemove: function (file, fileList) {
        this.tasskFiles = fileList;
        console.log(this.tasskFiles);
      }
    },

  };
</script>
<style>
  .announce-cont-box .announce-cont .word .pr {
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

  .total-cont {
    border-left-style: solid;
    border-left-color: #c8c8c8;
    border-left-width: 1px;

    padding: 0px 43px 0px 18px;
  }

   .file_font {
    font-size: 12.6px;
    font-family: 微软雅黑;
  }
</style>