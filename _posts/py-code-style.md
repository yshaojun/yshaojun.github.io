---
title: Python 代码风格
date: 2017/5/7 13:18:11
tags: Python
---

- 文档创建：2017/5/7 13:18:11
- 最后更新：2017/5/7 14:17:45

Python 项目开发中，保持一致的代码风格很重要。我在 Python 学习过程中，就兜兜转转调研和变换过多种风格，比如变量和函数名是“驼峰式”还是“下划线式”、注释是与代码并列写还是另起一行、缩进是 tab 还是空格、文档字符串怎么写等等。终于找到了一套与之相关的文档和工具，因此做个备忘。

<!-- more -->

## 1. 代码风格 ##

Python 的代码风格首选 [PEP8](https://www.python.org/dev/peps/pep-0008/)，这不仅是官方代码风格，而且在各处的规定上相当具体细致，绝对值得遵循。

> PEP 8 -- Style Guide for Python Code

> PEP:	8
> Title:	Style Guide for Python Code
> Author:	Guido van Rossum <guido at python.org>, Barry Warsaw <barry at python.org>, Nick Coghlan <ncoghlan at gmail.com>
> Status:	Active
> Type:	Process
> Created:	05-Jul-2001
> Post-History:	05-Jul-2001, 01-Aug-2013

## 2. 文档字符串 ##

文档字符串可以遵循 [PEP257](https://www.python.org/dev/peps/pep-0257/) 和 [Google Style Python Docstrings](http://www.sphinx-doc.org/en/stable/ext/example_google.html#example-google) ，另外遵循 [Sphinx Docstring Sections](http://www.sphinx-doc.org/en/stable/ext/napoleon.html#docstring-sections) ，文档字符串段落标题的使用如下：

- **Args**
- Attributes
- **Examples**
- Keyword Args
- Methods
- Notes
- Other Parameters
- **Returns**
- **Raises**
- **References**
- See Also
- Todo
- Warnings
- **Yields**

## 3. 控制工具 ##

利用 [Pylint](https://pylint.org/) 检查代码，使用非常简单，直接 `pylint yourcode.py` 即可。
另外，在 [VS Code](https://code.visualstudio.com/) 编辑器里可以使用 [Python for Visual Studio Code](http://donjayamanne.github.io/pythonVSCode/)，写代码时就可以实时检查。

## 4. 参考 ##

1. [官方文档 - PEP8](https://www.python.org/dev/peps/pep-0008/)；
2. [官方文档 - PEP257](https://www.python.org/dev/peps/pep-0257/)；
3. [Sphinx - sphinx.ext.napoleon](http://www.sphinx-doc.org/en/stable/ext/napoleon.html)；
4. [Sphinx -Example Google Style Python Docstrings](http://www.sphinx-doc.org/en/stable/ext/example_google.html#example-google)。
