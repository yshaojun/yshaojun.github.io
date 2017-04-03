---
title: Python 装饰器（基础）
date: 2017/4/3 17:20:10
tags: Python
---

- 文档创建：2017/4/3 17:20:10
- 最后更新：2017/4/3 17:35:55

Python 里 **万物皆对象** ，同样函数也是一种对象，因此 **一个函数可以作为另一个函数的参数和返回值** ，这是 Python 装饰器实现的基础。

<!-- more -->

## 1. 函数作为参数 ##

函数 `f0` 是 `f1` 的参数。

``` Python
    >>> def f0():
    ...     return "f0"

    >>> def f1(f0):
    ...     return f0()

    >>> f1(f0)
    'f0'
```



## 2. 函数作为返回值 ##

函数 `_f2` 是 `f2` 的返回值。

``` Python

    >>> def f2():
    ...     def _f2():
    ...         return "_f2"
    ...     return _f2

    >>> f2()()
    '_f2'

```

## 3. 装饰器 ##

利用函数可以作为参数和返回值的性质，如果我们需要在某个函数 **执行前** 或 **执行后** 做一些处理，可以实现如下：

``` Python
    >>> def f3():
    ...     print "Do in f3"
    ...
    >>> def decorator(func):
    ...     def _decorator():
    ...         print "Do before func"
    ...         func()
    ...         print "Do after func"
    ...     return _decorator
    ...
    >>> f3()
    Do in f3
    >>> decorator(f3)()
    Do before func
    Do in f3
    Do after func
```

如果我们不再关心原来的函数，可以这样做：

``` Python
    >>> f3 = decorator(f3)
    >>> f3()
    Do before func
    Do in f3
    Do after func
```

对于 `f3 = decorator(f3)` 这种操作，Python 提供 `@` 语法糖：

``` Python
    >>> @decorator
    ... def f4():
    ...     print "Do in f4"
    ...
    >>> f4()
    Do before func
    Do in f4
    Do after func
```

这就是我们常见的装饰器了。在分析含装饰器代码的时候，我们一定要 **记住** 以下两种写法等效（代码来自：[Glossary](https://docs.python.org/2.7/glossary.html)）：

``` Python
    def f(...):
        ...
    f = staticmethod(f)

    @staticmethod
    def f(...):
        ...
```

## 4. 不定参数 ##

装饰器的参数是函数，因此不应该对被装饰函数的参数敏感。当被装饰函数的参数不固定时，我们应该利用 `args` 和 `kwargs` 来处理。

``` Python
    >>> def decorator(func):
    ...     # 此处 args/kwargs 是打包参数
    ...     def _decorator(*args, **kwargs):
    ...         print "Do before func"
    ...         # 此处 args/kwargs 是解包参数
    ...         func(*args, **kwargs)
    ...         print "Do after func"
    ...     return _decorator
    ...
    >>> @decorator
    ... def f5(a):
    ...     print "Do in f5", a
    ...
    >>> @decorator
    ... def f6(a, b, c):
    ...     print "Do in f6", a, b, c
    ...
    >>> f5(1)
    Do before func
    Do in f5 1
    Do after func
    >>> f6(1, 2, 3)
    Do before func
    Do in f6 1 2 3
    Do after func
```

## 5. 多重装饰 ##

下面的 `@` 语法糖等价于 `f7 = decorator0(decorator1(f7))` 。

``` Python
    >>> def decorator0(func):
    ...     def _decorator(*args, **kwargs):
    ...         print "decorator0 begin"
    ...         func(*args, **kwargs)
    ...         print "decorator0 end"
    ...     return _decorator
    ...
    >>> def decorator1(func):
    ...     def _decorator(*args, **kwargs):
    ...         print "decorator1 begin"
    ...         func(*args, **kwargs)
    ...         print "decorator1 end"
    ...     return _decorator
    ...
    >>> @decorator0
    ... @decorator1
    ... def f7(a, b):
    ...    print "f7: ", a, b
    ...
    >>> f7(1, 2)
    decorator0 begin
    decorator1 begin
    f7:  1 2
    decorator1 end
    decorator0 end
```

## 6. 小结 ##

精确掌握 Python 装饰器需要把握以下两点：

1. 一个函数可以作为另一个函数 **参数** 和 **返回值** ；
2. 能正确地把 `@` 语法糖转化为等价的普通代码。

## 7. 参考 ##

1. [官方文档 - Glossary](https://docs.python.org/2.7/glossary.html) 。