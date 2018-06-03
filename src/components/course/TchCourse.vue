<template>
  <el-container>
    <el-header style=" display: flex;height: 38px;">
      <el-button class="ktcon1l fl" type="text" @click="dialogFormVisible = true">
        <i class="el-icon-plus">创建课程</i>
      </el-button>
    </el-header>
    <el-dialog title="创建课程" :visible.sync="dialogFormVisible" style="width: 835px">
      <el-form :inline="true" :model="course" status-icon :rules="rules">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="course.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="submitClick" v-bind:disabled="isKong">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-main>

      <el-card v-for="course in courses" :key="course.id" style="width: 206px; height: 206px; margin: 10px; float:left" :body-style="{ padding: '0px' }">
        <span style="font-family:'Microsoft YaHei';font-size:18px;color: white">
          <div style="position: relative; width: 170px; height: 89px;">
            <img :src="'http://assets.ketangpai.com/theme/min/'+  (course.id<10?( '0' +course.id):course.id) +'.jpg'" style="width:206px;height:103px">
            <span style="position: absolute;top:15px;left: 15px; ">
              <router-link style="color:white;text-decoration:none" :to="{ name: 'CourseDetails', query: { courseId: course.id }}">{{course.name}}</router-link>
            </span>
          </div>
        </span>

        <div style="padding-top: 20px;padding-left: 14px;padding-right: 14px;margin-bottom: 13px">
          <span>课程号:{{course.id}}</span>
        </div>
        <div style="margin-bottom: 6px">
          <span class="recent_work">近期作业</span>
        </div>
        <div v-if="course.recentTriTaskId!=null">
          <span class="recent_work2" :title="course.recentTriTaskTitle.length>9?course.recentTriTaskTitle.substring(0,9)+'...':course.recentTriTaskTitle">
            <router-link style="text-decoration:none" v-if="$store.state.user.userlevel==1" :to="{ name: 'TZyDetails', query: { taskId: course.recentTriTaskId }}">
              {{course.recentTriTaskTitle.length>7?course.recentTriTaskTitle.substring(0,7)+'...':course.recentTriTaskTitle}}
            </router-link>
          </span>
        </div>
        <div v-else>
          <br/>
        </div>
        <div style="padding-right:5px ;margin-bottom:5px ">
          <span class="cardmbr hy">成员{{course.stuNum}}</span>
        </div>
      </el-card>

    </el-main>

  </el-container>


</template>

<script>
  export default {
    data() {

      var validateName = (rule, value, callback) => {
        var _this = this;
        this.postRequest("/course/jcnnamebt", {
          name: _this.course.name,
          tid: this.$store.state.user.id
        }).then(resp => {
          if (resp && resp.status == 200) {
            console.log(resp.data);
            if (resp.data == "该课程名已存在") {
              _this.nocanB = true;
              callback(new Error("该课程名已存在"));
            }
            else {
              _this.nocanB = false
              callback()
            };
          }
          else callback();
        })
      };

      return {
        course: {
          id: this.$store.state.user.id,
          name: '',
        },
        courses: [],
        nocanB: true,
        dialogFormVisible: false,
        rules: {
          name: [{ validator: validateName, trigger: "change" }],

        },
      }
    },

    created: function () {
      var _this = this;
      console.log(this.$store.state.user.id);
      if (this.$store.state.user.userlevel == 1) {
        this.postRequest("/course/tchcoursesbp", {
          tid: this.$store.state.user.id,
        }).then(resp => {
          if (resp && resp.status == 200) {
            console.log(resp.data);
            _this.courses = resp.data;
          }
        });
      } else if (this.$store.state.user.userlevel == 0) {

      }

    },
    computed: {
      isKong: function () {
        return this.course.name === "" || this.nocanB;
      }
    },
    methods: {
      submitClick() {
        var _this = this;
        this.postRequest("/course/save", {
          name: this.course.name,
          tid: this.$store.state.user.id
        }).then(resp => {
          if (resp && resp.status == 200 && resp.data == "保存成功") {
            _this.$notify({
              title: '注册成功',
              message: '不过教师用户需要联系管理员并且通过审核后才能登陆',
              type: 'success',
              duration: 2000
            });

            _this.postRequest("/course/tchcoursesbp", {
              tid: this.$store.state.user.id,
            }).then(resp => {
              if (resp && resp.status == 200) {
                console.log(resp.data);
                _this.courses = resp.data;
              }
            });

          }
          else _this.$notify.error({
            title: '保存失败',
            message: '请联系管理员'
          });

        });
        this.course.name = "";
        this.dialogFormVisible = false;
      }
    }

  }
</script>

<style>
  .ktcon {
    padding-left: 40px;
    height: 100%;
    overflow: hidden;
    background: #ececec;
    padding-top: 93px;
  }

  .ktcon1l {
    cursor: pointer;
    padding-left: 23px;
    height: 16px;
    line-height: 16px;
    color: #272636;
    font-size: 16px;
  }

  .fl {
    float: left;
  }

  .ktcon1 {
    height: 16px;
    padding-bottom: 25px;
    padding-right: 40px;
    position: relative;
    z-index: 1;
  }

  .cl {
    clear: both;
  }

  .hide {
    display: none;
  }

  .clearfix {
    zoom: 1;
  }

  .cardmbr.hy {
    cursor: pointer;
    display: block;
    line-height: 20px;
    font-size: 12px;
    float: right;
    padding-left: 24px;
    height: 20px;
    color: #818181;
    background: url(http://www.ketangpai.com/Public/Common/img/ren.png) 0 1px no-repeat;
  }

  .recent_work {
    padding: 14px;
    font-size: 14px;
    font-family: 微软雅黑;
    color: #ababab;
  }
  .recent_work2 {
    padding: 14px;
    font-size: 13px;
    font-family: 微软雅黑;
    color: black;
  }
</style>