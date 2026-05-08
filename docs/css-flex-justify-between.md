# CSS Flex 两端对齐完整指南

CSS Flexbox 的 `justify-content: space-between` 是实现两端对齐最常用的方法。本指南详细介绍各种两端对齐的实现方式和应用场景。

## 基础语法

### 核心属性
```css
.container {
  display: flex;
  justify-content: space-between;
}
```

### 完整配置
```css
.container {
  display: flex;
  justify-content: space-between;  /* 水平两端对齐 */
  align-items: center;             /* 垂直居中 */
  flex-wrap: wrap;                 /* 允许换行 */
  gap: 10px;                       /* 元素间距 */
}
```

## 主要实现方式

### 1. 基本两端对齐
```css
.basic-flex {
  display: flex;
  justify-content: space-between;
}
```

**效果：** 第一个元素靠左，最后一个元素靠右，中间元素均匀分布

### 2. 两端对齐 + 垂直居中
```css
.centered-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
```

**效果：** 在水平两端对齐的基础上，所有元素垂直居中

### 3. 响应式两端对齐
```css
.responsive-flex {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

@media (max-width: 768px) {
  .responsive-flex {
    flex-direction: column;
    align-items: stretch;
  }
}
```

**效果：** 大屏幕两端对齐，小屏幕垂直堆叠

## 常见应用场景

### 1. 导航栏布局
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #2c3e50;
  color: white;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.user-actions {
  display: flex;
  gap: 10px;
}
```

```html
<nav class="navbar">
  <div class="logo">MyWebsite</div>
  <ul class="nav-links">
    <li><a href="#">首页</a></li>
    <li><a href="#">产品</a></li>
    <li><a href="#">关于</a></li>
  </ul>
  <div class="user-actions">
    <button>登录</button>
    <button>注册</button>
  </div>
</nav>
```

### 2. 卡片头部布局
```css
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
}

.card-actions {
  display: flex;
  gap: 8px;
}
```

```html
<div class="card-header">
  <h3 class="card-title">产品标题</h3>
  <div class="card-actions">
    <button>编辑</button>
    <button>删除</button>
  </div>
</div>
```

### 3. 表单行布局
```css
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.form-label {
  min-width: 120px;
  font-weight: bold;
}

.form-input {
  flex: 1;
  margin: 0 15px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
}
```

```html
<div class="form-row">
  <label class="form-label">用户名:</label>
  <input type="text" class="form-input" placeholder="请输入用户名">
  <div class="form-actions">
    <button>重置</button>
    <button>确认</button>
  </div>
</div>
```

### 4. 左右分组布局
```css
.split-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-group,
.right-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
```

```html
<div class="split-layout">
  <div class="left-group">
    <span>左侧内容1</span>
    <span>左侧内容2</span>
  </div>
  <div class="right-group">
    <span>右侧内容1</span>
    <span>右侧内容2</span>
  </div>
</div>
```

### 5. 三栏布局
```css
.three-column {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section,
.right-section {
  flex: 0 0 auto;  /* 不伸缩，保持原始大小 */
}

.center-section {
  flex: 1;         /* 占据剩余空间 */
  text-align: center;
  margin: 0 20px;
}
```

```html
<div class="three-column">
  <div class="left-section">左侧固定</div>
  <div class="center-section">中间自适应</div>
  <div class="right-section">右侧固定</div>
</div>
```

## 高级技巧

### 1. 处理元素数量不足的情况
```css
/* 当只有一个元素时，让它居左 */
.flex-container:has(:only-child) {
  justify-content: flex-start;
}

/* 当只有两个元素时，正常两端对齐 */
.flex-container {
  display: flex;
  justify-content: space-between;
}
```

### 2. 结合 gap 属性
```css
.flex-with-gap {
  display: flex;
  justify-content: space-between;
  gap: 20px;  /* 元素间最小间距 */
}
```

### 3. 嵌套 Flex 布局
```css
.outer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inner-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
```

### 4. 动态内容适配
```css
.dynamic-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;  /* 确保最小高度 */
}

.dynamic-flex > * {
  flex: 0 1 auto;    /* 允许收缩但不伸展 */
  min-width: 0;      /* 允许内容收缩 */
}
```

## 替代方案

### 1. 使用 margin: auto
```css
.alternative-1 {
  display: flex;
  align-items: center;
}

.alternative-1 > :last-child {
  margin-left: auto;  /* 最后一个元素推到右侧 */
}
```

### 2. 使用 Grid 布局
```css
.grid-alternative {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
}
```

### 3. 使用 space-around 或 space-evenly
```css
.space-around {
  display: flex;
  justify-content: space-around;  /* 元素周围有相等空间 */
}

.space-evenly {
  display: flex;
  justify-content: space-evenly;  /* 所有空间都相等 */
}
```

## 常见问题和解决方案

### 1. 元素内容过长导致布局破坏
```css
.safe-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;  /* 允许收缩 */
}

.safe-flex > * {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 2. 垂直对齐问题
```css
.vertical-align-fix {
  display: flex;
  justify-content: space-between;
  align-items: baseline;  /* 基线对齐 */
  /* 或者 */
  align-items: flex-start;  /* 顶部对齐 */
  /* 或者 */
  align-items: flex-end;    /* 底部对齐 */
}
```

### 3. 响应式断点处理
```css
.responsive-breakpoints {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

/* 平板 */
@media (max-width: 1024px) {
  .responsive-breakpoints {
    justify-content: space-around;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .responsive-breakpoints {
    flex-direction: column;
    align-items: stretch;
  }
}
```

## 最佳实践

### 1. 语义化 HTML 结构
```html
<!-- 推荐 -->
<header class="site-header">
  <div class="logo">Logo</div>
  <nav class="main-nav">导航</nav>
  <div class="user-menu">用户菜单</div>
</header>

<!-- 不推荐 -->
<div class="header-flex">
  <div>Logo</div>
  <div>导航</div>
  <div>用户菜单</div>
</div>
```

### 2. 合理使用 flex 属性
```css
.flex-item-grow {
  flex: 1;        /* 等比例伸展 */
}

.flex-item-fixed {
  flex: 0 0 auto; /* 固定大小 */
}

.flex-item-shrink {
  flex: 0 1 auto; /* 只收缩不伸展 */
}
```

### 3. 考虑可访问性
```css
.accessible-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;  /* 确保触摸目标足够大 */
}

.accessible-flex button {
  min-width: 44px;
  min-height: 44px;
}
```

### 4. 性能优化
```css
/* 避免不必要的重排 */
.optimized-flex {
  display: flex;
  justify-content: space-between;
  will-change: auto;  /* 只在需要时使用 */
}

/* 使用 transform 而不是改变布局属性 */
.animated-item {
  transition: transform 0.3s ease;
}

.animated-item:hover {
  transform: scale(1.05);  /* 而不是改变 width/height */
}
```

运行示例文件可以看到各种两端对齐布局的实际效果和应用场景。