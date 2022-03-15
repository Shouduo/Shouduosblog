---
title: ES6 中生成器函数 generator 和 yield 关键字
author: Shouduo
date: 2019-08-14 17:45:18
updated: 2019-08-16 21:55:02
tags: ['前端', 'EcmaScript', 'JavaScript']
categories: ['Frontend']
banner_img: '/img/post/js_generator.jpeg'
index_img: '/img/post/js_generator.jpeg'
abbrlink: es6-generator
---

## 简介

generator（生成器）是 ES6 标准引入的新的数据类型。一个 generator 看上去像一个函数，但函数执行中间可以停止。ES6 中 generator 借鉴了 Python 中 generator 的概念和语法。可以把 generator 理解成一个状态机（像 React 中有很多 state），封装了多个内部状态。执行 generator 返回的是一个遍历器对象，可以遍历 generator 产生的每一个状态。

## 使用

### 生成器函数 generator

在 function 后加 \* 就可以声明一个 generator 函数。\* 可以和函数名贴在一起，可以和function贴在一起，也可以谁都不贴，直接放中间，不建议连起来写。详见 [ESLint](https://eslint.org/docs/rules/generator-star-spacing)

``` javascript
function *foobar() {} //合法
function* foobar() {} //合法
function * foobar() {} //合法
function*foobar() {} //浏览器不会报错，但不负 ESLint 建议
```

### 关键字 yield

由于 generator 函数返回的遍历器对象，只有调用 next() 方法才会遍历到下一个状态，所以其实提供了一种可以暂停的执行函数，顺序执行时遇到 yield 语句就暂停执行，当调用 next() 时才会继续向下执行。

``` javascript
function* foobar(){
  yield 'hello';
  yield 'world';
  return '!';
}

let foo = foobar();
console.log(foo); //foo {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window}
console.log(foo.next()); //Object {value: "hello", done: false}
console.log(foo.next()); //Object {value: "world", done: false}
console.log(foo.next()); //Object {value: "!", done: true}
```

### 方法 next()

每次执行 next()，将当前所在 yield 后的表达式的值作为返回的对象的 value 值；如果没有遇到 yield，则返回 return 语句作为返回对象的 value 值；如果没有 return，则返回对象的 value 值为 undefined。next() 方法可以带一个参数，该参数会被当做上一条 yield 语句的返回值。

``` javascript
function* add(a, b){
  let c = 0;
  c = yield a + c;
  c = yield b + c;
  return;
}
 
let sum1 = add(1, 2);
console.log(sum1); //add {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window}
console.log(sum1.next()); //Object {value: 1, done: false}
console.log(sum1.next()); //Object {value: NaN, done: false}
console.log(sum1.next()); //Object {value: undefined, done: true}

let sum2 = add(1, 2);
console.log(sum2); //add {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window}
console.log(sum2.next()); //Object {value: 1, done: false}
console.log(sum2.next(1)); //Object {value: 3, done: false}
console.log(sum2.next(3)); //Object {value: undefined, done: true}
```

## 应用

在 js 中，要遍历一个数组，可以使用 ES6 的 for...of 语句，这是因为数组中包含了一个 generator 遍历器。如果自定义的对象也包含一个遍历器，就可以通过 for...of 等遍历语句来遍历。这个遍历器被存在 Symbol.iterator 属性中。

原生具备 iterator 接口的类型：

- Array
- Arguments
- Set
- Map
- String
- TypedArray
- NodeList

使用数组原型上的 Symbol.iterator 为自定义对象增加 Symbol.iterator 属性有个限制，对象必须是个伪数组（对象的键为数字）才能遍历。

``` javascript
let obj = {
  0: 'Shouduo',
  1: 24,
  length: 2,
  [Symbol.iterator]: Array.prototype[Symbol.iterator] // 让对象变为可迭代的值，手动加上数组的可迭代方法
};
for(let item of obj) {
  console.log(item);
}
```

可以使用 generator 实现自定义对象上的 Symbol.iterator 属性，使其更加通用：

``` javascript
let obj = {
  name: "Shouduo",
  age: 24,
  *[Symbol.iterator]() {
    for(let arg of Object.values(this)) {
      yield arg;
    }
  }
}

for(let item of obj) {
  console.log(item); // 用 for...of 遍历 generator 的时候，不需要显示调用 next() 方法。
}
```

## 总结

generator 函数是一个普通函数，但是有两个特征: 一是 function 关键字与函数名之间有一个**星号和空格**；二是函数体内部使用 yield 表达式，定义不同的内部状态（yield在英语里的意思是“让步、放弃”）。
调用 generator 函数后，函数并不执行，返回的也不是函数运行结果，而是返回的是一个指向遍历器对象的指针，必须调用遍历器对象的 next 方法，使得指针移向下一个状态。
next 方法返回一个对象，它的 value 属性就是当前 yield 表达式的值，done 属性的值表示遍历是否结束。
