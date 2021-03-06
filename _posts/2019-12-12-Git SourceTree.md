---
layout: post
title: "Sourcetree & Git 部分名词解释"
subtitle: "Sourcetree & Git 部分名词解释"
author: "Reno"
header-img: "img/post-bg-optimization.jpg"
header-mask: 0.4
catalog: true
tags:
  - Git
  - SourceTree
---

### Sourcetree & Git 部分名词解释

1.克隆(clone)：从远程仓库URL加载创建一个与远程仓库一样的本地仓库
2.提交(commit)：将暂存文件上传到本地仓库（我们在Finder中对本地仓库做修改后一般都得先提交一次，再推送）
3.检出(checkout)：切换不同分支
4.添加（add）：添加文件到缓存区
5.移除（remove）：移除文件至缓存区
6.暂存(git stash)：保存工作现场
7.重置(reset)：回到最近添加(add)/提交(commit)状态
8.合并(merge)：将多个同名文件合并为一个文件，该文件包含多个同名文件的所有内容，相同内容抵消
9.抓取(fetch)：从远程仓库获取信息并同步至本地仓库
10.拉取(pull)：从远程仓库获取信息并同步至本地仓库，并且自动执行合并（merge）操作，即 *pull=fetch+merge* 
11.推送(push)：将本地仓库同步至远程仓库，一般推送（push）前先拉取（pull）一次，确保一致
12.分支(branch)：创建/修改/删除分枝
13.标签(tag):给项目增添标签
14.工作流(Git Flow):团队工作时，每个人创建属于自己的分枝（branch），确定无误后提交到master分枝
15.终端(terminal):可以输入git命令行

### 用git命令的话 开发中按照以下步骤进行代码提交

0.cd命令进入项目目录然后如下

\1. 修改完代码后，git status查看自己的文件修改列表；

\2. git diff <文件名> 查看自己的文件修改记录；

\3. git add <文件名> 添加需要提交的文件列表；

\4. git commit -m "提交说明"

\5. git pull，更新一下当前最新的代码；

\6. git push 提交代码