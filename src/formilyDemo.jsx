/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2023-05-05 17:10:46
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2023-05-06 09:52:15
 * @FilePath: /fe-notebook/src/formilyDemo.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { createForm } from '@formily/core'
import { FormProvider, FormConsumer, Field } from '@formily/react'
import {
  FormItem,
  FormLayout,
  Input,
  FormButtonGroup,
  Submit,
} from '@formily/antd'

const form = createForm()
window.formhou = form;

export default () => {
  return (
    <FormProvider form={form}>
      <FormLayout layout="vertical">
        <Field
          name="input"
          title="输入框"
          required
          initialValue="Hello world"
          decorator={[FormItem]}
          component={[Input]}
        />
      </FormLayout>
      <FormConsumer>
        {(arg) => {
          // arg ===form: true
          console.info(' arg:',arg,'arg ===form:',arg ===form)
          return (
            <div
              style={{
                marginBottom: 20,
                padding: 5,
                border: '1px dashed #666',
              }}
            >
              实时响应：{form.values.input}
            </div>
          )
        }}
      </FormConsumer>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}