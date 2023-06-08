---
title: npm 中包的版本号规则
author: Shouduo
date: 2022-09-27 20:43:02
updated: 2022-09-27 21:41:10
tags: ['前端', 'npm', 'package.json']
categories: ['Front-end']
banner_img: /img/post/npm_version_rule.png
index_img: /img/post/npm_version_rule.png
abbrlink: npm_version_rule
---

## 前言

npm 的版本号依赖 [semver](https://docs.npmjs.com/cli/v6/using-npm/semver) 库遵守的 [Semantic Versioning 2.0.0](https://semver.org/) 规则进行管理。

## 版本号组成

![版本号组成](/img/post/npm_version_example.png)

软件版本号有四部分组成：

- 主版本号（Major）：变化了表示有了一个不兼容上个版本的大更改。
- 次版本号（Minor）：变化了表示增加了新功能，并且可以向后兼容。
- 修订版本号（patch）：变化了表示有 bug 修复，并且可以向后兼容。
- 日期版本号加希腊字母版本号（可选）：希腊字母版本号共有五种，分别为 base、alpha、beta、RC、release。

>关于希腊字母版本号：
>
> - Base：此版本表示该软件仅仅是一个假页面链接，通常包括所有的功能和页面布局，但是页面中的功能都没有做完整的实现，只是做为整体网站的一个基础架构；
> - Alpha：软件的初级版本，表示该软件在此阶段以实现软件功能为主，通常只在软件开发者内部交流，一般而言，该版本软件的 bug 较多，需要继续修改，是测试版本。测试人员提交 bug 经开发人员修改确认之后，发布到测试网址让测试人员测试，此时可将软件版本标注为 alpha 版；
> - Beta：该版本相对于 Alpha 版已经有了很大的进步，消除了严重错误，但还需要经过多次测试来进一步消除，此版本主要的修改对象是软件的 UI。修改的 bug 经测试人员测试确认后可发布到外网上，此时可将软件版本标注为 beta 版；
> - RC：该版本已经相当成熟，基本上不存在导致错误的 bug，与即将发行的正式版本相差无几；
> - Release：该版本意味“最终版本”，在前面版本的一系列测试版之后，终归会有一个正式的版本，是最终交付用户使用的一个版本。该版本有时也称标准版。

## package.json 中的依赖

dependencies 字段指定了项目运行所依赖的模块，devDependencies 指定项目开发所需要的模块(测试阶段和过渡阶段的依赖应该加在 devDependencies 中)。它们都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成，表示依赖的模块及其版本范围。

``` json
{ 
  "name": "create-react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
     "coffee-script": "~1.6.3"
  },
}
```

模块名和版本号被假定组合成一个唯一的标识符。version 字段必须能够被 [node-semver](https://docs.npmjs.com/cli/v6/using-npm/semver) 解析（node-semver 作为依赖项被捆绑进了 npm 中）。

``` json
{
  "dependencies": {
    "aaa": "1.2.3",             // ===1.2.3
    "bbb": "1.2",               // ===1.2.0 缺失的部分默认补 0
    "ccc": "1.2.3 - 4.5.6",     // >=1.2.3 且 <=4.5.6
    "ddd": ">=1.2.3 <=4.5.6",   // >=1.2.3 且 <=4.5.6
    "eee": "~1.2.3",            // >=1.2.3 且 <1.3.0
    "fff": "1.2.x",             // >=1.2.0 且 <1.3.0
    "ggg": "1.2.*",             // >=1.2.0 且 <1.3.0
    "hhh": "^1.2.3",            // >=1.2.3 且 < 2.0.0
    "iii": "<1.2.3 || >=4.5.6 <7.8.9", // <1.2.3 ，或者 >=4.5.6 且 <7.8.9
    "jjj": "latest",            // 安装最新版本，相当于 *
    "kkk": "file:../dyl",       // 使用本地路径
    "lll": "http://asdf.com/asdf.tar.gz", // 在版本上指定一个压缩包的 url，当执行 npm install 时这个压缩包会被下载并安装到本地。
    "mmm": "git://github.com/user/project.git#commit-ish" // 使用 git URL 加 commit-ish
  }
}
```

## 总结

- 项目开发中使用 ~(tilde) 和 ^(caret) 来标记版本号，可以保证项目不会出现大的问题，也能保证包中的小 bug 可以得到修复。
- 项目固化后可以直接指定特定的版本号，如：1.2.3，优点是稳定，但是如果依赖包发布新版本修复了一些小 bug，那么需要手动修改 package.json 文件。
- 慎用 *(asterisk)，这意味着安装最新版本的依赖包，可能会造成版本不兼容。

参考文章：
[package.json中版本号详解 | 作者：奋斗的小绿萝](https://blog.csdn.net/weixin_40817115/article/details/86611179)
[Semantic Versioning Cheatsheet | 作者：byte archer](https://bytearcher.com/goodies/semantic-versioning-cheatsheet/)
