---
title: JavaScript 事件循环的奇妙类比
author: Shouduo
date: 2020-07-18 12:22:01
updated: 2020-07-18 23:34:04
tags: ['前端', 'JavaScript', '事件循环', '宏任务', '微任务', 'Event Loop', 'MacroTask', 'MicroTask', 'Task', 'Jobs']
categories: ['Front-end']
banner_img: /img/post/event_loop.png
index_img: /img/post/event_loop.png
abbrlink: js_event_loop
---

## 前言

[上篇文章](https://shouduo.netlify.app/js_prototype_chain)使用“样品-工厂-产品”类比 JavaScript 的原型链来帮助快速理解，本文将再次使用类比的方法，帮助理解 JavaScript 的另一个底层原理难点 —— 事件循环（Event Loop）。

## 简介

作为浏览器脚本语言，JavaScript 的主要用途是与用户互动以及操作 DOM，这决定了它只能是单线程，否则会带来很复杂的同步问题（比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？）。所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Workers 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。所以，这个新标准并没有改变 JavaScript 单线程的本质。

## 名词解释

### 宏任务

宏任务（Macrotask/task），每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。浏览器为了能够使得 JS 内部宏任务与 DOM 任务能够有序的执行，会在一个宏任务执行结束后，下一个宏任务执行开始前，对页面进行重新渲染。

宏任务：

- script（整体代码）
- setTimeout
- setInterval
- I/O
- UI交互事件
- postMessage
- MessageChannel
- setImmediate（Node.js 环境）

### 微任务

微任务（Microtask/job），可以理解是在当前宏任务执行结束后立即执行的任务。也就是说在当前宏任务后，渲染之前。因此微任务的响应速度相比下一个宏任务会更快，因为无需等渲染。也就是说，在某一个宏任务执行完后，就会将在它执行期间产生的所有微任务都执行完毕（在渲染前）。

微任务：

- Promise.then
- Object.observe
- MutationObserver
- process.nextTick（Node.js 环境）

## 事件循环

![Even Loop Theory](/img/post/event_loop_theory.png)

### 原理

一个事件循环（Event Loop）中，可以有一个或者多个任务队列（Task queue），一个任务队列便是一系列有序任务（Task）的集合；
每个任务都有一个任务源（Task source），源自同一个任务源的 Task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。setTimeout/Promise 等 API 便是任务源，而进入任务队列的是他们指定的具体执行任务。

### 模型

- JavaScript 分为同步任务和异步任务, 同步任务就是前一个任务执行完成后，再执行下一个任务，程序的执行顺序与任务的排列顺序是一致的、同步的；异步任务则是先注册任务，当条件满足时任务会被送入任务队列等待 JS 线程空闲时执行，执行顺序与注册先后无关，与条件满足的时机相关；
- 同步任务按作用域嵌套层级由外至里压入执行栈（Call Stack），按代码顺序从上至下执行;
- 执行栈之外，事件触发器管理着一个任务队列（Task Queue），只要属于宏任务的异步任务有了运行结果，就在任务队列之中放置一个事件;
- 同上，只要属于微任务的异步任务有了运行结果，就在微任务队列（Microtask Queue）之中放置一个事件;

### 流程

在事件循环中，每进行一次循环操作称为一个 tick，其关键步骤如下：

- 在此次 tick 中执行一个宏任务（执行栈中没有，则从任务队列队头获取，都没有则跳过）；
- 检查微任务队列（Microtask Queue）之中是否存在微任务（Microtask），如果存在则不停地执行，直至清空队列;
- 更新 render，开始检查渲染，然后 GUI 线程接管渲染;
- 渲染完毕后，JS 线程继续接管，开始下一个 tick;

## 类比理解

![Even Loop Matephor](/img/post/event_loop_matephor.png)

1. 假设某间麦当劳只有一个员工（单线程），Event Loop 就是该员工的工作流程，目标是减少客户等待焦虑；
2. 按订单流顺序执行，遇到堂食订单（同步任务）则立即在操作台备餐出餐，遇到外卖订单（异步任务），则按条件先挂起（注册到事件管理器），当条件满足时也只能先在另外的队列中（宏任务队列）等待出餐，毕竟堂食订单更要紧；
3. 操作台空闲时，则开始执行甜品站的队列（微任务队列）直至清空，因为甜品出餐快；
4. 从满足出餐条件的外卖订单队列中（宏任务队列）取出排头一单出餐，接着重复步骤 3；

从上述流程不难看出在一次时间循环中，
执行的优先级为：同步任务 > 属于微任务的异步任务 > 属于宏任务的异步任务；

## 案例

### 案例1

``` javascript
setTimeout(() => {
    console.log(1);
    Promise.resolve().then(() => { // 宏任务中新建微任务
        console.log(2);
    });
}, 0)
new Promise(resolve => { // 新建 Promise 代码为同步执行
    console.log(3);
    setTimeout(() => {
       console.log(4);
    });
    resolve();
}).then(() => {
    console.log(5);
    new Promise(resolve => {
        resolve();
    }).then(() => { // 微任务中新建微任务
        console.log(6);
    });
    setTimeout(() => { // 微任务中新建宏任务
        console.log(7);
    });
});
console.log(8);
```

运行结果：

``` shell
3
8
5
6
1
2
4
7
```

### 案例2

``` javascript
console.log(1);
setTimeout(() => {
    console.log(2);
    new Promise(resolve => {
        console.log(3);
        resolve();
    }).then(() => {
        console.log(4);
    });
});
new Promise(resolve => {
    console.log(5);
    resolve();
}).then(() => {
    console.log(6);
});
setTimeout(() => {
    console.log(7);
    new Promise(resolve => {
        console.log(8);
        resolve();
    }).then(() => {
        console.log(9);
    });
});
```

运行结果：

``` shell
1
5
6
2
3
4
7
8
9
```

### 案例3

``` javascript
// 相当于
// async function async1() {
//     console.log(1);
//     Promise.resolve(async2()).then(() => {
//         console.log(2);
//     })
// }
async function async1() {
    console.log(1);
    await async2();
    console.log(2);
}
async function async2() {
    new Promise(function(resolve) {
        console.log(3);
        resolve();
    }).then(function() {
        console.log(4);
    });
}
console.log(5);
setTimeout(function() {
    console.log(6);
}, 0)
async1();
new Promise(function(resolve) {
    console.log(7);
    resolve();
}).then(function() {
    console.log(8);
});
console.log(9);
```

运行结果：

``` shell
5
1
3
7
9
4
2
8
6
```

参考文章：
[JavaScript 运行机制详解：再谈Event Loop | 作者：阮一峰](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
[js中的宏任务与微任务 | 作者：tigerHee](https://zhuanlan.zhihu.com/p/78113300)
[Event Loop的规范和实现 | 作者：长佑](https://zhuanlan.zhihu.com/p/33087629?hmsr=toutiao.io)
[这一次，彻底弄懂 JavaScript 执行机制 | 作者：ssssyoki](https://juejin.cn/post/6844903512845860872)
[深入解析你不知道的 EventLoop 和浏览器渲染、帧动画、空闲回调（动图演示）| 作者：ssh_晨曦时梦见兮](https://segmentfault.com/a/1190000022770549)
