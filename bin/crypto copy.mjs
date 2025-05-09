import { SM2 } from 'gm-crypto';
// sm-crypto
//订单参数
const p = {
coOrderId: 'DKSQ202504170007',//车方金融单号
stagingIdChannel:'ST032025041700014'//农业银行分期订单号，申请接口调用成功后会返回
};

//SM2公钥
const SM2_PUBLIC_KEY
='044dbd4a405e294f1900e8e572cfbadb5a671e23a46c889feddd7070e7e03c310b308b4cc0d04c1505145d6d10f26496e1e3abd1529accf31baf439b9df3f09a52';
//加密订单参数
const eStr = SM2.encrypt(JSON.stringify(p), SM2_PUBLIC_KEY, {
inputEncoding: 'utf8',
outputEncoding: 'hex',
pc: true,
});

console.info(' eStr:',eStr)
//农行-捷豹路虎汽车分期申请链接
//coProjectId为合作项目编号，由农行提供
//测试环境
const oUrlTest = `https://mssm.test.abchina.com.cn/mssm-st￾rel/msH5/#/cooperative/jlr/sms?coOrderId=${eStr}&coProjectId=XXX`;
//生产环境
// const oUrlProd = `https://mssm.abchina.com.cn/mssm￾st/msH5/#/cooperative/jlr/sms?coOrderId=${eStr}&coProjectId=XXX`;




//  const volvoTest1 = `https://mssm.test.abchina.com.cn/mssm-st-rel/msH5/#/cooperative/volvo/sms?coOrderId=0494308aa95f771c7d5b76561f8061cc7586315a496048fbfe8831b452e7ae550c89f4319b73855c47b9e7036bc07bf761ec97ea5f462424745af490a476a0cc4e102bfae1705b84bc5f9ff45e14d7f28191083354f6a23fbbfe1869724a008ea80388d34688bb6bde820c92b30c05900c7ef8d50664d7a0a6513c7bae0f148ad607470fe78d6e36f2700bbbc73550e46e0f7e844367a6f3d6fa21e5a2496f732dc45c4996ba8d0b34&coProjectId=P10058`;



const volvoTest1 = 'https://mssm.test.abchina.com.cn/mssm-st-rel/msH5/#/cooperative/volvo/sms?coOrderId=04186cd143a8568c669e61aae8a2f644116b7b727b5dd53a56b751474d9860ed88639a4265ff31c0cd1bdd2b1fc640904ab24d51cb8cf2b926aef41ceb671f7001d26d9548881c945327d4c2d5fbd93d92edbce0d4ac305c2b4df66346a8d418e77aa6de963cf98788c6d4b1db0557303adac745ff2a1894de06b406fb8cc5b8a80e1f3557dfacc5c071c25c4c6a546cb27471e2dddcfba0ff9e00b8afd6fad7bc254f&coProjectId=P10058'




https://mssm.test.abchina.com.cn/mssm-st-rel/msH5/#/cooperative/jlr/sms?coOrderId=0452ba32b40101a9cf817ff47c36350dbebaf377ac8ec4dd1c32c0d70232997d1d3c761e25257643211739e2be191b438d834889f6d6bf20ca3d3e8780e58e8a8fa2e56feb23387a5d2c98c302d248c96de73f06b24e49753d5084fa9d786cc4c6329494afc27636e3ce2c5d267027f021fc238683530bbacb908239c4ad5564421310f708d08dba643ab773de04b2a60b2feb1060e4667bdf63b72cecb68319b43c4b&coProjectId=P10115

// eStr: 

