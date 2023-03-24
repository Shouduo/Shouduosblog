---
title: Android 的 A/B 分区及 Pixel 手机刷机指南
author: Shouduo
date: 2022-11-22 10:23:09
updated: 2022-11-22 22:07:17
tags: ['Android', '刷机']
categories: ['Android']
banner_img: /img/post/google_pixel_5.png
index_img: /img/post/google_pixel_5.png
abbrlink: android_flash_system
---

## 前言

在 Android 7 之后，Google 引入了一种新的分区结构，称为 A/B 分区，并且在 Android 11 以后强制推行，这使得以往安卓手机最方便的刷机方法 -- “卡刷”，成为过去式。本文将介绍 A/B 分区带来的改变，以及对应常用的刷机方法。

## 分区结构

### 传统分区结构（non-A/B）

设备上有一个 Android 主系统和一个 Recovery 系统，Android 主系统运行时检测是否需要升级，如果需要升级，则将升级的数据包下载并存放到 cache 分区，重启系统后进入 Recovery 系统，并用 cache 分区下载好的数据更新 Android 主系统，更新完成后重新启动进入 Android 主系统。如果更新失败，设备重启后就不能正常使用了，唯一的办法就是重新升级，直到成功为止。

传统 OTA 方式下的系统分区主要包括：
分区 | 说明
-----|-----
bootloader | 存放用于引导 linux 的 bootloader
boot | 存放 Android 主系统的 linux kernel 文件和用于挂载 system 和其他分区的 ramdisk
system | Android 主系统分区，包括 Android 的系统应用程序和库文件
vendor | Android 主系统分区，主要是包含开发厂商定制的一些应用和库文件，很多时候开发厂商也直接将这个分区的内容直接放入 system 分区
userdata | 用户数据分区，存放用户数据，包括用户安装的应用程序和使用时生成的数据
cache | 临时存放数据的分区，通常用于存放 OTA 的升级包
recovery | 存放 Recovery 系统的 linux kernel 文件和 ramdisk
misc | 存放 Android 主系统和 Recovery 系统跟 bootloader 通信的数据

### A/B 分区结构

A/B 系统主要由运行在 Android 后台的 update_engine 和两套分区 slot A 和 slot B 组成（用户数据只有一份，为两套系统共用）。Android 系统从其中一套分区启动，在后台运行 update_engine 监测升级信息并下载升级数据，然后将数据更新到另外一套分区，写入数据完成后从更新的分区启动。Android 系统由许多分区组成，其系统包括 boot 分区的 kernel 和 ramdisk，system  和 vendor 分区的应用程序和库文件，以及 userdata 分区的数据。

A/B 系统实现了无缝升级（seamless updates），有以下特点：

1. 出厂时设备上有两套可以正常工作的系统，升级时确保设备上始终有一个可以工作的系统，减少设备变砖的可能性，方便维修和售后；
2. OTA 升级在 Android系统的后台进行，所以更新过程中，用户可以正常使用设备，数据更新完成后，仅需要用户重启一次设备进入新系统；
3. 如果 OTA 升级失败，设备可以回退到升级前的旧系统，并且可以尝试再次更新升级。

A/B 分区方式下的系统分区主要包括：
分区 | 说明
-----|-----
bootloader | 存放用于引导 linux 的 bootloader
boot_a 和 boot_b | 分别用于存放两套系统各自的 linux kernel 文件和用于挂载 system 和其他分区的 ramdisk
system_a 和 system_b | Android 主系统分区，分别用于存放两套系统各自的系统应用程序和库文件
vendor_a 和 vendor_b | Android 主系统分区， 分别用于存放两套系统各自的开发厂商定制的一些应用和库文件，很多时候开发厂商也直接将这个分区的内容直接放入 system 分区
userdata | 用户数据分区，存放用户数据，包括用户安装的应用程序和使用时生成的数据
misc 或其他名字分区 | 存放 Android 主系统和 Recovery 系统跟 bootloader 通信的数据，由于存放方式和分区名字没有强制要求，所以部分实现上保留了 misc 分区（代码中可见 Brillo 和 Intel 的平台），另外部分实现采用其他分区存放数据（Broadcom 机顶盒平台采用名为 eio 的分区）。

### 区别

Android 7 上传统 OTA 方式和新的 A/B 系统方式都存在，只是编译时只能选择其中的一种 OTA 方式。由于 A/B 系统在分区上与传统 OTA 的分区设计不一样，二者无法兼容，所以 Android 7 以前的系统无法通过 OTA 方式升级为 A/B 系统。

![分区区别](/img/post/system_partitions_diff.png)

与传统 OTA 方式相比，A/B 系统的变化主要有：

1. 系统的分区设置：传统方式只有一套分区；A/B 系统 boot，system 和 vendor 有两套分区，称为 slot A 和 slot B；
2. 跟 bootloader 沟通的方式：传统方式 bootloader 通过读取 misc 分区信息来决定是进入 Android 主系统还是 Recovery 系统；A/B 系统的 bootloader 通过特定的分区信息来决定从 slot A 还是 slot B 启动；
3. 系统的编译过程：传统方式在编译时会生成 boot.img 和 recovery.img 分别用于 Android 主系统和 Recovery 系统的 ramdisk；A/B 系统只有 boot.img，而不再生成单独的 recovery.img；
4. OTA 更新包的生成方式：A/B 系统生成 OTA 包的工具和命令跟传统方式一样，但是生成内容的格式不一样了；

> 关于 cache 和 misc 分区：
> 仍然有部分厂家保留 cache 分区，用于一些其他的用途，相当于 temp 文件夹，但不是用于存放下载的 OTA 数据。
> 部分厂家使用 misc 分区存放 Android 系统同 bootloader 通信数据，另有部分厂家使用其它名字的分区存储这类数据。

## 解锁 OEM

OEM 锁定是生厂商对手机系统的保护机制，阻止用户对系统进行修改的，没有解锁前用户只能在系统提供的权限范围内操作，而系统是默认不允许对 boot（获取 Root 的核心操作，写入受保护的分区）写入。

步骤：

1. 打开设置，点击“关于手机”，再连续点击5次“版本号”，直到提示“已启用开发者选项”，
2. 返回到设置首页，进入“系统”，点击“开发者选项”，打开“OEM 解锁”选项。

![OEM Unlock](/img/post/oem_unlock.png)

## 刷入官方系统

Android 官方刷机常见于通过电脑“线刷”方式进行覆盖式刷写，一般会导致用户数据丢失，请先做好数据备份，具体做法各家厂商有所不同，请根据官方指引进行操作。

这里以 Google Pixel 系列手机为例：

1. 打开设置，进入开发者选项，打开“ADB 调试”；
2. 电脑上打开官方刷机工具 [Android Flash Tool](https://flash.android.com)；
3. 用数据线连接手机和电脑（尽量使用 USB 2.0 接口）；
4. 根据提示选择目标系统，期间保持连接稳定，整个过程大约需要 30 分钟。

![Android FLash Tool](/img/post/android_flash_tool.png)

> 关于 ADB
> ADB（Android Debug Bridge）是用来操作、调试 Android设备的一套指令集；
> Win8/10/11自带ADB驱动，如果检测失败，可以前往设备管理器中找到“其他设备”更新驱动程序；

## 刷入第三方系统

Android 得益于自身开源性，使得社区出现了许多为各个设备开发和编译第三方固件的团体，他们提供了如 LineageOS、Resurrection Remix OS、Pixel Experience OS等优秀的第三方固件，给用户创造了使用官方以外系统的可供。

这里以 Pixel 5 刷入 Pixel Experience Plus 为例：

1. 刷入目标第三方系统对应的 Android 版本的官方系统；
2. 下载对应机型的第三方 ROM 和 Recovery 镜像文件 [Pixel Experience Plus](https://get.pixelexperience.org/redfin)；
3. 用数据线连接手机和电脑，在开发者选项中开启 ADB 调试；
4. 手机从关机状态下，同时长按开机键和音量减，等待手机进入 fastboot 模式；或者在电脑上使用命令行工具使手机进入 fastboot 模式；

    ``` shell
    adb reboot bootloader
    ```

5. 确定刷入的分区槽位。在 fastboot 模式界面下方信息中 Boot slot:a 得知目前处于 a 槽位，或者使用命令行获取；

    ``` shell
    fastboot getvar current-slot
    ```

    可以使用命令来切换目标槽位；

    ``` shell
    fastboot --set-active=b
    ```

6. 下载和刷入对应 Android 版本的 [vendor_boot](https://gitlab.pixelexperience.org/android/vendor-blobs/wiki_blobs_redbull/-/tree/main/redfin)；

    ``` shell
    fastboot flash vendor_boot <vendor_boot_filename>.img
    ```

7. 刷入 Recovery 镜像

    ``` shell
    fastboot flash boot <recovery_filename>.img
    ```

8. 使用音量键选择，电源键确认进入 Recovery 模式，点击 Factory Reset 对分区进行格式化；
9. 返回上级菜单，点击 Apply Update，再点击 Apply from ADB 准备侧载刷入；
10. 使用命令行进行侧载刷入 ROM；

    ``` shell
    adb sideload <rom_filename>.zip
    ```

11. 等待命令行提示结果（其中一个即可，或是侧载进度停滞在 47%），即可点击 Reboot system now 重启进入系统；

    ``` shell
    Total xfer: 1.00x
    Total xfer: 0.98x
    failed to read command: Success
    failed to read command: No error
    failed to read command: Undefined
    ```

## 获取 Root 权限

Root 在 linux 和 Android 中是系统的“超级用户”，拥有操作系统最高的权限。使用 Root 权限几乎可以对系统进行任何的更改。使用 Magisk 是现在主流的获取 Root 权限方式。安装 Magisk 需要用到 boot.img 文件，以前可以直接在刷机包里找到，但现在采用 Virtual A/​B 分区的新机型有了变化（指卡刷包，线刷包还是能找到 boot.img），需要从解压的 payload.bin 文件中提取 boot.img。

步骤：

1. 下载并解压 [Payload Dumper](https://github.com/ssut/payload-dumper-go) 工具;
2. 解压 ROM 包，将 payload.bin 放入 payload_dumper/payload_input/ 下，双击执行 payload_dumper.exe 执行文件，等待提取完毕，从 payload_dumper/payload_output/ 中获得 boot.img 文件；
3. 将 boot.img 复制到手机中，下载并安装 [Magisk](https://github.com/topjohnwu/Magisk) 管理器;
4. 使用 Magisk 管理器对 boot.img 进行修补，将修补后的镜像文件 magisk_patched-xxx.img 复制到电脑中；
5. 重启手机进入 bootloader，使用命令行将修补文件刷入 boot 分区；

    ``` shell
    fastboot flash boot <magisk_patched_filename>.img
    ```

## 总结

由于 Android 新的 A/B 分区方式将传统方式中的 Recovery 分区合并到 boot 分区中，使得通过如 TWRP 等第三方 Recovery 刷入、备份系统的“卡刷”方式不再流行。如今刷机离不开电脑，步骤繁琐，变成了手机玩家的心智负担。

参考文章：
[Pixel - 从二手到刷机Root一条龙步骤级教程及常见问题解决 | 作者：Decontamination](https://www.coolapk.com/feed/31409038)
[Android系统分区与升级 | 作者：SYLVAIN](https://zhuanlan.zhihu.com/p/364003927)
