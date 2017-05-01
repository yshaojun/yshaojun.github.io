---
title: Python 中的 metaclass
date: 2017/4/30 19:01:00
tags: Python
---

- 文档创建：2017/4/30 19:01:00
- 最后更新：2017/5/1 12:40:45

Python 中的 `class` 也是对象，那么 `class` 是谁的实例呢？这里就涉及到了 Python 中的 **元类** 的概念。

<!-- more -->

## 1. 内置元类 type ##

在 Python 文档 [3.4.3. Customizing class creation](https://docs.python.org/2.7/reference/datamodel.html#customizing-class-creation) 中有这样一句话：

> By default, new-style classes are constructed using type(). A class definition is read into a separate namespace and the value of class name is bound to the result of type(name, bases, dict).

也就是说，当我们用 `class` 关键字定义新式类的时候，Python 内部实际上是调用 `type` 来创建类的（在前一篇文章 [Python 中的 type](/public/2017/04/23/py-type/) 也提到用 `class` 和用 `type` 的定义的类等效），因此 `type` 是 Python 的内置元类。

## 2. 自定义元类 ##

如果用 `class` 关键字定义类时也指明了 `__metaclass__` 属性，则在创建类时 `type` 不会被调用，`__metaclass__` 的值将会被调用。

``` Python
    >>> class A(object):
    ...     a = 2
    ...
    >>> class MyMetaClass(type):
    ...     def __new__(mcs, name, bases, dict):
    ...         return A
    ...
    >>> class B(object):
    ...     __metaclass__ = MyMetaClass
    ...
    >>> B()
    <__main__.A object at 0x00000000025EDF60>
    >>> B().a
    2
    >>>
```

这样，通过自定义 `__metaclass__` ，在定义类 `C` 时实际上生成了 `B` 。
`__metaclass__` 不仅可以定义在类中，还可以在父类、全局变量中（这个次序也是搜索次序）。

值得注意的是，**全局 `__mataclass__` 只对老式类有效，对新式类无效** ，如下：

``` Python
    >>> class A(object):
    ...     a = 1
    ...
    >>> class MyMetaClass(type):
    ...     def __new__(mcs, name, bases, dict):
    ...         return A
    ...
    >>> __metaclass__ = MyMetaClass
    >>> class B1:
    ...     pass
    ...
    >>> B1()
    <__main__.A object at 0x000000000248BA90>
    >>> class B2(object):
    ...     pass
    ...
    >>> B2()
    <__main__.B2 object at 0x00000000025DDE10>
    >>>
```

## 3. type 的元类 ##

既然类都有元类，那么 `type` 的元类是什么呢？答案是 `type` ：

``` Python
    >>> type
    <type 'type'>
    >>> type(type)
    <type 'type'>
    >>> type is type(type)
    True
    >>>
```



## 4. 参考 ##

1. [官方文档 - type](https://docs.python.org/2.7/library/functions.html#type) ；
2. [官方文档 - 3.4.3. Customizing class creation](https://docs.python.org/2.7/reference/datamodel.html#customizing-class-creation) 。
