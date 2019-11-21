下载安装 rclone

```
curl https://rclone.org/install.sh | sudo bash
```

- rclone config: 以控制会话的形式添加 rclone 的配置，配置保存在.rclone.conf 文件中
- rclone config file - 显示配置文件的路径，一般配置文件在 ~/.config/rclone/rclone.conf
- rclone config show - 显示配置文件信息

```
# 本地到网盘
rclone [功能选项] <本地路径> <网盘名称:路径> [参数] [参数] ...

# 网盘到本地
rclone [功能选项] <网盘名称:路径> <本地路径> [参数] [参数] ...

# 网盘到网盘
rclone [功能选项] <网盘名称:路径> <网盘名称:路径> [参数] [参数] ...
```

- rclone copy source:sourcepath dest:destpath：将文件从源复制到目的地址，跳过已复制完成的
- rclone ls(lsl) onedrive:文件夹名字(起始必须是挂载的文件夹)：显示所有文件（多显示上传时间）
- rclone lsd onedrive:文件夹名字(起始必须是挂载的文件夹)：只显示文件夹
- rclone lsf onedrive:文件夹名字(起始必须是挂载的文件夹)：显示指定路径下的文件夹和文件
- rclone mkdir onedrive:文件夹名称：新建文件夹
- rclone sync source:path dest:path: 将源数据同步到目的地址，只更新目的目录的数据
- rclone move source:path dest:path： 将源数据移动到目的地址，如果移动后删除空源目录，加上`--delete-empty-src-dirs`参数
- rclone delete： 删除指定路径下的文件内容。
- rclone purge： 清空指定路径下所有文件数据。
- rclone mkdir：创建一个新目录。
- rclone rmdir：删除一个空目录，不能删除非空的目录。
- rclone rmdirs：删除指定路径下的空目录。`--leave-root`，则不会删除根目录
- rclone check source:path dest:path： 检查源和目的地址数据是否匹配。`-size-only`
- rclone ls: 列出指定路径下所有的文件以及文件大小和路径。
- rclone lsd: 列出指定路径下所有的目录/容器/桶。
- rclone lsl: 列出指定路径下所有文件以及修改时间、文件大小和路径。
- rclone md5sum: 为指定路径下的所有文件产生一个 md5sum 文件。
- rclone sha1sum: 为指定路径下的所有文件产生一个 sha1sum 文件。
- rclone size: 获取指定路径下，文件内容的总大小。.
- rclone version: 查看当前版本。
- rclone cleanup: 清空 remote。
- rclone dedupe: 交互式查找重复文件，进行删除/重命名操作。

> 常用参数

- `-n`=`--dry-run`：测试运行，用来查看人 clone 在实际运行中会进行哪些操作
- `-p`=`--progress`: 显示实时传输进度
- `--cache-chunk-size SizeSuffi`: 块的大小，默认 5M，理论上是越大上传速度越快，同时占用内存也越多。如果设置的太大，可能会导致进程中断
- `--transfers=N` : 并行文件数，默认为 4。在比较小的内存的 VPS 上建议调小这个参数，比如 128M 的小鸡上使用建议设置为 1。
- `--config string`: 指定配置文件路径，string 为配置文件路径。比如在使用宝塔面板输入命令操作时可能会遇到找不到配置文件的问题，这时就需要指定配置文件路径。

> 日志

rclone 有 4 个级别的日志记录，ERROR，NOTICE，INFO 和 DEBUG。默认情况下，rclone 将生成 ERROR 和 NOTICE 级别信息。

- `-q` rclone 将仅生成 ERROR 消息。
- `-v` rclone 将生成 ERROR，NOTICE 和 INFO 消息，推荐此项。
- `-vv` rclone 将生成 ERROR，NOTICE，INFO 和 DEBUG 消息。
- `--log-level` LEVEL 标志控制日志级别。

> 输出日志到文件

使用 --log-file=FILE 选项，rclone 会将 Error，Info 和 Debug 消息以及标准错误重定向到 FILE，这里的 FILE 是你指定的日志文件路径。

```
rclone sync -v Onedrive:/DRIVEX Gdrive:/DRIVEX > "~/DRIVEX.log" 2>&1
```

> 文件过滤

- `--exclude` 排除文件或目录。比如 `--exclude *.bak`，排除所有 bak 文件。
- `--include` 包含文件或目录。比如 `--include *.{png,jpg}` ，包含所有 png 和 jpg 文件，排除其他文件。
- `--delete-excluded` 删除排除的文件。需配合过滤参数使用，否则无效。

> 目录过滤

- `--exclude .git/` 排除所有目录下的 .git 目录。
- `--exclude /.git/` 只排除根目录下的 .git 目录。
- 以/开头只会匹配根目录，而如果没有，则是匹配所目录。同样适用于文件。

> 文件大小过滤

默认大小单位为 kBytes ，但可以使用 k ，M 或 G 后缀。

- `--min-size` 过滤小于指定大小的文件。比如 `--min-size 50` 表示不会传输小于 50k 的文件。
- `--max-size` 过滤大于指定大小的文件。比如 `--max-size 1G` 表示不会传输大于 1G 的文件。

> 文件过滤规则

`--filter-from <规则文件>` 从文件添加包含 / 排除规则。比如 `--filter-from filter-file.txt`。
过滤规则文件示例：
```
- secret*.jpg
+ *.jpg
+ *.png
+ file2.avi
- /dir/Trash/**
+ /dir/**
- *
+ 是包含  - 是排除
```