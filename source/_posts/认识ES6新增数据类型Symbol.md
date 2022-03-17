---
title: 认识 ES6 新增数据类型 Symbol
author: Shouduo
date: 2019-9-20 19:52:11
updated: 2021-11-03 22:01:41
tags: ['前端', 'JavaScript', 'Symbol']
categories: ['Frontend']
banner_img: /img/post/js_symbol.png
index_img: /img/post/js_symbol.png
abbrlink: js_symbol
---

## 简介

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。
如果有一种机制，保证每个属性的名字都是独一无二的，就可以避免属性名的冲突。这就是 ES6 引入第七种[数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B) Symbol 的原因。
这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。

![Js 数据类型](/img/post/js_types.png)

> ES11 引入第八种数据类型 BigInt

## 使用

### 通过 Symbol() 生成

Symbol 函数前不能使用 new 命令，否则会报错，这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性。

``` javascript
let s = Symbol();
typeof s;  // "symbol"
```

### 通过 Symbol(arg) 生成

Symbol() 函数可以接收一个字符串参数作为实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

``` javascript
let s1 = Symbol('foo');
let s2 = Symbol('bar');
let s3 = Symbol('bar');

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
s3.toString() // "Symbol(bar)"

s1 === s2 // false
s2 === s3 // false
```

### 通过 Symbol.for(arg) 生成

用于将描述相同的 Symbol 变量指向同一个 Symbol 值，方便通过描述（标识）区分开不同的实例

``` javascript
let s1 = Symbol.for('foo');
let s2 = Symbol.for('bar');
let s3 = Symbol.for('bar');

s1 === s2 // false
s2 === s3 // true

Symbol.keyFor(s1); // "foo"
Symbol.keyFor(s2); // "bar"
Symbol.keyFor(s3); // "bar"
```

### Symbol.prototype.description

Symbol.prototype.description 是一个只读属性，它会返回 Symbol 对象的可选描述的字符串。description 能返回所有 Symbol 类型数据的描述，而 Symbol.keyFor() 只能返回 Symbol.for() 在全局注册过的描述。

``` javascript
let s1 = Symbol();  //Symbol() 定义的数据
s1.description  //undefined
Symbol.keyFor(s1);  //undefined

let s2 = Symbol("foo");  //Symbol(arg) 定义的数据
s2.description  //"foo"
Symbol.keyFor(s2);  //undefined

let s3 = Symbol.for("foo"); //Symbol.for(arg) 定义的数据
s3.description  //"foo"
Symbol.keyFor(s3);  //"foo"

Symbol('foo').toString();   //"Symbol(foo)"
Symbol('foo').description;  //"foo"
Symbol('').description;      //""
Symbol().description;        //undefined
```

## 特点

1. Symbol 的值是唯一的，用来解决命名冲突的问题；
2. Symbol 值不能与其他数据进行运算；
3. Symbol 定义的对象属性不能使用 for…in/of 循环遍历 ，但是可以使用 Reflect.ownKeys 来获取对象的所有键名；

``` javascript
Symbol() + 1;  //TypeError: Cannot convert a Symbol value to a number
Symbol() + 'a';  //TypeError: Cannot convert a Symbol value to a string
`hello ${Symbol('world')}`  //TypeError: Cannot convert a Symbol value to a string
```

``` javascript
let s1 = Symbol();
let obj = {
  name: "Shouduo",
  age: 24
  [s1]: "symbol"
};
console.log(obj);  //{name: "Shouduo", age: 24, Symbol(): "symbol"}

for(let key in obj) {
  console.log(key);
}  //只输出了 name，age

Object.getOwnPropertySymbols(obj);  //[Symbol()]
Reflect.ownKeys(obj);   //["name", "age", Symbol()]

Object.keys(obj);  //["name", "age"]
Object.values(obj);  //["Shouduo", 24]
Object.getOwnPropertyNames(obj);  //["name", "age"]
JSON.stringify(obj);  //{"name": "Shouduo","age": 24}
```

## 应用

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。可以称这些方法为魔术方法，因为它们会在特定的场景下自动执行。

内置 Symbol 的值 | 调用时机
---------------|-------
Symbol.hasInstance | 当其他对象使用 instanceof 运算符，判断是否为该对象的实例时，会调用这个方法。
Symbol.isConcatSpreadable | 对象的 Symbol.isConcatSpreadable 属性等于的是一个布尔值，表示该对象用于 Array.prototype.concat() 时，是否可以展开。
Symbol.species | 创建衍生对象时，会使用该属性。
Symbol.match | 当执行 str.match(myObject) 时，如果该属性存在，会调用它，返回该方法的返回值。
Symbol.replace | 当该对象被 str.replace(myObject) 方法调用时，会返回该方法的返回值。
Symbol.search | 当该对象被 str.search(myObject) 方法调用时，会返回该方法的返回值。
Symbol.split | 当该对象被 str.split(myObject) 方法调用时，会返回该方法的返回值。
Symbol.iterator | 对象进行 for…of 循环时，会调用 Symbol.iterator 方法，返回该对象的默认遍历器。
Symbol.toPrimitive | 该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
Symbol. toStringTag | 在该对象上面调用 toString 方法时，返回该方法的返回值。
Symbol. unscopables | 该对象指定了使用 with 关键字时，哪些属性会被 with环境排除。

参考文章：
[详解Symbol（自定义值，内置值）-------小小的Symbol，大大的学问 | 作者：codingWeb](https://blog.csdn.net/fesfsefgs/article/details/108354248)
