---
layout:     post
title:      "Seaborn 的示例数据集（load_dataset）"
subtitle:   " 你的 \"Seaborn\" "
date:       2019-01-29 18:15:38
author:     "Reno"
header-img: "img/post-bg-seaborn.jpg"
catalog: true
tags:
    - Python
    - Machine Learning


---

## Seaborn 的示例数据集（load_dataset）

相信大家在学习GroupBy，或者数据透视表时，都有可能会碰到类似下面的一行代码：

```python
import seaborn as sns
planets = sns.load_dataset('planets')
```

然后就可以发现planets已经存储了数据了，那么这些数据到底是从哪里来的呢？

我们查看一下load_dataset的docstring：

```python
In [54]: sns.load_dataset??
Signature: sns.load_dataset(name, cache=True, data_home=None, **kws)
Source:
def load_dataset(name, cache=True, data_home=None, **kws):
    """Load a dataset from the online repository (requires internet).
    Parameters
    ----------
    name : str
        Name of the dataset (`name`.csv on
        https://github.com/mwaskom/seaborn-data).  You can obtain list of
        available datasets using :func:`get_dataset_names`
    cache : boolean, optional
        If True, then cache data locally and use the cache on subsequent calls
    data_home : string, optional
        The directory in which to cache data. By default, uses ~/seaborn-data/
    kws : dict, optional
        Passed to pandas.read_csv
    """

```

可以看到docstring的第一行就说明了这个函数是从在线存储库加载数据集的（需要互联网）。

网址：[我是GitHub](https://github.com/mwaskom/seaborn-data)

下面就是可以在线或取得数据集啦（可以用来做练习哦）

![](https://img-blog.csdn.net/20180908133204729?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTU3MTQ5Mw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



---

