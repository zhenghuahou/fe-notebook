# Vue3 获取Router配置的Meta属性

## 概述

在Vue3中，路由的meta属性用于存储路由的元信息，如页面标题、权限要求、面包屑导航等。本文档详细介绍如何在不同场景下获取和使用router的meta属性。

## 基础用法

### 1. 使用 useRoute() (推荐)

在Vue3 Composition API中，推荐使用`useRoute()`获取当前路由信息：

```javascript
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    
    // 获取meta属性
    const meta = route.meta
    
    // 获取特定meta属性
    const title = route.meta.title
    const requiresAuth = route.meta.requiresAuth
    
    return {
      meta,
      title,
      requiresAuth
    }
  }
}
```

### 2. 使用 this.$route (选项式API)

在选项式API中，可以通过`this.$route`访问：

```javascript
export default {
  mounted() {
    // 获取meta属性
    const meta = this.$route.meta
    console.log('页面标题:', meta.title)
    console.log('需要认证:', meta.requiresAuth)
  },
  
  computed: {
    pageTitle() {
      return this.$route.meta.title || '默认标题'
    }
  }
}
```

### 3. 在路由守卫中获取

```javascript
import router from './router'

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const meta = to.meta
  
  // 设置页面标题
  if (meta.title) {
    document.title = meta.title
  }
  
  // 权限验证
  if (meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
```

## 路由配置示例

```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false,
      roles: ['guest', 'user', 'admin'],
      breadcrumb: [
        { name: '首页', path: '/' }
      ]
    }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: {
      title: '用户管理',
      requiresAuth: true,
      roles: ['admin', 'user'],
      breadcrumb: [
        { name: '首页', path: '/' },
        { name: '用户管理', path: '/user' }
      ]
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: '管理后台',
      requiresAuth: true,
      roles: ['admin'],
      layout: 'AdminLayout',
      breadcrumb: [
        { name: '首页', path: '/' },
        { name: '管理后台', path: '/admin' }
      ]
    }
  }
]
```

## 实际应用场景

### 1. 动态页面标题

```javascript
import { useRoute } from 'vue-router'
import { watch } from 'vue'

export default {
  setup() {
    const route = useRoute()
    
    // 监听路由变化，动态设置标题
    watch(
      () => route.meta.title,
      (title) => {
        document.title = title || '默认标题'
      },
      { immediate: true }
    )
  }
}
```

### 2. 权限控制

```javascript
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const userRole = 'admin' // 从状态管理获取
    
    // 检查用户权限
    const hasPermission = computed(() => {
      const { requiresAuth, roles } = route.meta
      
      if (!requiresAuth) return true
      
      return roles && roles.includes(userRole)
    })
    
    return {
      hasPermission
    }
  }
}
```

### 3. 面包屑导航

```javascript
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  setup() {
    const route = useRoute()
    
    // 生成面包屑
    const breadcrumbItems = computed(() => {
      return route.meta.breadcrumb || []
    })
    
    return {
      breadcrumbItems
    }
  }
}
```

### 4. 布局切换

```javascript
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  setup() {
    const route = useRoute()
    
    // 根据meta决定使用哪个布局
    const currentLayout = computed(() => {
      return route.meta.layout || 'DefaultLayout'
    })
    
    return {
      currentLayout
    }
  }
}
```

## 响应式监听Meta变化

### 1. 监听整个meta对象

```javascript
import { useRoute } from 'vue-router'
import { watch } from 'vue'

export default {
  setup() {
    const route = useRoute()
    
    // 监听meta变化
    watch(
      () => route.meta,
      (newMeta, oldMeta) => {
        console.log('Meta变化:', newMeta)
        
        // 处理标题变化
        if (newMeta.title) {
          document.title = newMeta.title
        }
        
        // 处理其他meta属性变化
        if (newMeta.theme) {
          document.body.className = `theme-${newMeta.theme}`
        }
      },
      { deep: true, immediate: true }
    )
  }
}
```

### 2. 监听特定meta属性

```javascript
import { useRoute } from 'vue-router'
import { watch } from 'vue'

export default {
  setup() {
    const route = useRoute()
    
    // 只监听title变化
    watch(
      () => route.meta.title,
      (title) => {
        document.title = title || '默认标题'
      },
      { immediate: true }
    )
    
    // 监听权限变化
    watch(
      () => route.meta.requiresAuth,
      (requiresAuth) => {
        if (requiresAuth && !isAuthenticated()) {
          // 跳转到登录页
          router.push('/login')
        }
      }
    )
  }
}
```

## 通过router实例获取

```javascript
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    
    // 获取当前路由的meta
    const currentMeta = router.currentRoute.value.meta
    
    // 获取指定路由的meta
    const getUserRouteMeta = () => {
      const userRoute = router.getRoutes().find(route => route.name === 'User')
      return userRoute?.meta
    }
    
    return {
      currentMeta,
      getUserRouteMeta
    }
  }
}
```

## 最佳实践

### 1. Meta属性命名规范

```javascript
// 推荐的meta属性结构
meta: {
  // 页面基本信息
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词',
  
  // 权限相关
  requiresAuth: true,
  roles: ['admin', 'user'],
  permissions: ['read', 'write'],
  
  // 布局相关
  layout: 'AdminLayout',
  sidebar: true,
  navbar: true,
  
  // 导航相关
  breadcrumb: [],
  activeMenu: '/user/list',
  
  // 缓存相关
  keepAlive: true,
  
  // 其他配置
  theme: 'dark',
  fullscreen: false
}
```

### 2. 类型定义 (TypeScript)

```typescript
interface RouteMeta {
  title?: string
  description?: string
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
  layout?: string
  breadcrumb?: BreadcrumbItem[]
  keepAlive?: boolean
  theme?: 'light' | 'dark'
  [key: string]: any
}

interface BreadcrumbItem {
  name: string
  path: string
}
```

### 3. 工具函数

```javascript
// 检查权限的工具函数
export function checkPermission(route, userRole, userPermissions) {
  const { requiresAuth, roles, permissions } = route.meta
  
  if (!requiresAuth) return true
  
  // 检查角色
  if (roles && !roles.includes(userRole)) {
    return false
  }
  
  // 检查权限
  if (permissions && !permissions.some(p => userPermissions.includes(p))) {
    return false
  }
  
  return true
}

// 生成页面标题的工具函数
export function generateTitle(route) {
  const { title } = route.meta
  const siteName = 'My App'
  
  return title ? `${title} - ${siteName}` : siteName
}
```

## 注意事项

1. **响应式**: `route.meta`是响应式的，会随路由变化自动更新
2. **深度监听**: 监听meta对象时建议使用`{ deep: true }`
3. **默认值**: 访问meta属性时建议提供默认值
4. **性能**: 避免在meta中存储大量数据，影响路由切换性能
5. **类型安全**: 使用TypeScript时建议定义meta的类型接口

## 总结

Vue3中获取router meta属性的方式：

- **Composition API**: 使用`useRoute()`
- **Options API**: 使用`this.$route`
- **路由守卫**: 通过`to.meta`获取
- **Router实例**: 通过`router.currentRoute.value.meta`

选择合适的方式根据你的使用场景和API风格来决定。