<template>
  <div class="form-automation-demo">
    <h1>Vue3 表单自动化填充演示</h1>
    <p class="subtitle">用于自动化测试的预审批表单示例</p>

    <!-- 基础表单 -->
    <section class="form-section">
      <h2>用户信息表单</h2>
      <form id="userForm" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">用户名 *</label>
          <input 
            type="text" 
            id="username" 
            v-model="formData.username" 
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱 *</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            placeholder="请输入邮箱"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">手机号</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone" 
            placeholder="请输入手机号"
          />
        </div>

        <div class="form-group">
          <label>性别</label>
          <div class="radio-group">
            <label>
              <input type="radio" name="gender" value="male" v-model="formData.gender" />
              男
            </label>
            <label>
              <input type="radio" name="gender" value="female" v-model="formData.gender" />
              女
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="department">部门</label>
          <select id="department" v-model="formData.department">
            <option value="">请选择部门</option>
            <option value="tech">技术部</option>
            <option value="product">产品部</option>
            <option value="design">设计部</option>
            <option value="operation">运营部</option>
          </select>
        </div>

        <div class="form-group">
          <label>技能</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" value="js" v-model="formData.skills" />
              JavaScript
            </label>
            <label>
              <input type="checkbox" value="vue" v-model="formData.skills" />
              Vue.js
            </label>
            <label>
              <input type="checkbox" value="react" v-model="formData.skills" />
              React
            </label>
            <label>
              <input type="checkbox" value="node" v-model="formData.skills" />
              Node.js
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="reason">申请理由</label>
          <textarea 
            id="reason" 
            v-model="formData.reason" 
            rows="4"
            placeholder="请输入申请理由"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">提交</button>
          <button type="button" class="btn-secondary" @click="resetForm">重置</button>
        </div>
      </form>
    </section>

    <!-- 表单数据预览 -->
    <section class="preview-section">
      <h2>表单数据预览</h2>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  username: '',
  email: '',
  phone: '',
  gender: '',
  department: '',
  skills: [],
  reason: ''
})

const handleSubmit = () => {
  console.log('表单提交:', formData)
  alert('表单已提交!')
}

const resetForm = () => {
  Object.assign(formData, {
    username: '',
    email: '',
    phone: '',
    gender: '',
    department: '',
    skills: [],
    reason: ''
  })
}
</script>

<style scoped>
.form-automation-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-section {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-group label,
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: normal;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #409eff;
  color: #fff;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-secondary {
  background: #909399;
  color: #fff;
}

.btn-secondary:hover {
  background: #a6a9ad;
}

.preview-section {
  margin-top: 30px;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
}

.preview-section h2 {
  color: #606266;
  margin-bottom: 15px;
  font-size: 18px;
}

.preview-section pre {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
}
</style>
