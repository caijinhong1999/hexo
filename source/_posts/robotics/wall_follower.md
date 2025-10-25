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

技术栈：[激光雷达(LIDAR), Arduino, Raspberry Pi, VLA, 地图构建, 路径跟随]

设计并实现自主跟随左墙算法，使用ROS2节点结构结合激光雷达（LIDAR）进行环境感知与避障，实时计算12方向距离向量，动态调整线速度与角速度实现左向优先的沿墙探索策略。系统集成Arduino与Raspberry Pi硬件平台，实现传感器采集、运动控制及视觉标识辅助定位，完成自主地图构建与路径跟随。

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

