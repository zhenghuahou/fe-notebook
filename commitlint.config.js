/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2023-03-15 12:06:12
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2023-05-11 08:29:40
 * @FilePath: /fe-notebook/commitlint.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'deps',
      ],
    ],
  },
};
