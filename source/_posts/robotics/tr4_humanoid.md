---
title: TR4_Humanoid
date: 2025-11-19 17:24:08
tags: [GUI, LLM, DeepSeek-V3.2-Exp, IK, PinkIK, DLS, WebSocket, Isaac Sim, usdf, usd]
category: robotics
categories:
  - robotics
cover: /img/robotics/tr4_humanoid.png
comments: true
---

起止时间：11/2025 ~ 12/2025

技术栈：[GUI, LLM, DeepSeek-V3.2-Exp, IK, PinkIK, DLS, WebSocket, Isaac Sim, usdf, usd]


_全链路打通 + 实时交互 + 大模型规划 + 逆运动学IK算法 + 自动意图识别 + 串行序列生成 + GUI + WebSocket + IK_

<br/>

**该项目是面向具身智能的全链路机器人控制系统，集成 GUI、自然语言理解、大模型规划（DeepSeek-V3.2-Exp）、语义解析、动作模板匹配、多动作自动分解、队列化动作序列生成、PinkIK+DLS 逆运动学融合求解、抓取三维偏移、自适应轨迹规划、WebSocket 实时闭环控制与 Isaac Sim USD/USDF 仿真等核心模块。系统从一句自然语言开始，通过参数抽取、意图识别与动作结构化自动生成可执行的多段动作 schema；并在 IK 层实现对抓取、握拳、避障和动态偏移的自适应求解，最终以毫秒级同步执行与状态回传完成“自然语言 → 语义动作 → 序列规划 → IK 求解 → 真实执行 → 环境反馈”的完整闭环。该系统展示了面向具身智能的工程级实现能力，实现了人机交互、规划、控制与仿真全链路贯通。**
<br/>

**1. GUI 输入模块**

1. 支持自然语言输入
2. 支持复合动作指令输入
3. 支持预设动作
4. 支持生成机器人动作策略
5. 支持自动化解析动作成JSON结构


**2. 语义解析与动作分解模块**

1. 一句话 → 多动作
2. 自动分句 → 动作意图识别
3. 自动提取参数（步数、角度、方向、位置）
4. 判断是否在预设模板 or 需要自由生成


**3. 动作序列生成模块**

1. 自然语言 → 多段动作序列
2. 建立 Queue 串行执行
3. 动作包含角度、轨迹、持续时间、约束


**4. IK 与轨迹规划融合模块**

1. PinkIK 与 DLS 的结合
2. 三维偏移（握拳 vs 拿方块）
3. 抓取阈值 radius
4. 物体接触判断
5. 基于语义目标的 IK 自适应轨迹规划


**5. 机器人执行模块**

1. WebSocket 指令下发
2. 强同步与反馈
3. 支持中断、返回、失败处理
4. 行为封装为 schema


**6. 环境反馈循环**

1. Sim 更新状态
2. 判断物体是否抓取
3. 判断路径是否稳定
4. 自动处理 action completion
5. 向 GUI 回传状态
6. 完整闭环系统


<div class="row">
  <div class="col-lg-12"><!-- title -->
    <h5 class="trm-mb-40 trm-mt-20 trm-title-with-divider">bilibili效果展示<span data-number="05"></span></h5>
  </div>
  <div class="col-lg-12"><!-- video -->
    <div class="trm-video trm-scroll-animation">
      <div class="trm-video-content trm-overlay"><img src="/img/robotics/tr4_humanoid.png" alt="video-cover">
        <div class="trm-button-puls"></div>
        <a href="https://www.bilibili.com/video/BV1ZMyHBaEgH/" class="trm-play-button" target="_blank"><i class="fas fa-play"></i></a></div>
    </div>
    <!-- video end --></div>
</div>
