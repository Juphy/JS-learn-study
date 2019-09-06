### 防火墙相关概念
- 从逻辑上讲。防火墙可以大体分为主机防火墙和网络防火墙。
    - 主机防火墙：针对于单个主机进行防护。
    - 网络防火墙：往往处于网络入口或边缘，针对于网络入口进行防护，服务于防火墙背后的本地局域网。
    - 网络防火墙和主机防火墙并不冲突，可以理解为，网络防火墙主外（集体）， 主机防火墙主内（个人）。
- 从物理上讲，防火墙可以分为硬件防火墙和软件防火墙。
    - 硬件防火墙：在硬件级别实现部分防火墙功能，另一部分功能基于软件实现，性能高，成本高。
    - 软件防火墙：应用软件处理逻辑运行于通用硬件平台之上的防火墙，性能低，成本低。

iptables并不是真正的防火墙，它只相当于一个客户端代理，通过iptables代理，将用户的安全设定执行到对应的安全框架中，这个安全框架才是真正的防火墙，这个框架是netfilter。

netfilter才是防火墙的真正的安全框架，netfilter位于内核空间，iptables其实是一个命令行工具，位于用户空间，我们用这个工具操作真正的框架。

netfilter/iptables组成Linux平台下的包过滤防火墙，Netfilter是Linux操作系统核心层内部的一个数据包处理模块，它具有如下的功能：
- 网络地址转换
- 数据包修改
- 数据包过滤的防火墙功能

### iptables基础
iptables是按照规则来办事的，规则其实就是网络管理员预定义的条件，规则一般的定义为"如果数据包头符合这样的条件，就这样处理这个数据包"。规则存储在内核空间的信息包过滤表中，这些规则分别指定了源地址、目的地址、传输协议（如TCP、UDP、ICMP）和服务类型（如HTTP、FTP和SMTP）等。当数据包与规则匹配时，iptables就根据规则所定义的方法来处理这些数据包，如放行（accept）、拒绝（reject）和丢弃（drop）等。配置防火墙的主要工作就是添加、修改和删除这些规则。


### iptables相关操作
- iptables -L -n   查看本机关于iptables的设置情况
```
Chain INPUT (policy DROP)
target     prot opt source               destination         
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:3306
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:80
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:21
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpts:20000:30000
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:443
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0            icmptype 8

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination         

Chain syn-flood (0 references)
target     prot opt source               destination         
```
如果没有启动防火墙，就什么规则都没有。
- iptables -F 清除预设表filter中的所有规则链的规则
- iptables -X 清除预设表filter中使用者自定链中的规则