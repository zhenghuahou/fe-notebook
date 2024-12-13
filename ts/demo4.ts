/* eslint-disable @typescript-eslint/no-unused-vars */
class Animal {}
class Dog extends Animal {
  bark() {
    console.log("汪！");
  }
}
class Cat extends Animal {
  meow() {
    console.log("喵!");
  }
}

function isCar(vehicle: Dog | Cat): vehicle is Dog {
  return true;
}

// function makeSound(animal: Animal) {
//   if (animal instanceof Dog) {
//     animal.bark();
//   } else if (animal instanceof Cat) {
//     animal.meow();
//   }
// }

function makeSound(animal: Dog | Cat) {
  const aa = isCar(animal);
  if (a > 1) {
    if (aa) {
      animal.bark();
    }
    // animal
  }
}

interface IPaper {
  className?: string;
  children: Array<number>;
  elevation: "low" | "medium" | "high";
}

interface ThemeParameters extends IPaper {
  name: string;
}

const ad: ThemeParameters = {
  children: [11],
  name: "11",
  elevation: "low",
};





interface Goods {
  type: string[]
  goodsName: number[]
  price: number
}

// 作为网络请求参数，只需要 goodsName 和 price 就可以
type RequestGoodsParams = Pick<Goods, 'goodsName'>

type RequestTypeParams = Pick<Goods, 'type'>

type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Extract<string | number | (() => void), 'xxx'>;  // () => void


type Pick2<T, K extends keyof T> = {
  [P in K]: T[P];
}

type RequestGoodsParams2 = Pick2<Goods, 'goodsName'>

type A = "a" | "b" | "c" | "d"
type D =   K extends keyof T? T:string;
const a:D ="a"



interface Test {
  a: string;
  b: number;
  c: boolean;
}

// Omit a single property:
type OmitA = Omit<Test, "a">; // Equivalent to: {b: number, c: boolean}

// Or, to omit multiple properties:
type OmitAB = Omit<Test, "a"|"b">; // Equivalent to: {c: boolean}