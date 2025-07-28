---
title: 5. Как Вносить Вклад в Код

key words: VisActor, VChart, VTable, VStory, VMind, VGrammar, VRender, Визуализация, Диаграмма, Данные, Таблица, График, ГИС, LLM
---

# Создание Ветки

Ветка по умолчанию для VTable - это ветка develop. Для любой разработки функций, исправления ошибок или написания документации, пожалуйста, создайте новую ветку, а затем объедините ее с веткой develop. Используйте следующий код для создания ветки:

```
// Создание ветки документации, демо
git checkout -b docs/add-funnel-demo

```

# Поиск или Создание Issue

В принципе, мы требуем, чтобы каждый PR имел соответствующий issue. Перед началом разработки, пожалуйста, подтвердите, есть ли соответствующий issue, и что issue не был заявлен.

## Поиск Issues

Вы можете искать issues, связанные с ошибками или функциями, следующим образом:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/TPy4bTm01o9MSgxiwZvcTz66nug.gif' alt='' ширина='487' высота='auto'>

## Создание Issues, Связанных с Кодом

Нажмите "новый ISSUE", чтобы открыть страницу выбора issue, и выберите "**Bug Report" или "Feature Request".**

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/AhNvbxd1uoZZMHxuKxscjErrnDe.gif' alt='' ширина='611' высота='auto'>

Fill в the relevant information для the document issue you want к submit и apply the appropriate tags.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Odonb0WssownV3xTSQDcEudhnOi.gif' alt='' ширина='828' высота='auto'>

# Claiming an Issue

If you want к contribute code, Вы можете leave a сообщение к claim the issue. An administrator will contact you и, upon confirmation, assign the issue к you.

для example:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MMCpb9MvEomle4xYIe1cauFUnCe.gif' alt='' ширина='988' высота='auto'>

# Writing Code

The source code для VTable is located в Следующий way within the project:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/code-dir.png' alt='' ширина='952' высота='auto'>

все the components из the VTable ecosystem are в the same directory, split по package name. Developers need к develop code в their own code branch и then submit it.

# Writing Code с Marscode AI Programming Assistant

с the help из the Marscode AI Programming Assistant, comprehensive assistance can be provided throughout the coding process.

If you have не installed the Marscode AI Programming Assistant, please download it от this link: https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a

When writing code, using context commands appropriately can improve the accuracy из content.

`**⭐️ #Workspace**`

выбрать global code от Workspace as context, и AI will automatically find relevant code context based на the user's Query.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DWoabR7kIoqRe8xVu7RcqjjenFg.gif' alt='' ширина='1000' высота='auto'>

`**⭐️ #Files**`

Search и выбрать files в the code repository as context.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VcWsbki1MohwabxGtRPcZnXXnGb.gif' alt='' ширина='1000' высота='auto'>

`**⭐️ #Code**`

Search и выбрать functions и classes в the code repository as context.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/FDTHbZ2Hko9WrSx2JqWcJRRnnUf.gif' alt='' ширина='1000' высота='auto'>

Below is an example из how к use the Marscode AI Programming Assistant для coding.

## 5.1 Quickly Familiarize с the Entire Repository

Here, use ** # к summon #Workspace ** и then ask it к help generate a project structure description document.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-structure.png' alt='' ширина='1000' высота='auto'>

We can still ask further questions about subfolders.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/AdgDb1oGFoAyaRxkW8xciziInvf.gif' alt='' ширина='1000' высота='auto'>

## 5.2 Explaining Code

### 5.2.1 Generate Code Descriptions

When we выбрать a piece из code в a file, we can choose the Explain command от the floating menu, и [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) will generate a detailed code explanation для us, which we can proofread и adapt.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/K2RVbq5broy4rpxSStYcA4J7ndf.gif' alt='' ширина='1000' высота='auto'>

Вы можете also directly enter the Explain command в the диалог box.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/TH9ybov7JomacGxBX2QcccwFnvc.gif' alt='' ширина='1000' высота='auto'>

Here, Вы можете also directly use the #Code context mentioned above к combine Explain с your instructions для more detailed tasks.

### 5.2.2 Generate Explanation для the Entire File

Explain can be used с Context или Files commands к generate explanations для the entire file.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HyeabsSvjoHYZ9xAbLRc55j8nDg.gif' alt='' ширина='1000' высота='auto'>

## 5.3 Content Retrieval

Usually, для каждый Q&A session, [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) will provide reference documents, which can offer more contextual reference для further analysis.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OeF0bP4jPoUZWGxqDqScyHzhnvf.gif' alt='' ширина='1000' высота='auto'>

Вы можете also directly perform file retrieval:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-gantt.png' alt='' ширина='1000' высота='auto'>

## 5.4 Code Generation

в daily coding, we often encounter scenarios where repetitive code is used. Sometimes you may не know if a certain функция has already been implemented. в this time, use `#Workspace` к ask questions. для example:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-create-gantt.png' alt='' ширина='1000' высота='auto'>

## 5.5 Adding Comments

Use the "/doc" command к generate code comments.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-create-commit.png' alt='' ширина='1000' высота='auto'>

## 5.6 Generating Unit Tests

The unit test code для VTable is located в the `__tests__` directory из каждый package.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/code-unit-test.png' alt='' ширина='1000' высота='auto'>

Use the [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) "/test" command к quickly generate unit test code.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OnTDbxBAzoQ9h7xEk6vcpYjAnNd.gif' alt='' ширина='1000' высота='auto'>

## 5.7 Intelligent Suggestions

During writing, the intelligent generation из необязательный code is a standard feature из the programming assistant. Please feel free к explore this feature.

# Submitting Code

After completing the documentation, первый push the code к your remote branch. для example:

```
git commit -a -m "docs: add custom funnel demo и related docs"

```

The commit сообщение для VisActor follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, **demo uses docs**

`<тип>[необязательный scope]: <description>`

Common types include docs (documentation, log changes), feat (новый features), fix (problem fixes), refactor (code refactoring), etc. Please choose based на the actual situation.

Please write the description с a concise и accurate English description.

Before submitting a commit, we will conduct commit lint checks. для more details, please see [check rules](https://github.com/VisActor/VTable/blob/develop/common/autoinstallers/lint/commitlint.config.js).

## Writing Documents и Demos

If you have added an API или a новый feature, please modify the relevant configuration documents. If necessary, please add the corresponding official website demo. к начало the tutorial, run:

```
# Comment: начало the official website page в the outer directory. начало site development server, execute в file path: ./
$ rush docs
```

## Generating Changelog

If it is a bug fix или a новый feature submission, please generate the changelog before pushing. After running Следующий command, the commit information из the последний submission will be used к generate the changelog:

```
# Comment: Generate changelog after submitting code. after executing git commit, please run Следующий command к update the change log. Please execute в file path: ./

rush change-все
```

Следующий files are generated в common:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/contribute-changelog.png' alt='' ширина='400' высота='auto'>

## Resolving Code Conflicts

A common issue is that the remote upstream (@visactor/VTable) has новый updates, which may cause conflicts when you submit a Pull Request. Therefore, Вы можете merge the commits от other developers с your commits before submitting. Use Следующий code к switch к the develop branch:

```
git checkout develop

```

Use Следующий code к pull out the latest code от upstream:

```
git pull upstream develop

```

Switch back к your development branch:

```
git checkout docs/add-funnel-demo

```

Merge the commits от develop into your branch:

```
git rebase develop

```

Submit the updated code к your branch:

```
git push origin docs/add-funnel-demo

```

# Submitting a PR

Вы можете нажать the `Compare & pull request` кнопка на your GitHub code repository page.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/H0J8bpv2qoodVCxPfFTcRHL1nCf.gif' alt='' ширина='1000' высота='auto'>

или create one through the `contribute` кнопка:

Fill в the modification details из this submission according к the template:

- Check what тип из modification this is

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/AgIOb5bRAo7UUVxS52AcNZCanad.gif' alt='' ширина='692' высота='auto'>

- Fill в the associated issue

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VGonbJeFJoc68XxDzkOc7j8Lnjd.gif' alt='' ширина='470' высота='auto'>

- If there are complex changes, please explain the фон и solution

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HYy2bLtuCopGfxxdeKkc2pt0n4e.gif' alt='' ширина='1000' высота='auto'>

After filling в the relevant information, нажать Create pull request к submit.

An administrator will review the PR к decide whether к approve it. If не approved, modifications will be needed before resubmitting.

# следующий Step

следующий, Вы можете read the implementation principles и source code explanations из каждый module, или join в contributing к these documents.

Please join the VisActor family и contribute your efforts!

GitHub: [github.com/VisActor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FVisActor)

VisActor WeChat Subscription (Вы можете join the WeChat group through the subscription menu):

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ZqQ2bVj6woabSXxeLKOce9rrn9d.gif' alt='' ширина='258' высота='auto'>

VisActor Official Website: [www.visactor.io/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvtable)

Feishu Group:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/F0GRbKlLOoHUwRx9JBVcKxk0n6g.gif' alt='' ширина='264' высота='auto'>

Discord: https://discord.com/invite/3wPyxVyH6m

# This Document Was Contributed по

[玄魂](https://github.com/xuanhun)
[方帅](https://github.com/fangsmile)
