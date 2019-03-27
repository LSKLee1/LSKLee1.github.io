---

layout:     post
title:      "史上最全Jupyter Lab 配置"
subtitle:   " \"Jupyter Lab 你值得拥有的最强笔记本\" "
date:       2019-03-26 22:22:22
author:     "Reno"
header-img: "img/post-bg-fengsha.jpg"
catalog: true
tags:
    - Jupyter
    - Python
    - Programe



---

> 用了Jupyter Lab，所有IDE你都不会想再碰。

Jupyter notebook 有多好用还需要我说么？

但是更好用的Jupyter Lab 你也必须一试

## Jupyter Lab 简介

JupyterLab 是一个交互式的开发环境，是 Jupyter notebook 的下一代产品，集成了更多的功能，简直好用爆了好嘛。

使用 JupyterLab，你可以：

- 可以开启终端，用于交互式运行代码，完全支持丰富的输出
- 完美支持 Markdown，Python，R，Julia，LaTeX等任何文本文件
- 增强notebook功能
- 超多插件支持

## Jupyter Lab安装

首先，你应该先安装好了Python环境（[点我进入下载Python3.7](https://www.python.org/downloads/release/python-373rc1/)），这里不再赘述：

然后打开 cmd 命令行：

```python
# 下载jupyterlab
pip install jupyterlab
# 安装ipython
pip install ipython
```

 在使用 jupyterlab 时，可以设置一下密码，也可以不设，简单说一下：

```python
# 打开cmd，进入ipython交互环境
ipython
```

设置密码：

```python
from notebook.auth import passwd
passwd()
# 在这里输入想要设置的登录JupyterLab 的密码 然后会有一串输出，复制下来，等会配置需要使用
```

修改 JupyterLab 配置文件：

```python
jupyter lab --generate-config
```

修改以下配置：

```python
c.NotebookApp.allow_root = True
c.NotebookApp.open_browser = False
c.NotebookApp.password = '刚才复制的输出粘贴到这里来'
```

由于之后在下载Jupyter Lab 特别好用的插件时，会用到npm，所以要先下载好 node 环境。[Node官网](https://nodejs.org/zh-cn/)

接下来就是重头戏啦——安装插件：

## Jupyter Lab 插件安装

```python
# 安装一个生成目录的插件
jupyter labextension install @jupyterlab/toc
# 可以查看一下安装的插件
jupyter labextension list
```

安装完后，打开cmd，输入jupyter lab 进入Jupyter Lab界面。

点击 Settings --> Advanced Settings Editor ，将Extension Manager 里的enabled 的  false 改成 true（在右边的里面改），如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190326211529864.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTU3MTQ5Mw==,size_16,color_FFFFFF,t_70)
现在，看向界面左侧应该就可以看到一个插件管理的图标，点击就可以看到刚才安装的插件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190326211859188.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTU3MTQ5Mw==,size_16,color_FFFFFF,t_70)

这个插件还有查询功能，我们可以很方便的安装卸载插件，上面是已安装的插件，下面是可以安装的插件，安装完成后可以直接更新。

#### 主题字体设置
Setting --> Jupyter Lab Theme 
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019032621231637.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTU3MTQ5Mw==,size_16,color_FFFFFF,t_70)
如果你下载了字体插件，还可以更改字体大小和字体：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190326212441455.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTU3MTQ5Mw==,size_16,color_FFFFFF,t_70)
