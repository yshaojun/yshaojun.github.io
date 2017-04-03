---
title: Python 协议二 Iterator
date: 2017/3/18 12:17:19
tags: Python
---

- 文档创建：2017/3/18 12:17:19
- 最后修改：2017/4/3 14:41:09

本文介绍 Python 迭代器协议和应用。

<!-- more -->

## 1. 定义 ##

实现了如下两个方法的对象即是一个迭代器。

``` Python
    iterator.__iter__() # 返回对象本身
    iterator.next()     # 返回下一个值，超出则 raise StopIteration
```

如果一个想要普通的容器对象支持迭代，则需要实现如下方法。

``` Python
    container.__iter__() # 返回一个上面定义的迭代器对象
```

值得注意的是，容器仅仅是提供迭代支持，而不是迭代器。

## 2. 调用 ##

1. 直接调用 `next()` 函数，这种方式不能应用于容器，因为容器里没有定义 `next()` 方法；
2. 在 `for...in` 语句中调用，这种方式迭代器和容器都支持。

## 3. 举例 ##

``` Python
    >>> class MyIterator(object):
    ...     def __init__(self):
    ...         self.a = [1, 2, 3, 4, 5]
    ...         self.i = 0
    ...     def __iter__(self):
    ...         return self
    ...     def next(self):
    ...         if self.i > 4:
    ...             raise StopIteration
    ...         v = self.a[self.i]
    ...         self.i += 1
    ...         return v
    
    >>> for i in MyIterator():
    ...     print i
    1
    2
    3
    4
    5
    
    >>> class MyContainer(object):
    ...     def __init__(self):
    ...         self.mi = MyIterator()
    ...     def __iter__(self):
    ...         return self.mi
    
    >>> for i in MyContainer():
    ...     print i
    1
    2
    3
    4
    5
    
    >>>
```

## 4. 应用 ##

1. `for...in` 语句支持；
2. Python 生成器（Generator）。

以下将介绍 Python 生成器相关知识。

生成器的定义：一个函数包含 `yield` 语句，则该函数执行后返回一个生成器。

``` Python
    >>> def g():
    ...     yield 1
    
    >>> type(g)
    <type 'function'>
    
    >>> type(g())
    <type 'generator'>
```

生成器的方法：除了迭代器协议的 `__iter__` 和 `next()`，另外还包含 `send` 和 `close` 等方法。

``` Python
    >>> dir(g())
    ['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '_
    _iter__', '__name__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof
    __', '__str__', '__subclasshook__', 'close', 'gi_code', 'gi_frame', 'gi_running', 'next', 'send', 't
    hrow']
```

- `generator.next()` ；
- `generator.send(value)`；
- `generator.throw(type[, value[, traceback]])`；
- `generator.close()`;

上述函数的用法在 [5.2.10.1. Generator-iterator methods](https://docs.python.org/2.7/reference/expressions.html#generator-iterator-methods) 有介绍，此处不再列出。

可以看到，`yield` 能暂停函数执行并保存上下文， `generator.send(value)` 和 `generator.next()` 可以让函数在上次暂停的位置继续执行，这给 **在 Python 代码层面调度函数** 提供了可能。如果实现了这种“调度器”，实际上就实现了用户态的例程调度，即所谓的 **协程**。

这类调度器的实现有 [tornado ioloop](http://www.tornadoweb.org/en/stable/ioloop.html) 和 Python 3 的 [asyncio event loop](https://docs.python.org/3.6/library/asyncio.html) 等等。

## 5. 参考 ##

1. [官方文档 - 5.5. Iterator Types](https://docs.python.org/2.7/library/stdtypes.html#iterator-types)；
2. [官方文档 - 5.2.10. Yield expressions](https://docs.python.org/2.7/reference/expressions.html#yieldexpr)。
