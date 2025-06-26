import { Buffer } from 'node:buffer';

const aa = Buffer.from((true ? '05' : ''))


const buf4 = Buffer.from([1, 2, 3]);

console.info('aa:',aa,' --:',aa.toString())
// console.info(' buf4:',buf4)

