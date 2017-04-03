---
title: Python 协议三 Context Manager
date: 2017/3/25 13:30:43
tags: Python
---

- 文档创建：2017/3/25 13:30:43
- 最后更新：2017/4/3 15:10:29

本文介绍上下文管理器协议和 `with` 语句。

<!-- more -->

## 1. 定义 ##

实现如下两个方法的对象是上下文管理器。

``` Python
    contextmanager.__enter__()
    contextmanager.__exit__(exc_type, exc_val, exc_tb)
```

## 2. 调用 ##

1. 直接调用，由于 `__enter__` 和 `__exit__` 事实上也是定义在类里的方法，跟其他自定义方法一样可以利用实例直接调用；
2. 使用 `with` 语句。

## 3. 举例 ##

``` Python
    >>> class MyContextManager(object):
    ...     def __init__(self):
    ...         super(MyContextManager, self).__init__()
    ...     def __enter__(self):
    ...         print "__enter__"
    ...         # 返回值会赋值给 with...as 语句中 as 后的变量
    ...         return "return value from `__enter__`"
    ...     def __exit__(self, exc_type, exc_val, exc_tb):
    ...         print "__exit__"
    ...         # 返回 False 会 re-raise with语句下代码块的异常，
    ...         # 例如，假设下面的 print type(mcm), mcm 会抛异常，
    ...         # 返回 False 会将该异常抛出，返回 True 则会忽略掉此异常。
    ...         return False
    
    >>> with MyContextManager() as mcm:
    ...     print type(mcm), mcm
    __enter__
    <type 'str'> return value from `__enter__`
    __exit__
```

由上面的例子可以看到，在进入 `with...as` 下面的代码块之前，`__enter__` 会被调用，其返回值赋值给 `as` 后的变量；然后执行代码块；在代码块执行结束之后会自动调用 `__exit__`。

## 4. 应用 ##

Python 为一些常用的需要释放资源的对象实现了上下文管理器协议，例如 `file` 和 `threading.Lock` 等等，使用这些对象时**建议用 `with` 语句**，代码会更加简洁安全。

``` Python
    with open("t.txt", "rb") as fp:
        ...

    G_LOCK = threading.Lock
    with G_LOCK:
        ...
```

我们也可以为自己的类实现上下文管理器协议，以便使用 `with` 语句简化代码。

## 5. 其他 ##

除了通过 `__enter__` 和 `__exit__` 实现上下文管理器协议，我们还可以利用 Python 内置模块 `contextlib` 来完成。事实上 `contextlib` 不过是封装了实现 `__enter__` 和 `__exit__` 过程以便使用的。

用 `contextlib` 改下 “3. 举例” 中的代码如下：

``` Python
    >>> from contextlib import contextmanager
    ...
    ... @contextmanager
    ... def MyContextManager():
    ...     print "__enter__"
    ...     yield "return value from `__enter__`"
    ...     print "__exit__"
    
    >>> with MyContextManager() as mcm:
    ...     print type(mcm), mcm
    __enter__
    <type 'str'> return value from `__enter__`
    __exit__
```

可以看到 `yield` 前的代码相当于 `__enter__`， `yield` 语句后的值相当于 `__enter__` 返回值，`yield` 后的代码相当于 `__exit__` 。

## 参考 ##

1. [官方文档 - 3.4.10. With Statement Context Managers](https://docs.python.org/2.7/reference/datamodel.html#with-statement-context-managers)；
2. [官方文档 - 5.11. Context Manager Types](https://docs.python.org/2.7/library/stdtypes.html#typecontextmanager)；
3. [官方文档 - 7.5. The with statement](https://docs.python.org/2.7/reference/compound_stmts.html#with)；
4. [官方文档 - 28.7. contextlib — Utilities for with-statement contexts](https://docs.python.org/2.7/library/contextlib.html#module-contextlib)；
