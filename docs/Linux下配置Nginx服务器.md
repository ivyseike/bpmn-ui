# Nginx 操作

```sh
#启动nginx服务
systemctl start nginx.service　

#设置开机启动
systemctl enable nginx.service

#重新启动服务（特别重要，每次修改配置都要重启服务）
systemctl restart nginx.service　

#停止开机启动
systemctl disable nginx.service

#查看服务当前状态
systemctl status nginx.service

#查看所有已启动的服务
systemctl list-units --type=service
```







# vue-router部署nginx刷新404问题与解决方案

## 1.问题：

使用Vue.js框架，利用vue-route结合webpack编写了一个单页路由项目，运维协助在服务器端配置nginx。部署完成后，访问首页没问题，再次刷新，就会出现404现象。

## 2.原因：

刷新页面时访问的资源在服务端找不到，因为vue-router设置的路径不是真实存在的路径。如上的404现象，是因为在nginx配置的根目录dist下面压根没有loading这个真实资源存在，这些访问资源都是在js里渲染的。

## 3.解决方案

 在nginx配置里添加vue-route的跳转设置（这里首页是index.html，如果是index.php就在下面对应位置替换），重定向到首页index下，这样就都能找到路由了。

正确配置如下： 

```
#nginx.config文件修改

         location / {
             try_files $uri $uri/ @router;
             index index.html;
         }

        location @router {
            rewrite ^.*$ /index.html last;
        }
```

