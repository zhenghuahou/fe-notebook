/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export type IAnimalExtra<T extends EAnimalType> = {
  [c in keyof AnimalMap[T]]: AnimalMap[T][c];
};

interface Address<T> {
  address: string;
  city: string;
  data: T;
}

export interface IAnimal<T extends EAnimalType, U> extends Address<U> {
  id: number; // 编号
  name: string; // 名称
  type: U; // 类型
}

const employee: IAnimal<EAnimalType.bird, string> = {
  name: "GeeksforGeeks",
  //   age: 30,
  address: "A-143, 9th Floor, Sovereign Corporate Tower",
  city: "Noida",
  //   jobTitle: "Manager",
  id: 122,
  type: "trest",
  data: "bird",
};

// export type IAnimal<T extends EAnimalType> = IAnimalExtra<T> & {
//   id: number; // 编号
//   name: string; // 名称
//   type: T; // 类型
// };

// export type IAnimalExtra<T extends EAnimalType>  {
//     [c in keyof AnimalMap[T]]: AnimalMap[T][c];
//   }

// type Wrong3<T> = T extends (infer U)[] ? U : T; // Error
// type Wrong2<T> = (infer U)[] extends T ? U : T; // Error
// type Wrong1<T extends (infer U)[]> = T[0]; // Error

function add(a: number, b: number): number {
  return a + b;
}

type A = typeof add;
type B = keyof typeof EAnimalType;
type AddParameters = Parameters<typeof add>;

interface BB {
  name: string;
}

// type cc = BB & never;

type Obj = {
  a: number;
  b: string;
  [key: string]: any;
};

const ObjSatisfies = {
  a: 1,
  b: "1", // 顯示型別錯誤
  c: 3, // 自動推導為 number
} satisfies Obj;

ObjSatisfies.c = 12;
