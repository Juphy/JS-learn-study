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

### [Git 内部原理](http://iissnan.com/progit/html/zh/ch9_0.html)
在新的目录或已有目录下执行`git init`时，Git会创建一个.git目录，几乎所有Git存储和操作的内容都位于该目录下，如果要备份或复制一个仓库，基本上将这个目录拷贝至其他地方就可以了，该目录结构如下：
```
HEAD
branches/
config
description
hooks/
index
info/
objects/
refs/
```
该目录可能还有其他文件，新版本的Git不在使用branches目录，description文件仅供GitWeb程序使用，config文件包含项目特有的配置选项 ，info目录保存了一份不希望在.gitignore文件中管理的忽略模式（ignored patterns）的全局可执行文件。hooks目录保存了客户端或服务端钩子脚本。另外还有四个重要的文件和目录：
- objects 存储所有数据内容
- refs  存储指向数据（分支）的提交对象的指针
- HEAD 文件指向当前分支
- index 保存了暂存区域信息

#### Git对象
Git是一套内容寻址文件系统，Git从核心上来看不过是简单地存储键值对（key-value）。它允许插入任意类型的内容，并返回一个键值，通过该键值可以在任何时候取出该内容。可以通过底层命令hash-object来示范这一点，传一些数据给该命令，它会将数据保存在.git目录并返回表示这些数据的键值。
```
git init
find .git/objects
=>.git/objects
  .git/objects/info
  .git/objects/pack
find .git/objects -type f
=> 空     
```
git init初始化了objects目录，同时在该目录下创建了pack和info子目录，但是该目录下没有其他常规文件，往git数据库里存储一些文件
```
$ echo "text content" | git hash-object -w --stdin
d670460b4b4aece5915caf5c68d12f560a9fe3e4
```
-w 指示hash-object命令存储数据对象，若不指定这个参数该命令仅仅返回键值
--stdin 指定从标准输入设备（stdin）来读取内容，若不指定这个参数则需指定一个要存储的文件的路径。该命令输出长度为 40 个字符的校验和。这是个 SHA-1 哈希值──其值为要存储的数据加上你马上会了解到的一种头信息的校验和。现在可以查看到 Git 已经存储了数据：
```
$ find .git/objects -type f
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
```
这便是Git存储数据内容的方式——为每份内容生成一个文件，取得该内容与头信息的SHA-1校验和，创建以该校验和前两个字符为名称的子目录，并以（校验和）剩下38个字符为文件命名（保存至自目录下）。

`cat-file`命令可以将数据内容取回，传入  -p  参数可以让该命令输出数据内容的类型
```
git cat-file -p d670460b4b4aece5915caf5c68d12f560a9fe3e4
```

往Git中添加更多内容并取回了，也可以直接添加文件。
```
// 创建新文件，并把文件内容存储到数据库中
$ echo 'version 1' > test.txt
$ git hash-object -w test.txt
```
```
// 重新写入一些内容并再次保存
echo 'version 2' > test.txt
git hash-object -w test.txt
```
数据库中已经将文件中的两个新版本连同一开始的内容保存下来了：
```
find .git/objects -type f
=> .git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a    (version 2)
   .git/objects/83/baae61804e65cc73a7201a7252750c76066a30  （version  1）
   .git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
```
```
// 将文件恢复到第一个版本
git cat-file -p 83baae61804e65cc73a7201a7252750c76066a30 > test.txt
cat test.txt
=> version 1
```
```
// 将文件恢复到第二个版本
$ git cat-file -p 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a > test.txt
$ cat test.txt
=> version 2
```
*注意hash值的使用*，需要记住的是几个版本的文件SHA-1值，存储的并不是文件名而仅仅是文件内容，这种对象称为blob，通过传递SHA-1值给`cat-file -t`命令可以让Git返回任何对象的类型。
```
// 验证该hash下的文件类型
git cat-file -t 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a
=> blob
```

#### git cat-file
显示版本库对象的内容、类型及大小信息
```
git cat-file (-t [--allow-unknown-type] | -s [--allow-unknown-type] | -e | -p | <type> | --textconv | --filters) [--path=<path>] <object>
git cat-file (--batch | --batch-check) [ --textconv | --filters][--follow-symlinks]
```
在第一种形式中，该命令提供存储库中对象的内容或类型，类型是必需的，除非 -t 或 -p 用于查找的对象类型，或 -s 用于查找对象的大小，或 --textconv 或 --filters 使用（其暗示型“斑点”）。
在第二种形式中，在stdin上提供了一个对象列表（由换行符分隔），每个对象的SHA-1，类型和大小都打印在stdout上，使用可选`<`format`>`参数可以覆盖输出的格式，如果指定其中之一`--textconv`或者`--filters`。
- `<`object`>` 要显示的对象的名称
- `-t`  显示由`<`object`>`标识的对象类型而不是内容
- `-s`  显示由`<`object`>`的对象大小而不是内容
- `-e`  控制所有输出，如果对象存在且有效，命令结束状态返回值为0
- `-p`  根据对象的类型，以优雅的方式（Pretty-print）显示对象的内容
- `<`type`>`  通常情况下，它匹配`<`object`>`的实际类型，但是要求可以轻松从给定`<`object`>`取消引用的类型也是允许的。

#### tree对象
tree对象可以存储文件名，同时也允许存储一组文件，Git以一种类似UNIX文件系统但更简单的方式来存储内容。所有内容以tree或blob对象存储，其中tree对象对应于UNIX中目录，blob对象则大致对应与inodes或文件内容。一个单独的tree对象包含一条或多条tree记录，每一条记录含有一个指向blob或子tree对象的SHA-1指针，并附有该对象的权限模式、类型和文件名信息。
```
git cat-file -p master^{tree}
===>
100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib
```
master^{tree}表示的是master分支上最新提交指向的tree对象，lib子目录不是一个blob对象，而是一个指向另一个tree对象的指针。
```
git cat-file -p 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0
=> 该目录下的各文件或文件夹的权限模式、类型和文件名信息
```
Git根据你的暂存区域或index来创建并写入一个tree，因此要创建一个tree对象的话要通过将一些文件暂存从而创建一个index，可以使用plumbing命令update-index为单独文件——test.txt文件的第一个版本——创建一个index。通过该命令人为地将test.txt文件的首个版本加入到一个新的暂存区中。由于该文件原先并不在暂存区中(甚至就连暂存区域也还没被创建出来呢) ，必须传入 --add 参数;由于要添加的文件并不在当前目录下而是在数据库中，必须传入 --cacheinfo 参数。同时指定了文件模式，SHA-1 值和文件名：
```
git update-index --add --cacheinfo 100644 \
83baae61804e65cc73a7201a7252750c76066a30 test.txt
```
文件模式`100644`，表明这是一个普通文件，其它有用的模式有：`100755`表示可执行文件，`120000`表示符号链接。文件模式是从常规的UNIX文件模式中参考过来的，但是这三种模式只对Git中的文件（blobs）有效。

```
// write-tree命令将暂存区域的内容写到一个tree对象，无需 -w 参数——如果目标tree不存在，调用write-tree会自动根据index状态创建一个tree对象。
git write-tree
=> d8329fc1cc938780ffdd9f94e0d364e0ea74f579
git cat-file -p d8329fc1cc938780ffdd9f94e0d364e0ea74f579
=> 100644 blob 83baae61804e65cc73a7201a7252750c76066a30     test.txt
// 验证确实是一个tree对象
git cat-file -t d8329fc1cc938780ffdd9f94e0d364e0ea74f579
=> tree
```
根据test.txt的第二个版本以及一个新文件创建一个tree对象
```
echo 'new file' > new.txt
git update-index test.txt
git update-index --add new.txt
```
暂存区域中包含了test.txt的新版本以及一个新文件new.txt。创建（写）该tree对象（将暂存区域或index状态写入到一个tree对象）
```
git write-tree
=> 0155eb4229851634a0f03eb265b69f5a2d56f341
git cat-file -p 0155eb4229851634a0f03eb265b69f5a2d56f341
=> 100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
   100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt
```

该tree对象包含了两个文件记录，且test.txt的SHA值是最早值的“第二版”（1f7a7a）。把第一个tree对象作为一个子目录加进该tree中，可以用read-tree命令将tree对象读到暂存区域中区，在这时，通过传一个`--prefix`参数传给read-tree，将一个已有的tree对象作为一个子tree读到暂存区域中：
```
$ git read-tree --prefix=bak d8329fc1cc938780ffdd9f94e0d364e0ea74f579
$ git write-tree
=>  3c4e9cd789d88d8d89c1073707c3585e41b0e614
$ git cat-file -p 3c4e9cd789d88d8d89c1073707c3585e41b0e614
=> 040000 tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579      bak
   100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
   100644 blob 1f7a7a472abf3dd9643fd615f6da379c4acb3e3a      test.txt
```
如果从刚写入的新tree对象创建一个工作目录，将得到位于工作目录顶级的两个文件和一个bak的子目录，盖子目录包含了test.txt文件的第一个版本。
![当前Git数据的内容结构](https://wx1.sinaimg.cn/large/8b2b1aafly1g0n4xycdzxj20dw09fgm6.jpg)

#### commit 对象
tree对象，它们指向了你要追踪的项目的不同快照，可是必须记住三个SHA-1值以获得这些快照，但是没有关于谁、何时以及为何保存了这些快照的信息，commit对象为你保存了这些基本信息。要创建一个commit对象，使用commit-tree命令，指定一个tree的SHA-1，如果有任何前继提交对象，也可以指定。
```
// 第一个tree
echo "first commit" |  git commit-tree d8329f
=> 09ee0fd221d54947383d1686dead81ae7bfb676c

// cat-file 查看这个commit对象
git cat-file -p 09ee0f
=> tree d8329fc1cc938780ffdd9f94e0d364e0ea74f579
author Juphy <1571066810@qq.com> 1551411956 +0800
committer Juphy <1571066810@qq.com> 1551411956 +0800
```
commit 对象格式简单，指明了改时间点项目快照的顶层树对象、作者\提交者信息（从Git设置的user.name和user.email中获得）以及当前的时间戳、一个空行，以及提交注释信息。
```
// 写入另外两个commit对象，每一个都指定其之前的那个commit对象
echo "second commit" | git commit-tree 0155eb -p 09ee0f
=> 07adfdc255e7287a2706c272eb4245f001dde287
echo "third commit" | git commit-tree 3c4e9c -p 07adfd
=> f5a175698fc53498627ca589863bc94060c1734b
```
每一个commit对象都指定了你创建的树对象快照，现在已经有了真实的Git历史，运行`git log`命令并指定最后那个commit对象的SHA-1便可以查看历史。
```
git log --stat f5a175
=> 
commit f5a175698fc53498627ca589863bc94060c1734b
Author: Juphy <1571066810@qq.com>
Date:   Fri Mar 1 14:31:27 2019 +0800

    third commit

 bak/test.txt | 1 +
 1 file changed, 1 insertion(+)

commit 07adfdc255e7287a2706c272eb4245f001dde287
Author: Juphy <1571066810@qq.com>
Date:   Fri Mar 1 14:30:32 2019 +0800

    second commit

 new.txt  | 1 +
 test.txt | 2 +-
 2 files changed, 2 insertions(+), 1 deletion(-)

commit 09ee0fd221d54947383d1686dead81ae7bfb676c
Author: Juphy <1571066810@qq.com>
Date:   Fri Mar 1 11:45:56 2019 +0800

    first commit

 test.txt | 1 +
 1 file changed, 1 insertion(+)
```
这样就通过使用低级操作而不是那些普通命令创建了一个Git历史，这基本上就是运行 git add 和 git commit 命令时Git进行的功能工作——保存修改了的文件的blob，更新索引，创建tree对象，最后创建commit对象，这些commit对象指向了顶层tree对象以及先前的commit对象。这三类Git独享——blob、tree以及commit都各自以文件的方式保存在.git/objects目录下。

#### 对象存储
当存储数据内容时，同时会有一个文件头被存储起来。
通过Ruby脚本语言存储一个blob对象，使用irb命令进入Ruby交互模式：
```
$ irb
>> content = "what is up, doc?"
=> "what is up, doc?"
```
Git以对象类型为起始内容构造一个文件头，然后添加一个空格，接着是数据内容的长度，最后是一个空字节（null type）
```
header = "blob #{content.length}\0"
=> "blob 16\000"
```
Git将文件头与原始数据内容拼接起来，并计算拼接后的新内容的SHA-1校验和。
```
>> store = header + content
=> "blob 16\000what is up, doc?"
>> require 'digest/sha1'
=> true
>> sha1 = Digest::SHA1.hexdigest(store)
=> "bd9dbf5aae1a3862dd1526723246b20206e5fc37"
```
Git用zlib对数据内容进行压缩
```
>> require 'zlib'
=> true
>> zlib_content = Zlib::Deflate.deflate(store)
=> "x\234K\312\311OR04c(\317H,Q\310,V(-\320QH\311O\266\a\000_\034\a\235"
```
最后将zlib压缩后的内容写入磁盘，需要制定保存对象的路径（SHA-1值的头两个字符作为子目录名称，剩余38个字符作为文件名保存至该子目录中）。在 Ruby 中，如果子目录不存在可以用 FileUtils.mkdir_p() 函数创建它。接着用 File.open 方法打开文件，并用 write() 方法将之前压缩的内容写入该文件：
```
>> path = '.git/objects/' + sha1[0,2] + '/' + sha1[2,38]
=> ".git/objects/bd/9dbf5aae1a3862dd1526723246b20206e5fc37"
>> require 'fileutils'
=> true
>> FileUtils.mkdir_p(File.dirname(path))
=> ".git/objects/bd"
>> File.open(path, 'w') { |f| f.write zlib_content }
=> 32
```
所有的Git对象都以这种方式存储，唯一的区别是类型不同——除了字符串blob，文件头其实内容还可以是commit或tree。不过虽然blob几乎可以是任意内容，commit和tree的数据却是有固定格式的。

### git仓库.git文件太大
（暂时还没找到最好的解决办法）
产生的主要原因是提交了大文件导致，即使后面删除了，但是在git中记录了这些操作，并将之完整保存。
解决方案：使用git branch-filter来遍历git history tree，可以永久删除history中的大文件，达到让.git文件瘦身的目的。
```
// 识别出排在前5位的大文件
git verify-pack -v .git/objects/pack/pack-*.idx | sort -k 3 -g | tail -5
=> 
394e7ef18acb30aa8546bf1921383e1f51168888 blob   2407380 551569 2611677
1b43d0adbb73f661c39c2b2e806e900d387d0fb7 blob   2517307 2328094 19519911
105be7b587f3cc0dcc6d9ea159086df3780e73d8 blob   2585388 1795781 3683520
3e36eea2fc1ae172f2220074ed39469b2abed7fc blob   12294608 11375844 5796219
4de3af3e53c9295e5768a2d5d717e1d36edf4b3a blob   39361304 30242751 21848005
```

- du -d 1 -h  查看各个文件夹的大小
- du -ah 查看各个文件的大小
- find .git/objects -type f   列出.git中存储的所有的
- git count-objects -v 查看空间使用，size-pack 是以千字节为单位表示的packfiles的大小

