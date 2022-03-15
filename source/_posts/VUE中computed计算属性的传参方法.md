---
title: Vue 中 computed 计算属性的传参方法
author: Shouduo
date: 2019-10-18 19:12:05
updated: 2019-10-18 19:47:11
tags: ['Vue']
categories: ['Frontend']
banner_img: '/img/post/vue-computed.png'
index_img: '/img/post/vue-computed.png'
abbrlink: vue-computed
---

## 前言

在 Vue 中，computed 计算属性为我们提供了一个非常灵活简洁的动态数据更新方法，虽然写法相似，但不同于 methods 和 watch 的是，computed 计算属性更倾向于“属性”性质，在渲染开始 Vue 便会将 computed 内的计算属性运算后以键值对的方式保存在缓存中，DOM 中多次调用只会从缓存中取值，只有在 computed 计算属性所牵涉到的数据发生变动时才会再次运算，并更新缓存的数值，也正因如此在DOM中使用时也不必在函数名后加括号()。computed 计算属性设计之初就是为了避免因DOM中重复调用相同计算属性而引起的多次运算，不能也不需要传参，在 DOM 中当作普通属性调用即可。

## 如果我非要传参呢？

### 先来看一个简单 Vue 结构

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <script src="https://cdn.staticfile.org/vue/2.2.2/vue.min.js"></script>
</head>
<body>
  <div id="app">
    <button @click=" base += 1">add</button>
    <p>原始字符串: {{ add }}</p>
    <p>原始字符串: {{ add }}</p>
    <p>原始字符串: {{ add }}</p>
  </div>

  <script>
    var vm = new Vue({
      el: '#app',
      data: {
        base: 0
      },
      computed: {
        add:function() {
          alert("add");
          return this.base;
        }
      }
    })
</script>
</body>
</html>
```

运行结果：
> 首次运行的时候会发现alert弹窗一次，
> 接着点击add按钮，每次+1都只会再弹窗一次，
> 尽管DOM中调用了三次add……
> 符合前言所说的每次修改只更新一次且保存到缓存，再从缓存中调用

### 稍微修改一下代码

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <script src="https://cdn.staticfile.org/vue/2.2.2/vue.min.js"></script>
</head>
<body>
  <div id="app">
    <button @click=" base += 1">add</button>
    <p>原始字符串: {{ add("one") }}</p>    //传一个字符串过去
    <p>原始字符串: {{ add }}</p>
    <p>原始字符串: {{ add }}</p>
  </div>one

  <script>
    var vm = new Vue({
      el: '#app',
      data: {
        base: 0
      },
      computed: {
        add:function(a) {    //塞一个形参给他
          alert("add");
          return this.base + a;
        }
      }
    })
</script>
</body>
</html>
```

运行结果：
> F12看log提示 ‘add is not a function’……
> 符合前言所说的缓存中保存的是computed早已运算完毕的键值对，
> 应当作computed一个对象属性来使用，
> add不是函数，而是键！自然不能以add("one")这么调用。

讲到这里吊大的旁友应该会想起，既然缓存里保存的是键值对，那么咱想办法把“值”给整成函数不就得了？是的，只要使用JavaScript的闭包方式去写add:function()，俄罗斯套娃般地把逻辑代码丢进一个新的内嵌函数里，并把它整个返回就行了。

### 再修改一下上面的例子

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <script src="https://cdn.staticfile.org/vue/2.2.2/vue.min.js"></script>
</head>
<body>
  <div id="app">
    <button @click=" base += 1">add</button>
    <p>原始字符串: {{ add(" one") }}</p>  //传参“ one”
    <p>原始字符串: {{ add(" one") }}</p>  //传参“ one” (和上面一样，验证多次调用）
    <p>原始字符串: {{ add(" two") }}</p>  //传参“ two”（改变参数）
  </div>

  <script>
    var vm = new Vue({
      el: '#app',
      data: {
        base: 0
      },
      computed: {
        add:function() {
          alert("add");
          return function(a){    //返回整个内嵌函数
            alert("add inner");
            return this.base + a; //把逻辑代码放内嵌函数里
          }
        }
      }
    })
</script>
</body>
</html>
```

运行结果：
> 一上来就弹了 “add” 弹窗一次————键值对 add:function(a) 被写进缓存，
> 接着弹了 “add inner” 弹窗三次———— DOM 中调用了三次，
> 点击 add 按钮，“add” 弹窗没有出现，“add inner” 弹窗三次。

发现了没有，虽然DOM中有两次传参都是 “one”，但 “add inner” 弹窗依旧出现三次，这明显和 computed 计算属性的设计初衷相违背（相同调用，一次计算），这也很好理解，之前是记着答案的 computed，现在给咱整成记着算法的了……问了两次一样的问题，它还是老实巴交地算了两遍……QAQ，你是能愉快地传参了，但这样的 computed 又和 methods 有何区别？

## 总结

要传参就去 methods 里传 ~~（要打就去练舞室打）~~
