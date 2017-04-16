---
title: Python 中的 *args / **kwargs 小结
date: 2017/4/16 13:13:39
tags: Python
---

- 文档创建：2017/4/16 13:13:39
- 最后更新：2017/4/16 14:02:50

Python 代码中经常出现 `*args` / `**kwargs` 的函数，这里对它们的用法做个小结。

<!-- more -->

## 1. 形参中的 \*args / **kwargs ##

形参（[parameter](https://docs.python.org/2.7/glossary.html#term-parameter)）中的 `*args` / `**kwargs`，会将位置参数打包成元组赋值给变量 `args` ，将关键字参数打包成字典赋值给 `kwargs` ，如下：

``` Python
    >>> def func(*args, **kwargs):
    ...     print "args=", args
    ...     print "kwargs=", kwargs

    >>> func(1, 2, a=3, c=4)
    args= (1, 2)
    kwargs= {'a': 3, 'c': 4}
```

## 2. 实参中的 \*args / **kwargs ##

实参（[argument](https://docs.python.org/2.7/glossary.html#term-argument)）中的 `*args` / `**kwargs` 与形参作用相反，会将元组 `args` 解包成位置参数，将字典 `kwargs` 解包成关键字参数，如下：

``` Python
>>> def func(a, b, c, d):
...     print "a=", a
...     print "b=", b
...     print "c=", c
...     print "d=", d

>>> args = (1, 2)

>>> kwargs = {"c": 3, "d": 4}

>>> func(*args, **kwargs)
a= 1
b= 2
c= 3
d= 4
```

## 3. 应用 ##

1. 定义不定参数的函数。形参中 `*args` 能将任意个位置参数打包成元组，`**kwargs` 将任意个关键字参数打包成字典，我们可以利用这个特点写不定参数的函数。

2. 增强公共 API 兼容性。很多开源项目的公共接口都预留了 `**setting` 的参数，这样在保持接口不变的情况下就能扩展功能。

3. 简化函数调用。如下：

``` Python
    >>> paths = ["a", "b", "c", "d"]
    
    >>> os.path.join(*paths)
    'a\\b\\c\\d'
    
    # 不必写 os.path.join(paths[0], paths[1], paths[2], paths[3])
```

## 4. 参考 ##

1. [官方文档 - parameter](https://docs.python.org/2.7/glossary.html#term-parameter)；
2. [官方文档 - argument](https://docs.python.org/2.7/glossary.html#term-argument)。
