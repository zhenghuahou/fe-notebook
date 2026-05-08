# Vue3 多选组件使用文档

## 简介

Vue3 多选组件是一个功能完整、易于使用的多选择器组件，基于 Vue 3 Composition API 开发，支持搜索、全选、清空等丰富功能。

## 特性

- ✅ 基础多选功能
- ✅ 双向数据绑定 (v-model)
- ✅ 搜索过滤
- ✅ 全选/反选
- ✅ 清空选择
- ✅ 禁用状态
- ✅ 自定义字段名
- ✅ 键盘导航
- ✅ 无障碍访问
- ✅ 响应式设计
- ✅ TypeScript 支持

## 安装

```bash
# 复制组件文件到你的项目中
cp MultiSelect.vue your-project/components/
```

## 基础用法

### 简单示例

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="请选择选项"
  />
</template>

<script setup>
import { ref } from 'vue'
import MultiSelect from './components/MultiSelect.vue'

const selectedValues = ref([])
const options = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
])
</script>
```

### 预设选中值

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="预设选中值"
  />
</template>

<script setup>
const selectedValues = ref(['option1', 'option3'])
const options = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
])
</script>
```

## API 参考

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | Array | [] | 选中的值数组，支持 v-model |
| options | Array | [] | 选项数据数组 |
| placeholder | String | '请选择' | 占位符文本 |
| disabled | Boolean | false | 是否禁用组件 |
| searchable | Boolean | true | 是否支持搜索功能 |
| clearable | Boolean | true | 是否显示清空按钮 |
| multiple | Boolean | true | 是否多选模式 |
| maxHeight | String | '200px' | 下拉框最大高度 |
| showSelectAll | Boolean | true | 是否显示全选选项 |
| labelKey | String | 'label' | 选项标签字段名 |
| valueKey | String | 'value' | 选项值字段名 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value: Array | 选中值变化时触发 |
| change | value: Array, option: Object | 选项变化时触发 |
| search | keyword: String | 搜索时触发 |
| clear | - | 清空选择时触发 |
| selectAll | isSelectAll: Boolean | 全选/取消全选时触发 |

### 选项数据格式

```typescript
interface Option {
  label: string;        // 显示文本
  value: any;          // 选项值
  disabled?: boolean;   // 是否禁用该选项
}
```

## 使用示例

### 1. 搜索功能

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="cityOptions"
    placeholder="搜索并选择城市"
    searchable
    @search="handleSearch"
  />
</template>

<script setup>
const selectedValues = ref([])
const cityOptions = ref([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' }
])

const handleSearch = (keyword) => {
  console.log('搜索关键词:', keyword)
}
</script>
```

### 2. 禁用搜索

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="不支持搜索"
    :searchable="false"
  />
</template>
```

### 3. 全选功能

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="支持全选"
    :show-select-all="true"
    @selectAll="handleSelectAll"
  />
</template>

<script setup>
const handleSelectAll = (isSelectAll) => {
  console.log('全选状态:', isSelectAll)
}
</script>
```

### 4. 清空功能

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="支持清空"
    clearable
    @clear="handleClear"
  />
</template>

<script setup>
const handleClear = () => {
  console.log('已清空选择')
}
</script>
```

### 5. 禁用状态

```vue
<template>
  <!-- 整体禁用 -->
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="整体禁用"
    disabled
  />
  
  <!-- 部分选项禁用 -->
  <MultiSelect
    v-model="selectedValues"
    :options="disabledOptions"
    placeholder="部分选项禁用"
  />
</template>

<script setup>
const disabledOptions = ref([
  { label: '可选项1', value: 'option1' },
  { label: '禁用项', value: 'disabled', disabled: true },
  { label: '可选项2', value: 'option2' }
])
</script>
```

### 6. 自定义字段名

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="customOptions"
    placeholder="自定义字段名"
    label-key="name"
    value-key="id"
  />
</template>

<script setup>
const customOptions = ref([
  { name: '管理员', id: 1 },
  { name: '编辑者', id: 2 },
  { name: '查看者', id: 3 }
])
</script>
```

### 7. 自定义高度

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="longOptions"
    placeholder="自定义下拉框高度"
    max-height="150px"
  />
</template>
```

### 8. 事件监听

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="options"
    placeholder="监听所有事件"
    @change="handleChange"
    @search="handleSearch"
    @clear="handleClear"
    @selectAll="handleSelectAll"
  />
</template>

<script setup>
const handleChange = (values, option) => {
  console.log('选择变化:', values, option)
}

const handleSearch = (keyword) => {
  console.log('搜索:', keyword)
}

const handleClear = () => {
  console.log('清空选择')
}

const handleSelectAll = (isSelectAll) => {
  console.log('全选状态:', isSelectAll)
}
</script>
```

## 键盘操作

| 按键 | 功能 |
|------|------|
| Tab | 切换焦点 |
| Enter/Space | 打开/关闭下拉框，选择选项 |
| Escape | 关闭下拉框 |
| ↑/↓ | 导航选项（计划中） |

## 样式定制

### CSS 变量

组件使用 CSS 变量，可以轻松定制样式：

```css
.multiselect {
  --multiselect-primary-color: #409eff;
  --multiselect-border-color: #dcdfe6;
  --multiselect-hover-color: #f5f7fa;
  --multiselect-disabled-color: #c0c4cc;
  --multiselect-text-color: #606266;
  --multiselect-placeholder-color: #c0c4cc;
  --multiselect-border-radius: 4px;
  --multiselect-font-size: 14px;
}
```

### 自定义主题

```css
/* 深色主题 */
.multiselect.dark-theme {
  --multiselect-primary-color: #409eff;
  --multiselect-border-color: #4c4d4f;
  --multiselect-hover-color: #2d2d30;
  --multiselect-text-color: #cccccc;
  --multiselect-placeholder-color: #6c6c6c;
}
```

## 无障碍访问

组件遵循 WCAG 2.1 标准，支持：

- 完整的 ARIA 属性
- 键盘导航
- 屏幕阅读器支持
- 焦点管理

## 性能优化

### 大数据量处理

对于大量选项（>1000项），建议：

1. 启用搜索功能减少显示项目
2. 考虑分页或虚拟滚动
3. 使用防抖搜索

```vue
<template>
  <MultiSelect
    v-model="selectedValues"
    :options="bigDataOptions"
    placeholder="大数据量选择器"
    searchable
    max-height="200px"
  />
</template>
```

## 常见问题

### Q: 如何获取选中项的完整信息？

A: 监听 `change` 事件，第二个参数包含当前操作的选项信息：

```javascript
const handleChange = (values, option) => {
  console.log('选中值:', values)
  console.log('当前操作选项:', option)
}
```

### Q: 如何实现单选模式？

A: 设置 `multiple` 为 `false`（计划中的功能）：

```vue
<MultiSelect
  v-model="selectedValue"
  :options="options"
  :multiple="false"
/>
```

### Q: 如何自定义选项模板？

A: 当前版本不支持，计划在后续版本中通过插槽实现。

### Q: 组件支持哪些浏览器？

A: 支持所有现代浏览器：
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 更新日志

### v1.0.0
- ✅ 基础多选功能
- ✅ 搜索过滤
- ✅ 全选/反选
- ✅ 清空功能
- ✅ 禁用状态
- ✅ 键盘导航
- ✅ 响应式设计

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个组件。

## 许可证

MIT License