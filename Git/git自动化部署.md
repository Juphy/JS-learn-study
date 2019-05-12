### Git远程仓库及代码部署

> 服务器端

- git init --bare xxxx.git  // 创建裸仓库
- cd xxx.git
- git --bare update-server-info
- git config core.bare false
- git config receive.denycurrentbranch ignore
- git config core.worktree /home/git/myCode/(存放代码的位置)
    ```
    如果git config 等操作报错：fatal: core.bare and core.worktree do not make sense.
    git -c core.bare=false config --unset core.bare
    ```

- cd hooks
- vi post-receive 写入以下代码
    ```
    git checkout -f 更新代码
    echo 'Restarting server:' （记录在面板的log文字）
    pm2 restart main
    echo 'Deployment Done'
    exit 0
    ```
> 客户端

- ssh-keygen -t rca -C "邮箱地址或者姓名"
    ```
    在~/.ssh/下生成id_rsa.pub，将其内容加入服务端，所登录user的文件下username/.ssh/authorized_keys
    ```
- git clone username@ip:/home/www/xxx.git 克隆代码到本地
- git remote add vps username@ip:/home/www/xxx.git 或者添加remote

- 正常push代码，就会触发hooks/post-receive中的操作
    ```
    可能会产生的错误：
    remote: fatal: Unable to create temporary file '/home/www/Server.git/./objects/pack/tmp_pack_XXXXXX': Permission denied
    error: remote unpack failed: index-pack abnormal exit

    主要是因为用户的权限不对：用root用户登录，
    chown username -R(遍历所有的文件及文件夹) xxx.git 修改所在文件的所有文件的用户
    ```
> git init 和git init --bare的区别

使用--bare选项时，不在生成.git目录，而是只生成.git目录下面的版本历史记录文件，这些版本历史记录文件也不再存放在.git目录下面，而是直接存放在版本库的根目录下面。

git init 初始化的版本库用户也可以在该目录下执行所有git方面的操作。但别的用户在将更新push上来的时候容易出现冲突。

git init –-bare 创建一个所谓的裸仓库，之所以叫裸仓库是因为这个仓库只保存git历史提交的版本信息，而不允许用户在上面进行各种git操作，如果你硬要操作的话，只会得到下面的错误（”This operation must be run in a work tree”）。

### Webhooks
