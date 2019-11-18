- git diff `<`filename`>`:  查看文件在工作目录与暂存区的差别，就是还没add进暂存区，则查看文件自身修改前后的差别
- git diff `<`branch`>`  ` <`filename`>`:  查看另一个分支该文件的区别
- git diff --cached `<`filename`>`: 查看已经add进暂存区但是尚未commit的内容同最新一次commit时的内容的差异
- git diff --cached `<`commit`>`  `<`filename`>`: 指定仓库版本查看查看已经add进暂存区但是尚未commit的内容同最新一次commit时的内容的差异
- git diff `<`commit`>`  `<`filename`>`: 查看工作目录同Git仓库指定commit的内容的差异，commit是HEAD时，查看工作目录用最近一次commit的内容的差异。
- git diff `<`commit`>`  `<`commit`>`: Git仓库任意commit之间的差别

以上命令都可以不指定`<`filename`>`，则对全部文件操作；以上命令涉及和Git仓库对比的，均可以指定commit的版本，commit版本如下：
- `HEAD`最近一次commit
- `HEAD^`上一次提交
- `HEAD~100`上100次提交
- 每次提交产生的哈希值