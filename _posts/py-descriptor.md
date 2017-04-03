---
title: Python 协议一 Descriptor
date: 2017/3/12 15:36:51
tags: Python
---

- 文档创建：2017/3/12 15:36:51
- 最后更新：2017/4/3 15:57:43

在 Python 中，如果对象实现了某些特定方法，则称该对象实现了某协议，例如 [迭代器协议](https://docs.python.org/2.7/library/stdtypes.html#iterator-types)、[上下文管理器协议](https://docs.python.org/2.7/library/stdtypes.html#context-manager-types)、[描述符协议](https://docs.python.org/2.7/reference/datamodel.html#implementing-descriptors) 等。本文记录学习描述符协议时的一些要点。

<!-- more -->

## 1. 定义 ##

实现了如下三个方法的对象即是一个描述符。

``` Python
    descr.__get__(self, obj, type=None) --> value
    descr.__set__(self, obj, value) --> None
    descr.__delete__(self, obj) --> None
```

数据描述符（data descriptor）：定义了 `__get__()` 和 `__set__()` ；
非数据描述符（non-data descriptor）：只定义了 `__get__()` 。
两种描述符的区别在于方法覆盖优先级。如果实例字典里有与数据描述符同名的属性，则数据描述符优先；如果实例字典里有与非数据描述符同名的属性，则实例字典的优先。

## 2. 调用 ##

描述符调用方式有如下4种：

1. 直接调用，`x.__get__(a)` ；
2. 实例绑定，`a.x` 等价于 `type(a).__dict__['x'].__get__(a, type(a))` ；
3. 类绑定，`A.x` 等价于 `A.__dict__['x'].__get__(None, A)` ；
4. Super 绑定，`A.__dict__['m'].__get__(obj, obj.__class__)` 。

## 3. 举例 ##

代码出处在 [这里](https://docs.python.org/2.7/howto/descriptor.html#descriptor-example) 。

``` Python
    class RevealAccess(object):
        """A data descriptor that sets and returns values
            normally and prints a message logging their access.
        """

        def __init__(self, initval=None, name='var'):
            self.val = initval
            self.name = name

        def __get__(self, obj, objtype):
            print 'Retrieving', self.name
            return self.val

        def __set__(self, obj, val):
            print 'Updating', self.name
            self.val = val

    >>> class MyClass(object):
    ...     x = RevealAccess(10, 'var "x"')
    ...     y = 5
    ...
    >>> m = MyClass()
    >>> m.x
    Retrieving var "x"
    10
    >>> m.x = 20
    Updating var "x"
    >>> m.x
    Retrieving var "x"
    20
    >>> m.y
    5
```

从上述代码可以看出，描述符的本质是 **对象属性的自定义读写** ，Python 描述符和 Java  `set()` / `get()` 的功能大致相当，基本就是个“语法糖”的作用。
示例代码是在类里使用描述符的，那么能不能在实例里使用呢？答案是 **不能** 。因为在 “2. 调用” 一节的 “实例绑定” 可以看到 `a.x` 被转换为 `type(a).__dict__['x'].__get__(a, type(a))` ，而 `type(a)` 返回的是实例的类。

``` Python
    >>> class MyClass1(object):
    ...     def __init__(self):
    ...         self.x = RevealAccess(10, 'var "x"')

    >>> m1 = MyClass1()
    >>> m1.x
    <RevealAccess object at 0x0000000003D66518>
```

## 4. 应用 ##

Python 使用描述符主要用途如下：

1. `@property`；
2. `@classmethod`；
3. `@staticmethod`；
4. 实例方法绑定，实现细节在 [这里](https://docs.python.org/2.7/howto/descriptor.html#functions-and-methods)。

## 5. 参考 ##

1. [官方文档 - 3.4.2.2. Implementing Descriptors](https://docs.python.org/2.7/reference/datamodel.html#implementing-descriptors)；
2. [官方文档 - Descriptor HowTo Guide](https://docs.python.org/2.7/howto/descriptor.html#descriptor-howto-guide)；
3. [伯乐在线 - Python官方文档：Descriptor 指南](http://python.jobbole.com/83562/)；
4. [xin053 - Python描述符descriptor](https://xin053.github.io/2016/11/29/Python%E6%8F%8F%E8%BF%B0%E7%AC%A6descriptor/);
5. [知乎 - 如何理解 Python 的 Descriptor？刘缙的回答](https://www.zhihu.com/question/25391709)。
