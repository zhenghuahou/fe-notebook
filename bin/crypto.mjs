/*
 * @Author: zhenghuahou 2430370966@qq.com
 * @Date: 2025-05-22 15:01:26
 * @LastEditors: zhenghuahou 2430370966@qq.com
 * @LastEditTime: 2025-06-12 10:04:05
 * @FilePath: /fe-notebook/bin/crypto copy.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SM2 } from "gm-crypto";
import { appendFileSync } from "node:fs";

// sm-crypto
//订单参数
const p = {
  coOrderId: "20250612P1011001", //车方金融单号
  stagingIdChannel: "ST032025061200006", //农业银行分期订单号，申请接口调用成功后会返回
};

//SM2公钥
const SM2_PUBLIC_KEY =
  "044dbd4a405e294f1900e8e572cfbadb5a671e23a46c889feddd7070e7e03c310b308b4cc0d04c1505145d6d10f26496e1e3abd1529accf31baf439b9df3f09a52";
//加密订单参数
const eStr = SM2.encrypt(JSON.stringify(p), SM2_PUBLIC_KEY, {
  inputEncoding: "utf8",
  outputEncoding: "hex",
  pc: true,
});

console.info(" eStr:", eStr);
//农行-捷豹路虎汽车分期申请链接
//coProjectId为合作项目编号，由农行提供
//测试环境
const testUrl = `https://mssm.test.abchina.com.cn/mssm-st-rel/msH5/#/cooperative/xiaomi/sms?coOrderId=${eStr}&coProjectId=P10116\n`;
//生产环境
// const oUrlProd = `https://mssm.abchina.com.cn/mssm￾st/msH5/#/cooperative/jlr/sms?coOrderId=${eStr}&coProjectId=XXX`;

//  const volvoTest1 = `https://mssm.test.abchina.com.cn/mssm-st-rel/msH5/#/cooperative/volvo/sms?coOrderId=0494308aa95f771c7d5b76561f8061cc7586315a496048fbfe8831b452e7ae550c89f4319b73855c47b9e7036bc07bf761ec97ea5f462424745af490a476a0cc4e102bfae1705b84bc5f9ff45e14d7f28191083354f6a23fbbfe1869724a008ea80388d34688bb6bde820c92b30c05900c7ef8d50664d7a0a6513c7bae0f148ad607470fe78d6e36f2700bbbc73550e46e0f7e844367a6f3d6fa21e5a2496f732dc45c4996ba8d0b34&coProjectId=P10058`;

// eStr:

function writeFile() {
  try {
    appendFileSync("url.txt", testUrl);
  } catch (error) {
    console.log("error:", error);
  }
}

writeFile();
