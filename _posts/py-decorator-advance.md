---
title: Python 装饰器（进阶）
date: 2017/4/8 13:18:20
tags: Python
---

- 文档创建：2017/4/8 13:18:20
- 最后更新：2017/4/8 16:14:50

Python 装饰器的本质是 **将原函数名指向新函数** 。新函数一般和原函数有关，但实际上也可以无关；新函数一般在装饰器函数里定义，但也可以在任何能访问到的位置定义。

<!-- more -->

## 1. 信息丢失 ##

由于被装饰的函数实际上变成了另一个函数，因此原函数的 `__doc__` 和 `__name__` 等属性将会丢失，如下：

``` Python
    >>> def decorator(func):
    ...     def _decorator(*args, **kwargs):
    ...         """_decorator's docstring"""
    ...         return func(*args, **kwargs)
    ...     return _decorator

    >>> def func_without_decorator():
    ...     """func_without_decorator's docstring"""
    ...     return "func_without_decorator"

    >>> @decorator
    ... def func_with_decorator():
    ...     """func_with_decorator"""
    ...     return "func_with_decorator"

    >>> func_without_decorator.__name__
    'func_without_decorator'

    >>> func_without_decorator.__doc__
    "func_without_decorator's docstring"

    >>> func_with_decorator.__name__
    '_decorator'

    >>> func_with_decorator.__doc__
    "_decorator's docstring"
```

## 2. functools.wraps() ##

为了解决信息丢失问题，我们可以在装饰器返回新函数前，对新函数的属性进行设置，如下：

``` Python
    >>> def decorator(func):
    ...     def _decorator(*args, **kwargs):
    ...         """_decorator's docstring"""
    ...         return func(*args, **kwargs)
    ...     _decorator.__name__ = func.__name__
    ...     _decorator.__doc__ = func.__doc__
    ...     return _decorator

    >>> @decorator
    ... def func_with_decorator():
    ...     """func_with_decorator"""
    ...     return "func_with_decorator"

    >>> func_with_decorator.__name__
    'func_with_decorator'

    >>> func_with_decorator.__doc__
    'func_with_decorator'
```

对于这种属性更新，Python 的 `functools` 模块提供了 `wraps` 函数。因此一个通用的装饰器模版应该如下：

``` Python
def decorator(func):
    @functools.wraps(func)
    def _decorator(*args, **kwargs):
        # TODO: do something before func.
        ret = func(*args, **kwargs)
        # TODO: do something after func.
    return _decorator
```

## 3. 鸭式辨型 ##

上述方法虽然解决了装饰器信息丢失问题，但被装饰的函数仍然是新函数，而不是在原函数上的修改。那么能不能修改原函数呢？

在回答之前，首先考虑有没有必要在原函数上修改，这里需要提到 Python 的 **鸭式辨型** ([duck-typing](https://docs.python.org/2.7/glossary.html?highlight=duck#term-duck-typing))：

> “If it looks like a duck and quacks like a duck, it must be a duck.”

简单说就是 **不要看它是什么，而要看它做什么** 。从 “鸭式辨型” 的观点看，返回新函数和修改原函数的效果相同，但返回新函数更简单，因此是没有必要修改原函数的。

## 4. 面向切面编程 ##

装饰器代表了一种 **面向切面编程** ([Aspect Oriented Programming, AOP](https://en.wikipedia.org/wiki/Aspect-oriented_programming)) 的思想。所谓 AOP ，是 **在不修改原代码的情况下，给它添加功能** ；函数的某些位置，即是 “切面” 。

AOP 的好处是允许函数只专注于核心功能，其他功能由调用者通过装饰器加上，提高了代码的模块化和语义性。

## 5. 内置装饰器 ##

Python 内置了一些装饰器，有的装饰器比如 `@functools.wraps` 是用 Python 实现的，可以通过阅读源码理解；有的是由 C 实现的，比如 `@property` 等，这时候需要去读文档了。这里备忘一下 `@property` 、 `@classmethod` 和 `@staticmethod` 的用法，它们的文档在 [这里](https://docs.python.org/2.7/library/functions.html) 。

``` Python
    >>> class A(object):
    ...     def __init__(self):
    ...         self.a = 1
    ...
    ...     @property
    ...     def aa(self):
    ...         return self.a + 1
    ...
    ...     @classmethod
    ...     def class_func(cls):
    ...         return "class_func"
    ...
    ...     @staticmethod
    ...     def static_func():
    ...         return "static_func"
    ...
    ...     def instance_func(self):
    ...         return "instance_func"

    >>> a = A()

    >>> a.a
    1

    >>> a.aa
    2

    >>> a.class_func()
    'class_func'

    >>> a.static_func()
    'static_func'

    >>> a.instance_func()
    'instance_func'

    >>> A.class_func()
    'class_func'

    >>> A.static_func()
    'static_func'
```

## 6. 参考 ##

1. [官方文档 - functools.wraps](https://docs.python.org/2.7/glossary.html) ；
2. [官方文档 - duck-typing](https://docs.python.org/2.7/glossary.html?highlight=duck#term-duck-typing) ；
3. [官方文档 - class property](https://docs.python.org/2.7/library/functions.html#property) ；
4. [官方文档 - classmethod](https://docs.python.org/2.7/library/functions.html#classmethod) ；
5. [官方文档 - staticmethod](https://docs.python.org/2.7/library/functions.html#staticmethod) ；
6. [维基百科 - Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) ；
