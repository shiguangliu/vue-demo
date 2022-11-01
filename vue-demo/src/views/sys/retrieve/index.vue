<template>
  <div class="retrieve-password">
    <div class="header">
      <img
        src="./img/cloud_1.png"
        class="cloud_1"
      >
      <img
        src="./img/cloud_1.png"
        class="cloud_2"
      >
      <span class="tittle">找回密码</span>
      <p class="msg">
        请您按照操作步骤填写找回密码
      </p>
    </div>
    <div class="container">
      <div class="steps-box">
        <el-steps :active="activeSteps">
          <el-step
            v-for="(item, index) in stepsList"
            :key="index"
            :title="item"
          />
        </el-steps>
        <!-- 不同步骤显示不同的内容 -->
        <div
          v-if="activeSteps === 1"
          class="steps1"
        >
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="form.username"
                placeholder="请输入账号"
              />
            </el-form-item>
            <div class="valid-code">
              <el-form-item prop="validCode">
                <el-input
                  v-model.trim="form.validCode"
                  placeholder="验证码"
                />
              </el-form-item>
              <valid-code v-model="validCode" />
            </div>
          </el-form>
          <el-button
            class="bt-next"
            type="primary"
            style="margin-top: 12px;"
            @click="handleNext"
          >
            下一步
          </el-button>
        </div>
        <div
          v-if="activeSteps === 2"
          class="steps2"
        >
          <div v-if="retrieveMethods.email==='1'" class="email-check">
            <img src="./img/email.jpg">
            <div class="desc">
              <p class="title">
                邮箱找回
              </p>
              <p class="msg">
                您已经绑定的邮箱
              </p>
            </div>
            <div class="bt">
              <el-button
                type="primary"
                @click="handleNext"
              >
                立即验证<i class="el-icon-arrow-right" />
              </el-button>
            </div>
          </div>
          <div v-if="retrieveMethods.phone==='1'" class="phone-check">
            <img src="./img/phone_nobind.jpg">
            <div class="desc">
              <p class="title">
                手机找回
              </p>
              <p class="msg">
                您已经绑定的手机
              </p>
            </div>
            <div class="bt">
              <el-button
                type="primary"
                @click="handleNext"
              >
                立即验证<i class="el-icon-arrow-right" />
              </el-button>
            </div>
          </div>
        </div>
        <div
          v-if="activeSteps === 3"
          class="steps3"
        >
          <div class="title">
            您正在使用"<span style="color: red">{{ form.retrieveMethodName }}</span>"验证身份，请获取验证码重置登录密码
          </div>
          <div class="warp">
            <span class="check-info">验证{{ form.retrieveMethodName }}为:
              <span style="color: #409EFF">{{ form.nickAccount }}</span>
            </span>
            <div class="getValidCode">
              <el-input
                v-model.trim="form.verifyCode"
                placeholder="验证码"
              />
              <el-button
                type="primary"
                @click="sendVerifyCode"
              >
                获取验证码
              </el-button>
            </div>
            <el-button
              class="bt-next"
              type="primary"
              style="margin-top: 12px;"
              @click="handleNext"
            >
              下一步
            </el-button>
            <a
              class="back"
              @click="activeSteps--"
            >重新选择验证方式</a>
          </div>
        </div>
        <div
          v-if="activeSteps === 4"
          class="steps4"
        >
          <el-input
            v-model.trim="form.password"
            class="new-pwd"
            placeholder="新密码"
          />
          <el-input
            v-model.trim="form.passwordAgain"
            class="confirm-pwd"
            placeholder="确认密码"
          />
          <el-button
            class="bt-next"
            type="primary"
            style="margin-top: 12px;"
            @click="handleNext"
          >
            立刻重置
          </el-button>
        </div>
        <div
          v-if="activeSteps === 5"
          class="steps5"
        >
          <div class="warp">
            <img src="./img/finsh.jpg">
            <div class="right">
              <span class="msg">恭喜您"密码"重置成功</span>
              <router-link
                to="/login"
                class="goto"
              >
                立即登录
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mSendVerifyCode, mCheckVerifyCode, ifUserExist, changePwd } from '@/api/account'
import ValidCode from '@/components/ValidCode'
export default {
  components: {
    ValidCode
  },
  data() {
    const checkValidCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (value.toUpperCase() !== this.validCode.toUpperCase()) {
        callback(new Error('验证码不正确'))
      } else {
        callback()
      }
    }
    return {
      activeSteps: 1,
      retrieveMethods: {
        email: '0', // 启用邮箱验证重置密码
        phone: '1' // 启用手机验证重置密码
      },
      validCode: '',
      form: {
        retrieveMethod: '1', // 默认手机验证法
        retrieveMethodName: '手机',
        username: '',
        validCode: '', // 图像验证码
        verifyCode: '', // 手机验证码
        nickAccount: '', // 匿名的邮箱或手机号
        password: '',
        passwordAgain: ''
      },
      userinfo: {
        userid: '',
        phone: ''
        // ,email: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: ['blur', 'change']
          }
        ],
        validCode: [
          {
            required: true,
            validator: checkValidCode,
            trigger: ['blur', 'change']
          }
        ]
      },
      stepsList: [
        '找回密码',
        '选择验证方式',
        '验证',
        '重置密码',
        '重置完成'
      ]
    }
  },
  beforeCreate() {
    document.title = this.$route.name
  },
  methods: {
    handleNext() {
      switch (this.activeSteps) {
        case 1:
          this.$refs.form.validate(valid => {
            if (valid) {
              // 调用api验证是否存在user
              this.loading = true
              this.$handleAPI('', ifUserExist, { accountname: this.form.username }).then(res => {
                this.loading = false
                if (res.code === '200' || res.code === 200) {
                  if (res.data.userlist.length > 0) {
                    this.activeSteps++
                    const user = res.data.userlist[0]
                    this.userinfo.userid = user.userid
                    this.userinfo.phone = user.phone
                    // this.userinfo.email = user.userid // 为邮箱验证预留
                  } else {
                    this.$message({
                      showClose: true,
                      message: '账号错误或不存在',
                      type: 'error',
                      duration: 3500
                    })
                  }
                } else {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 3500
                  })
                }
              }).catch((error) => {
                this.loading = false
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            }
          })

          break
        case 2:
          if (this.form.retrieveMethod === '1') {
            this.form.nickAccount = this.userinfo.phone.substring(0, 3) + '******' + this.userinfo.phone.substring(9)
          } else {
            // 用email拼nickAccount
          }
          this.activeSteps++
          break
        case 3: {
          // 验证验证码
          this.loading = true
          if (this.form.verifyCode !== '') {
            const cond = {
              phone: this.userinfo.phone,
              verifycode: this.form.verifyCode
            }
            this.$handleAPI('', mCheckVerifyCode, cond).then(res => {
              this.loading = false
              if (res.code === '200' || res.code === 200) {
                this.activeSteps++
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            }).catch((error) => {
              this.loading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: '请输入收到的验证码',
              type: 'error',
              duration: 3500
            })
          }

          break
        }
        case 4: {
          // 更新密码
          this.loading = true
          if (this.form.password === this.form.passwordAgain) {
            const cond = {
              userid: this.userinfo.userid,
              newpwdaes: this.form.password,
              retrieve: 1
            }
            console.log(cond)
            this.$handleAPI('', changePwd, cond).then(res => {
              this.loading = false
              if (res.code === '200' || res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '重置成功',
                  type: 'success',
                  duration: 3500
                })
                this.activeSteps++
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            }).catch((error) => {
              this.loading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: '请确保两次输入的密码一致',
              type: 'error',
              duration: 3500
            })
          }

          break
        }
      }
    },
    sendVerifyCode() {
      const cond = {
        phone: this.userinfo.phone,
        page: 'm_invitation_register'
      }
      this.$handleAPI('', mSendVerifyCode, cond).then(res => {
        this.loading = false
        if (res.code === '200' || res.code === 200) {
          this.$message({
            showClose: true,
            message: res.data,
            type: 'success',
            duration: 3500
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      }).catch((error) => {
        this.loading = false
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    }
  }
}
</script>

<style lang="scss">
.retrieve-password{
  .el-step__head.is-process, .el-step__title.is-process{
    color: rgb(150, 150, 150);
    border-color: rgb(150, 150, 150);
  }
}
</style>

<style lang="scss" scoped>
.retrieve-password{
  height: 100vh;
  background-color: #eff2f4;
  .header{
    position: relative;
    height: 142px;
    .cloud_1{
      position: absolute;
      top: 50px;
      left: 60px;
      z-index: 1;
      width: 141px;
      height: 78px;
    }
    .cloud_2{
      position: absolute;
      top: 10px;
      left: 250px;
      z-index: 1;
      width: 70px;
      height: 39px;
    }
    .tittle{
      padding: 10px;
      padding-left: 0;
      font-size: 30px;
      color: #34495e;
      margin-left: 200px;
      margin-top: 60px;
      display: inline-block;
    }
    .msg{
      font-size: 16px;
      color: #34495e;
      margin-left: 200px;
    }
  }
  .container{
    height: calc(100% - 152px);
    background: url('./img/login_form.png') no-repeat;
    background-size: cover;
    .steps-box{
      padding: 20px;
      margin: 0 auto;
      width: 100%;
      max-width: 700px;
      .steps1, .steps2, .steps3, .steps4, .steps5{
        padding-top: 20px;
        width: 90%;
        margin-left: 3%;
      }
      .steps1{
        padding: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-form, .el-form-item{
          width: 100%;
          .el-input{
            width: 100%;
          }
        }
        .valid-code{
          display: flex;
          .el-form-item{
            flex: 1;
          }
        }
        .bt-next{
          width: 100%;
        }
      }
      .steps2{
        padding-top: 50px;
        .email-check, .phone-check{
          display: flex;
          padding: 20px;
          padding-bottom: 0;
          margin-bottom: 20px;
          border: 1px solid rgb(200 ,200 ,200);
          .desc{
            flex: 1;
            padding-left: 10px;
            .title{
              font-size: 20px;
            }
            .msg{
              margin-top: 10px;
              color: rgb(150, 150, 150);
            }
          }
          .bt{
            display: flex;
            align-items: center;
            padding-bottom: 20px;
          }
        }
      }
      .steps3{
        margin-top: 20px;
        padding: 20px;
        border: 1px solid rgb(200, 200, 200);
        .title{
          height: 30px;
          font-size: 18px;
          color: #409EFF;
          border-bottom: 1px solid rgb(200, 200, 200);
        }
        .warp{
          width: 70%;
          margin-left: 15%;
          margin-top: 20px;
          .check-info{
            display: inline-block;
            margin-bottom: 10px;
          }
          .getValidCode{
            display: flex;
            .el-input__inner{
              border-radius: 4px 0 0 4px;
            }
            .el-button{
              border-radius: 0 4px 4px 0;
            }
          }
          .bt-next{
            width: 100%;
            margin-bottom: 10px;
          }
          .back{
            margin-bottom: 40px;
            display: block;
            text-align: center;
            color: #409EFF;
          }
        }
      }
      .steps4{
        padding: 50px;
        .new-pwd{
          margin-bottom: 20px;
        }
        .bt-next{
          width: 100%;
          margin-top: 20px;
        }
      }
      .steps5{
        padding: 100px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .warp{
          display: flex;
          .right{
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .msg{
              font-size: 16px;
              color: rgb(100, 100, 100);
              margin-bottom: 10px;
            }
            .goto{
              font-size: 18px;
              color: #409EFF;
            }
          }
        }
      }
    }
  }
}
</style>
