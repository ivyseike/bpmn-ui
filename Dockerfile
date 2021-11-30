FROM node:16-alpine as builder
# http-server 不变动也可以利用缓存
WORKDIR /code

ADD . /code
EXPOSE 8080
CMD npm run serve
## 选择更小体积的基础镜像
#FROM nginx:alpine
#COPY --from=builder /code/public /usr/share/nginx/html