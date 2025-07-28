---
title: 1-Настройка-Среды-Разработки

key words: VisActor, VChart, VTable, VStory, VMind, VGrammar, VRender, Визуализация, Диаграмма, Данные, Таблица, График, ГИС, LLM
---
# Github 

## 1.1 Регистрация Аккаунта

Команда VisActor обычно разрабатывает и поддерживает проекты на GitHub. Пожалуйста, посетите [GitHub](https://github.com/), нажмите кнопку `Sign up` в правом верхнем углу, чтобы зарегистрировать свой аккаунт и начать свое путешествие в открытый исходный код.

Если вы не можете получить доступ к GitHub из-за определенных ограничений, пожалуйста, сообщите нам об этом и используйте [Gitee](https://gitee.com/VisActor/VTable) для разработки проекта.

## 1.2 Форк Проекта

Сначала вам нужно создать форк этого проекта. Перейдите на [страницу проекта VTable](https://github.com/VisActor/VTable) и нажмите кнопку Fork в правом верхнем углу.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/github-fork.png' alt='' ширина='1000' высота='auto'>

Проект появится как xxxx (ваше имя пользователя GitHub)/VTable в вашем аккаунте GitHub.

<img src='https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/contributing/github-fork-self.png' alt='' ширина='849' высота='auto'>

# Локальная Среда Разработки

## 2.1 Установка Git

Поскольку код хранится на GitHub, мы используем git для контроля версий.

Git - это система контроля версий, которая помогает отслеживать и управлять изменениями кода в проектах разработки программного обеспечения. Она помогает разработчикам записывать и управлять историей кода, делая командную работу, контроль версий кода и слияние кода проще. С Git вы можете отслеживать каждую версию каждого файла, легко переключаться и сравнивать между различными версиями. Git также предлагает функции управления ветками, позволяя одновременно выполнять несколько параллельных задач разработки.

*  Посетите официальный веб-сайт Git: [https://git-scm.com/](https://git-scm.com/)

*  Скачайте последнюю версию установщика Git.

*  Запустите скачанный установщик и следуйте указаниям мастера установки.

*  После установки вы можете проверить установку, используя `git version` в командной строке.

```
HM4G2J09L6:~ xuanhun$ git version
**git version 2.39.2 (Apple Git-143)**
```

## 2.2 Установка Инструмента Разработки (Рекомендуется: VSCode)

VisActor преимущественно использует стек технологий фронтенда. Существует множество инструментов для фронтенд-разработки, но мы рекомендуем использовать VSCode. Конечно, вы можете использовать любой инструмент разработки, который предпочитаете.

Если вы не знакомы с VSCode, может быть полезно прочитать официальную документацию: https://vscode.js.cn/docs/setup/setup-overview

## 2.3 Установка Помощника ИИ Программирования Doubao Marscode


[Помощник ИИ Программирования Marscode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a)


Помощник Программирования Doubao MarsCode - это ИИ помощник программирования от Doubao, который предоставляет функции ИИ, представленные интеллектуальным завершением кода. Он поддерживает основные языки программирования и IDE, предлагая предложения для написания одной строки кода или целой функции во время разработки. Кроме того, он предлагает такие функции, как объяснение кода, генерация модульных тестов и исправление проблем, повышая эффективность и качество разработки. Для получения дополнительной информации, пожалуйста, обратитесь к [документации Помощника Программирования Doubao MarsCode](https://www.marscode.cn/home?utm_source=developer&utm_medium=oss&utm_campaign=visactor_a).

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DLaKb4PysoADAZx0x1RcYjXbnBe.gif' alt='' ширина='760' высота='auto'>

С Marscode разработчики VisActor могут легче понимать код, писать документацию, разрабатывать функции и выполнять модульное тестирование. Подробные примеры будут предоставлены в конкретных руководствах по вкладу в задачи.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BQeib7E2gonoOaxLPqjcRtAYngh.gif' alt='' ширина='1000' высота='auto'>

## 2.4 Клонирование Кода Локально

Войдите в папку VTable и добавьте удаленный адрес для VTable.

```
git remote add upstream https://github.com/VisActor/VTable.git
```

Получите последний исходный код для VTable.

```
git pull upstream develop
```

# Инициализация Проекта

Сначала глобально установите [<u>@microsoft/rush</u>](https://rushjs.io/pages/intro/get_started/)

```
$ npm i --global @microsoft/rush
```

Затем выполните команду для просмотра демо

```
# Установка зависимостей
$ rush update
# Запуск демо-страницы для VTable
$ cd ./packages/VTable && rushx demo
# Запуск демо-страницы для react-VTable
$ cd ./packages/react-VTable && rushx начало
# Запуск локального сайта документации
$ rush docs
```

# Следующие Шаги

На этом этапе вы завершили подготовку к разработке кода. Пожалуйста, продолжите чтение следующего руководства, чтобы начать работу над различными типами задач.

github: [github.com/VisActor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FVisActor)

Подписка на WeChat VisActor (вы можете присоединиться к группе WeChat через меню подписки):

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KLjmbz9TtoGzPIxarv7cmhpgnSY.gif' alt='' ширина='258' высота='auto'>

Официальный сайт VisActor: [www.visactor.io/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvtable)

Группа Feishu:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Cv9xb0zzLoUWyaxMVgccWuGPn7d.gif' alt='' ширина='264' высота='auto'>

discord: https://discord.com/invite/3wPyxVyH6m

# Этот Документ Был Подготовлен
[玄魂](https://github.com/xuanhun)