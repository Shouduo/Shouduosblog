---
title: 前端动效之 FLIP 的技术原理
author: Shouduo
date: 2022-03-22 12:42:16
updated: 2022-03-22 15:03:25
tags: ['前端', 'JavaScript', 'CSS']
categories: ['Frontend']
banner_img: /img/post/flip_technique.png
index_img: /img/post/flip_technique.png
abbrlink: flip_technique
---

## 前言

Vue 自带的组件 [transition-group](https://vuejs.org/guide/built-ins/transition-group.html) 可以让其子组件在插入、移除以及重新排序时，加入动画效果，直观体现子组件前后的位置变换过程。在 [ToDone](https://github.com/Shouduo/ToDone) 中便使用了 transition-group 实现了 todo 排序时的动效。在使用 Electron + React 新建项目 [Toodoo](https://github.com/Shouduo/Toodoo) 时，使用了三方库 [react-flip-move](https://github.com/joshwcomeau/react-flip-move) 实现了相同的效果，该仓库的 README 提到了这种动效的实现原理基于 [FLIP](https://aerotwist.com/blog/flip-your-animations/#the-general-approach) 技术。

![ToDone 列表动画](/img/post/todone_example.gif)

## 简介

FLIP 是四个单词 First, Last, Invert, Play 的首字母缩写。
FLIP 核心思想是，在由数据驱动的排序变动时，真实 DOM 发生改变后，浏览器渲染前，加入一段 “从哪里来” 的动画，是一种逆向思维。常规的正向思维是，在由数据驱动的排序变动时，在真实 DOM 发生改变前，加入一段 “到哪里去” 的动画。

### First

发生变换元素A的初始状态（如位置，宽，高，透明度等，为方便表述，下面仅以位置作为例子）。

### Last

发生变换元素A的最终状态。

### Invert

> DOM 元素属性的改变（比如 left, right, transform 等等），会被集中起来延迟到浏览器的下一帧统一渲染，因此有一个这样的时间点：DOM 结构已改变，而浏览器还没渲染。此时视觉上元素仍在原位，但 DOM 中的元素已在新位置，可以得到 DOM 状态变更后的位置了。

知道了元素A前后的状态，便可以推算出发生了哪些变化，浏览器渲染伊始时，先使已经变化后的元素A回到开始状态。

比如在一次变换中，元素A从原来的位置（0，0）移动到了（100，100），Invert 步骤就是在 DOM 结构已改变，而浏览器还没渲染前，在视觉上将元素A移动到原来的位置，如 translate(-100, -100)。

### Play

浏览器开始渲染后，让元素A回到位置（0，0）即可。

## 实现

### 原生JS实现

``` javascript
// Get the first position.
var first = el.getBoundingClientRect();

// Now set the element to the last position.
el.classList.add('totes-at-the-end');

// Read again. This forces a sync layout, so be careful.
var last = el.getBoundingClientRect();

// You can do this for other computed styles as well.
// Just be sure to stick to compositor-only props 
// like transform and opacity where possible.
var invert = first.top - last.top;

// Invert.
el.style.transform = `translateY(${invert}px)`;

// Wait for the next frame so we know 
// all the style changes have taken hold.
requestAnimationFrame(function() {
  // Switch on animations.
  el.classList.add('animate-on-transforms');
  // GO GO GOOOOOO!
  el.style.transform = '';
});

// Capture the end with transitionend
el.addEventListener('transitionend', tidyUpAnimations);
```

### 使用 Web Animation Api 实现

[Web Animation Api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

``` javascript
// Get the first position.
var first = el.getBoundingClientRect();

// Move it to the end.
el.classList.add('totes-at-the-end');

// Get the last position.
var last = el.getBoundingClientRect();

// Invert.
var invert = first.top - last.top;

// Go from the inverted position to last.
var player = el.animate([
  { transform: `translateY(${invert}px)` },
  { transform: 'translateY(0)' }
], {
  duration: 300,
  easing: 'cubic-bezier(0,0,0.32,1)',
});

// Do any tidy up at the end of the animation.
player.addEventListener('finish', tidyUpAnimations);
```

## 总结

FLIP 思维对于那些需要根据用户操作频繁响应的元素是能提升动效流畅度的，比如本文的一张图片被点击后，从它本来的位置慢慢的放大成了一张完整的页面。

![fancybox](/img/post/fancybox_example.gif)

在用户操作和浏览器渲染之间有 100ms 的窗口期，在这个时间里做一些相对消耗资源的预运算对用户来说是难以感知的（如：getBoundingClientRect, getComputedStyle），只用在动画开始渲染时才需要保持 60 fps。

![Taking advantage of user perception](/img/post/render_gap.png)

参考文章：
[前端动画必知必会：React 和 Vue 都在用的 FLIP 思想实战。 | 作者：前端小苑](https://mp.weixin.qq.com/s/fW-QOoDY3W8eWnO8Ndn1NA)
[FLIP Your Animations | 作者：Paul Lewis](https://aerotwist.com/blog/flip-your-animations/#the-general-approach)
