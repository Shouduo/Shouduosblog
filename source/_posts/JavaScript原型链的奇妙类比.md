---
title: JavaScript 原型链的奇妙类比
author: Shouduo
date: 2020-05-10 21:41:22
updated: 2020-05-10 22:12:08
tags: ['前端', 'JavaScript', '原型链']
categories: ['Frontend']
banner_img: /img/post/prototype_chain.png
index_img: /img/post/prototype_chain.png
abbrlink: js_prototype_chain
---

## 前言

JavaScript 原型链的知识比较抽象，一直以来也是前端面试中常见的提问内容。理解一个模型的最好方法就是套入已是常识的模型中去，此文用一个现实例子类比以快速理解原型链，但不作为严肃教材，比喻不是等同，总有不严谨的地方，望悉知。

## 简介

1994 年，网景公司（Netscape）发布了 Navigator 浏览器0.9版，但是前端不具备与访问者互动的能力（比如表单验证，需要后台实现，这样过于耗时耗力），工程师 Brendan Eich 负责解决这个问题。

1994 年正是面向对象编程（object-oriented programming）最兴盛的时期，Brendan Eich 开发新的网页脚本语言 JavaScript 也沿用这种思维，所有的数据类型都是对象（object），但是他不打算引入"类"（class）的概念，他想到 C++ 和 Java 使用 new 命令时，都会调用"类"的构造函数（constructor），他就做了一个简化的设计，在 JavaScript 语言中，new 命令后面跟的不是类，而是构造函数。但用构造函数生成实例对象有一个缺点，那就是无法共享属性和方法，因此需要有一种机制将所有对象联系起来。

考虑到这一点，Brendan Eich 决定为构造函数设置一个 prototype 属性。这个属性包含一个对象（以下简称"prototype 对象"），所有实例对象需要共享的属性和方法，都放在这个对象里面；那些不需要共享的属性和方法，就放在构造函数里面。实例对象一旦创建，将自动引用 prototype 对象的属性和方法。也就是说，实例对象的属性和方法，分成两种，一种是本地的，另一种是引用的。由于所有的实例对象共享同一个 prototype 对象，那么从外界看起来，prototype 对象就好像是实例对象的原型，而实例对象则好像"继承"了 prototype 对象一样。

## 类比理解

![原型链](/img/post/prototype_chain_theory.png)

1. 一切皆对象(Object)，实例对象，构造函数，原型对象都有 \_\_proto\_\_ 属性，且向上一路搜寻最终必定指向 Object.prototype；Object.prototype 是原型链的尽头，它的 \_\_proto\_\_ 为 null。
2. function Object() 由 function Function() 根据 Function.prototype 创建，同时 Function.prototype 由 function Object() 根据 Object.prototype 创建,这里出现了一个先有 function Object() 还是先有 function.prototype 的问题，实际上它们都是原型链模型的先决设定，是同时存在的，一个生产工厂，一个生产样品，新建的产线才能运作。它们的 \_\_proto\_\_ 是为了迎合全局设定才故意指向彼此，它们是依存的关系，不是先后的因果关系。

``` javascript
// foo instanceof Foo; 用于检测构造函数 Foo 的 prototype 属性是否出现在 foo 实例对象的原型链上。

// 1. 函数的显示原型（prototype）指向的对象默认是空 Object 实例对象（但 Object 不满足）
console.log(Foo.prototype instanceof Object); // true
console.log(Function.prototype instanceof Object); // true
console.log(Object.prototype instanceof Object); // false

// 2. 所有函数都是 Function() 的实例（包括 Function）
console.log(Function.__proto__ === Function.prototype); // true

// 3. Object 的原型对象是原型链的尽头
console.log(Object.prototype.__proto__); // null

// 案例 1
function Foo() {};
var f1 = new Foo();
console.log(f1 instanceof Foo); // true
console.log(f1 instanceof Object); // true

// 案例 2
console.log(Object instanceof Function); // true
console.log(Object instanceof Object); // true
console.log(Function instanceof Function); // true
console.log(Function instanceof Object); // true

// 案例 3
function Foo() {};
console.log(Object instanceof Foo); // false
```

参考文章：
[Javascript继承机制的设计思想 | 作者：阮一峰](https://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)
[深入了解原型链，Object与Function的关系 | 作者：小林搞前端](https://blog.csdn.net/qq_45643079/article/details/120043001)
