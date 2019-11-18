### git switch
切换分支使用`git checkout <branch>`，而撤销修改则是`git checkout -- <file>`，同一个命令有两种作用，容易让人产生迷惑，因此，切换分支用`switch`更加科学，因此，最新版本的Git提供了新的`git switch` 命令来切换分支。
- git switch -c dev: 创建并切换到新的dev分支
- git switch master: 切换到master分支