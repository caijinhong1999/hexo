---
title: Wall Follower
date: 2025-10-23 21:34:16
tags: [激光雷达(LIDAR), Arduino, Raspberry Pi, VLA, 地图构建, 路径跟随]
category: robotics
categories:
  - robotics
cover: /img/robotics/wall_follower.jpg
comments: true
---

起止时间：09/2025 ~ 12/2025

技术栈：[ROS2, TurtleBot3, V2A, SLAM, Cartographer, Nav2, LIDAR, Arduino, Raspberry Pi, 自动导航, 路径规划, 视觉定位]

设计并实现基于 ROS2 框架的自主导航机器人系统，部署于 TurtleBot3 平台，融合 LIDAR 激光雷达 实现环境感知与自主避障。系统采用 V2A（Virtual to Action） 左向优先探索策略，实时计算 12 向激光距离向量，动态调节线速度与角速度，实现沿墙稳定行进与障碍规避。

基于 SLAM（Simultaneous Localization and Mapping） 与 Cartographer 构建环境地图，结合 Nav2 导航栈完成路径规划与闭环定位。系统通过 ROS2 多节点架构 实现模块化通信：感知节点进行激光与视觉信息融合，控制节点执行运动控制与路径跟踪。

在硬件层面，系统集成 Arduino（底盘与传感器采集）与 Raspberry Pi（高层路径规划与视觉识别），并结合 视觉标识识别（RGB-D Camera） 辅助地标定位，实现从传感器采集、决策规划到运动执行的完整自主导航闭环。
<div class="row">
  <div class="col-lg-12"><!-- title -->
    <h5 class="trm-mb-40 trm-mt-20 trm-title-with-divider">bilibili效果展示<span data-number="05"></span></h5>
  </div>
  <div class="col-lg-12"><!-- video -->
    <div class="trm-video trm-scroll-animation">
      <div class="trm-video-content trm-overlay"><img src="/img/robotics/wall_follower.jpg" alt="video-cover">
        <div class="trm-button-puls"></div>
        <a href="https://www.bilibili.com/video/BV1ejW2zhEWX/" class="trm-play-button" target="_blank"><i class="fas fa-play"></i></a></div>
    </div>
    <!-- video end --></div>
</div>

<br>

![wall_follower_map.jpg](/img/robotics/wall_follower_map.jpg)_自主构建图_


