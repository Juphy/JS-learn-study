### git status
显示工作目录和缓存区的状态，可以看到哪些更改被缓存了，那些没有，以及那些还未被GIT追踪。基本上就是git add和git commit的进展。status信息还包括了添加缓存和移除缓存的相关指令。
```
# On branch master
# Changes to be committed:
# (use "git reset HEAD <file>..." to unstage)
#
# modified: hello.py
#
# Changes not staged for commit:
# (use "git add <file>..." to update what will be committed)
# (use "git checkout -- <file>..." to discard changes in working directory)
#
# modified: main.py
#
# Untracked files:
# (use "git add <file>..." to include in what will be committed)
#
# hello.pyc
```
> 忽略文件
 
未追踪的文件通常有两类：它们要么是项目新增但还未提交的文件，要么是像`.pyc`，`.obj`，`.exe`等编译后的二进制文件，显然前者应该出现在git status的输出中，而后者会让我们困惑。

因此，Git允许你完全忽略这些文件，只需要将路径放在一个特定的`.gitignore`文件中，所有想要忽略的文件应该分别卸载单独一行，`*`字符用作通配符。比如，将下面这行加入项目根目录的`.gitignore`文件可以避免编译后的Python模块出现在git status中。
`*.pyc`

> 

在提交更改前检查仓库状态，这样可以减少不必要的提交。
```
# Edit a.txt
git status

# a.txt is listed under "Changes not staged for commit"
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)
        modified:   a.txt
no changes added to commit (use "git add" and/or "git commit -a")

git add a.txt
git status

# a.txt is listed under "Changes to be commited"
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
        modified:   a.txt

git commit
git status
# nothing to commit(working directory clean)
On branch master
nothing to commit, working tree clean
```

### git log
显示已经提交的项目历史。log输出可以有很多中自定义的方式。
- git log: 使用默认格式显示出完整的项目历史，如果输出超出一屏，可以用空格键来滚动，按q退出。
- git log -n `<`limit`>`: 用`<`limit`>`限制提交的数量，比如`git log -n 3` 只会显示3个提交
- git log --oneline: 每个提交压缩到一行
- git log --stat: 除了git log信息之外，包含哪些文件被更改了，以及每个文件相对的增删行数。
- git log -p: 显示代表每个提交的一堆信息，显示每个提交全部的差异（diff），这也是项目历史中最详细的视图
- git log --author="`<`pattern`>`": 搜索特定作者的提交，pattern可以是字符串或者正则表达式
- git log --grep="`<`pattern`>`": 搜索提交信息匹配特定`<`pattern`>`的提交，pattern可以是字符串或正则表达式
- git log `<`since`>`..`<`until`>`: 只显示发生在since和until之间的提交，两个参数可以是提交ID、分支名、HEAD或是任何一种引用。
- git log `<`file`>`: 只显示包含特定文件的提交。查找特定文件的历史。
- git log --graph --decorate --oneline: --graph标记会绘制一幅字符组成的图形，左边是提交，右边是提交信息。--decorate 标记会加上提交所在的分支名和标签。--oneline 标记将提交信息显示在同一行，一目了然。

`git log`命令是Git查看项目历史的基本工具，
```
commit 3157ee3718e180a9476bf2e5cab8e3f1e78a73b7
Author: John Smith
```
commit 后面40个字符是提交内容的SHA-1校验总和（checksum）。它有两个作用：一是保证提交的正确性—如果它被破坏了，提交会生成一个不同的校验总和，二是提交唯一的标识ID。
这个ID可以用于git log这样的命令来引用具体的提交，比如，`git log 3157e..5ab91`会显示ID在`3157e`和`5ab91`之间的提交，除了校验总和之外，分支名、HEAD关键字也是常用的引用提交的方法。HEAD总是指向当前的提交，无论是分支还是特定提交。 

`~`用于表示提交的父节点的相对引用，比如，`3157e~1`指向`3157e`前一个提交，`HEAD~3`是当前提交的回溯3个节点的提交。

`git log`可以将很多选项用在同一个命令中，
```
git log --author="Jim Smith" -p hello.py
```