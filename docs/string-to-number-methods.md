# JavaScript 字符串转数字的方法总结

在 JavaScript 中，除了使用 `+` 操作符将字符串转换为数字外，还有多种等价的方法。每种方法都有其特点和适用场景。

## 主要转换方法

### 1. Number() 构造函数
```javascript
Number('123')     // 123
Number('123.45')  // 123.45
Number('123abc')  // NaN
Number('')        // 0
Number('  123  ') // 123 (自动去除空格)
```

**特点：**
- 最严格的转换方式
- 整个字符串必须是有效数字
- 自动处理空格
- 推荐用于一般转换

### 2. parseInt() - 解析整数
```javascript
parseInt('123')     // 123
parseInt('123.45')  // 123 (只取整数部分)
parseInt('123abc')  // 123 (忽略后面的非数字)
parseInt('abc123')  // NaN
parseInt('10', 2)   // 2 (二进制解析)
parseInt('10', 16)  // 16 (十六进制解析)
```

**特点：**
- 从左到右解析，遇到非数字字符停止
- 支持指定进制
- 只返回整数部分

### 3. parseFloat() - 解析浮点数
```javascript
parseFloat('123.45')  // 123.45
parseFloat('123abc')  // 123
parseFloat('abc123')  // NaN
parseFloat('123.45.67') // 123.45 (只解析第一个小数点)
```

**特点：**
- 类似 parseInt，但保留小数部分
- 从左到右解析到第一个无效字符

### 4. 一元加号操作符 (+)
```javascript
+'123'     // 123
+'123.45'  // 123.45
+'123abc'  // NaN
+''        // 0
```

**特点：**
- 等价于 Number()
- 语法简洁
- 常用于快速转换

### 5. 算术操作符隐式转换
```javascript
// 乘法
'123' * 1    // 123
'123.45' * 1 // 123.45

// 减法
'123' - 0    // 123
'123.45' - 0 // 123.45

// 除法
'123' / 1    // 123
'123.45' / 1 // 123.45
```

**特点：**
- 利用 JavaScript 的隐式类型转换
- 简洁但可读性稍差
- 行为与 Number() 相同

### 6. 位运算符 (仅适用于32位整数)
```javascript
~~'123'      // 123 (双重按位非)
'123' | 0    // 123 (按位或)
'123' >> 0   // 123 (右移)
'123' >>> 0  // 123 (无符号右移)
```

**特点：**
- 只能处理32位整数范围 (-2^31 到 2^31-1)
- 会截断小数部分
- 性能较好但有限制

### 7. Math 方法配合转换
```javascript
Math.floor(+'123.789')  // 123 (向下取整)
Math.ceil(+'123.789')   // 124 (向上取整)
Math.round(+'123.789')  // 124 (四舍五入)
Math.trunc(+'123.789')  // 123 (截断小数部分)
```

## 方法对比表

| 方法 | 严格性 | 处理小数 | 处理非数字 | 性能 | 推荐场景 |
|------|--------|----------|------------|------|----------|
| Number() | 高 | ✓ | 返回NaN | 好 | 一般转换 |
| parseInt() | 中 | ✗ | 部分解析 | 好 | 解析整数 |
| parseFloat() | 中 | ✓ | 部分解析 | 好 | 解析浮点数 |
| 一元加号(+) | 高 | ✓ | 返回NaN | 很好 | 快速转换 |
| 算术操作符 | 高 | ✓ | 返回NaN | 很好 | 简洁转换 |
| 位运算符 | 低 | ✗ | 强制转换 | 最好 | 32位整数 |

## 实际应用建议

### 1. 表单输入验证
```javascript
function validateNumberInput(input) {
  const num = Number(input);
  if (isNaN(num)) {
    return { valid: false, message: '请输入有效数字' };
  }
  return { valid: true, value: num };
}
```

### 2. 安全转换（带默认值）
```javascript
function safeStringToNumber(str, defaultValue = 0) {
  const num = Number(str);
  return isNaN(num) ? defaultValue : num;
}
```

### 3. 进制转换
```javascript
const binary = parseInt('1010', 2);    // 10
const octal = parseInt('12', 8);       // 10
const hex = parseInt('A', 16);         // 10
```

## 选择建议

1. **一般情况**：使用 `Number()` 或一元加号 `+`
2. **解析用户输入**：使用 `parseInt()` 或 `parseFloat()`
3. **性能敏感场景**：使用一元加号 `+` 或算术操作符
4. **整数运算**：可考虑位运算符（注意范围限制）
5. **需要进制转换**：使用 `parseInt(str, radix)`

运行示例代码查看各种方法的详细对比和性能测试结果。