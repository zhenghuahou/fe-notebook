import { SM2} from "gm-crypto";
import ss from "gm-crypto";
import { appendFileSync } from "node:fs";
//订单参数
const p = {
coOrderId: 'DKSQ202504220003',//车方金融单号
stagingIdChannel:'ST032025042200014'//农业银行分期订单号，申请接口调用成功后会返回
};


/*


// console.info(' ss:',ss,'constants:',SM2.constants,' C1C3C2:',SM2.constants.C1C3C2)

// const p = {
//   coOrderId: 'DKSQ202504180015', //车方金融单号
//   stagingIdChannel: 'ST032025042100026', //农业银行分期订单号，申请接口调用成功后会返回
// };

//SM2公钥
const SM2_PUBLIC_KEY =
  "044dbd4a405e294f1900e8e572cfbadb5a671e23a46c889feddd7070e7e03c310b308b4cc0d04c1505145d6d10f26496e1e3abd1529accf31baf439b9df3f09a52";
//加密订单参数
const eStr = SM2.encrypt(JSON.stringify(p), SM2_PUBLIC_KEY, {
  inputEncoding: "utf8",
  outputEncoding: "hex",
  pc: false,
//   mode:SM2.constants.C1C3C2
});

console.info(" eStr:", eStr, 'eStr.length:',eStr.length);

//测试环境
const testUrl = `coOrderId:${p.coOrderId} stagingIdChannel:${p.stagingIdChannel}\n测试链接:https://mssm.test.abchina.com.cn/mssm-st-rel/msH5/#/cooperative/jlr/sms?coProjectId=P10115&coOrderId=${eStr}\n\n`;
// 
// console.info(' testUrl:',testUrl)

function writeFile(){
    try {
        appendFileSync('url.txt',testUrl)
    } catch (error) {
        console.log('error:',error)
    }

}

writeFile();