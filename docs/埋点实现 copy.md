 ```javascript
 type Channel = 'wechat' | 'alipay' | 'h5';

  type BaseTrackParams = {
    userId?: string;
    page?: string;
    buttonName?: string;
    orderId?: string;
    [key: string]: any;
  };

  const channelParamMap: Record<Channel, Record<string, string>> = {
    wechat: {
      userId: 'openid',
      page: 'page_path',
      buttonName: 'btn_name',
      orderId: 'order_id',
    },
    alipay: {
      userId: 'uid',
      page: 'pageName',
      buttonName: 'actionName',
      orderId: 'bizOrderId',
    },
    h5: {
      userId: 'user_id',
      page: 'page',
      buttonName: 'button_name',
      orderId: 'order_id',
    },
  };

  function transformParams(
    params: BaseTrackParams,
    map: Record<string, string>,
  ) {
    return Object.keys(params).reduce<Record<string, any>>((result, key) => {
      const targetKey = map[key] || key;
      result[targetKey] = params[key];
      return result;
    }, {});
  }
```
  调用示例：
```javascript
  const baseParams = {
    userId: 'u_10001',
    page: 'order_confirm',
    buttonName: '提交订单',
    orderId: 'order_888',
    extraInfo: '自定义字段',
  };

  const channel: Channel = 'wechat';

  const finalParams = transformParams(
    baseParams,
    channelParamMap[channel],
  );

  console.log(finalParams);
```
  输出结果：

```javascript
  {
    openid: 'u_10001',
    page_path: 'order_confirm',
    btn_name: '提交订单',
    order_id: 'order_888',
    extraInfo: '自定义字段'
  }
```
  extraInfo 没有配置映射，所以会保留原字段名。

  ———

  也可以封装到统一 track 方法里：
```javascript
  function track(
    channel: Channel,
    eventName: string,
    params: BaseTrackParams,
  ) {
    const map = channelParamMap[channel];

    const finalParams = transformParams(params, map);

    console.log('eventName:', eventName);
    console.log('channel:', channel);
    console.log('finalParams:', finalParams);

    // 示例：这里替换成真实埋点 SDK
    // analytics.track(eventName, finalParams);
  }
```
  业务侧这样调用：
```javascript
  track('wechat', 'submit_order_click', {
    userId: 'u_10001',
    page: 'order_confirm',
    buttonName: '提交订单',
    orderId: 'order_888',
  });
```
  最终 track 内部拿到的是：
```json
  {
    openid: 'u_10001',
    page_path: 'order_confirm',
    btn_name: '提交订单',
    order_id: 'order_888'
  }
```
  如果换成支付宝：
```javascript
  track('alipay', 'submit_order_click', {
    userId: 'u_10001',
    page: 'order_confirm',
    buttonName: '提交订单',
    orderId: 'order_888',
  });
```
  得到：
```json
  {
    uid: 'u_10001',
    pageName: 'order_confirm',
    actionName: '提交订单',
    bizOrderId: 'order_888'
  }
```