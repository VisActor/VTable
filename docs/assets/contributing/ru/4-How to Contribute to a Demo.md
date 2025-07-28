---
title: 4. Как Вносить Вклад в Демо

key words: VisActor, VChart, VTable, VStory, VMind, VGrammar, VRender, Визуализация, Диаграмма, Данные, Таблица, График, ГИС, LLM
---

# Создание Ветки

Ветка по умолчанию для VTable - это ветка develop. Будь то разработка функций, исправление ошибок или написание документации, пожалуйста, создайте новую ветку перед объединением ее с веткой develop. Используйте следующий код для создания ветки:

```
// Создание ветки документации/демо
git checkout -b docs/add-funnel-demo

```

# Поиск или Создание Issue

В принципе, мы требуем, чтобы каждый PR имел соответствующий issue. Перед началом разработки, пожалуйста, убедитесь, что есть соответствующий issue, и что issue еще не заявлен.

## Поиск Issues по Демо

Вы можете искать issues, связанные с демо, используя следующий метод:

```
 label:demos 

```
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RDQZbKyEYomaIRx7jwJccGoMnId.gif' alt='' ширина='769' высота='auto'>

некоторые features may have the doc label associated с them. Check further if the issue is purely a demo task.

## Creating a Demo Issue

нажать "новый ISSUE" к открыть the issue selection page и choose "**Others**."

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VNGhbVirmoaQTIxhOlFc61w3nqb.gif' alt='' ширина='1000' высота='auto'>

Fill в the information related к the document issue you want к submit, и tag it с "demos."

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Cc8SbSAFFoCvQ2xJFd6cjv17nyc.gif' alt='' ширина='1000' высота='auto'>

# Claiming an Issue

If you want к submit a demo или fix a demo bug, Вы можете leave a сообщение в the issue к claim it. The administrator will contact you, и after confirmation, assign the issue к you.

для example:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Q2vGbhmevorebJxa8Toc1hmtnMc.gif' alt='' ширина='988' высота='auto'>

# Creating или Modifying a Demo

The location из VTable documentation и demos within the project is as follows (examples):

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/code-demos.png' alt='' ширина='1000' высота='auto'>

Taking the example document из a basic area chart as an example (currently, a single example contains both Chinese и English versions, located under the paths zh & en respectively):

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/md-site.png' alt='' ширина='1000' высота='auto'>

Example Markdown content is divided into several parts:

* Metadata: Attribute definitions из the example content, including chart category, cover image, keywords, etc.

* Title: The main content under the первый-level title corresponds к the description information из the example.

* Key Configuration: Explanation из the key configurations included в the example, which will be displayed в the "Key Configuration" section на the право side из the example page.

* Code Demonstration: The specific code content executed в the example; currently only native JavaScript code is supported.

The field definitions из Markdown metadata are:

* group: The classification information из the example, describing which chart category the текущий example belongs к.

* title: The example title

* keywords: Keywords из the example

* order: The order criterion из the example within the same group

* cover: The cover image из the example

* tutorial: The tutorial link к jump к (the по умолчанию example tutorial will jump к the tutorial corresponding к the example group)

Currently, chart examples в the group include multiple categories such as area chart, bar chart, combination, storytelling, etc., corresponding к все categories under the VTable example gallery. Refer к existing example documents для specific classification fields.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/site-demos.png' alt='' ширина='1000' высота='auto'>

# Writing Demos с the Help из Doubao Marscode AI Programming Assistant
[Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a)

с the help из Doubao [Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a), Вы можете get comprehensive assistance throughout the document creation process.

If you haven't installed the [Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a), please download it от this link: https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a

During demo writing, using context instructions reasonably can improve content accuracy.

`**⭐️ #Workspace**`

выбрать global code в the Workspace as context; AI will automatically find related code Context according к user Query.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XQaqbAX59oLBKOxR7ngctRbQnXb.gif' alt='' ширина='1000' высота='auto'>

`**⭐️ #Files**`

Search и выбрать files в the code repository as context

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MhZTbAAD2oj1XJxil8WcHYSWn6d.gif' alt='' ширина='1000' высота='auto'>

`**⭐️ #Code**`

Search и выбрать functions или classes в the code repository as context

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V4M7bX87hoHOxOxM1Nfc9of0nhL.gif' alt='' ширина='1000' высота='auto'>

Below is an example из how к use the [Marscode AI Programming Assistant](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) для demo writing.

## 5.1 Providing a Document Framework

Here **invoke #Workspace**, then ask a question, выбрать a document content из an example и hope it generates a новый example document в the same manner.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-create-demo.png' alt='' ширина='1000' высота='auto'>

We can continue к make adjustments на this basis.

## 5.2 Generating Descriptive текст

The description текст для каждый demo can be initially generated using [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a), и then proofread и adjusted. для example:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-gantt-config.png' alt='' ширина='1000' высота='auto'>

## 5.3 Generating Example Code

к better explain principles и usage, it is usually necessary к provide a runnable demo. The code generation capability из [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) can be used к generate example code. However, the текущий code generation capabilities из various AIs cannot guarantee accuracy и require further verification.

## 5.4 Content Retrieval

Usually, в каждый Q&A, [Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a) will provide reference documents, which can offer more contextual references для further analysis.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DGyBbfi99oucAYxxkyJcfka3nJa.gif' alt='' ширина='1000' высота='auto'>

Вы можете also perform file retrieval directly:

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/marscode-gantt.png' alt='' ширина='1000' высота='auto'>

# Submitting Code

After the document is completed, push the code к your remote branch, для example:

```
git commit -a -m "docs: add custom funnel demo и related docs" 

```

The commit сообщение для VisActor follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention. **для demo, use docs**

`<тип>[необязательный scope]: <description>`

Common `тип` includes docs (documentation/log modifications), feat (новый feature), fix (bug fix), refactor (code restructuring), etc., please choose based на the actual situation.

Please write the description в brief и precise English.

Before submitting a commit, we perform a commit lint check, which Вы можете check в the [check rules](https://github.com/VisActor/VTable/blob/develop/common/autoinstallers/lint/commitlint.config.js).

A common issue is that the remote upstream (@visactor/VTable) has новый updates, which can lead к conflicts during the submission из a Pull Request. Thus, before submission, Вы можете merge the commits от other developers remotely into your commit. Use Следующий code к switch к the develop branch:

```
git checkout develop

```

Use Следующий code к pull the latest remote code:

```
git pull upstream develop

```

Switch back к your development branch:

```
git checkout docs/add-funnel-demo

```

Merge the develop commits into your branch:

```
git rebase develop

```

Push the updated code к your branch:

```
git push origin docs/add-funnel-demo

```

# Submitting a PR

Вы можете нажать the `Compare & pull request` кнопка на your GitHub repository page.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/FWm3bZjbnoaqUOxiygXcFdLznwf.gif' alt='' ширина='1000' высота='auto'>

или create via the `contribute` кнопка:

Fill в the modified content из this submission according к the template:

* Check what тип из modification this is

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/V7xpbJhhEoSoCExC31WcyKvHnDe.gif' alt='' ширина='692' высота='auto'>

* Fill в the associated issue

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/O6YqbpdxgodBjfxHXEpcwob4n5E.gif' alt='' ширина='470' высота='auto'>

* If there are complex changes, explain the фон и solution

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/QsnYbfLCio4u3MxK2uIc8epKnXh.gif' alt='' ширина='1000' высота='auto'>

After filling в the relevant information, нажать Create pull request к submit.

The administrator will review the PR к decide whether к approve it; if не, modifications need к be made, и a resubmission is обязательный.

# следующий Step

следующий, Вы можете continue к explore different types из tasks.

GitHub: [github.com/VisActor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FVisActor)

VisActor WeChat subscription account сообщение (Вы можете join the WeChat group through the subscription account menu):

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/I8OdbhGfkort6oxqHW6cR492n7d.gif' alt='' ширина='258' высота='auto'>

VisActor Official Website: [www.visactor.io/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvtable)

Feishu Group:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DdEAbEU9yoFq9IxjrN4curJnnyf.gif' alt='' ширина='264' высота='auto'>

Discord: https://discord.com/invite/3wPyxVyH6m


# This Document Was Contributed по
[玄魂](https://github.com/xuanhun)