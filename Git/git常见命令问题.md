### git相关命令
- ls -a(-all) ~/.ssh    列出.ssh目录中的文件
    - 公钥的文件名是以下之一：\
      id_dsa.pub\
      id_ecdsa.pub\
      id_ed25519.pub\
      id_rsa.pub
- cat ~/.ssh/id_rsa.pub 查看当前的ssh密钥
- ssh-keygen -t rsa -C "your_email@example" 创建新的ssh密钥


- git remote set-url 原连接名 新的连接  修改连接地址
- git config --list 查看所有的config配置

- error: GH007:Your push would publish a private email address. 由于设置邮箱为隐私邮箱，解决方法：
  - 1.在github上的settings=>Emails=>Keep my email address private去掉勾选
  - 2.命令行中配置邮箱为 username@users.noreply.github.com   `git config --global user.email 'username@users.noreply.github.com'`

- ssh: connect to host `gitlab.huayingjuhe.com` port 22: Connection timed out
fatal: Could not read from remote repository.

  原因可能是防火墙修改，导致网路无法连接。如果是超时这种情况使用http协议而不是ssh这种方式，只需要将配置文件的url更改为http。
  - ssh -T git@github.com  检查网络连接
  - git config --local -e 直接修改git的配置文件，将url=git@github.com:username/repo.git修改为url=`https://github.com/username/repo.git`
  - git config --global url."http://github.com/".insteadOf git@github.com:

>  WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED! (远程连接服务异常)
```
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:DY4p81gRCppTGt4f+3882AUe7wmG7BUIGFRmiF1Bypg.
Please contact your system administrator.
Add correct host key in /c/Users/Juphy/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /c/Users/Juphy/.ssh/known_hosts:2
ECDSA host key for 58.87.114.124 has changed and you have requested strict checking.
Host key verification failed.
```
由于中间有一句"Add correct host key in /c/Users/Juphy/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /c/Users/Juphy/.ssh/known_hosts:2"，执行
vi ~/.ssh/known_hosts将第二行删掉。

### github不允许100MB大文件上传
- 如果大文件是最近一次commit的，还没有push
  - 1.在.gitignore中忽略你需要忽略的文件的名字（跟忽略一般文件一样）
  - 2.从本地仓库移除掉大文件 git rm --cached 文件名（要移除的文件）
  - 3.提交操作： git commit --amend -CHEAD

- 突破github限制，支持单个文件超出100M
  - 1.安装[GIT LFS](https://git-lfs.github.com/)
  - 2.git lfs install（设置一次即可）
  - 3.git lfs track "*.pdf" 跟踪一下要push的大文件的文件名或者文件类型，还可以直接编辑.gitattributes文件
  - 4.设置完毕就可以正常的add，commit，push
  
### Git Bash下载单个文件夹
```
mkdir 文件夹名称
cd 文件夹名称
git init   // 创建空仓库
git remote add -f origin git仓库地址(https或者ssl)   // 连接远程仓库
git config core.sparsecheckout true   // 开启sparse checkout模式
echo  git仓库的文件夹  >>  .git/info/sparse-checkout  （这里的工作目录就是那个repo下的，如果还想要其他目录，可以继续加入，但是加入的目录应该在远程仓库存在，否则会报错"error: Sparse checkout leaves no entry on the working directory"）
git pull origin master
```

### 本地代码与线上代码不一致
- Repository is not clean.  Please commit or stash any changes before updating. 
- Please commit your changes or stash them before you merge.error: Your local changes to the following files would be overwritten by merge.
解决方法：
```
git reset --hard  // 将当前的工作目录重置
git pull origin master // 拉取远程更新到本地
```
```
git stash   // save uncommited changes 将本地未提交的修改暂存
git pull origin master
git stash pop
```

### .gitignore
- ?：代表任意字符
- *：代表任意数目的字符
- {!ab}：必须不是此类型
- {ab,bb,cx}：代表ab、bb、cx中任一类型即可
- `[`abc`]`：代表a、b、c中任一字符即可
- `[`^abc`]`：代表必须不是a,b,c中任一字符
