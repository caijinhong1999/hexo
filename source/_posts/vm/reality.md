---
title: REALITY
date: 2025-11-20 14:18:25
tags: [Linux, Ubuntu, VPN, Xray, VLESS, REALITY, v2rayN]
category: VM
categories:
  - VM
cover: /img/vm/v2rayN.png
published: false
comments: true
---

起止时间：11/2025 ~ 11/2025

技术栈：[Linux, Ubuntu, VPN, Xray, VLESS, REALITY, v2rayN]

# 一、服务端
## 1. 安装 XRay

```bash
在服务器执行：

bash <(curl -fsSL https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh) install
```

## 2. 生成 Reality 密钥对
```bash
root@racknerd-ed5bfb7:/# xray x25519
PrivateKey: xxxxxxxxxx
Password: xxxxxxxxxx  (publicKey)
Hash32: xxxxxxxxxx


如何从 PrivateKey 得到 PublicKey？
Reality 使用 X25519 密钥对，你可以用 Xray 自带命令生成公钥：
在服务器上运行：

xray x25519 -i <你的privateKey>

Password就是publicKey
```


## 3. 生成一个 UUID
```bash
Reality 使用 VLESS 协议，需要 UUID：

xray uuid
把输出填到配置：

"id": "你的UUID"
```

## 4. shortid
```bash
root@racknerd-ed5bfb7:/usr/local/etc/xray# openssl rand -hex 8
d5c45053dcc6540e
```
## 5. 配置文件
```bash
cat > /usr/local/etc/xray/config.json << EOF
{
  "inbounds": [
    {
      "port": 你的自定义端口,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "UUID",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none",
        "fallbacks": []
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": false,
          "dest": "www.cloudflare.com:你的自定义端口",
          "xver": 0,
          "serverNames": ["www.cloudflare.com"],
          "privateKey": "这里填你 xray x25519 输出的 PrivateKey",
          "shortIds": ["这里填 1 个 8~16 位十六进制 shortId，例如 \"6ba851abf4c94397\""]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}
EOF
```

## 6. 测试配置是否正确
```bash
xray run -test -config /usr/local/etc/xray/config.json
```

## 7. 重启 XRay
```bahs
systemctl daemon-reload
systemctl restart xray
systemctl status xray
看到 Running = 成功。
```

## 8. 异常处理：systemd 服务没有权限读取 /usr/local/etc/xray/config.json
```bash
很多发行版中：
systemd 默认 User=nobody
而 nobody 没有权限访问 /usr/local/etc/xray/
你的 service 文件里应该有：

User=nobody
所以 systemctl 会失败，而你手动运行 root 账户却是 OK 的。

③ systemd 启动环境与手动启动环境不同
你手动运行时环境变量正确，但 systemd 环境是干净的，找不到依赖库，也会报 255 异常退出。

1）编辑 systemd 服务文件

nano /etc/systemd/system/xray.service
改成：

[Unit]
Description=Xray Service
After=network.target
[Service]
User=root
WorkingDirectory=/usr/local/etc/xray
ExecStart=/usr/local/bin/xray run -config /usr/local/etc/xray/config.json
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target
✔ 关键点是：User=root
Reality + VLESS + XTLS 需要权限 读取 config.json、绑定 端口等。

2）重新加载 systemd 服务

systemctl daemon-reload

3）启动 Xray

systemctl restart xray

4）查看状态

systemctl status xray -l
此时应该正常运行。
```

# 二、客户端
## 1. Windows 上用 v2rayN 配置
```bash
  1. 在 Windows 上下载并安装 v2rayN（最新版）。
  2. 打开 v2rayN → 右键托盘图标 → “从剪贴板导入 URL” 或 “添加[VLESS]服务器”。
手动添加方式
在 “添加 VLESS 服务器” 界面里对应填写：
  • 地址：你的服务器IP
  • 端口：你的端口
  • 用户 ID（UUID）：填你的 UUID
  • 额外 ID：0
  • 加密方式：none
  • 传输协议：tcp
  • 传输层加密：选择 reality
  • Flow：xtls-rprx-vision
Reality 相关选项：
  • ServerName / SNI：www.cloudflare.com
  • PublicKey：填你 config.json 里的 publicKey
  • ShortId：填你 shortIds[0]
  • Fingerprint：选 chrome
  • SpiderX：一般填 / 或留空
保存后，在 v2rayN 里：
  • 右键那一行节点 → 设为活动服务器
  • 再右键托盘图标 → 打开系统代理 / 全局模式
  • 浏览器访问 https://ipinfo.io / https://ipleak.net / https://ip.gs 看 IP 是否变成你的服务器。
```

## 2. Android 客户端（NekoBox / v2rayNG）
```bash
以 NekoBox 为例（v2rayNG 类似）：
  1. 在手机上安装 NekoBox。
  2. 打开 → 点击右下角 + → 选择 手动添加 / VLESS。
  3. 按照同样字段填写：
  • 地址：你的服务器IP
  • 端口：你的端口
  • ID：你的 UUID
  • 加密：none
  • 传输协议：tcp
  • 流控 / Flow：xtls-rprx-vision
  • TLS 类型：选择 Reality
  • SNI / ServerName：www.cloudflare.com
  • PublicKey：你的 publicKey
  • ShortId：你的 shortId
  • Fingerprint：chrome
保存后，点这个节点连接即可。
```

## 3. iOS 客户端（Shadowrocket / Stash）
```bash
以 Shadowrocket 为例：
  1. 安装 Shadowrocket。
  2. “配置” → 添加节点 → 类型选 VLESS。
  3. 填写：
  • 服务器：你的服务器IP
  • 端口：你的端口
  • UUID：你的 UUID
  • 加密：none
  • 传输协议：tcp
  • Flow：xtls-rprx-vision
  • TLS：开启 → 类型选 Reality
  • SNI：www.cloudflare.com
  • PublicKey：你的 publicKey
  • ShortId：你的 shortId
  • Fingerprint：chrome
保存后，选择该节点 → 打开总开关测试。
```

## 4. 快速检查连不连得上
```bash
 1. 确认服务器上 Xray 正在跑：

systemctl status xray
看到 active (running) 就行。
  2. 在本地客户端连上后，看 Xray 日志：

journalctl -u xray -f
如果有类似 accepted tcp:...、reality: handshake ok 之类的日志，说明已经有人连进来了。
```
 
# 三、关系
| 名称             | 本质是什么                   | 地位/关系                                   |
| -------------- | ----------------------- | --------------------------------------- |
| **VPN**        | 一类技术                    | 最大的概念（泛指虚拟专网）                           |
| **OpenVPN**    | 一种 VPN 协议 + 软件          | 比较传统，被识别率高                              |
| **V2Ray/Xray** | 一个代理内核（平台）              | 提供多协议的代理框架（VMess、VLESS、Trojan、Reality…） |
| **REALITY**    | Xray 里的一种“隐身技术”+ 传输伪装方式 | 是 **VLESS 协议的高级外套**                     |
| **v2rayN**     | Windows 客户端（图形界面）       | 用来操作 Xray/V2Ray 配置                      |
