---
title: openVPN
date: 2025-11-19 21:12:29
tags: [Linux, Ubuntu, RackNerd, VPN, OpenVPN, Forward Proxy]
category: VM
categories:
  - VM
cover: /img/vm/openVPN.png
published: true
comments: true
---

起止时间：11/2025 ~ 11/2025

技术栈：[Linux, Ubuntu, RackNerd, OpenVPN, Forward Proxy]

# 0. 前置条件
```bash
    • 服务器（Ubuntu）
    • 公网 IP：(你的ip)
    • 本地电脑已安装 OpenVPN 客户端
要实现：
    本地电脑流量 → OpenVPN → 服务器 → 访问互联网
```

# 1. 在服务器安装 OpenVPN 与 Easy-RSA
```bash
在 Ubuntu 上执行：

sudo apt update
sudo apt install openvpn easy-rsa -y
```

# 2. 创建 OpenVPN CA（证书授权）目录
```bash
make-cadir ~/openvpn-ca
cd ~/openvpn-ca
```

# 3. 配置 CA（证书生成参数）
```bash
编辑 vars 文件：

nano vars
加入（或修改）以下内容：

set_var EASYRSA_REQ_COUNTRY    "US"
set_var EASYRSA_REQ_PROVINCE   "California"
set_var EASYRSA_REQ_CITY       "LosAngeles"
set_var EASYRSA_REQ_ORG        "OpenVPN"
set_var EASYRSA_REQ_EMAIL      "admin@example.com"
set_var EASYRSA_REQ_OU         "Server"
保存后：


⭐ 正确的下一步操作（基于你现在的状态）
请复制下面命令执行：

1）初始化 PKI

./easyrsa init-pki

2）生成 CA（根证书）

./easyrsa build-ca
它会问你：
    • 输入 CA 的密码（随便一个你记得住的   这个密码会输入两次，在执行./easyrsa sign-req server server 会再次输入一次 ）这个密码客户端创建时会用到。
    • 输入证书的 Common Name（直接按回车，用默认就行）

3）生成服务器证书

./easyrsa gen-req server nopass
./easyrsa sign-req server server
系统会问你是否确认签名：
输入：yes
输入密码：
```

# 4. 生成 Diffie-Hellman（DH）参数
```bash
执行：

./easyrsa gen-dh
这一步可能要几十秒。
```


# 5. 生成 HMAC TLS-auth key
```bash
openvpn --genkey --secret ta.key
```

# 6. 将证书和密钥全部复制到 OpenVPN 配置目录
```bash
sudo cp pki/ca.crt /etc/openvpn/
sudo cp pki/issued/server.crt /etc/openvpn/
sudo cp pki/private/server.key /etc/openvpn/
sudo cp pki/dh.pem /etc/openvpn/dh2048.pem
sudo cp ta.key /etc/openvpn/
```
# 7. 创建 OpenVPN 服务端配置文件
```bash
sudo nano /etc/openvpn/server.conf
⭐ 完整 server.conf

port 1194
proto udp
dev tun

ca ca.crt
cert server.crt
key server.key
dh dh2048.pem

tls-auth ta.key 0
tls-version-min 1.2
cipher AES-256-GCM
auth SHA256

server 10.8.0.0 255.255.255.0
topology subnet


# 让所有流量走服务器
push "redirect-gateway def1 bypass-dhcp"

# 推荐的 DNS
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 8.8.8.8"

keepalive 10 120
persist-key
persist-tun

user nobody
group nogroup

status openvpn-status.log
verb 3


⭐ 保存步骤
在 nano 中按：

Ctrl + O   （写入）
回车
Ctrl + X   （退出）

配置说明（不用修改，了解即可）
配置	作用
port 1194	OpenVPN 默认端口
proto udp	最佳性能的协议
dev tun	使用 TUN 虚拟网络
server 10.8.0.0/24	VPN 内部网段
push "redirect-gateway def1"	
push DNS	客户端 DNS 走 VPN 服务器
tls-auth ta.key 0	增强安全，拒绝不明连接
cipher AES-256-GCM	高级加密
user nobody	降权运行，更安全
```

# 8. 启动 OpenVPN 服务
```bash
sudo systemctl start openvpn@server
2️⃣ 查看服务状态

sudo systemctl status openvpn@server
如果看见：

Active: active (running)
那就成功运行了！🎉

systemctl status openvpn@server 的查看模式（分页显示器），
这个界面是由 less 或 pager 控制的。
要退出它非常简单：
👉 按键： q
只要按下字母 q，就能退出分页查看状态，回到命令行。

🔥 常见的分页控制命令（你以后会用到）
操作	按键
退出（最重要）	q
向下翻一页	space
向上翻一页	b
向下移动一行	j 或 ↓
向上移动一行	k 或 ↑
搜索文本	/ 然后输入关键词
搜索下一个匹配	n
```

# 9. 生成客户端证书 
```bash
cd ~/openvpn-ca
./easyrsa build-client-full 证书名 nopass

Yes
密码
```

# 10. 创建 证书名.ovpn 客户端配置
```bash

nano 证书名.ovpn
在文件中粘贴以下内容👇：

⭐ 完整客户端配置（可直接粘贴）

client
dev tun
proto udp
remote 服务器ip 自定义端口
resolv-retry infinite
nobind
persist-key
persist-tun

remote-cert-tls server
cipher AES-256-GCM
auth SHA256
key-direction 1

<ca>
【这里放你刚才的 ca.crt 内容】
</ca>

<cert>
【这里放你的 证书名.crt 内容】
</cert>

<key>
【这里放你的 证书名.key 内容】
</key>

<tls-auth>
【这里放你的 ta.key 内容】
</tls-auth>

查看 CA：
cat /root/openvpn-ca/pki/ca.crt

查看 客户端证书：
cat /root/openvpn-ca/pki/issued/证书名.crt

查看 客户端私钥：
cat /root/openvpn-ca/pki/private/证书名.key

查看 ta.key：
cat /etc/openvpn/ta.key
```

# 11. 拓展_重新生成密钥
```bash
1️⃣ 重新生成客户端私钥

cd ~/openvpn-ca
./easyrsa revoke 证书名
./easyrsa gen-crl
2️⃣ 删除旧密钥& 旧密钥（如果存在）
执行前可以确认一下文件是否存在：

ls pki/issued/
ls pki/private/
然后删除它们：

rm -f pki/issued/证书名.crt
rm -f pki/private/证书名.key
rm -f pki/reqs/证书名.req
（-f 强制删除，不会报错）

3️⃣ 重新生成客户端证书

./easyrsa build-client-full 证书名 nopass
```

# 12. 处理无法上网
```bash
可以成功连接 VPN，但连接后无法上网，这个问题 不是客户端的问题，而是 服务器端 OpenVPN 转发 / NAT / 路由没有正确配置。
这是 OpenVPN 服务器端最常见的问题之一。

✅ 状况总结
    • OpenVPN Connect 显示 CONNECTED（已成功连接）
    • 有流量进出（图表有波动）
    • 但是客户端 无法访问任何网站，等于断网
    • 说明：
VPN 服务器没有正确转发 / NAT 出站流量
或
防火墙未允许转发的数据包
马上修复方法

✅ 1. 确认服务器开启 IP 转发（最重要）
SSH 到你的 VPN 服务器，执行：

sudo bash -c 'echo 1 > /proc/sys/net/ipv4/ip_forward'
然后永久开启：

sudo nano /etc/sysctl.conf
找到并修改：

net.ipv4.ip_forward=1
保存：

ctrl+o，回车，ctrl+x
加载配置：

sudo sysctl -p

✅ 2. 配置 NAT
RackNerd 默认不会自动 NAT，所以必须手动加 Masquerade。
执行：

sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -j MASQUERADE
非常重要：保存规则（否则重启就没了）

sudo apt install iptables-persistent -y
sudo netfilter-persistent save

✅ 3. 确认 OpenVPN server.conf 里有这两行
打开配置：

sudo nano /etc/openvpn/server.conf
确保有：

push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 1.1.1.1"
如果没有 → 添加进去。
保存后重启 OpenVPN：

sudo systemctl restart openvpn@server

✅ 4. 检查是否使用了正确的网卡名称（重要）
RackNerd 的网卡通常是：
    • eth0
    • 或 ens160
    • 或 venet0（OpenVZ 环境）
你的 NAT 命令不用指定网卡也行（MASQUERADE 会自动匹配）
但如果你服务器是 OpenVZ，需要改成：

sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

可以执行这个命令看看网卡名：
ip addr

🔥 你测试能否成功的方法
① 打开 CMD 执行：

curl ifconfig.me
如果显示：

服务器Ip
说明访问已经走 VPN。

② 访问 https://www.google.com
能打开 → 成功
不能打开 → NAT 或 DNS 还没设置好
```
