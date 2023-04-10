---
title: 做点微小的工作，实现 iOS 日历和提醒事项双向同步
author: Shouduo
date: 2023-04-10 15:00:45
updated: 2023-04-10 23:02:32
tags: ['iOS', 'iPhone']
categories: ['iOS']
banner_img: /img/post/ios_sync_calendar_reminders.png
index_img: /img/post/ios_sync_calendar_reminders.png
abbrlink: ios_sync_calendar_reminders
---

## 前言

作为一名资深谷粉和十年的 Android 用户，在 2020 年看着各家厂商在笔记本、手机、手表、耳机甚至是智能家居上不断推成出新，补齐数字生活的每一块拼图，辅以“生态化反”的概念牢牢绑住每一个入坑的用户，此时再看看自己手里孤身寡人的 Pixel 手机，以及不知何时就被砍掉的 Pixelbook 系列，默默留下了悔恨的泪水。久苦于谷歌令人失望的硬件生态，我终于还是放弃了 Android 生态，转身拥抱苹果全家桶。苹果硬件生态品类齐全，多年深耕的软件生态和云服也赋予了这些硬件无缝的使用体验。但有一点一直令我不解，那就是 iOS 的自带应用：日历和提醒事项，它们的事件竟不是相互联动的。而在谷歌套件中，只要一个任务在 Google Tasks 中被新增或是被勾选完成，就会自动同步到 Google Calendar 中，以方便用户进行日程安排或是日程回顾。虽然第三方应用如滴答清单、Sunsama 也提供了类似的功能，但为了原生（免费）体验，只能自己动手折腾了。

## 前提条件

为了在 iOS 上实现日历和提醒事项双向同步的效果，需要借助快捷指令，搭配 JSBox 写一个脚本，创建数据库来绑定和管理日历和提醒事项中各自的事件。

1. iOS 14+；
2. 愿意花 40 RMB 开通 JSBox 高级版；
3. 不满足第2点，则需要设备已越狱，或者装有 TrollStore；

## *破解 JSBox

步骤：

1. 在 App Store 安装 JSBox；
2. 通过越狱的包管理工具或者 TrollStore 安装 Apps Manager；
3. 下载 [JSBox 备份](/attachment/JSBox_bak.adbk)文件，在文件管理中长按该文件，选择分享，使用 Apps Manager 打开，在弹出的菜单中点取消；
4. 在 Apps Manager 中的 Applications 选项卡中，选择 JSBox，点击 Restore 进行还原，即可使用 JSBox 高级版功能（在 JSBox 中的设置选项卡中不要点击“JSBox 高级版”选项，否则需要再次还原）；

![JSBox hacked](/img/post/jsbox_hacked.png)

## 加载脚本

步骤：

1. 下载 [Reminders ↔️ Calendar](/attachment/Reminders_sync_Calendar.box) 项目文件，在文件管理中长按该文件，选择分享，使用 JSBox 打开；
2. 在日历和提醒事项中各自新建一个“test”列表，在提醒事项的“test”列表中新建一个定时事件；
3. 返回 JSBox 中的 Reminders ↔️ Calendar 项目，点击界面下的“Sync now”按钮；
4. 回到日历中查看事件是否同步成功；

![Reminders & Calendar sync test](/img/post/reminders_calendar_sync_test.png)

设置项说明：

1. 同步周期 —— 周期内的事件才会被同步；
2. 同步备注 —— 是否同步日历和提醒事项的备注；
3. 同步删除 —— 删除一方事件时，是否自动删除另一方对应的事件；
4. 单边提醒 —— 日历和提醒事项的事件，谁创建谁通知，关闭则日历和提醒事项都会通知；
5. 历史待办默认超期完成 —— 补录历史待办，是否默认为已完成；
6. 提醒事项：默认优先级 —— 在日历创建的事件，同步到提醒事项时候默认的优先级；
7. 日历：默认用时 —— 在提醒事项创建的事件，同步到日历时默认的时间间隔；
8. 日历：快速跳转 —— 日历的事件是否在链接项中添加跳转到对应提醒事项的快速链接；
9. 日历：显示剩余时间 —— 日历的事件是否在地点项中添加时间信息；
10. 日历：完成变全天 —— 日历的事件是否在完成时，自动变成全天事件（这样日历视图就会将该项目置顶，方便查看未完成项目）；

![Reminders & Calendar sync settings](/img/post/reminders_calendar_sync_settings.png)

## 设置快捷指令

步骤：

1. 打开快捷指令应用，选择自动化选项卡，点击右上角+号新增一个任务；
2. 选择新建个人自动化，设置触发条件为打开应用，指定应用为日历和提醒事项，点击下一步；
3. 点击按钮新增一个行动，选择执行 JSBox 脚本，在脚本名上填入“Reminders ↔️ Calendar”，点击右下角的 ▶️ 测试，如果输出成功则点击下一步；（注意区分执行 JSBox 脚本和执行 JSBox 界面）；
4. 关闭执行前询问的选项，点击右上角的完成保存任务；

![Shortcut automation run JSBox](/img/post/shortcut_automation_jsbox.png)

## 总结

JSBox 是一款运行在 iOS 设备上的轻量级脚本编辑器和开发环境。它内置了大量的 API，允许用户使用 JavaScript 访问原生的 iOS API。另一款相似的应用 [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) 在语法的书写上更亲和，但其暴露的事件对象中缺少 last modified 字段，当信息不对称时，没有办法判断日历和提醒事项中事件的新旧。期待 Scriptable 的后续更新，毕竟它是免费的🤡。

参考文章：
[真香！自动同步ios的提醒事项和日历，显示日打卡内容 | 作者：汀力](https://zhuanlan.zhihu.com/p/169566930)
[最完美(ios)提醒事项与日历双向同步+带跳转 | 作者：你说](https://zhuanlan.zhihu.com/p/512921323)
