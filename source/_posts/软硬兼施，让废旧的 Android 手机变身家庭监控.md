---
title: 软硬兼施，让废旧的 Android 手机变身家庭监控
author: Shouduo
date: 2023-02-18 13:53:02
updated: 2023-02-18 20:52:22
tags: ['Android', '智能家居']
categories: ['Android']
banner_img: /img/post/android_as_webcam.jpg
index_img: /img/post/android_as_webcam.jpg
abbrlink: android_as_webcam
---

## 前言

随着智能手机的更新换代，家中废旧的 Android 设备也越积越多，其中多数是因为出现各种故障，或者年代久远且价值过低不好售卖，被遗忘在抽屉中吃灰。堆积在家中的旧手机不仅占地，甚至还有电池老化起火的风险，真就是食之无味又弃之可惜（功能尚好的设备建议二手售卖，毕竟家用监控摄像头一般价格也在 200 RMB 左右）。本文将提供一种利用 Tailscale 虚拟组网技术和 IP Webcam Pro 网络摄像头软件，将 Android 设备改造为 24/7 监控设备的方案。

## 系统准备

为了降低维护成本和方便后期功能扩展，在安装监控软件、安置在固定机位上之前，需要对对手机的系统层面做一些改动和设置，使目标手机拥有远程调试、上电自启等功能。

### 远程调试

步骤：

1. 刷入最新的稳定版固件（Android 6.0+），安装 Magisk 获取 Root 权限，卸载无用的系统程序和谷歌套件（减少手机耗电和发热）；
2. 安装 [AirDroid](https://www.airdroid.com/download/) 软件，给予远程控制的相关权限，开启开机自启功能，关闭电池优化防止程序后台被杀，在[网页端](https://web.airdroid.com/)上测试远程控制功能（用于公网的远程控制，网页上控制目标手机）；
3. 进入开发者调试，开启 ADB 调试和允许网络 ADB 调试，使用另一台 Android 手机安装 [甲壳虫 ADB 助手](https://www.coolapk.com/apk/com.didjdk.adbhelper) 做控制端，通过目标手机的内网地址进行连接，在目标手机上勾选始终信任控制手机的 MAC 地址，在控制手机上测试甲壳虫 ADB 助手的远程控制功能（用于同一局域网的远程控制，Android 手机控制目标手机，暂未找到 iOS 作为控制端的方法）；
4. 由于 Android 的安全机制，允许网络 ADB 调试的功能在手机重启后会被自动关闭，可以通过安装 [开机自动开启本地和网络usb调试](/attachment/wireless_adb_boot_enabler.zip) Magisk 模块使允许网络 ADB 调试的功能始终保持打开。

### 上电自启

步骤：

1. 下载和安装 [DNA-Android](/attachment/DNA-Android_4.0.5.apk)，打开工具，点击下方-其他-提取镜像文件，如果只有一个 boot 分区，那直接提取，如果 boot_a/boot_b 两个分区，可以用终端执行下述命令，输出是 a 就提取 boot_a，是 b 就提取 boot_b。提取的镜像位于 /storage/emulated/0/DNA/image/ 目录下（请将此文件备份一份到电脑，出错时可以用电脑或者 recovery 恢复）；

    ``` shell
    getprop ro.boot.slot_suffix
    ```

2. 打开 DNA-Android 工具，点击下方-主页-新建工程，输入bootdeal-确定，打开文件管理器，进入 /storage/emulated/0/DNA/image/ 下的 boot 镜像，剪切到 /storage/emulated/0/DNA/NA_bootdeal/，再次打开工具，点击工程菜单-点击分解img-选择boot镜像，确定，开始解包，解包完成后的文件总目录位于 /data/DNA/NA_bootdeal/；

3. 在 /data/DNA/NA_bootdeal/boot_a/ramdisk/overlay.d/ 目录下，新建一个 [custom.rc](/attachment/custom.rc) 文件，里面输入下述代码，保存。打开 DNA-Android 工具，点击工程菜单-点击合成img-dat-br，点击最上面请选择-勾选。打包大小-选择原镜像大小，打包格式-选择线刷格式，点击确定。修改后 boot 镜像就生成了；

    ``` shell
    on charger
        setprop sys.powerctl reboot
    ```

    > 在 /data/DNA/NA_bootdeal/boot_a/ramdisk/overlay.d/ 目录下，所有 .rc 文件将被读取执行，但不会挂载到系统中去；而其他文件，将被挂载到系统中去，但是一定要系统根目录中原位置存在同名文件，否则将被忽略。不要去动 sbin 文件夹。

4. 回到 DNA-Android 工具主页面，点击其他-刷入镜像，选择输入分区，只有一个 boot 分区就选 boot，A/B 分区 就选 boot_a 或 boot_b。img 文件选择，点击文件夹图标-依次打开 DNA/NA_bootdeal/out，选定 boot.img，确定，完成后重启，将手机拔出电源并关机，完全关机后，插入电源，测试是否上电自动开机。

![DNA-Android](/img/post/dna_android.png)

## 硬件改造

要作为 24/7 的监控设备，需要一直插着充电器充电，而 Android 系统百花齐放，不一定都有良好的充电管理功能，并且旧手机的电池通常有效率较低的和电池鼓包的现象，为安全起见，个人建议还是先将手机的内置电池去除，改为直供电的方式使设备的后期维护成本更低。

步骤：

1. 将手机拆开，断开电池接口座子，小心地将电池取下（电池通常通过易拉胶和手机主体框架粘合）；
2. 将电池上的电工胶带拆开，用剪刀将电池小板和锂电池分离（注意避免正负极发生短接，锂电池正负极绝缘处理后按垃圾分类丢弃）；
3. 在充电口座子上焊接正负极两根飞线，和电池小板的正负极相连；
4. 将电池小板的接口按回主板的电池座子上，手机插上充电器后开机测试。

![Android direct power](/img/post/android_direct_power.png)

>如果手机运行不稳定，有屏幕闪烁、突然灭屏等现象，一般是由于电池小板电压不匹配引起的，可以尝试在充电座子和电池小板的正极接线中间串联一个 S6M 压降二极管来解决问题（充电座子一般输入 5V 电压，而电池小板一般输入 4.2V 电压）；

## 开启监控服务

市面上有许多成套的远程监控应用和服务，如掌上看家、Ivideon 等，但这些应用和服务通常都需要按年或按月进行收费，用以支付服务器费用，更有甚者会在其应用内布满广告，增加收益。此外，为了实现远程监控，画面需要通过服务器进行中转，其中的安全问题也令人担忧。考虑到上述因素，下面将介绍一种免费、无广、安全的实现方法，使用 IP Webcam Pro 为局域网提供本地监控服务，再通过 Tailscale 虚拟组网技术，实现远程设备间的 P2P 通信，以达到远程监控的目的。

步骤：

1. 下载安装 [IP Webcam Pro](https://happymod.com/ip-webcam-pro-mod/com.pas.webcam.pro/) 到监控端手机，进入应用，点击 Local broadcasting-Login/password，设置用户名和密码，返回到一级菜单，点击 Start server 开启服务；

![IP Webcam Pro](/img/post/ip_webcam_pro.png)

2. 使用同一局域网下的电脑，浏览器打开监控端手机的内网地址 192.168.x.x:8080，登陆上一步设置的用户名和密码，即可访问 IP Webcam Pro 的后台管理界面；

![IP Webcam Pro Http Server](/img/post/ip_webcam_http_server.png)

3. 下载安装 [Tailscale](https://tailscale.com/download/android) 到监控端手机，进入应用，注册并登陆账号，打开左上角的开关，即可和使用同个账号登陆的其他设备进行虚拟组网，网内的设备之间可以通过分配的公网 IP 地址相互访问，就像在同一局域网中一样，在电脑上下载安装 Tailscale 客户端，浏览器打开监控端手机 Tailscale 分配的地址 100.99.x.x:8080，即可实现远程监控；

   >Tailscale 和其他网络代理无法同时开启。

4. 下载安装 [tinyCam PRO](https://modyolo.com/tinycam-pro.html) 到控制端手机，进入应用，展开侧边栏，点击 Manage Cameras，点击 + 号，选择 Add IP camera, NVR/DVR，在 Camera brand 选择 IP Webcam for Android，输入监控端手机的 IP 地址、端口号、用户名和密码后，即可返回侧边栏中的 Live View 查看监控画面；

![tinyCam PRO](/img/post/tinycam_pro.png)

>如果有多台监控端手机，使用 IP Webcam Pro 需要在网页端打开多个浏览器窗口来实现多画面实时监控。控制端手机上使用 tinyCam PRO 可以添加多台监控端手机，在 Live View 界面中同时进行监控，但 tinyCam PRO 不支持读取 IP Webcam Pro 的录像 Video Archive。为实现网页端多画面实时监控，还可以在其中一台监控端手机中安装 tinyCam PRO 并在侧边栏开启 Web server，这样在远程访问这台监控端手机就可以同时进行监控。

## 总结

经过上述流程改造过的 Android 手机，还可以通过安装其他应用和服务，同时胜任旁路由、电子相框、电脑性能监控器等工作。

参考文章：
[修改根目录文件/添加新的init*.rc到系统中，暨让手机接电即开机/修改手机成为车机、机顶盒，的二合一教程。 | 作者：请输入新用户名99](https://www.coolapk.com/feed/41463938?shareKey=MmVlMWNmZjFiZDA3NjQyMmYwMzI)
[tinyCam Pro、IP Webcam，妥妥的“黑科技”，屌炸天的功能！ | 作者：i3综合社区](https://www.i3zh.com/4483.html)
