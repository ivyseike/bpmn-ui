# Docker-compose部署应用

# 安装

```bash
#下载
sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# 添加权限
sudo chmod +x /usr/local/bin/docker-compose
# 测试
$ docker-compose --version

```

或者使用`pip`安装

```bash
sudo pip install docker-compose
```

# 部署

```bash
cd ./docker-compose
docker-compose up -d
```





