---
title: JavaScript 的浅拷贝和深拷贝
author: Shouduo
date: 2022-09-20 19:12:02
updated: 2022-09-20 21:21:19
tags: ['前端', '浅拷贝', '深拷贝']
categories: ['Front-end']
banner_img: /img/post/js_clone.png
index_img: /img/post/js_clone.png
abbrlink: js_clone
---

## 前言

JavaScript 中有许多拷贝对象、数组的代码场景。现实世界中的再版或者文件管理系统的复制，总是得到另一份完全独立的副本，而 JavaScript 中的拷贝由于引用类型的存在，可以使得多个副本中的变量可以操作同一个内存地址中的数据，为了厘清 “地址拷贝” 和 “数据拷贝”，JavaScript 中的拷贝分为 浅拷贝 和 深拷贝。

![浅拷贝和深拷贝](/img/post/js_clone_theory.png)

## 浅拷贝

浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，当其中一个对象改变了这个地址，就会影响到另一个对象。

### Object.assign()

object.assign 是 ES6 中 object 的一个方法，该方法可以用于JS 对象的合并等多个用途，其中一个用途就是可以进行浅拷贝。该方法的第一个参数是拷贝的目标对象，后面的参数是拷贝的来源对象（也可以是多个来源）。

``` javascript
const source = { a: { b: 1 } };
const target = {};

Object.assign(target, source);

console.log(target); // { a: { b: 1 } };
```

但是使用 object.assign 方法有几点需要注意：

- 可以拷贝 Symbol 类型的属性。
- 不会拷贝对象的继承属性；
- 不会拷贝对象的不可枚举的属性（本文提及的所有浅拷贝和深拷贝方法都不会拷贝不可枚举的属性）；

``` javascript
const source = {
  a: { b: 1 },
  c: 1,
  sym: Symbol(1)
};
Object.defineProperty(source, 'innumerable', {value: '1', enumerable: false});

const target = {};

Object.assign(target, source);

source.a.b = 2;
source.c = 2;

console.log('source', source); // {a: {b: 2}, c: 2, sym: Symbol(1), innumerable: "1"}
console.log('target', target); // {a: {b: 2}, c: 1, sym: Symbol(1)}
```

从上面的样例代码中可以看到，利用 object.assign 也可以拷贝 Symbol 类型的对象，但是如果到了对象的第二层属性 obj1.a.b 这里的时候，前者值的改变也会影响后者的第二层属性的值，说明其中依旧存在着访问共同堆内存的问题，也就是说这种方法还不能进一步复制，而只是完成了浅拷贝的功能。

### lodash 的 _.clone()

``` javascript
const _ = require('lodash');

const source = {
  a: { b: 1 },
  c: 1,
  sym: Symbol(1)
};

const target = _.clone(source);

source.a.b = 2;
source.c = 2;

console.log('source', source); // {a: {b: 2}, c: 2, sym: Symbol(1)}
console.log('target', target); // {a: {b: 2}, c: 1, sym: Symbol(1)}
```

### 扩展运算符 \.\.\.

展开运算符是一个 es6（es2015）特性，它提供了一种非常方便的方式来执行浅拷贝，这与 Object.assign() 的功能相同。

``` javascript
/* 对象的拷贝 */
const source = {
  a: { b: 1 },
  c: 1,
  sym: Symbol(1)
};

const target = { ...source };

source.a.b = 2;
source.c = 2;

console.log('source', source); // {a: {b: 2}, c: 2, sym: Symbol(1)}
console.log('target', target); // {a: {b: 2}, c: 1, sym: Symbol(1)}

/* 数组的拷贝 */
const source = ['a', { b: 1 }, 'c'];
const target = [ ...source ];

source[2].b = 2;
source[3] = 'd';

console.log('source', source); // ['a', { b: 2 }, 'c']
console.log('target', target); // ['a', { b: 2 }, 'd']
```

### Array.prototype.concat()

``` javascript
let source = ['a', { b: 1 }, 'c'];
let target = source.concat();

source[2].b = 2;
source[3] = 'd';

console.log('source', source); // ['a', { b: 2 }, 'c']
console.log('target', target); // ['a', { b: 2 }, 'd']
```

### Array.prototype.slice()

``` javascript
let source = ['a', { b: 1 }, 'c'];
let target = source.slice();

source[2].b = 2;
source[3] = 'd';

console.log('source', source); // ['a', { b: 2 }, 'c']
console.log('target', target); // ['a', { b: 2 }, 'd']
```

## 深拷贝

将原对象从内存中完整地拷贝出来一份给新对象，并从堆内存中开辟一个全新的空间存放新对象，且新对象的修改并不会改变原对象，二者实现真正的分离。

### JSON.parse(JSON.stringify())

``` javascript
const source = {
  a: { b: 1 },
  c: 1,
  sym: Symbol(1),
};

const target = JSON.parse(JSON.stringify(source));

source.a.b = 2;
source.c = 2;

console.log('source', source); // {a: {b: 2}, c: 2, sym: Symbol(1)}
console.log('target', target); // {a: {b: 1}, c: 1)}
```

但是，JSON.stringify 并不是那么完美的，它也有局限性:

- 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；
- 拷贝 Date 引用类型会变成字符串；
- 无法拷贝不可枚举的属性；
- 无法拷贝对象的原型链；
- 拷贝 RegExp 引用类型会变成空对象；
- 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；
- 无法拷贝对象的循环应用，即对象成环 (obj\[key\] = obj)。

``` javascript
let source = {
  func: function () { alert(1) },
  obj: { a: 1 },
  arr: [1, 2, 3],
  und: undefined,
  reg: /123/,
  date: new Date(0),
  NaN: NaN,
  infinity: Infinity,
  sym: Symbol('1')
}
Object.defineProperty(source, 'innumerable', {value: '1', enumerable: false});

const target = JSON.parse(JSON.stringify(source));

console.log('source', source); 
// { 
//   NaN: NaN,
//   arr: (3) [1, 2, 3],
//   date: Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间) {},
//   func: ƒ(), infinity: Infinity,
//   obj: { a: 1 },
//   reg: /123/,
//   sym: Symbol(1),
//   und: undefined,
//   innumerable: "1"
// }
console.log('target', target); 
// {
//   NaN: null,
//   arr: (3) [1, 2, 3],
//   date: "1970-01-01T00:00:00.000Z",
//   infinity: null,
//   obj: {a: 1},
//   reg: {}
// }
```

### lodash 的 _.cloneDeep()

``` javascript
const _ = require('lodash');

const source = {
  a: { b: 1 },
  c: 1,
  sym: Symbol(1)
};

const target = _.cloneDeep(source);

source.a.b = 2;
source.c = 2;

console.log('source', source); // {a: {b: 2}, c: 2, sym: Symbol(1)}
console.log('target', target); // {a: {b: 1}, c: 1, sym: Symbol(1)}
```

## 手动实现

### 浅拷贝

``` javascript
const shallowClone = (source) => {
  let target = {};
  for(let i in source) {
    if (source.hasOwnProperty(i)) {
      target[i] = source[i];
    }
  }
  return target;
}

const source = {
  a: { b: 1 },
  c: 1,
  sym: Symbol(1)
};
Object.defineProperty(source, 'innumerable', {value: '1', enumerable: false});

const target = shallowClone(source);

source.a.b = 2;
source.c = 2;

console.log('source', source); // {a: {b: 2}, c: 2, sym: Symbol(1), innumerable: "1"}
console.log('target', target); // {a: {b: 2}, c: 1, sym: Symbol(1)}
```

### 深拷贝

``` javascript
const deepClone = (source, hash = new WeakMap()) => {
  if (source === null) return source; // 如果是 null 或者 undefined 就不进行拷贝操作
  if (source instanceof Date) return new Date(source);
  if (source instanceof RegExp) return new RegExp(source);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof source !== "object") return source;
  // 是对象的话就要进行深拷贝
  if (hash.get(source)) return hash.get(source);
  let target = new source.constructor();
  // 找到的是所属类原型上的 constructor，而原型上的 constructor 指向的是当前类本身
  hash.set(source, target);
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      target[key] = deepClone(source[key], hash);
    }
  }
  return target;
}

let source = {
  a: { b: 1 },
  c: 1,
};
source.o = source; // 对象存在循环引用的情况
let target = deepClone(source);

source.a.b = 2;

console.log('source', source); // {a: {b: 2}, c: 2, o: {a: {...}, c: 1, o: {...}}}
console.log('target', target); // {a: {b: 1}, c: 1, o: {a: {...}, c: 1, o: {...}}}
```

## 总结

- 浅拷贝：重新在堆中创建内存，拷贝前后对象的基本数据类型互不影响，但拷贝前后对象的引用类型因共享同一块内存，会相互影响。
- 深拷贝：从堆内存中开辟一个新的区域存放新对象，对对象中的子对象进行递归拷贝,拷贝前后的两个对象互不影响。

参考文章：
[浅拷贝与深拷贝 | 作者：浪里行舟](https://juejin.cn/post/6844904197595332622)
[【JS专栏】JS对象的浅拷贝与深拷贝 | 作者：前端历劫之路](https://blog.csdn.net/qq_39045645/article/details/121151205)
[Object.assign()扩展-实现原型链拷贝 | 作者：邵天宇Soy](https://blog.csdn.net/qq_35087256/article/details/82634816)
