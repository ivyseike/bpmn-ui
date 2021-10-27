# Nginx ����

```sh
#����nginx����
systemctl start nginx.service��

#���ÿ�������
systemctl enable nginx.service

#�������������ر���Ҫ��ÿ���޸����ö�Ҫ��������
systemctl restart nginx.service��

#ֹͣ��������
systemctl disable nginx.service

#�鿴����ǰ״̬
systemctl status nginx.service

#�鿴�����������ķ���
systemctl list-units --type=service
```







# vue-router����nginxˢ��404������������

## 1.���⣺

ʹ��Vue.js��ܣ�����vue-route���webpack��д��һ����ҳ·����Ŀ����άЭ���ڷ�����������nginx��������ɺ󣬷�����ҳû���⣬�ٴ�ˢ�£��ͻ����404����

## 2.ԭ��

ˢ��ҳ��ʱ���ʵ���Դ�ڷ�����Ҳ�������Ϊvue-router���õ�·��������ʵ���ڵ�·�������ϵ�404��������Ϊ��nginx���õĸ�Ŀ¼dist����ѹ��û��loading�����ʵ��Դ���ڣ���Щ������Դ������js����Ⱦ�ġ�

## 3.�������

 ��nginx���������vue-route����ת���ã�������ҳ��index.html�������index.php���������Ӧλ���滻�����ض�����ҳindex�£������Ͷ����ҵ�·���ˡ�

��ȷ�������£� 

```
#nginx.config�ļ��޸�

         location / {
             try_files $uri $uri/ @router;
             index index.html;
         }

        location @router {
            rewrite ^.*$ /index.html last;
        }
```

