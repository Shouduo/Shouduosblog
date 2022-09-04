---
title: JavaScript 中的闭包
author: Shouduo
date: 2022-09-04 15:17:10
updated: 2022-09-04 17:41:15
tags: ['前端', '闭包']
categories: ['Front-end']
banner_img: /img/post/js_closure.png
index_img: /img/post/js_closure.png
abbrlink: js_closure
---

## 前言

Closure, 中文名：闭包。

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) 上的解释是：闭包（closure）是一个函数以及其捆绑的周边环境状态（lexical environment，词法环境）的引用的组合。换而言之，闭包让开发者可以从内部函数访问外部函数的作用域。在 JavaScript 中，闭包会随着函数的创建而被同时创建。

个人理解是：闭包表示的是一个封闭的内存空间。每个函数被创建的时候，都有一个与之关联的闭包。通过闭包的特点开发者可以在代码中跨函数作用域访问变量。（常见于在外部访问函数作用域内部的变量）

## 作用域

作用域是当前的执行上下文，值和表达式在其中“可见”或可被访问。如果一个变量或表达式不在当前的作用域中，那么它是不可用的。作用域也可以堆叠成层次结构，子作用域可以访问父作用域，反过来则不行。

JavaScript 的作用域分以下三种：

- 全局作用局：脚本模式运行所有代码的默认作用域；
- 模块作用域：模块模式中运行代码的作用域；
- 函数作用域：由函数创建的作用域；

此外，用 let 或 const 声明的变量属于额外的作用域：

- 块级作用域：用一对花括号（一个代码块）创建出来的作用域；

由于函数会创建作用域，因而在函数中定义的变量无法从该函数外部访问，也无法从其他函数内部访问。

``` javascript
function outer () {
  let outVal = 'outer';
  function inner () {
    let inVal = 'inner';
    console.log(outVal, inVal); // outer inner
  }
  inner();
  console.log(outVal, inVal); // ReferenceError: inVal is not defined
}
outer();
```

变量都存在在指定的作用域中，如果在当前作用域中找不到，则通过作用域链向上，在父作用域中继续查找，直到找到第一个同名的变量为止（或找不到，抛出 ReferenceError 错误），子作用域可以访问父作用域，反之则不行。

``` javascript
function outer () {
  let outVal = 'outer';
  function inner () {
    let inVal = 'inner';
    console.log(outVal, inVal); // outer inner
    return inVal; // <--
  }
  let inVal = inner();
  console.log(outVal, inVal); // outer inner
}
outer();
```

为了从父作用域访问子作用域的变量，可以在子作用域中将持有的变量作为函数返回值。

## 垃圾回收

“垃圾回收”是一个术语，在 计算机编程中用于描述查找和删除那些不再被其他对象引用的对象 处理过程。换句话说，垃圾回收是删除任何其他对象未使用的对象的过程。垃圾收集通常缩写为 "GC"，是JavaScript中使用的内存管理系统的基本组成部分。

``` javascript
function outer () {
  let outVal = 'outer';
  function inner () {
    let inVal = 'inner';
    console.log(outVal, inVal); // outer inner
    return inVal;
  }
  let inVal = inner();
  console.log(outVal, inVal); // outer inner
}
outer();
```

虽然 function inner() 返回了 inVal 让外部的 function outer() 可以访问，但当 inner() 执行完，其持有的 inVal 也随之被销毁了，即函数内的局部变量的生命周期仅存在于函数的声明周期内，函数被销毁，函数内的变量也自动被销毁。

``` javascript
function outer () {
  let outVal = 'outer';
  function inner () {
    let inVal = 'inner';
    console.log(outVal, inVal); // outer inner
    return function getInVal () { // <--
      return inVal;
    };
  }
  let getInValInstance = inner();
  console.log(outVal, getInValInstance()); // outer inner
}
outer();
```

当 inner() 被调用的时候，function getInval() 被创建，同时与之关联的闭包也被创建。由于 getInval() 内部引用了位于其作用域之外的 inner() 作用域中的变量 inVal，因此 inner() 作用域中的 inVal 被拷贝到了 getInval() 的闭包中。

每个函数被创建的时候，都会有一个与之关联的闭包被同时创建。在新创建的函数内部，如果引用了外部作用域中的变量，那么这些变量都会被添加到该函数的闭包中。

``` javascript
function outer () {
  let outVal = 'outer';
  function inner () {
    let inVal = 'inner';
    console.log(outVal, inVal); // outer inner
    function getInVal () { // <--
      return inVal;
    };
    inVal = 'innnnnnner';
    return getInVal;
  }
  let getInValInstance = inner();
  console.log(outVal, getInValInstance()); // outer innnnnnner
}
outer();
```

这里先将 inVal 的内存地址保存于闭包 getInVal() 中，等到 inVal 为非活动状态时，才会进行拷贝。也就是当 inner() 即将运行结束时，inVal 将变为非活动状态，那么需要将其内容拷贝到引用它的闭包 getInVal() 中。一旦内容被拷贝到闭包中，除了与之关联的 getInValInstance 函数对象之外，再也没有其他方式可以访问到其中的内容。

新创建的函数引用了外部作用域的变量，并且该变量为活动的，那么并不急于将该变量的内容拷贝到闭包中，而是将该变量所指向的内存单元的地址保存于闭包中。

``` javascript
function outer () {
  let outVal = 'outer';
  function inner () {
    let inVal = 'inner';
    console.log(outVal, inVal); // outer inner
    function getInVal () {
      return inVal;
    };
    inVal = 'innnnnnner';
    return getInVal;
  }
  let getInValInstance = inner();
  console.log(outVal, getInValInstance()); // outer innnnnnner
  getInValInstance = null; // <--
}
outer();
```

将引用 getInVal() 的变量 getInValInstance 赋值为 null，这样就没有任何变量引用 getInVal() 了，所以 getInVal() 成为了垃圾，会在未来的某个时间点（具体要看 GC 的实现以及运行情况），由垃圾回收器进行所占内存回收。

当与闭包关联的函数对象被释放时，闭包中所占用的内存才会被释放。

## 案例

### 代码1

``` javascript
function f() {
  var a = [];
  for (var i = 0; i < 2; i++) {
    var ff = function () {
      console.log(i);
    };
    a.push(ff);
  }
  return a;
}

const [f1, f2] = f();
f1(); // 2
f2(); // 2
```

### 代码2

``` javascript
function f() {
  var a = [];
  for (let i = 0; i < 2; i++) { // <-- let 或 const 声明的变量具有块作用域
    var ff = function () {
      console.log(i);
    };
    a.push(ff);
  }
  return a;
}

const [f1, f2] = f();
f1(); // 0
f2(); // 1
```

被引用的变量拷贝到闭包中的时机，发生在被引用的变量离开自己所属的作用域时，即状态为非活动时。

ES6 中引入了 let 关键字，由它声明的变量所属块级作用域。在上面的例子中，在 for 循环体的初始化部分使用了 let，这样一来 i 的作用域被设定为了该循环的块级作用域内。不过另一个细节是，循环体中的 i ，也就是 ff 中引用的 i，在每次迭代中都会进行重新绑定，换句话说循环体中的 i 的作用域是每一次的迭代。因此在循环体中，当每次迭代的 i 离开作用域时，它的状态变为非活动的，因此它的内容被拷贝到引用它的闭包中。

### 代码3

``` javascript
var a = [];
for (var i = 0; i < 2; i++) { // <--
  a.push((function (i) {
    return function () {
      console.log(i);
    }
  })(i));
};

const [f1, f2] = a;
f1(); // 0
f2(); // 1
```

也可以配合立即调用函数 [IIFE](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE) 使 代码1 有 代码2 一样的输出。

### 代码4

``` javascript
function f() {
  var a = [];
  for (var i = 0; i < 2; i++) {
    var ff = function () {
      console.log(i);
    };
    a.push(ff);
  }
  a.push(function () { // <--
    i++;
  });
  return a;
}

const [f1, f2, f3] = f();
f1(); // 2
f3();
f2(); // 3
```

这是因为闭包的另一个机制，同一个变量被引用它的多个闭包所共享。在 for 循环内部创建了两个函数，在循环外部创建了一个函数，这三个函数的都引用了 f 中的 i，因而 i 被这三个函数的闭包所共享，也就是说在 i 离开自己所属的作用域时（f 退出前），将只会发生一次拷贝，并将新创建的三个函数的闭包中的 i 的对应的指针设定为那一份拷贝的内存地址即可。对于这一个共享的拷贝地址，除了这三个闭包之外，没有其他方式可以访问到它。

## 总结

- 什么是闭包?

> 简单来说，闭包是指可以访问另一个函数作用域变量的函数，一般是定义在外层函数中的内层函数。

- 为什么需要闭包？

> 局部变量无法共享和长久的保存，而全局变量可能造成变量污染，所以我们希望有一种机制既可以长久的保存变量又不会造成全局污染。

- 特点

> 占用更多内存，不容易被释放。

- 何时使用？

> 变量既想反复使用，又想避免全局污染。

- 如何使用？

> 定义外层函数，封装被保护的局部变量。
> 定义内层函数，执行对外部函数变量的操作。
> 外层函数返回内层函数的对象，并且外层函数被调用，结果保存在一个全局的变量中。

参考文章：
[如何才能通俗易懂地解释JS中的的"闭包"？ | 作者：Raychan](https://www.cnblogs.com/wx1993/p/7717717.html)
[关于闭包其余凑标题字数 | 作者：hsiaosiyuan0](https://cnodejs.org/topic/5d39c5259969a529571d73a8)
