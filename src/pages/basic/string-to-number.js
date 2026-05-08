/**
 * JavaScript 字符串转数字的各种方法
 * 演示不同方法的使用场景和特点
 */

console.log('=== JavaScript 字符串转数字的各种方法 ===\n');

// 测试用的字符串
const testStrings = [
  '123',
  '123.45',
  '0123',
  '123abc',
  'abc123',
  '  123  ',
  '',
  'NaN',
  'Infinity',
  '-123',
  '0x10', // 十六进制
  '0b1010', // 二进制
  '0o12', // 八进制
];

console.log('测试字符串:', testStrings);
console.log('\n');

// 方法1: Number() 构造函数
console.log('1. Number() 构造函数:');
testStrings.forEach(str => {
  console.log(`Number('${str}') = ${Number(str)}`);
});
console.log('\n');

// 方法2: parseInt() - 解析整数
console.log('2. parseInt() - 解析整数:');
testStrings.forEach(str => {
  console.log(`parseInt('${str}') = ${parseInt(str)}`);
});
console.log('\n');

// 方法3: parseFloat() - 解析浮点数
console.log('3. parseFloat() - 解析浮点数:');
testStrings.forEach(str => {
  console.log(`parseFloat('${str}') = ${parseFloat(str)}`);
});
console.log('\n');

// 方法4: 一元加号操作符 (+)
console.log('4. 一元加号操作符 (+):');
testStrings.forEach(str => {
  console.log(`+'${str}' = ${+str}`);
});
console.log('\n');

// 方法5: 乘法操作符 (* 1)
console.log('5. 乘法操作符 (* 1):');
testStrings.forEach(str => {
  console.log(`'${str}' * 1 = ${str * 1}`);
});
console.log('\n');

// 方法6: 减法操作符 (- 0)
console.log('6. 减法操作符 (- 0):');
testStrings.forEach(str => {
  console.log(`'${str}' - 0 = ${str - 0}`);
});
console.log('\n');

// 方法7: 除法操作符 (/ 1)
console.log('7. 除法操作符 (/ 1):');
testStrings.forEach(str => {
  console.log(`'${str}' / 1 = ${str / 1}`);
});
console.log('\n');

// 方法8: Math.floor() / Math.ceil() / Math.round() 配合其他方法
console.log('8. Math 方法配合转换:');
const floatStr = '123.789';
console.log(`Math.floor(+'${floatStr}') = ${Math.floor(+floatStr)}`);
console.log(`Math.ceil(+'${floatStr}') = ${Math.ceil(+floatStr)}`);
console.log(`Math.round(+'${floatStr}') = ${Math.round(+floatStr)}`);
console.log('\n');

// 方法9: 位运算符 (~~, |0, >>0)
console.log('9. 位运算符转换 (仅适用于32位整数):');
const intStrings = ['123', '123.789', '-123.456'];
intStrings.forEach(str => {
  console.log(`~~'${str}' = ${~~str}`);
  console.log(`'${str}' | 0 = ${str | 0}`);
  console.log(`'${str}' >> 0 = ${str >> 0}`);
  console.log(`'${str}' >>> 0 = ${str >>> 0}`); // 无符号右移
  console.log('---');
});
console.log('\n');

// 各方法的特点对比
console.log('=== 各方法特点对比 ===\n');

const comparisonTests = [
  { str: '123', desc: '纯数字字符串' },
  { str: '123.45', desc: '小数字符串' },
  { str: '123abc', desc: '数字+字母' },
  { str: '  123  ', desc: '带空格' },
  { str: '', desc: '空字符串' },
  { str: 'abc', desc: '纯字母' },
];

comparisonTests.forEach(({ str, desc }) => {
  console.log(`测试: '${str}' (${desc})`);
  console.log(`  Number(): ${Number(str)}`);
  console.log(`  parseInt(): ${parseInt(str)}`);
  console.log(`  parseFloat(): ${parseFloat(str)}`);
  console.log(`  +: ${+str}`);
  console.log(`  * 1: ${str * 1}`);
  console.log(`  - 0: ${str - 0}`);
  console.log(`  / 1: ${str / 1}`);
  console.log('');
});

// 实际应用场景示例
console.log('=== 实际应用场景 ===\n');

// 场景1: 表单输入验证
function validateNumberInput(input) {
  const num = Number(input);
  if (isNaN(num)) {
    return { valid: false, message: '请输入有效数字' };
  }
  return { valid: true, value: num };
}

console.log('表单验证示例:');
console.log(validateNumberInput('123')); // 有效
console.log(validateNumberInput('abc')); // 无效
console.log('\n');

// 场景2: 安全的字符串转数字
function safeStringToNumber(str, defaultValue = 0) {
  const num = Number(str);
  return isNaN(num) ? defaultValue : num;
}

console.log('安全转换示例:');
console.log(`safeStringToNumber('123') = ${safeStringToNumber('123')}`);
console.log(`safeStringToNumber('abc', 0) = ${safeStringToNumber('abc', 0)}`);
console.log('\n');

// 场景3: 解析不同进制
function parseWithRadix(str, radix) {
  return parseInt(str, radix);
}

console.log('进制解析示例:');
console.log(`parseInt('10', 2) = ${parseInt('10', 2)}`); // 二进制
console.log(`parseInt('10', 8) = ${parseInt('10', 8)}`); // 八进制
console.log(`parseInt('10', 16) = ${parseInt('10', 16)}`); // 十六进制
console.log('\n');

// 性能对比函数
function performanceTest() {
  const testStr = '123456';
  const iterations = 1000000;
  
  console.log('=== 性能测试 (1,000,000 次转换) ===');
  
  // Number()
  console.time('Number()');
  for (let i = 0; i < iterations; i++) {
    Number(testStr);
  }
  console.timeEnd('Number()');
  
  // 一元加号
  console.time('一元加号 (+)');
  for (let i = 0; i < iterations; i++) {
    +testStr;
  }
  console.timeEnd('一元加号 (+)');
  
  // parseInt()
  console.time('parseInt()');
  for (let i = 0; i < iterations; i++) {
    parseInt(testStr);
  }
  console.timeEnd('parseInt()');
  
  // 乘法
  console.time('乘法 (* 1)');
  for (let i = 0; i < iterations; i++) {
    testStr * 1;
  }
  console.timeEnd('乘法 (* 1)');
}

// 运行性能测试
performanceTest();

// 总结
console.log('\n=== 方法选择建议 ===');
console.log('1. Number() - 最严格，推荐用于一般转换');
console.log('2. parseInt() - 解析整数，忽略后面的非数字字符');
console.log('3. parseFloat() - 解析浮点数，忽略后面的非数字字符');
console.log('4. 一元加号 (+) - 简洁，等价于 Number()');
console.log('5. 算术操作符 (*, -, /) - 隐式转换，简洁但可读性稍差');
console.log('6. 位运算符 - 仅适用于32位整数，性能好但有限制');