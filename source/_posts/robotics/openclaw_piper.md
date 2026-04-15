---
title: openclaw_piper
date: 2026-04-15 12:31:32
tags: [Openclaw, Piper, Orbbec, CAN, ROS2, Rviz, yoloV8, VLA, ACT, Diffusion Policy]
category: robotics
categories:
  - robotics
cover: /img/robotics/piper.png
comments: true
---

起止时间：11/2025 ~ 12/2025

技术栈：[ROS2, Rviz, yoloV8, Piper, Orbbec, CAN, VLA, ACT, Diffusion Policy]


_基于 OpenClaw Skill 框架，构建了一个由 Agent 驱动的视觉引导机械臂抓取系统，实现了从感知、决策到执行的端到端闭环控制。_

<br/>

🧩 系统完整能力拆解（面试重点版）
1️⃣ Agent 控制层（小龙虾）
基于 Agent（你说的“小龙虾”）作为决策中枢
负责任务理解 + 调用 Skill
实现：
“看见 → 理解 → 决策 → 执行”

👉 本质：
AI 在调度机器人能力（具身智能雏形）

2️⃣ Skill 执行层（OpenClaw 框架）
使用 OpenClaw 定义 Skill
将机器人能力模块化：
视觉 Skill
抓取 Skill
运动 Skill

👉 特点：

可组合
可扩展
支持 Agent 调用
3️⃣ 视觉感知（Perception）
YOLO 目标检测
实时识别目标（cup / bottle 等）
输出：
类别
bounding box
4️⃣ 空间定位（3D理解）
深度相机获取距离信息
计算：
像素坐标 → 相机坐标系
5️⃣ 手眼标定（关键能力）
完成：
相机坐标系 → 机械臂坐标系

👉 作用：
解决“看见 ≠ 抓得到”的核心问题

6️⃣ 抓取优化（PSO）
使用 PSO（粒子群优化）
对抓取点 / 抓取姿态进行优化

👉 提升：

抓取成功率
稳定性
7️⃣ 机械臂控制（执行层）
基于 SDK 控制机械臂运动
完成：
轨迹执行
抓取动作
🔁 系统闭环（你一定要会讲）
用户/任务
   ↓
Agent（小龙虾）
   ↓
Skill调用（OpenClaw）
   ↓
视觉感知（YOLO + 深度）
   ↓
坐标计算 + 手眼标定
   ↓
PSO优化抓取点
   ↓
机械臂执行抓取


<div class="row">
  <div class="col-lg-12"><!-- title -->
    <h5 class="trm-mb-40 trm-mt-20 trm-title-with-divider">bilibili效果展示<span data-number="0415"></span></h5>
  </div>
  <div class="col-lg-12"><!-- video -->
    <div class="trm-video trm-scroll-animation">
      <div class="trm-video-content trm-overlay"><img src="/img/robotics/piper.png" alt="video-cover">
        <div class="trm-button-puls"></div>
        <a href="https://www.bilibili.com/video/BV1VTQ7BAELY/" class="trm-play-button" target="_blank"><i class="fas fa-play"></i></a></div>
    </div>
    <!-- video end --></div>
</div>

![openclaw.png](/img/robotics/openclaw.png)_OpenClaw_
![handeye_calibration_ros.png](/img/robotics/handeye_calibration_ros.png)_handeye calibration ros，手眼标定法_
![PSO.png](/img/robotics/PSO.png)_Particle Swarm Optimization，粒子群优化算法_
