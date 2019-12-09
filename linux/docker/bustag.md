### 使用docker运行
- 新建 bustag，以及子目录 data，data 目录用于保存配置文件以及下载数据的数据库
- 在 data 下需要建立一个文件 config.ini，该文件用于设置爬取的初始地址，以及每次下载的最大数量
- 运行命令

```
linux, mac
  docker run --rm -d -e TZ=Asia/Shanghai -e PYTHONUNBUFFERED=1 -v $(pwd)/data:/app/data -p 8000:8000 gxtrobot/bustag-app

windows powershell
  docker run --rm -d -e TZ=Asia/Shanghai -e PYTHONUNBUFFERED=1 -v ${PWD}/data:/app/data -p 8000:8000 gxtrobot/bustag-app

注：-e TZ=Asia/Shanghai，指的是docker container的时区设置，如果需要其他时区可自行设置，如果不设置默认为UTC时区
-e PYTHONUNBUFFERED=1，指的是显示所有log输出，如果不设置，那只能看到debug的错误log日志
```

### 如何使用项目
1.到达标页面进行打标，达到一定数量（喜欢+不喜欢），比如300
2.到其他页面训练模型
3.坐等系统自动推荐
4.在推荐页面进行确认（确认过的数据转为打标数据）
5.积累更多打标数据，再次训练模型，打标数据越多模型效果越好

data目录文件说明：
```
|__bus.db
|__config.ini
|__crontab.txt
|__model
|   |__label_binarizer.pkl
|   |__model.pkl
```
config.ini(系统配置文件，系统启动时需要此文件)
- root_path:制定bus网站主页地址，爬虫起始地址，由于地址可能变化，确保本机能够访问改地址，如果需要代理才能访问，必须开启全局代理，系统本身无代理设置
- count: 每次下载总数, 建议不要太多, 500以下比较好
- interval: 每次下载间隔时间, 单位为秒, 建议不要低于1800秒

bus.db(数据库文件)

crontab.txt(定时下载配置文件)

model目录