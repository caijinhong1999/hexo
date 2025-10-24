---
title: 如何从0搭建自己的网站
date: 2025-10-24 18:38:42
tags: [hexo, async, npm, nodejs, racknerd, namecheap, docker, nginx, linux]
category: IT
categories:
  - IT
cover: /img/it/personal_website_hexo.png
comments: true
---

> 想要搭建一个自己的网站是从2021年有的这个想法，当时毕设获得优秀毕业论文，唯一缺点就是软件没有上线。后面三年JAVA全栈工作，每天忙的昏天黑地，技术确实得到极大提升，但内心深度的声音也愈发清晰，我的理想是什么？我是要做机器人的，现在的软件开发只是当时最靠近AI的一个选择，，，于是我2024年辞职，来UNSW攻读AI硕士。
硕士一方面提升我的学识，另一方面也给我充足时间让我探索自我，我需要一个展示自我的平台，于是这个网站成立了, 现在把整个搭建流程分享，希望对大家有帮助~

# 1. 网站搭建
参考这两篇
https://hexo.io/zh-cn/
![personal_website_hexo](/img/it/personal_website_hexo.png)
https://hexo-theme-async.imalun.com/
![personal_website_async](/img/it/personal_website_async.png)
# 2. 申请服务器
https://www.racknerd.com/
![personal_website_racknerd](/img/it/personal_website_racknerd.png)
racknerd经常有活动，点这个10$/year就行
# 3. 申请域名
https://www.namecheap.com/domains/
![personal_website_namecheap](/img/it/personal_website_namecheap.png)
namecheap申请可以多次选择，有很多域名4$/year左右，价格美丽~
申请号后记得在dashboard绑定服务器ID

# 4. 配置nginx

1) 基础环境 & Nginx
## 1. 更新系统，安装必备软件：Nginx、Git、Node.js 20
apt-get update && apt-get -y upgrade
## 安装 Nginx 和 Git
apt-get -y install nginx git curl
## 安装 Node.js 20（官方源）
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get -y install nodejs
## 可选：把时区设为悉尼（按需）
timedatectl set-timezone Australia/Sydney
## 启动并设置 Nginx 开机自启
systemctl enable --now nginx

2) 拉取你的 Hexo 源码并构建静态文件
## 2.1 放到 /opt 目录下
cd /opt
## 2.2 克隆你的仓库（用你给的公开地址）
git clone （你的仓库地址） hexo-site
cd /opt/hexo-site
## 2.3 安装依赖并生成静态文件（public/）
npm install
npx hexo generate  # 简写：npx hexo g
  生成后，静态文件都在 /opt/hexo-site/public/。

3) 拷贝静态文件到 Web 根目录
## 3.1 创建网站根目录
mkdir -p /var/www/hexo
## 3.2 将 public/ 同步到网站根目录（--delete 会删除多余文件，保证一致）
rsync -av --delete /opt/hexo-site/public/ /var/www/hexo/
## 3.3 设置给 Nginx 用户
chown -R www-data:www-data /var/www/hexo

4) 配置 Nginx 站点
## 4.1 写入站点配置 /etc/nginx/sites-available/hexo
cat >/etc/nginx/sites-available/hexo <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
root /var/www/hexo;
    index index.html;
location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
## 4.2 启用站点并关闭默认站点
ln -sf /etc/nginx/sites-available/hexo /etc/nginx/sites-enabled/hexo
rm -f /etc/nginx/sites-enabled/default
## 4.3 检查配置并重载
nginx -t && systemctl reload nginx
现在在浏览器访问：
**http://（你的 VPS IP）**（
应该能看到 Hexo 首页 🎉

5) 一键更新脚本（可选，方便以后更新）
以后你改了仓库内容，想重新部署，只需执行一个脚本：
## 5.1 创建部署脚本
cat >/usr/local/bin/deploy-hexo.sh <<'EOF'
#!/usr/bin/env bash
set -e
cd /opt/hexo-site
git pull
npm install
npx hexo generate
rsync -av --delete public/ /var/www/hexo/
chown -R www-data:www-data /var/www/hexo
systemctl reload nginx
echo "Deploy done."
EOF
## 5.2 赋予执行权限
chmod +x /usr/local/bin/deploy-hexo.sh
以后只要执行：
/usr/local/bin/deploy-hexo.sh
就会自动拉取、构建并同步上线 ✅

6) 绑定域名（可选）
  • 在你的域名 DNS 里添加 A 记录 → 指向 （你的服务器ID）
  • 把 Nginx 配置里的 server_name _; 改为你的域名，例如：
server_name blog.your-domain.com;
  • nginx -t && systemctl reload nginx


🚀 下一步：运行 Certbot 获取 HTTPS 证书
等大约 10–20 分钟后（或你能用浏览器访问 (你的域名) 时），
在你的 VPS 上执行以下命令：

sudo certbot --nginx
当出现：

Please enter the domain name(s) you would like on your certificate:
就输入：

（你的域名）
然后一路确认即可（Y / Yes）。
Let’s Encrypt 会自动帮你：
  • 验证域名所有权；
  • 配置 Nginx HTTPS；
  • 自动重启服务；
  • 设置定时自动续期任务。

✅ 完成后验证
访问：
  • （你的域名）
  • （你的域名）
如果显示绿色小锁 🔒
说明你的博客现在已经全球可访问、并启用了加密连接。



# 5. 开启评论区

方案① Docker + Docker Compose 一步部署 Twikoo + MongoDB
这是零成本、最省心、最快速的方式。
下面是完整步骤👇

🔹 Step 1：安装 Docker 与 Docker Compose
在 Ubuntu 终端执行：

sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
验证是否安装成功：

docker -v
docker-compose -v

🔹 Step 2：创建部署目录

sudo mkdir -p /srv/twikoo
cd /srv/twikoo

🔹 Step 3：创建 docker-compose.yml

version: '3'
services:
  mongodb:
    image: mongo:latest
    container_name: mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - ./mongo_data:/data/db
twikoo:
    image: imaegoo/twikoo
    container_name: twikoo
    restart: always
    ports:
      - "8080:8080"
    environment:
      - TWIKOO_PORT=8080
      - TWIKOO_MONGODB_URI=mongodb://mongodb:27017/twikoo
    depends_on:
      - mongodb

🔹 Step 4：启动服务

sudo docker-compose up -d
查看容器是否启动成功：

sudo docker ps

🔹 Step 5：测试后端是否运行
在浏览器访问：

http://<你的服务器IP>:8080
正常情况下会显示：

Twikoo service is running.

🔹 Step 6：配置 Nginx 反向代理 + HTTPS
(1) 新建反向代理配置文件
路径：/etc/nginx/sites-available/twikoo.conf
内容如下：

server {
    listen 80;
    server_name （你的后端域名，不是之前的前端域名，这个域名可以在namecheap之前申请的域名下面添加，不需要额外付费）
location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
(2) 启用配置

sudo ln -s /etc/nginx/sites-available/twikoo.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
(3) 配置 HTTPS（如果你有证书）
如果你已经申请了证书（比如使用 certbot）：

sudo certbot --nginx -d （你的后端域名）
certbot 会自动修改配置为 HTTPS。

🔹 Step 7：在 Hexo 中配置评论后端
在 _config.async.yml 中加入：

comments:
  enable: true
  type: twikoo
  envId: （你的后端域名）
保存后：

hexo clean && hexo g && hexo s
打开文章页，底部应出现 Twikoo 评论框。


# 6. 解决CORS问题
关键提示是：

Access to XMLHttpRequest at '（你的后端域名）' 
from origin '你的前端域名）' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The 'Access-Control-Allow-Origin' header contains the invalid value ''.
也就是说你的服务器返回的 Access-Control-Allow-Origin 是空字符串（''），浏览器直接拦截了。
这说明：你的 Nginx 配置里的 $cors_origin 变量判断没匹配成功，所以为空。


sudo nano /etc/nginx/sites-available/twikoo.conf    (下面的内容)
sudo nginx -t
sudo nginx -s reload
用两条 curl 分别测带/不带 www：

curl -i -X OPTIONS -H "Origin: （你的前端域名）" \
  -H "Access-Control-Request-Method: POST" （你的后端域名）
curl -i -X OPTIONS -H "Origin: （你的前端域名）" \
  -H "Access-Control-Request-Method: POST" （你的后端域名）




server {
    if ($host = （你的后端域名）) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name （你的后端域名）;
    return 301 https://$host$request_uri;


}

server {
    listen 443 ssl;
    server_name （你的后端域名）;
    ssl_certificate /etc/letsencrypt/live/（你的后端域名）/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/（你的后端域名）/privkey.pem; # managed by Certbot


    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 隐藏上游（Twikoo）自带的 CORS header，避免重复
        proxy_hide_header Access-Control-Allow-Origin;


        # ===== CORS for （你的后端域名） & local debug =====
        set $cors_origin "";
        if ($http_origin ~* ^https?://(localhost(:\d+)?|127\.0\.0\.1(:\d+)?|（你的后端域名）)$) {
          set $cors_origin $http_origin;
        }

        add_header Access-Control-Allow-Origin $cors_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Vary Origin always;

        # 预检请求直接放行
        if ($request_method = OPTIONS) {
          return 204;
        }
        # ===== end CORS =====

    }

}

# 欢迎大家有问题评论区留言~

<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.38/dist/twikoo.all.min.js"></script>
<script>twikoo.init({el: '#twikoo',envId: 'https://comment.jinhongcai.work'})</script>

