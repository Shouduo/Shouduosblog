---
title: ES6 ～ ES11 新特性汇总
author: Shouduo
date: 2021-12-10 15:14:53
updated: 2021-12-31 22:19:04
tags: ['前端', 'EcmaScript', 'JavaScript']
categories: ['Front-end']
banner_img: /img/post/ecma_feature.png
index_img: /img/post/ecma_feature.png
abbrlink: es6_es11_feature
---

## 什么是 ES（ECMAScript）

ECMA（European Computer Manufacturers Association）是一家国际性会员制度的信息和电信标准组织，为了让最初的 JavaScript 与最初的 JScript 能遵循同一套标准，ECMA 制定了 ECMA-262 号标准，也名为 [ECMAScript](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)。

## ES 发展简史

- 1995年，网景工程师 Brendan Eich（布兰登·艾奇）花了10天时间设计了 JavaScript 语言；
- 1996年，微软发布了 JScript（和 JS 有一些差异），同时拉开了 Navigator 和 Internet Explorer 大战的序幕（到2002年 IE 完胜，占据全世界96%的市场份额）；
- 1997年6月，ECMA 为了让各大浏览器统一编程规范，以 JavaScript 语言为基础制定了 ECMAScript 标准规范 ECMA-262，从此浏览器厂商都是按照这个规范来开发自己的浏览器产品（第一版）；
- 1999年12月，ES3 发布；
- 2007年，ES4 夭折： 改动太大；
- 2011年6月，ES5 发布。ES3 占据了10年历程，也是JS语言的基础；
- 2015年6月，ES6 发布（但是由于之后规定每年发布一个新的版本，所以后改名 ES2015：let、const、Arrow function、Class、Module、Promise、Iterator、Generator、Set、Map、async、Symbol、Proxy…）
- 2016年6月，对2015版本增强的2016版本发布；
- 此后相继有 ES2017、ES2018…

> [Javascript诞生记 | 作者：阮一峰](https://www.ruanyifeng.com/blog/2011/06/birth_of_javascript.html)

## ES 版本特性一览

版本 | 时间 | 概述
-----|-----|-----
ES1 | 1997 | 制定了语言的基本语法
ES2 | 1998 | 较小改动
ES3 | 1999 | 引入正则、异常处理、格式化输出等。IE 开始支持
ES4 | 2007 | 过于激进，未发布
ES5 | 2009 | 引入严格模式、JSON，扩展对象、数组、原型、字符串、日期方法
ES6 | 2015 | 模块化、面向对象语法、Promise、箭头函数、let、const、数组解构赋值...
ES7 | 2016 | 幂运算符、数组扩展、Async/await 关键字
ES8 | 2017 | Async/await、字符串扩展
ES9 | 2018 | 对象解构赋值、正则扩展
ES10 | 2019 | 扩展对象、数组方法
ES11 | 2020 | 链式操作、动态导入等
ES.next | 2020+ | 动态指向下一个版本

## ES6

### let 关键字

特性：

1. 不允许重复声明；
2. 块级作用域（局部变量）；
3. 不存在变量提升；
4. 不影响作用域链。

``` javascript
// 1. 不允许重复声明
let dog = "狗"; 
let dog = "猫";  // SyntaxError: Identifier 'dog' has already been declared

// 2. 块级作用域（局部变量）；
{
  let cat = "猫";
  console.log(cat); // 猫
}
console.log(cat);  // ReferenceError: cat is not defined

// 3. 不存在变量提升；
console.log(people1); // 大哥
console.log(people2); // ReferenceError: people2 is not defined
let people1 = "大哥"; // 存在变量提升
let people2 = "二哥"; // 不存在变量提升

// 4. 不影响作用域链。
{
  let p = "大哥"; 
  function fn(){
    console.log(p); // 这里是可以使用的
  }
  fn();
}
```

### const 关键字

const 关键字用来声明常量。
特性：

1. 声明必须赋初始值；
2. 标识符一般为大写（习惯）；
3. 不允许重复声明；
4. 值不允许修改；
5. 块级作用域（局部变量）。

### 变量和对象的解构赋值

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构赋值。

``` javascript
// 1. 数组的解构赋值
const F4 = ["大哥","二哥","三哥","四哥"]; 
let [a, b, c, d] = F4;
// 这就相当于我们声明4个变量a,b,c,d，其值分别对应"大哥","二哥","三哥","四哥" 
console.log(a + b + c + d); // 大哥二哥三哥四哥

// 2. 对象的解构赋值
const F3 = {
    name : "大哥",
    age : 22,
    sex : "男",
    xiaopin : function(){ // 常用
        console.log("我会演小品！");
    }
}
let {name, age, sex, xiaopin} = F3; // 注意解构对象这里用的是{} 
console.log(name + age + sex + xiaopin); // 大哥22男
xiaopin(); // 此方法可以正常调用
```

### 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识，
特性：

1. 字符串中可以出现换行符；
2. 可以使用 ${} 形式引用变量来实现变量拼接。

``` javascript
let s = "大哥";
let out = `${s}是我最大的榜样！`;
console.log(out);  // 大哥是我最大的榜样！
```

### 简化对象和函数写法

如果属性名和变量名相同，ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。

``` javascript
let name = "hhhh";
let change = function(){
  console.log("活着就是为了改变世界！");
}
const school = {
    // 完整写法
    // name:name,
    // change:change
    // 简化写法
    name, 
    change,
    // 声明方法的简化
    say(){
      console.log("言行一致！");
    }
}
school.change(); 
school.say();
```

### 箭头函数

ES6允许使用箭头（=>）定义函数，箭头函数提供了一种更加简洁的函数书写方式，箭头函数多用于匿名函数的定义。

特性：

1. 箭头函数的 this 是静态的，始终指向函数声明时所在作用域下的 this 的值（外层作用域）；
2. 不能作为构造函数实例化对象；
3. 不能使用 arguments 变量；
4. 如果形参只有一个，则小括号可以省略；
5. 函数体如果只有一条语句，则花括号可以省略，且 return 也必须省略，该条语句的执行结果就是函数的返回值；
6. 没有原型对象，没有 prototype 属性。

``` javascript
// 1. 箭头函数的 this 是静态的，始终指向函数声明时所在作用域下的 this 的值
const school = {
  name : "dada",
}
window.name = "小小";
// 传统函数
function getName(){ 
  console.log(this.name);
}
// 箭头函数
getName1 = () => {
  console.log(this.name); 
}
// 直接调用
getName();  // 小小，直接调用传统函数，其 this 是指向 window 的
getName1();  // 小小，此时箭头函数声明所在的作用域是全局的 window
// 使用 call 调用，call 可以改变函数内部 this 的值
getName.call(school);  // dada
getName1.call(school);  // 小小，结果没有改变，因为此时箭头函数声明所在的作用域还是全局的 window

// 2. 不能作为构造实例化对象
let Persion = (name,age) => {
  this.name = name;
  this.age = age;
}
let me = new Persion("Shouduo",24);
console.log(me);  // TypeError: Persion is not a constructor

// 3. 不能使用 arguments 变量
let fn = () => console.log(arguments);
fn(1,2,3);  // ReferenceError: arguments is not defined

// 4. 如果形参只有一个，则小括号可以省略
let add = n => {
    return n + n;
}

// 5. 函数体如果只有一条语句，则花括号可以省略，且 return 也必须省略，该条语句的执行结果就是函数的返回值。
let pow = (n) => n*n;
```

<details>
<summary>使用场景</summary>

- 回调函数 this 指向问题

``` html
<body>
  <div id="ad"></div>
  <script>
    let ad = document.getElementById('ad');
    ad.addEventListener("click", function(){
        // 传统写法
        let _this = this;
        setTimeout(function(){ 
            console.log(this); // window, 因为 this 引用的是把函数当成方法调用的上下文对象
                               // setTimeout是JS自身的方法，所以其上下文对象是 window
            console.log(_this); // ad
            _this.style.background = 'pink';
        }, 2000);
    });   
  </script>
</body>
```

``` html
<script>
  let ad = document.getElementById('ad');
  ad.addEventListener("click", function(){
    // 箭头函数写法
    setTimeout(() => {
      this.style.background = 'pink';  // this 是在外层的作用域里声明的，所以 this 指向事件源 ad
    }, 2000);
  })
  // 下面也是错误写法，这里的this还是window
  // ad.addEventListener("click", () => {
  //   setTimeout(() => this.style.background = 'pink',2000);
  // })
</script>
```

</details>

### 函数参数的默认值

ES6 允许给函数的参数赋初始值。

``` javascript
// 1. 形参初始值，具有默认值的参数, 一般位置要靠后
function add(a,b,c=10) {
  return a + b + c;
}
let result = add(1,2); 
console.log(result); // 13

// 2. 与解构赋值结合
function connect({host="127.0.0.1", username,password, port}){  // 解构
  console.log(host);
  console.log(username);
  console.log(password);
  console.log(port);
}
connect({
  host: 'atguigu.com', 
  username: 'root', 
  password: 'root', 
  port: 3306
})
```

### rest 参数

ES6 引入 rest 参数，用于获取函数的实参，用来代替 arguments。

``` javascript
// ES5 获取实参的方式
function data(){
	console.log(arguments);  // 返回的是一个 Arguments 对象
  // Arguments(4) ['大哥', '二哥', '三哥', '四哥', callee: ƒ, Symbol(Symbol.iterator): ƒ]
}
data("大哥","二哥","三哥","四哥");

// ES6 的 rest 参数 ...args，一个参数对象可对应多个实参，rest 参数必须放在最后面
function data(...args){
  console.log(args);  // 返回的是一个数组，就可以使用 fliter some every map 方法
  // ['大哥', '二哥', '三哥', '四哥']
}
data("大哥","二哥","三哥","四哥");
```

### 扩展运算符

扩展运算符能将数组转换为逗号分隔的参数序列，扩展运算符也是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列，对数组进行解包。

``` javascript
// ... 扩展运算符能将数组转换为逗号分隔的参数序列
const bat = ['bytedance', 'alibaba', 'tencent'];
// => 'bytedance','alibaba','tencent'

function dagong() {
    console.log(arguments);
}
dagong(...bat); // 相当于 dagong('bytedance','alibaba','tencent')
```

<details>
<summary>使用场景</summary>

``` javascript
// 1. 数组的合并 
const kuaizi = ['王太利','肖央']; 
const fenghuang = ['曾毅','玲花'];
// 传统的合并方式
// const zuixuanxiaopingguo = kuaizi.concat(fenghuang); 
// 利用扩展运算符
const zuixuanxiaopingguo = [...kuaizi, ...fenghuang]; 

// 2. 数组的克隆
const sanzhihua = ['E','G','M'];
const sanyecao = [...sanzhihua];  // ['E','G','M'] 

// 3. 将伪数组转为真正的数组
const divs = document.querySelectorAll('div');  // 假设html里面有3个div
const diletr = [...divs]; 
console.log(diletr);  // [div,div,div]
```

</details>

### <a href="/js_symbol" target="_blank">Symbol</a>

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，是一种类似于字符串的数据类型。

特性：

1. Symbol 的值是唯一的，用来解决命名冲突的问题；
2. Symbol 值不能与其他数据进行运算；
3. Symbol 定义的对象属性不能使用 for...of 循环遍历 ，但是可以使用 Reflect.ownKeys 来获取对象的所有键名；
4. ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。可以称这些方法为魔术方法，因为它们会在特定的场景下自动执行。

``` javascript
// 创建 Symbol
let s = Symbol();
// 传入参数
let s2 = Symbol('Shouduo');
let s3 = Symbol('Shouduo'); 
console.log(s2 === s3); // false

// Symbol.for 创建
let s4 = Symbol.for('Shouduo'); 
let s5 = Symbol.for('Shouduo'); 
console.log(s4 === s5); // true
```

### 迭代器 Iterator

迭代器是一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口（JS 里面就是指对象里面的一个属性），就可以完成遍历操作。

特性：
ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费。
原生具备 iterator 接口的数据(可用 for...of 遍历)：

- Array
- Arguments
- Set
- Map
- String
- TypedArray
- NodeList

### <a href="/js_generator" target="_blank">生成器 Generator</a>

生成器函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同，以前用的是回调函数。

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

### Promise

Promise 是 ES6 引入的异步编程（文件操作、网络操作（ajax、request）、数据库操作）的新解决方案。语法上 Promise 是一个构造函数，用来封装异步操作并可以获取其成功或失败的结果。

每个 promise 对象都有两个属性：

- PromiseState：保存 promise 当前的状态（Pending, Resolved(Fulfilled), Rejected）
- PromiseValue：保存 promise 返回的值

``` javascript
// 实例化 Promise 对象
const p = new Promise(function(resolve,reject){ 
  // 封装一个异步操作
  setTimeout(function() {
    let data = Math.Random()
    let isSuccess = data < 0.5;
    if(isSuccess) {
      resolve(data); // 调用 resolve，这个 Promise 对象 p 的状态就会变成成功
    } else {
      reject(data);
    }
	}, 1000);
});

// 就可以调用 Promise 对象的then方法
p.then(function(value){ // 成功
	console.log(value);
}, function(reason){ // 失败
	console.log(reason);
});
```

<details>
<summary>使用场景</summary>

- 避免回调地狱

``` javascript
// 回调函数写法
const fs = require("fs");
fs.readFile("./text1.txt",(err1,data1)=>{
    if(err1) throw err1;
    fs.readFile("./text2.txt",(err2,data2)=>{
      if(err2) throw err2;
      fs.readFile("./text3.txt",(err3,data3)=>{
        if(err3) throw err3;
         console.log((data1+data2+data3));
      })
    })
});

//
// 使用 Promise 封装
const p = new Promise((resolve,reject)=>{ 
  fs.readFile("./text1.txt",(err,data)=>{
    if(err) reject(err);
    resolve(data);
  });
});
p.then((value)=>{
  return new Promise((resolve,reject)=>{
    fs.readFile("./text2.txt",(err,data)=>{
      if(err) reject(err);
      resolve(value + data);
    });
  })
}).then((value)=>{
  return new Promise((resolve,reject)=>{
    fs.readFile("./text2.txt",(err,data)=>{
      if(err) reject(err);
      console.log(value + data);
      resolve(value + data);
    });
  })
}).catch((err)=>{
  console.log(err);
})

// 更好的写法
function myReadFile(path, append=''){
  return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) =>{
          if(err) reject(err);
          resolve(append + data);
      });
  });
}
myReadFile("./text1.txt").then((value1)=>{
  return myReadFile("./text2.txt", value1);
}).then((value2)=>{
  return myReadFile("./text3.txt", value2);
}).then(value3=>{
  console.log(value3);
}).catch((err)=>{
  console.log(err);
});

// 最好的写法
function myReadFile(path){
  return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) =>{
          if(err) reject(err);
          resolve(data);
      });
  });
}
async function main(){
  try{
      let data1 = await myReadFile('./text1.txt');
      let data2 = await myReadFile('./text2.txt');
      let data3 = await myReadFile('./text3.txt');
      console.log(data1 + data2 + data3);
  }catch(err){
      console.log(err);
  }
}
main();
```

</details>

### Set

ES6 提供了新的数据结构 Set（集合）。它类似于数组，但成员的值都是唯一的，集合实现了 iterator（迭代器）接口，所以可以使用扩展运算符（...）和 for...of 进行遍历。

属性和方法：

- new Set(接收一个可迭代数组)，自动去重；
- size：返回集合的元素个数；注意不是 length；
- add：增加一个新元素，返回当前集合；
- delete：删除元素，返回 boolean 值；
- has：检测集合中是否包含某个元素，返回 boolean 值；
- clear：清空集合，返回 undefined。

``` javascript
// 创建Set集合
let s = new Set(); 
console.log(s, typeof s); // Set(0) {} "object"
let s1 = new Set(["大哥","二哥","三哥","四哥","三哥"]);
console.log(s1); // {"大哥","二哥","三哥","四哥"}自动去重

// 1. size 返回集合的元素个数；
console.log(s1.size); // 4

// 2. add 增加一个新元素，返回当前集合；
s1.add("大姐"); 
console.log(s1); // {"大哥","二哥","三哥","四哥", "大姐"}

// 3. delete 删除元素，返回 boolean 值；
let result = s1.delete("三哥");
console.log(result); // true
console.log(s1); // {"大哥","二哥","四哥", "大姐"}

// 4. has 检测集合中是否包含某个元素，返回 boolean 值；
let r1 = s1.has("二姐"); 
console.log(r1); // false

// 5. clear 清空集合，返回 undefined。
s1.clear();
console.log(s1); // Set(0) {}
```

<details>
<summary>使用场景</summary>

``` javascript
let arr = [1,2,3,4,5,4,3,2,1];
// 1.数组去重
let res1 = [...new Set(arr)]; 
console.log(res1); // [1,2,3,4,5]

// 2.交集
let arr2 = [3,4,5,6,5,4,3];
let res2 = [...new Set(arr)].filter(item => new Set(arr2).has(item));
console.log(res2); // [3,4,5]

// 3.并集
let union = [...new Set([...arr,...arr2])]; 
console.log(union); // [1,2,3,4,5,6]

// 4.差集
let result1 = [...new Set(arr)].filter(item =>!(new Set(arr2).has(item)));
console.log(result1); // [1,2]
```

</details>

### Map

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合。但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。Map 也实现了 iterator 接口，所以可以使用扩展运算符（...）和 for...of 进行遍历。

属性和方法：

- size：返回 Map 的元素个数；
- set：增加一个新元素，返回当前 Map；
- get：返回键名对象的键值；
- has：检测 Map 中是否包含某个元素，返回 boolean 值；
- clear：清空集合，返回 undefined。

### Class 类

ES6 提供了更接近传统语言（Java，C++）的写法，引入了 Class（类）这个概念，作为对象的模板。通过 class 关键字，可以定义类。基本上，ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

特性：

- class 声明类；
- constructor 定义构造函数初始化；
- extends 继承父类；
- super 调用父级构造方法；
- static 定义静态方法和属性；
- 父类方法可以重写。

``` javascript
// ES5 写法
function Phone(brand, price){
  this.brand = brand;
  this.price = price;
}
Phone.prototype.call = function(){ // 添加方法
  console.log("我可以打电话！");
}
let nokia = new Phone("诺记", 999); // 实例化对象
nokia.call();

// ES6 写法
class Shouji{
  constructor(brand, price) { // 构造方法
    this.brand = brand; 
    this.price = price;
  }
  call(){ // 方法必须使用该方式写，不能用写其他函数的方法写
    console.log("我可以打电话！");
  }
}
let huaWei = new Shouji("华为", 5999); 
huaWei.call();
```

Class 中的静态成员

- ES5 中实例对象和函数对象的属性是不相通的，实例对象跟构造函数的原型对象是相通的。函数对象的属性属于函数对象，不属于实例对象。
- ES6 中类中加了 static 的属性是静态属性，静态属性属于类而不属于实例对象。

``` javascript
// class静态成员
// ES5写法
function Phone(){}
Phone.prototype.color = "黑色";
Phone.name = "手机"; //name是静态成员
Phone.change = function(){
    console.log("我可以打电话！");
}
let nokia = new Phone();
console.log(nokia.name); // undefined
nokia.change(); // TypeError: nokia.change is not a function
console.log(nokia.color); // 黑色
// 原因：实例对象(nokia)和函数对象(phone)的属性是不相通的，实例对象跟构造函数(phone)原型对象是相通的。函数对象的属性属于函数对象，不属于实例对象。

// ES6写法
class Shouji{
  constructor() { // 构造方法
    this.color = "黑色"; 
  }
  // 静态属性，属于类而不属于实例对象
  static name = "手机";  
	static change(){
    console.log("我可以打电话！");
  }
}
let huaWei = new Shouji(); 
console.log(huaWei.name); // undefined
huaWei.change(); // TypeError: nokia.change is not a function
console.log(huaWei.color); // 黑色
```

构造函数实现继承

``` javascript
// ES5 构造函数继承
function Phone(brand, price){ 
  this.brand = brand; 
  this.price = price;
}
Phone.prototype.dial = function(){ 
  console.log("我可以打电话！");
}
function SmartPhone(brand, price, color, size){ 
  Phone.call(this, brand, price); //改变了this的指向
  this.color = color; 
  this.size = size;
}
SmartPhone.prototype = new Phone; // 设置子级构造函数的原型
SmartPhone.prototype.constructor = SmartPhone;
SmartPhone.prototype.photo = function(){ // 声明子类的方法
  console.log("我可以拍照！");
}
SmartPhone.prototype.game = function(){ 
  console.log("我可以玩游戏！");
}
const chuizi = new SmartPhone("锤子",2499,"黑色","5.5inch"); 
chuizi.dial(); 
chuizi.photo(); 
chuizi.game();

// ES6 class类继承
class Phone{
  constructor(brand, price) { 
    this.brand = brand; 
    this.price = price;
  }
  dial(){
    console.log("我可以打电话！");
  }
}
class SmartPhone extends Phone{
  constructor(brand, price, color, size) { // 构造函数，没有也是合法的
    super(brand, price); // 调用父类构造函数this.color = color;
    this.size = size;
  }
  photo(){
    console.log("我可以拍照！");
  }
  game(){
    console.log("我可以玩游戏！");
  }
}
const xiaomi = new SmartPhone("小米", 1999, "黑色", "5.15inch"); 
xiaomi.dial(); 
xiaomi.photo(); 
xiaomi.game();
```

子类对父类方法的重写

``` javascript
class Phone{
  constructor(brand, price) { 
    this.brand = brand; 
    this.price = price;
  }
  call(){
    console.log("我可以打电话！");
  }
}

class SmartPhone extends Phone{
  constructor(brand, price, color, size) { 
    super(brand, price); 
    this.size = size;
  }
  photo(){
    console.log("我可以拍照！");
  }
  game(){
    console.log("我可以玩游戏！");
  }
  // 子类对父类方法重写：直接写，直接覆盖
  // 注意：子类无法调用父类同名方法，super也不行
  call(){
    console.log("我可以进行视频通话！");
  }
}

const chuizi = new SmartPhone("小米", 1999, "黑色", "5.15inch");
chuizi.call(); // "我可以进行视频通话！", 调用的是子类的方法
chuizi.photo(); 
chuizi.game();
```

class 中 getter 和 setter

``` javascript
// class 中的 getter 和 setter 设置 
class Phone{
  get price(){
    console.log("价格属性被读取了！");
    return 123; // 返回值
  }
  set price(newVal){ 
    console.log("价格属性被修改了！");
  }
}

let s = new Phone(); 
console.log(s.price); // "价格属性被读取了！"  123;
s.price = 'free'  // "价格属性被修改了！"
```

### 数值扩展

1. Number.EPSILON：
Number.EPSILON 是 JavaScript 表示的最小精度，
EPSILON 属性的值接近于 2.2204460492503130808472633361816E-16，
主要用在浮点数的运算上；

2. 二进制和八进制：
ES6 提供了二进制和八进制数值的新的写法，分别用前缀 0b 和 0o 表示；

3. Number.isFinite() 与 Number.isNaN() ：
Number.isFinite() 用来检查一个数值是否为有限的；
Number.isNaN() 用来检查一个值是否全等于 NaN；

4. Number.parseInt() 与 Number.parseFloat()：
ES6 将全局方法 parseInt 和 parseFloat，移植到 Number 对象上面，使用不变；

5. Number.isInteger()：
判断一个数值是否为整数；

6. Math.trunc() ：
去除一个数的小数部分，返回整数部分；

7. Number.sign()：
返回一个数字的符号, 指示数字是正数，负数还是零。

``` javascript
// 1. Number.EPSILON 
function equal(a, b){
  return Math.abs(a-b) < Number.EPSILON;
} 
console.log(0.1 + 0.2 === 0.3); // false
console.log(equal(0.1 + 0.2, 0.3)); // true

// 2. 二进制和八进制
let b = 0b1010;
let o = 0o777; 
let d = 100; 
let x = 0xff; 
console.log(b, o, d, x); // 10 511 100 255

// 3. Number.isFinite()	和 Number.isNaN()
console.log(Number.isFinite(100)); // true
console.log(Number.isFinite(100/0)); // false
console.log(Number.isFinite(Infinity)); // false
// 注意区分 isNaN() 和 Number.isNaN()
// isNaN() converts the value to a number before testing it.
console.log(Number.isNaN(NaN)); // true, NaN is NaN
console.log(Number.isNaN(123)); // false
console.log(Number.isNaN({})); // false
console.log(Number.isNaN('ponyfoo')); // false
console.log(Number.isNaN('pony'/'foo')); // true, 'pony'/'foo' is NaN, NaN is NaN
console.log(isNaN(NaN)); // true, NaN is not a number
console.log(isNaN(123)); // false
console.log(isNaN({})); // true, {} is not a number
console.log(isNaN('ponyfoo')); // true, 'ponyfoo' is not a number
console.log(isNaN('pony'/'foo')); // true, 'pony'/'foo' is NaN, NaN is not a number

// 4. Number.parseInt() 和 Number.parseFloat()
console.log(Number.parseInt('5211314love'));  //5211314
console.log(Number.parseFloat('3.1415926神奇'));  //3.1415926

// 5. Number.isInteger()
console.log(Number.isInteger(5));  // true
console.log(Number.isInteger(2.5)); // false

// 6. Math.trunc()
console.log(Math.trunc(3.5)); // 3

// 7. Math.sign()
console.log(Math.sign(100)); // 1
console.log(Math.sign(0));  // 0
console.log(Math.sign(-20000)); // -1
```

### 对象方法的扩展

ES6 新增了一些 Object 对象的方法：

Object.is() 用来比较两个值是否严格相等，与（===）行为基本一致，除了（+0 与 NaN）；
Object.assign() 用于对象的合并，将源对象的所有可枚举属性，复制到目标对象；
proto、Object.setPrototypeOf()、 Object.getPrototypeOf() 可以直接设置原型对象。

``` javascript
// 1. Object.is()
console.log(Object.is(120, 120)); // true
console.log(Object.is(NaN, NaN)); // true
console.log(NaN === NaN); //false
console.log(Object.is(+0, -0)); // false
console.log(Object.is(+0, 0)); // true
console.log(Object.is(-0, 0)); // false
console.log(+0 === -0); // true
console.log(+0 === 0); // true
console.log(-0 === 0); // true

// 2. Object.assign()
const config1 = {
  host : "localhost", 
  port : 3306,
  name : "root",
  pass : "root",
  test : "test" //唯一存在的
}

const config2 = {
  host : "127.0.0.1", 
  port : 8086,
  name : "admin", 
  pass : "admin", 
  test2 : "test2"
}
console.log(Object.assign(config1,config2)); // {host: '127.0.0.1', port: 8086, name: 'admin', pass: 'admin', test: 'test', test2: 'test2'}, 后面的会覆盖前面的

// 3. proto 、setPrototypeOf()、 getPrototypeOf()
const school = { 
  name : "尚硅谷"
}
const cities = {
  xiaoqu : ['北京','上海','深圳']
}
Object.setPrototypeOf(school, cities); // 并不建议这么做
console.log(Object.getPrototypeOf(school)); // {xiaoqu: Array(3)}
console.log(school); // {name: '尚硅谷'}

```

### 模块化

模块化是指将一个大的程序文件，拆分成许多小的文件，然后将小文件组合起来。

``` javascript
// m.js 分别暴露
export let school = "尚硅谷";
export function teach(){ 
  console.log("我们可以教你开发技术！");
}

// n.js 统一暴露
let school = "尚硅谷";
function findJob(){      
  console.log("我们可以帮你找到好工作！");
}
export {school,findJob}

// o.js 默认暴露
export default { 
  school: "尚硅谷",
  change: function(){ 
    console.log("我们可以帮你改变人生！");
  }
}
```

``` html
<script type="module"> // type="module"
  // 通用方式
  import * as m from "./js/m.js"; // 引入m.js模块内容
  console.log(m.school); 
  m.teach();
  
  import * as n from "./js/n.js"; // 引入n.js模块内容
  console.log(n.school); 
  n.findJob();
  
  import * as o from "./js/o.js"; // 引入o.js模块内容
  console.log(o.default.school); // 注意这里调用方法的时候需要加上default
  o.default.change();
  
  // 解构赋值形式
  import {school,teach} from "./js/m.js";
  import {school as xuexiao,findJob} from "./js/n.js"; // 重名的可以使用别名
  import {default as one} from "./js/o.js"; // 导入默认导出的模块，必须使用别名

  // 简便形式
  import oh from "./js/o.js"; // 只支持默认导出, oh === one
</script>

```

### Babel 对 ES6 模块化代码转换

Babel 是一个 JavaScript 编译器，能够将新的ES规范语法转换成ES5的语法；因为不是所有的浏览器都支持最新的 ES 规范，所以一般项目中都需要使用Babel进行转换。

### ES6 模块化引入 npm 包

## ES7

### Array.prototype.includes()

判断数组中是否包含某元素，语法：arr.includes(item)；

### 指数操作符

在 ES7 中引入指数运算符（\*\*），用来实现幂运算，功能与 Math.pow 结果相同；
例如：2的10次方：2\*\*10

``` javascript
console.log(Math.pow(2, 10) === 2**10); // true
```

## ES8

### async 和 await

async 和 await 两种语法结合可以让异步代码看起来像同步代码一样，简化异步函数的写法；

- async 要点

async 函数的返回值为 promise 对象；promise 对象的结果由 async 函数执行的返回值决定；
只要返回的值不是 promise 类型的对象，且状态为失败，其余情况，即使是没有返回的值，都是一个成功的 Promise 对象，成功的值就是 promise 对象返回的结果。

- await 要点

await 必须写在 async 函数中；await 右侧的表达式一般为 promise 对象；await 返回的是 promise 成功的值；await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理。

``` javascript
// async 和 await 结合发送ajax请求
function sendAjax(url){
  return new Promise((resolve,reject)=>{
    const x = new XMLHttpRequest();
    x.open("GET",url);
    x.send();
    x.onreadystatechange = function(){ 
      if(x.readyState == 4){
        if(x.status>=200 && x.status<300){
          resolve(x.response);
        }else{
          reject(x.status);
        }
      }
    }
  });
}
//使用 async 和 await 
async function main(){
  let result = await sendAjax("https://api.apiopen.top/getJoke");
  console.log(result);
}
main();
```

### 对象方法扩展

- Object.keys()：获取对象所有的键；
- Object.values()：获取对象所有的值，返回一个给定对象的所有可枚举属性值的数组；
- Object.entries()：返回给定对象自身可遍历属性 \[key, value\] 的数组；
- Object.getOwnPropertyDescriptors()：返回指定对象所有自身属性的描述对象。

``` javascript
// 对象方法扩展
let people = { 
  name: "Shouduo", 
  age: 24,
  sex: "男"
}
console.log(Object.keys(people)); // ['name', 'age', 'sex']
console.log(Object.values(people)); // ['Shouduo', 24, '男']
console.log(Object.entries(people)); // [['name', 'Shouduo'], ['age', 24], ['sex', '男']]

const map = new Map(Object.entries(people)); // 创建map
console.log(map); // Map(3) {'name'=>'Shouduo', 'age'=>24, 'sex'=>'男'}
console.log(map.get("name")); // Shouduo

// 返回指定对象所有自身属性的描述对象
console.log(Object.getOwnPropertyDescriptors(people));

const obj = Object.create(null, { 
  name : {
    value : "Shouduo",
    writable : true, 
    configuration : true, 
    enumerable : true
  }
});
```

<center>
  <img src="/img/post/object_getOwnPropertyDescriptors.png" width = "300" alt="Object.getOwnPropertyDescriptors(people)"/>
</center>

## ES9

### 扩展运算符和 rest 参数

Rest 参数和扩展运算符在 ES6 中已经引入，不过 ES6 中是只针对数组，在 ES9 中为对象提供了像数组一样的扩展运算符和 rest参数。

``` javascript
// 扩展运算符对对象的支持
function connect({ host, port, ...user }) {
    console.log(host); // 127.0.0.1
    console.log(port); // 3306
    console.log(user); // {username: 'root', password: 'root', type: 'master'}
}
connect({
    host: '127.0.0.1',
    port: 3306, 
    username: 'root', 
    password: 'root', 
    type: 'master'
});

//对象合并
const skillOne = { q: '天音波'};
const skillTwo = { w: '金钟罩'};
const skillThree = { e: '天雷破'};
const skillFour = { r: '猛龙摆尾'};
const mangseng = {...skillOne,...skillTwo,...skillThree,...skillFour};
console.log(mangseng); // {q: '天音波', w: '金钟罩', e: '天雷破', r: '猛龙摆尾'}
```

### 正则扩展

- 命名捕获分组
ES9 允许命名捕获组使用符号（?），这样获取捕获结果可读性更强。

``` javascript
// 需求：提取 url 和标签内文本
let str = '<a href="http://www.baidu.com">Shouduo</a>';
const reg = /<a href="(.*)">(.*)<\/a>/; // 之前的写法
const result = reg.exec(str); 
console.log(result); // ['<a href="http://www.baidu.com">Shouduo</a>', 'http://www.baidu.com', 'Shouduo', index: 0, input: '<a href="http://www.baidu.com">Shouduo</a>', groups: undefined]
console.log(result[1]); // http://www.baidu.com
console.log(result[2]); // Shouduo

const reg1 = /<a href="(?<url>.*)">(?<text>.*)<\/a>/; // 命名捕获分组
const result1 = reg1.exec(str);
console.log(result1); // ['<a href="http://www.baidu.com">訾博</a>', 'http://www.baidu.com', '訾博', index: 0, input: '<a href="http://www.baidu.com">訾博</a>', groups: {…}]
console.log(result1.groups.url); // http://www.baidu.com
console.log(result1.groups.text); // Shouduo
```

- 反向断言
ES9 支持反向断言，通过对匹配结果前面的内容进行判断，对匹配进行筛选。

``` javascript
// 需求：只匹配到555
let str = "JS5201314你知道么555啦啦啦";
// 正向断言
const reg = /\d+(?=啦)/; // 前面是数字后面是啦
const result = reg.exec(str); 
console.log(result); // ['555', index: 13, input: 'JS5201314你知道么555啦啦啦', groups: undefined]
// 反向断言
const reg1 = /(?<=么)\d+/; //后面是数字前面是么
const result1 = reg.exec(str); 
console.log(result1); // ['555', index: 13, input: 'JS5201314你知道么555啦啦啦', groups: undefined]
```

- dotAll 模式
正则表达式中的点（.）匹配除回车外的任何单字符，标记（s）改变这种行为，允许行终止符出现。

``` javascript
// 需求：将 url 其中的电影名称和对应上映时间提取出来，存到对象中
let str = `
  <ul>
    <li>
      <a>肖生克的救赎</a>
      <p>上映日期: 1994-09-10</p>
    </li>
    <li>
      <a>阿甘正传</a>
      <p>上映日期: 1994-07-06</p>
    </li>
  </ul>
`;
// 之前的写法
const reg = /<li>\s+<a>(.*?)<\/a>\s+<p>(.*?)<\/p>/g;
// dotAll 模式
const reg1 = /<li>.*?<a>(.*?)<\/a>.*?<p>(.*?)<\/p>/gs;

let result;
let data = [];
while(result = reg1.exec(str)){ 
    console.log(result); 
    data.push({title:result[1],time:result[2]});
}
console.log(data); // '[{"title":"肖生克的救赎","time":"上映日期: 1994-09-10"},{"title":"阿甘正传","time":"上映日期: 1994-07-06"}]'
```

## ES10

### Object.fromEntries

将二维数组或者 map 转换成对象；之前学的 Object.entries 是将对象转换成二维数组。

``` javascript
const result = Object.fromEntries([["name","Shouduo"], ["age",24]]);
console.log(result); // {name: 'Shouduo', age: 24}

const m = new Map(); 
m.set("name","Shouduo");
m.set("age",24);
const result1 = Object.fromEntries(m); 
console.log(result1); // {name: 'Shouduo', age: 24}
```

### trimStart 和 trimEnd

去除字符串前后的空白字符。

``` javascript
const str = '     Hello World !      ';
console.log(str.trimStart()); // "Hello World !      "
console.log(str.trimEnd()); // "     Hello World !"
console.log(str.trimLeft()); // "Hello World !      "
console.log(str.trimRight()); // "     Hello World !"
console.log(str.trim()); // "Hello World !"
```

### flat 与 flatMap

将多维数组降维。

``` javascript
// flat
const arr = [1,2,3,[4,5,[6,7]],8,9];
console.log(arr.flat()); // [1, 2, 3, 4, 5, [6, 7], 8, 9]
console.log(arr.flat(2)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(arr.flat(10086)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// flatMap，若Map返回的是多维数组，则可降维
let arr = [1, 2, 3, 4];
console.log(arr.flatMap(x => [x, x * 2])); // [1, 2, 2, 4, 3, 6, 4, 8]
// is equivalent to
let n = arr.length;
let acc = new Array(n * 2);
for (let i = 0; i < n; i++){
  let x = arr[i];
  acc[i * 2] = x;
  acc[i * 2 + 1] = x * 2;
}
// [1, 2, 2, 4, 3, 6, 4, 8]

```

### Symbol.prototype.description

获取 Symbol 的字符串描述。

``` javascript
let s = Symbol("Shouduo"); 
console.log(s.description) // Shouduo
```

## ES11

### 类的私有属性

私有属性外部不可直接访问；

``` javascript
class Person{
  name; // 公有属性
  #age; // 私有属性
  #weight; // 私有属性
  constructor(name, age, weight){ 
    this.name = name;
    this.#age = age; 
    this.#weight = weight;
  }
intro(){
    console.log(this.name, this.#age, this.#weight); 
  }
}

const girl = new Person("小兰", 18, "90kg"); 
console.log(girl); // Person {name: '小兰', #age: 18, #weight: '90kg'}
console.log(girl.name); // 小兰
console.log(girl.#age); // SyntaxError: Private field '#age' must be declared in an enclosing class
console.log(girl.age); // undefined
girl.intro(); // 小兰 18 90kg
```

### Promise.allSettled

获取多个 promise 执行的结果集；返回的结果 PromiseStatus 永远是成功的状态。PromiseValue 是每个对象值合起来的数组。

``` javascript
const p1 = new Promise((resolve,reject)=>{ 
    setTimeout(()=>{
        resolve("商品数据-1");
    },1000);
});
const p2 = new Promise((resolve,reject)=>{ 
    setTimeout(()=>{
        reject("失败啦");
    },1000);
});
const result = Promise.allSettled([p1,p2]); 
console.log(result);
const result1 = Promise.all([p1,p2]);
console.log(result1);
```

<center>
  <img src="/img/post/promise_allSettled.png" width = "500" alt="Promise.allSettled"/>
</center>

### String.prototype.matchAll

用来得到正则批量匹配的结果

``` javascript
let str = `
  <ul>
    <li>
      <a>肖生克的救赎</a>
      <p>上映日期: 1994-09-10</p>
    </li>
    <li>
      <a>阿甘正传</a>
      <p>上映日期: 1994-07-06</p>
    </li>
  </ul>`;
// 正则
const reg = /<li>.*?<a>(.*?)<\/a>.*?<p>(.*?)<\/p>/sg; 
const result = str.matchAll(reg); // 返回的是可迭代对象，可用扩展运算符展开
console.log(...result);

// 也可使用for...of...遍历
for(let v of result){ 
    console.log(v);
}
```

<center>
  <img src="/img/post/regexp_matchAll.png" width = "600" alt="console.log(...result)"/>
</center>

### 可选链操作符

简化对象存在的判断逻辑，如果存在则往下走，省略对对象是否传入的层层判断。

``` javascript
// 可选链操作符 ?.
function main(config){
  // 传统写法
  const dbHost = config && config.db && config.db.host;
  // 可选链操作符写法
  const dbHost = config?.db?.host; //前面一项有就往下走，没有则返回 undefined 不会报错
  console.log(dbHost);
}
main({
  db:{
    host:"192.168.1.100",
    username:"root"
  },
  cache:{
    host:"192.168.1.200",
    username:"admin"
  }
});

```

### 动态 import 导入

动态导入模块，什么时候使用什么时候导入；
使用 import 动态导入后返回的是一个 Promise 对象。

``` html
// index.html
<body>
  <button id="btn">点击</button>
  <script src="app.js" type="module"></script>
</body>
```

``` javascript
//hello.js
export function hello(){ 
  alert('Hello');
}

//app.js
// import * as m1 from "./hello.js"; // 传统静态导入
const btn = document.getElementById('btn');
btn.onclick = function(){ 
  import('./hello.js').then(module => { //module就是导入的模块中暴露的对象
    module.hello();
  });
}
```

### BigInt

bigint类型不能直接跟普通的 int 类型做运算。

``` javascript
// 大整型
let n = 100n; 
console.log(n, typeof(n)); // 100n 'bigint'

// 函数：普通整型转大整型
let m = 123; 
console.log(BigInt(m));  // 123n

// 大数值运算
let max = Number.MAX_SAFE_INTEGER;  //最大安全整数
console.log(max); // 9007199254740991
console.log(max+1); // 9007199254740992
console.log(max+2); // 9007199254740992

console.log(BigInt(max)); // 9007199254740991n
console.log(BigInt(max)+BigInt(1)); // 9007199254740992n
console.log(BigInt(max)+BigInt(2)); // 9007199254740993n
```

### 绝对全局对象globalThis

无论执行环境是什么，始终指向全局对象 window。

---
参考文章：
[ES6-ES11的新特性 | 作者：Martian_小小](https://blog.csdn.net/weixin_45950819/article/details/123134455)
[ECMAScript 6 入门 | 作者：阮一峰](https://es6.ruanyifeng.com/#README)
[尚硅谷Web前端ES6教程，涵盖ES6-ES11 | 作者：尚硅谷-李强](https://www.bilibili.com/video/BV1uK411H7on)
