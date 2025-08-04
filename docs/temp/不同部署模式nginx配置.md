### 微应用集中式部署

文件树

```
├── container
│   └── index.html
└── microapps
    ├── microapp1
    │   └── index.html
    └── microapp2
        └── index.html
```

```nginx
server {
    listen 8080;
    server_name localhost;
    # 资源根目录
    root /opt/www/;

    error_page 404 /404.html; # 是否容器内处理

    # 基准访问  https://localhost:8080/
    location / {
        try_files $uri =404;
        # 兜底路由应该走container 的 index
        index container/index.html;
        add_header Cache-Control "no-cache";
    }

    # 微应用和容器访问 https://localhost:8080/microapps/microapp1
    location ~ ^/(microapps|container) {
        try_files $uri =404;
        index index.html;
    }

    # api 访问 https://localhost:8080/api/xxxx
    location /api {
        proxy_pass http://localhost:8081;
        # proxy_set_header Host $host;
        # proxy_set_header X-Real-IP $remote_addr;
        # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 微应用分布式部署

文件树

```
localhost:8081
└── microapps
    ├── microapp1
    │   └── index.html
    └── microapp2
        └── index.html

---- OR ----

localhost:8081
  └── index.html

```

```nginx
server {
  listen 8080;
  server_name distributed.microapps;
  root /opt/www/;

  location ^~ /scope1/(microapps|container) {
    # 代理到该微应用对应的地址
    proxy_pass http://localhost:8081;
    # 根据部署地址/目录，决定是否需要去除 scope1/microapps/container
    # rewrite ^/scope1/(microapps|container)(.*)$ /$1$2 break;
  }

  location ^~ /scope2/(microapps|container) {
    # 代理到微应用对应的地址
    proxy_pass http://localhost:8082;
    # 根据部署地址/目录，决定是否需要去除 scope2/microapps/container
    # rewrite ^/scope2/(microapps|container)(.*)$ /$1$2 break;
  }
}
```

### 多微前端项目的集中部署模式

```
/opt/www/
  ├── 404.html
  ├── app1
  │   ├── microapps
  │   │   ├── microapp1
  │   │   └── microapp2
  │   └── container
  └── app2
      ├── microapps
      │   ├── microapp1
      │   └── microapp2
      └── container
```

```nginx
server {
  listen 8080;  # 统一端口
  index index.html;
  gzip on;
  # 资源根目录
  root /opt/www/;

  error_page 404 /404.html;

  location / {
    # 默认规则  
  }

  # app1 项目的前端静态资源
  # 微应用和容器访问 https://localhost:8080/app1/microapps/microapp1
  location ~ ^/app1/(microapps|container) {
    # try_files $uri =404;
    # access_log off;
    # add_header Cache-Control "public, max-age=31536000";
  }

  # app2 项目的前端静态资源
  # 微应用和容器访问 https://localhost:8080/app2/microapps/microapp1
  location ~ ^/app2/(microapps|container) {
    # try_files $uri =404;
    # access_log off;
    # add_header Cache-Control "public, max-age=31536000";
  }

  # app1 项目的兜底路由
  # 微应用和容器访问 https://localhost:8080/app1/
  location /app1/ {
    try_files $uri /app1/container/index.html =404; 
    add_header Cache-Control "no-cache";
  }

  # app2 项目的兜底路由
  # 微应用和容器访问 https://localhost:8080/app2/
  location /app2/ {
    try_files $uri /app2/container/index.html =404; 
    add_header Cache-Control "no-cache";
  }

  # 接口请求转发
  location ~ ^/api? {
    proxy_pass http://localhost:8081;
  }
}
```
