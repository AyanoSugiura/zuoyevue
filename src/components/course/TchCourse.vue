<template>
  <el-container>
    <el-form :inline="true" :model="course" status-icon :rules="rules">
      <div v-if="this.$store.state.user.userlevel==1">
        <el-form-item label="创建课程" prop="name">
          <el-input v-model="course.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="submitClick" v-bind:disabled="isKong">创建课程</el-button>
        </el-form-item>
      </div>
      <el-table :data="courses" style="width: 100%">
        <el-table-column prop="name" label="课程名称" width="180"> </el-table-column>
      </el-table>
    </el-form>

    <!-- <el-container>
      <el-main>
        <el-table :data="courses" style="width: 100%">
          <el-table-column prop="name" label="课程名称" width="180"> </el-table-column>
        </el-table>
      </el-main>
    </el-container> -->

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
           phone: this.$store.state.user.phone,
        }).then(resp => {
          if (resp && resp.status == 200) {
            console.log(resp.data);
            _this.courses = resp.data;
          }
        });
      }else if(this.$store.state.user.userlevel == 0){
        
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
              phone: this.$store.state.user.phone,
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
      }
    }

  }
</script>