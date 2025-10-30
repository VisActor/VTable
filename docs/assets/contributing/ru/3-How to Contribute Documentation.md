---
title: 3-Как Вносить Вклад в Документацию

keywords: VisActor, VChart, VTable, VStory, VMind, VGrammar, VRender, Визуализация, Диаграмма, Данные, Таблица, График, ГИС, LLM
---
# Создание Ветки

Ветка по умолчанию для VTable - это ветка develop. Будь то разработка функций, исправление ошибок или написание документации, пожалуйста, создайте новую ветку, а затем объедините ее с веткой develop. Используйте следующую команду для создания ветки:

```bash
// Создание ветки документации/демо
git checkout -b docs/add-funnel-demo
```

# Найти или Создать Issue

В принципе, мы требуем, чтобы каждый PR имел соответствующий issue. Перед началом разработки, пожалуйста, подтвердите, есть ли соответствующий issue, и что issue не был заявлен.

## Поиск Issues по Документации

Вы можете искать issues, связанные с документацией, используя следующий фильтр:

```
is:открыть label:docs
```

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/JkscbtGcbo9iQRxuAR2clnx6n9J.gif' alt='' ширина='801' высота='auto'>

Некоторые функции могут быть связаны с меткой doc, поэтому проверьте, является ли issue чисто задачей по документации.

## Create a Documentation Issue

нажать "новый ISSUE" к открыть the issue selection page, then выбрать “**Documentation Request**.”

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Xs7nbpfaCo479XxGRq5cONJ3nye.gif' alt='' ширина='1000' высота='auto'>

Fill out the relevant information для the documentation issue you want к submit.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KXsCbe7XYo0puWxn3oGczfXInbc.gif' alt='' ширина='1000' высота='auto'>

# Claim an Issue

If you want к write или edit documentation bugs, Вы можете leave a comment на the issue к claim it. An administrator will contact you, и after confirmation, the issue will be assigned к you.

для example:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V9UTb3w08oJcj6xUSUKc32gTnrh.gif' alt='' ширина='988' высота='auto'>

# Create или Modify Documentation

The locations из VTable documentation и demos в the project are as follows:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/code-docs.png' alt='' ширина='1000' высота='auto'>

The текущий documentation types are as follows:

*  api: интерфейс documentation, corresponding site: https://www.visactor.io/VTable/api/API/VTable
*  changelog: Log, corresponding site: https://www.visactor.io/VTable/changelog/release
*  demos: Independent running demos для debugging purposes
*  examples: Graph examples, corresponding sites:
https://www.visactor.io/VTable/example
https://www.visactor.io/VTable/example-react
https://www.visactor.io/VTable/example-openinula
https://www.visactor.io/VTable/example-vue
*  faq: FAQs, corresponding site: https://www.visactor.io/VTable/faq/1-How%20to%20implement%20multi-level%20headers%20in%20a%20basic%20table
*  guide: Tutorials, corresponding site: https://www.visactor.io/VTable/guide/Getting_Started/Getting_Started
*  option: Specification descriptions, corresponding site: https://www.visactor.io/VTable/option/ListTable
*  contributing: Community contributor documentation, corresponding site: https://www.visactor.io/VTable/guide/contributing_docs/Contribution_Guide

Find the corresponding location к add или modify the document. Note that некоторые documents need к maintain the “menu.json” file as well.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/TxwTb83S5oOnqMx5VI7cqzjXnkg.gif' alt='' ширина='528' высота='auto'>

This file corresponds к the final позиция и name из the document displayed на the site. для example:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/L6WpbXlFEo15F4xSIsMch9YTnof.gif' alt='' ширина='1000' высота='auto'>

# Use Doubao Marscode AI Programming Assistant

[Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a)

Using Doubao [Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) can provide comprehensive assistance throughout the entire process из document creation.

If you haven't installed the [Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a), please download it от Следующий link: https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a

в document writing, using context commands appropriately can improve content accuracy.

`**⭐️ #Workspace**`

выбрать the global code от Workspace as context, и the AI will automatically find related code context based на user queries.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WiikbC26FovfN8xiDrkc5jDGn4b.gif' alt='' ширина='1000' высота='auto'>

`**⭐️ #Files**`

Search и выбрать files от the code repository as context

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OG15bVGdAoghaux6QlUckffVnfg.gif' alt='' ширина='1000' высота='auto'>

`**⭐️ #Code**`

Search и выбрать functions или classes от the code repository as context

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BEaXbdXyUoik0WxoWqHcz0A6nCg.gif' alt='' ширина='1000' высота='auto'>

Below is an example из how к use the [Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) для document writing.

## 5.1 Provide Document Writing Ideas

Here, **по invoking #Workspace** и then asking it к help generate an outline для a developer document.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-introduce.png' alt='' ширина='1000' высота='auto'>

## 5.2 Generate Project Structure Description

Here, **по invoking #Workspace** и then asking it к help generate a project structure description document.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RI9sb17ygoL2JMxwpqrcDLD3nVh.gif' alt='' ширина='1000' высота='auto'>

We can still ask further questions about subfolders.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-structure.png' alt='' ширина='1000' высота='auto'>

## 5.3 Generate File или Code Details

### 5.3.1 Generate Code Explanation

When we выбрать a piece из code в a file, we can choose the Explain command от the floating menu, и [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) will generate a detailed code explanation для us. We can use this as a basis для proofreading и adaptation.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BQurb7A6fo7UVJxxuqHcSLIdnzc.gif' alt='' ширина='1000' высота='auto'>

Вы можете also directly ввод the Explain command в the dialogue box.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/FtYLb95EEoCXGOx835tc3X2Zn7g.gif' alt='' ширина='1000' высота='auto'>

Here Вы можете also directly use the previously mentioned #Code context к combine Explain с your instructions для more detailed tasks.

### 5.3.2 Generate Explanations для Entire Files

Explain can be used в conjunction с Context или Files commands к generate explanations для entire files.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HoqGbdBxyolQodx2uhdcquven0g.gif' alt='' ширина='1000' высота='auto'>

## 5.4 Generate Sample Code

к better explain principles и usage, it is often necessary к provide a demo that can be practically run. Вы можете use [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a)'s code generation capabilities к generate sample code для us. However, currently the code generation capabilities из various AIs cannot guarantee accuracy и require further verification.

## 5.5 Content Search

для каждый Q&A, [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) will usually provide reference documentation, which can offer more contextual references для further analysis.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/QMD7b5mQgoyNYtxNK5jcNTL4n7c.gif' alt='' ширина='1000' высота='auto'>

Вы можете also directly perform file searches:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-gantt.png' alt='' ширина='1000' высота='auto'>

## 5.6 Translate Documents

VisActor's documentation needs к be provided в both Chinese и English, и Marscode can assist в translation.

# Submit Code

After completing the documentation, первый push the code к your remote branch. для example:

```bash
git commit -a -m "docs: add custom funnel demo и related docs"
```

VisActor follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification для commit messages:

`<тип>[необязательный scope]: <description>`

Common `тип`s include docs (documentation, log changes), feat (новый features), fix (bug fixes), refactor (code refactoring), и others. Please choose according к the actual situation.

Write the description в concise и accurate English.

Before submitting a commit, we will conduct a commit lint check. Вы можете view the [rules для checking](https://github.com/VisActor/VTable/blob/develop/common/autoinstallers/lint/commitlint.config.js).

A common issue is when the remote upstream (@visactor/VTable) has новый updates, leading к conflicts when submitting a Pull Request. Therefore, before submission, we can merge other developers' remote commits into ours. Use Следующий command к switch к the develop branch:

```bash
git checkout develop
```

Use Следующий command к pull the latest code от upstream:

```bash
git pull upstream develop
```

Switch back к your development branch:

```bash
git checkout docs/add-funnel-demo
```

Merge the develop branch's commits into your branch:

```bash
git rebase develop
```

Push the updated code к your branch:

```bash
git push origin docs/add-funnel-demo
```

# Submit a PR

Вы можете нажать the `Compare & pull request` кнопка на your GitHub repository page.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/S8hebTyczoKfg7x4ZTncy8uenX9.gif' alt='' ширина='1000' высота='auto'>

или create it through the `contribute` кнопка:

Fill out the template с the changes submitted:

*  Check the тип из modification

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/J9z9biTukokoJBx846zcIOVqnsh.gif' alt='' ширина='692' высота='auto'>

*  Fill в the associated issue

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Oxl7bkBuEoHdssxxfRHc11IAnsg.gif' alt='' ширина='470' высота='auto'>

*  If there are complex changes, please explain the фон и solution

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RUeebaBA8oGMZNxWdi1cstXWn1d.gif' alt='' ширина='1000' высота='auto'>

Once the relevant information is filled в, нажать Create pull request к submit.

The administrator will review the PR к decide whether к approve it. If не approved, modifications are needed и it must be resubmitted.

# следующий Steps

Among different documentation types, demo documents have некоторые special requirements, which can be referenced в the "How к Contribute a Demo" section.

Вы можете then continue к attempt different types из tasks.

GitHub: [github.com/VisActor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FVisActor)

Leave a сообщение на the VisActor WeChat public account (Вы можете join the WeChat group through the public account menu):

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Cj40bjDrxoEDnZxrBl4cEfs9nyc.gif' alt='' ширина='258' высота='auto'>

Official website из VisActor: [www.visactor.io/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvtable)

Feishu group:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VeKlb1t5sogCmExPAFmcbtmgndb.gif' alt='' ширина='264' высота='auto'>

Discord: https://discord.com/invite/3wPyxVyH6m
```

# This Document Was Contributed по
[玄魂](https://github.com/xuanhun)