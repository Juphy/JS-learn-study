- docker ps -a 查看所有容器

```
CONTAINER ID      IMAGE                 COMMAND                  CREATED             STATUS                   PORTS                    NAMES
5f800920cb44      gxtrobot/bustag-app   "/app/docker/entry.sh"   4 hours ago         Up 47 minutes            0.0.0.0:8000->8000/tcp   epic_ellis
6335b39667de      hello-world           "/hello"                 4 hours ago         Exited (0) 4 hours ago                            cocky_kilby

0.0.0.0:8000->8000/tcp  Docker开放8000（后）映射到主机端口8000（前）上。
```

- docker start 6335b39667de 启动已停止运行的容器
- docker stop 6335b39667de 停止一个容器
- docker restart 6335b39667de

- docker run -d XXXX：`-d`参数默认不进入容器

- docker attach 6335b39667de: 进入某个容器，如果从这个容器退出（exit），会导致容器的停止
- docker exec -it 6335b39667de /bin/bash：进入某个容器，如果从这个容器退出（exit），不会导致容器的停止

- docker rm -f 6335b39667de：删除某个容器（删除容器时，容器必须是停止状态的）。

- docker port 6335b39667de：查看指定（ID 或名字）容器的某个确定端口映射到宿主主机的端口号

```
8000/tcp -> 0.0.0.0:8000
```

- docker logs `[ID或6335b39667de]`：查看容器内部的标准输出

  - -f：让 docker logs 像使用 tail -f 一样输出容器内部的标准输出

- docker top `[ID或6335b39667de]`：查看容器内部运行的进程。

- docker inspect `[ID]`：检查 Docker 的底层信息

- docker ps -l：查询最后一次创建的容器

- docker stats --help

- docker run -it ubuntu /bin/bash

  - -i：交互式操作
  - -t: 终端
  - ubuntu：ubuntu 镜像
  - /bin/bash：放在镜像名后的是命令，如果用的是交互式 Shell，使用/bin/bash

- docker images：列出主机上的镜像。 - REPOSITORY：表示镜像的仓库源 - TAG：镜像的标签 - IMAGE ID：镜像 ID - CREATED：镜像创建的时间 - SIZE：镜像的大小
  同一个仓库源可以有多个 TAG，代表这个仓库源的不同版本，如 ubuntu 仓库源里，有 15.10、14.04 等多个不同的版本，我们使用 REPOSITORY:TAG 来定义不同的镜像

```
docker run -t -i ubuntu:15.10 /bin/bash
-i：交互式操作
-t：终端
ubuntu:15.10：这里指用ubuntu15.10版本镜像为基础来启动容器
/bin/bash：放在镜像名后的是命令
```

- docker pull ubuntu:13.10 当我们在本地上使用一个不存在的镜像是 Docker 就会自动下载这个镜像。

- docker search xxx 搜索镜像

  - NAME: 镜像仓库源的名称
  - DESCRIPTION: 镜像的描述
  - OFFICIAL: 是否 docker 官方发布
  - stars: 类似 Github 里面的 star，表示点赞、喜欢的意思。
  - AUTOMATED: 自动构建。

- docker rmi hello-world 删除 hello-world 镜像
- docker commit 提交容器副本

```
docker commit -m"has update" -a="runboo" e218edb10161 runoob/ubuntu:v2
-m：提交的描述信息
-a：指定镜像作者
e218edb10161：容器ID
runoob/ubuntu:v2：指定要创建的目标镜像名
```

> 构建镜像

```
cat Dockerfile

FROM    centos:6.7
MAINTAINER      Fisher "fisher@sudops.com"
RUN     /bin/echo 'root:123456' |chpasswd
RUN     useradd runoob
RUN     /bin/echo 'runoob:123456' |chpasswd
RUN     /bin/echo -e "LANG=\"en_US.UTF-8\"" >/etc/default/local
EXPOSE  22
EXPOSE  80
CMD     /usr/sbin/sshd -D
```

每个指令都会在镜像上创建一个新的层。每个指令的前缀都必须是大写的，第一条 FROM，指定使用哪个镜像源

RUN 指令告诉 docker 在那个镜像内执行命令，安装了什么。

- docker build -t runoob/centos:6.7 .
    - -t：指定要创建的目标镜像名
    - .：Dockerfile文件所在目录。可以指定Dockfile的绝对路径
```
Sending build context to Docker daemon 17.92 kB
Step 1 : FROM centos:6.7
 ---&gt; d95b5ca17cc3
Step 2 : MAINTAINER Fisher "fisher@sudops.com"
 ---&gt; Using cache
 ---&gt; 0c92299c6f03
Step 3 : RUN /bin/echo 'root:123456' |chpasswd
 ---&gt; Using cache
 ---&gt; 0397ce2fbd0a
Step 4 : RUN useradd runoob
......
```
- docker run -t -i runoob/centos:6.7 /bin/bash：用新的镜像来创建容器
- id runboo：新的镜像查看用户
- docker tag 860c279d2fec runoob/centos:dev   docker tag 镜像ID（这里是860c279d2fec）用户名称 镜像源名:新的标签名（tag）

### Docker容器连接
- docker run -d -P training/webapp python app.py
    - -P：是容器内部端口随机映射到主机的高端口
    - -p：是容器内部端口绑定到指定的主机端口
    