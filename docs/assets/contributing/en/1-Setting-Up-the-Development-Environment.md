---
title: 1-Setting-Up-the-Development-Environment

key words: VisActor, VChart, VTable, VStory, VMind, VGrammar, VRender, Visualization, Chart, Data, Table, Graph, GIS, LLM
---
# Github 

## 1.1 Register an Account

The VisActor team usually develops and maintains issues on GitHub. Please visit [GitHub](https://github.com/), click the `Sign up` button on the top right to register your account, and start your journey into open source.

If you are unable to access GitHub due to certain restrictions, please let us know and use [Gitee](https://gitee.com/VisActor/VTable) for project development.

## 1.2 Fork the Project

First, you need to fork this project. Go to the [VTable project page](https://github.com/VisActor/VTable) and click the Fork button on the top right.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/github-fork.png' alt='' width='1000' height='auto'>

The project will appear as xxxx (your GitHub username)/vtable in your GitHub account.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/github-fork-self.png' alt='' width='849' height='auto'>

# Local Development Environment

## 2.1 Install Git

Since the code is hosted on GitHub, we use git for version control.

Git is a version control system that helps track and manage code changes in software development projects. It aids developers in recording and managing code history, making team collaboration, code version control, and code merging easier. With Git, you can track each version of every file, switching and comparing between different versions easily. Git also offers branch management features, enabling simultaneous multiple parallel development tasks.

*  Visit the Git official website: [https://git-scm.com/](https://git-scm.com/)

*  Download the latest version of the Git installer.

*  Run the downloaded installer and follow the prompts in the installation wizard.

*  After installation, you can verify the installation by using `git version` in the command line.

```
HM4G2J09L6:~ xuanhun$ git version
**git version 2.39.2 (Apple Git-143)**
```

## 2.2 Install a Development Tool (Recommended: VSCode)

VisActor predominantly uses a frontend tech stack. There are many tools available for frontend development, but we recommend using VSCode. Of course, you can use any development tool you prefer.

If you're not familiar with VSCode, it might be helpful to read the official documentation: https://vscode.js.cn/docs/setup/setup-overview

## 2.3 Install Doubao Marscode AI Programming Assistant


[Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a)


Doubao MarsCode Programming Assistant is an AI coding assistant from Doubao that provides AI features represented by intelligent code completion. It supports mainstream programming languages and IDEs, offering suggestions for writing a single line of code or an entire function during development. In addition, it offers features like code explanation, unit test generation, and problem fixing, improving development efficiency and quality. For more information, please refer to the [Doubao MarsCode Programming Assistant documentation](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a).

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DLaKb4PysoADAZx0x1RcYjXbnBe.gif' alt='' width='760' height='auto'>

With Marscode, VisActor developers can more easily understand code, write documentation, develop features, and perform unit testing. Detailed examples will be provided in specific task contribution guides.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BQeib7E2gonoOaxLPqjcRtAYngh.gif' alt='' width='1000' height='auto'>

## 2.4 Clone the Code to Local

Enter the VTable folder and add the remote address for VTable.

```
git remote add upstream https://github.com/VisActor/VTable.git
```

Get the latest source code for VTable.

```
git pull upstream develop
```

# Initialize the Project

First, globally install [<u>@microsoft/rush</u>](https://rushjs.io/pages/intro/get_started/)

```
$ npm i --global @microsoft/rush
```

Then, execute the command to view the demo

```
# Install dependencies
$ rush update
# Start the demo page for vtable
$ cd ./packages/vtable && rushx demo
# Start the demo page for react-vtable
$ cd ./packages/react-vtable && rushx start
# Start the local documentation site
$ rush docs
```

# Next Steps

At this point, you have completed the preparations for developing the code. Please continue reading the next tutorial to begin working on different types of tasks.

github: [github.com/VisActor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FVisActor)

VisActor WeChat subscription message (you can join the WeChat group via the subscription menu):

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KLjmbz9TtoGzPIxarv7cmhpgnSY.gif' alt='' width='258' height='auto'>

VisActor official website: [www.visactor.io/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvtable)

Feishu group:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Cv9xb0zzLoUWyaxMVgccWuGPn7d.gif' alt='' width='264' height='auto'>

discord: https://discord.com/invite/3wPyxVyH6m

# This Document Was Contributed By
[玄魂](https://github.com/xuanhun)