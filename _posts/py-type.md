---
title: Python 中的 type
date: 2017/4/23 13:18:57
tags: Python
---

- 文档创建：2017/4/23 13:18:57
- 最后更新：2017/4/23 14:45:28

Python 在定义和初始化变量的时候并不需要指明类型，因此我们常用 `type` 去看一个变量的类型。除此之外，`type` 的另一个用途是创建类。

<!-- more -->

## 1. type 定义 ##

`type` 有如下两种形式：

``` Python
    class type(object)
    class type(name, bases, dict)
```

因此 `type` 是一个类，跟其他的类一样，类在调用时会返回一个对象。

## 2. type 应用 ##

当 `type` 只有一个参数时，调用它会返回这个这个参数的类型，如下：

``` Python
    >>> type(1)
    <type 'int'>

    >>> type(1.0)
    <type 'float'>

    >>> def func():
    ...     pass

    >>> type(func)
    <type 'function'>
```

当 `type` 有三个参数时，调用它会返回一个类，如下两种定义类 `X` 的方式完全等价：（代码来自[这里](library/functions.html#type)）

``` Python
    >>> class X(object):
    ...     a = 1
    ...
    >>> X = type('X', (object,), dict(a=1))
```

我们可以做如下的验证来证明为什么这两种定义类的方式是等价的：

``` Python
    >>> class A(object):
    ...     a = 1
    ...
    >>> type(A())
    <class '__main__.A'>
```

``` Python
    >>> B = type("B", (object, ), {"a": 1})
    >>> type(B())
    <class '__main__.B'>
```

``` Python
    >>> dir(A())
    ['__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__new__', '__reduce__','__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'a']
    >>> dir(B())
    ['__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__new__', '__reduce__','__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'a']
```

可以看到，`A` 和 `B` 两个类除了名称不同，其他都是一样的。根据 **[duck-typing](https://docs.python.org/2.7/glossary.html?highlight=duck#term-duck-typing)** ，可以认为两者等效。

## 3. 小结 ##

`type` 是一个内置类，调用它会返回一个 `type` 对象。这个对象要么是内置的类型，要么是自定义的类，因此 `type` 实际上是 **类的类**，也就是所谓的 **元类 (metaclass)**。

## 4. 参考 ##

1. [官方文档 - type](https://docs.python.org/2.7/library/functions.html#type) ；
2. [官方文档 - 3.4.3. Customizing class creation](https://docs.python.org/2.7/reference/datamodel.html#customizing-class-creation) 。
