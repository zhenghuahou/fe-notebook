/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 动物枚举
 */
export enum EAnimalType {
  dog = "dog",
  cat = "cat",
  bird = "bird",
}

type Dog = {
  /** 大叫 */
  shoutLoudly: () => void;
};

type Cat = {
  say: () => void;
};

type Bird = {
  /** 飞 */
  fly: () => void;
};

export type AnimalMap = {
  [EAnimalType.dog]: Dog;
  [EAnimalType.cat]: Cat;
  [EAnimalType.bird]: Bird;
};

export type IAnimalExtra<T extends EAnimalType> = {
  [c in keyof AnimalMap[T]]: AnimalMap[T][c];
};

const y: AnimalMap[EAnimalType.dog]["shoutLoudly"] = () => {
  return;
};
console.info(" y:", y);
export type IAnimal<T extends EAnimalType> = IAnimalExtra<T> & {
  id: number; // 编号
  name: string; // 名称
  type: T; // 类型
};

/**
 * 定义一个工厂，用来创建具体动物的实例
 * @returns 返回动物的实例
 */
function createAnimalFactory<T extends EAnimalType>(): IAnimal<T> {
  // TODO 根据业务具体实现
  return {} as IAnimal<T>;
}

// 根据泛型创建狗狗的实例
const dog = createAnimalFactory<EAnimalType.dog>();
dog.shoutLoudly();

// 根据泛型创建鸟的实例
const bird = createAnimalFactory<EAnimalType.bird>();
bird.fly();

// type A = "blue" | "red" | 999;
// type B = 999 | 666;
// type C = A & B; // type C = 999;
// const c: C = 999;
// console.info(" c:", c);

type Person = {
  name: string;
  age: number;
} & {
  age: 18;
  height: number;
  weight: number;
};
const person: Person = {
  name: "zhangsan",
  age: 18, // ❌ 不能将类型“20”分配给类型“18”。
  height: 180,
  weight: 60,
};

const valueList = [123, "abc"];
const getRandomValue = () => {
  const number = Math.random() * 10; // 这里取一个[0, 10)范围内的随机值
  if (number < 5)
    return valueList[0]; // 如果随机数小于5则返回valueList里的第一个值，也就是123
  else return valueList[1]; // 否则返回"abc"
};

type A = number;
type B = string;
function isString(value: A | B): value is string {
  //   const number = Math.random() * 10;
  return typeof value === "string";
}

const item = getRandomValue();

const bridge = (() => {
  const test: B = "11";
  return test as B;
})();

function test() {
  const a = isString(item);
  if (a) {
    console.log(item.length); // 此时item是string类型
  } else {
    console.log(item.toFixed()); // 此时item是number类型
  }
}

test();

type Parameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

function add(a: number, b: number): number {
  return a + b;
}

type z = typeof add;
type AddParameters = Parameters<typeof add>;

type UnboxArray<T extends Array<any>> = T extends Array<infer U> ? U : never;

type MyArray = (number | boolean)[];

type ElementType = UnboxArray<MyArray>;
const a: ElementType = true;

type Functionify<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : T[K];
};

type OriginalObject<T> = {
  a: string;
  b: number;
  c: () => boolean;
  extra: T;
};

interface Demo {
  a: string;
  b?: number;
}
type DF = OriginalObject<Demo>;
type FunctionifiedObject = Functionify<OriginalObject<Demo>>;

const yy: FunctionifiedObject = {
  a: "1",
  b: 22,
  c: () => {
    return !0;
  },
  extra: {
    a: "11",
    // zz: 11,
  },
};

type Args<T> = T extends new (...args: infer P) => any ? P : never;

class MyClass {
  constructor(name: string, age: number) {
    console.info(" test");
  }
}
type MyClassArgs = Args<typeof MyClass>; // [name:string, age:number]

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

async function fetchData(): Promise<string> {
  return "Fetched data";
}

type Huazi = typeof fetchData;
type Huazi2 = ReturnType<typeof fetchData>;
type FetchedDataType = PromiseType<ReturnType<typeof fetchData>>; // FetchedDataType is inferred as 'string'
