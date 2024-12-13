/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
interface Message {
  type: string;
  url: string;
}
interface SuccessMessage extends Message {
  type: `${string}Success`;
  body: string;
}
interface ErrorMessage extends Message {
  type: `${string}Error`;
  message: string;
}
function handler(r: SuccessMessage | ErrorMessage) {
  const a = r.type === "HttpSuccess";
  if (a) {
    let token = r.body;
  }
}

type Square = {
  kind: "square";
  size: number;
};
type Rectangle = {
  kind: "rectangle";
  height: number;
  width: number;
};
type Circle = {
  kind: "circle";
  radius: number;
};
type Shape = Square | Rectangle | Circle;
function getArea(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return "ss" + s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}

const a = getArea({
  kind: "square",
  size: 12,
});
enum EAnimalType {
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

type AnimalMap = {
  [EAnimalType.dog]: Dog;
  [EAnimalType.cat]: Cat;
  [EAnimalType.bird]: Bird;
};

interface Address<T> {
  address: string;
  city: string;
  data: T;
}
export interface IAnimalExtra<T extends EAnimalType> {
  //   [c in keyof AnimalMap[T]]: AnimalMap[T][c];
  number: T;
}

export interface IAnimal<T extends EAnimalType> extends IAnimalExtra<T> {
  id: number; // 编号
  name: string; // 名称
  type: T; // 类型
}

type Args<T> = T extends new (...args: infer P) => any ? P : never;

class MyClass {
  constructor(name: string, age: number) {
    console.info("MyClass");
  }
}
class MyClass2 {
  constructor(name: string, age: number) {
    console.info(" MyClass2");
  }
}

type DRT = typeof MyClass;

const zz: DRT = MyClass2;
type MyClassArgs = Args<typeof MyClass>; // [string, number]

type UnArray<T> = T extends any[] ? T[number] : T;

type Users = {
  name: string;
  age: number;
  city: string;
}[];

type User = UnArray<Users>;

type Str = UnArray<string>; // string

type UnArray2<T> = T extends Array<infer U> ? U : T;

type User2 = UnArray2<Users>;

type Str2 = UnArray2<string>; // string
