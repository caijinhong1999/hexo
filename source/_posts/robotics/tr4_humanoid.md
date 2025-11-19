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


全链路打通 + 实时交互 + 大模型规划 + 逆运动学IK算法 + 自动意图识别 + 串行序列生成 + GUI + WebSocket + IK。


# 1. GUI 输入模块（创新点：指令结构化＋高自由度动作输入）

1. 支持自然语言输入
2. 支持复合动作指令输入
3. 支持预设动作
4. 支持生成机器人动作策略
5. 支持自动化解析动作成JSON结构


# 2. 语义解析与动作分解模块

1. 一句话 → 多动作
2. 自动分句 → 动作意图识别
3. 自动提取参数（步数、角度、方向、位置）
4. 判断是否在预设模板 or 需要自由生成


# 3. 动作序列生成模块

1. 自然语言 → 多段动作序列
2. 建立 Queue 串行执行
3. 动作包含角度、轨迹、持续时间、约束


# 4. IK 与轨迹规划融合模块

1. PinkIK 与 DLS 的结合
2. 三维偏移（握拳 vs 拿方块）
3. 抓取阈值 radius
4. 物体接触判断
5. 基于语义目标的 IK 自适应轨迹规划


# 5. 机器人执行模块

1. WebSocket 指令下发
2. 强同步与反馈
3. 支持中断、返回、失败处理
4. 行为封装为 schema


# 6. 环境反馈循环

1. Sim 更新状态
2. 判断物体是否抓取
3. 判断路径是否稳定
4. 自动处理 action completion
5. 向 GUI 回传状态
6. 完整闭环系统

