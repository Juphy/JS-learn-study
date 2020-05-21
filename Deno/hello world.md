### deno 的主要特性如下：

- 设计安全，除非明确允许，否则 deno 不能访问网络或文件系统
- Promise
- 没有 npm， deno 使用 URL 或文件路径来引入模块，与浏览器端高度相似
- 原生支持 TypeScript

### 如何安装 deno？

Mac 用户，可以使用 brew 安装：
`brew install deno`
Shell 用户可以使用：
`curl -fsSL https://deno.land/x/install/install.sh | SH`
Windows 用户可以使用 PowerShell:
`iwr https://deno.land/x/install/install.ps1 -useb | iex`
