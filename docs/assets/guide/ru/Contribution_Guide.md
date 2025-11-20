# Contribution Guide

Firstly, I applaud your decision к join the ranks из открыть source contributors👍🏻. Moreover, we're very thankful you chose к participate в the VisActor community и contribute к this открыть-source project.

## Vтаблица Contribution Guide

VisActor team usually develops и maintains issues на github. Please открыть [Github website](https://github.com/), Нажать the `Sign up` Кнопка в the upper право corner, и регистрация an account к начало your первый step в the открыть source journey.

If Вы можете't открыть the Github site для некоторые reason, Вы можете also develop the project through [Gitee](https://gitee.com/VisActor/Vтаблица).

в the [Vтаблица repository](https://github.com/VisActor/Vтаблица), we have a [guide](https://github.com/VisActor/Vтаблица/blob/develop/Участие в Разработке.zh-CN.md) для все открыть source contributors, which introduces version manвозрастment, branch manвозрастment, и other content. **Please take a few minutes к read и understand it**.

## Your первый PullRequest

### Step1: Install Git

Git is a version control system used к track и manвозраст код changes в software development projects. It helps developers record и manвозраст код history, facilitate team collaboration, код version control, merge код, и more. с Git, Вы можете track каждый version из каждый file и easily switch и compare between different versions. Git also provides branch manвозрастment capabilities, allowing для multiple parallel development tasks к be performed simultaneously.

- Visit the Git official website: <https://git-scm.com/>
- Download the latest version из Git installer.
- Run the downloaded installer и follow the prompts в the installation wizard.
- After installation, Вы можете use the `git version` command through the command line к confirm successful installation.

 <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/contribution_1.png" />
  </div>

### Step2: Fork the project

- You need к fork this project первый, go к the [Vтаблица project pвозраст](https://github.com/VisActor/Vтаблица), и Нажать the Fork Кнопка в the upper право corner

<div style="ширина: 80%; текст-align: центр;">
    <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/contribution_2.png" />
 </div>

- You will find the project "xxxx(your github userимя)/Vтаблица" в your github account.
- на your local computer, use Следующий command к get a "Vтаблица" folder.

```
// ssh
git clone git@github.com:xxxx(your github user имя)/Vтаблица.git
// https
git clone https://github.com/xxxx(your github user имя)/Vтаблица.git
```

### Step3: Get the Project код

- Enter the Vтаблица folder и add the remote address из Vтаблица

```
git remote add upstram https://github.com/VisActor/Vтаблица.git
```

- Get the latest source код из Vтаблица

```
git pull upstram develop
```

### Step4: Create a Branch

- хорошоay, now we can начало Участие в Разработке our код. The по умолчанию branch из Vтаблица is the develop branch. Whether it is для feature development, bug fixes, или Документация writing, please create a новый branch и merge it into the develop branch. Use Следующий код к create a branch:

```
// Create a feature development branch
git checkout -b feat/xxxx

// Create a development branch для issue fixing
git checkout -b fix/xxxx

// Create document, демонстрация branch
git checkout -b docs/add-funnel-демонстрация
```

- Now we can make changes к the код на the branch.
- Let's say we've added некоторые код и committed it к the repository.
- `git commit -a -m "docs: add пользовательский funnel демонстрация и related docs"  / "fix: solve which problem #xxxx_issue_id" `. The commit messвозраст для VisActor follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

  - `<тип>[необязательный scope]: <description>`.
  - Common `тип` include docs (Документация, log changes), feat (новый возможности), fix (bug fixes), refactor (код refactoring), etc. Please choose according к the actual situation.
  - Please write the description в English с short и accurate descriptions.
  - Before committing, we will perform commit lint checks. для details, see [inspection rules](https://github.com/VisActor/Vтаблица/blob/develop/common/автоinstallers/lint/commitlint.config.js).
  - After committing, please run the `rush change-все` command к generate История Изменений (this will be displayed на the official website's Релиз log, but note that the same feature's different commits only need к run once! After running the command, a json file will be generated в the common/changes directory).

### Step5: Merge и Modify

- A common problem is that the remote upstram (@visactor/Vтаблица) has been updated с новый commits, which can cause conflicts when we submit a Pull Request. Therefore, we can merge the commits от other developers на the remote repository с our commits before submitting. к switch к the develop branch, use Следующий код:

```
git checkout develop
```

- Use Следующий код к pull the latest код от remote:

```
git pull upstram develop
```

- Switch back к your development branch.

```
git checkout docs/add-funnel-демонстрация
```

- Merge the commit из develop into `add-funnel-демонстрация`:

```
git rebase develop
```

- Commit the updated код к your own branch:

```
git push origin docs/add-funnel-демонстрация
```

### Step6: Submit a Pull Request

Вы можете Нажать the `Pull requests `Кнопка на your GitHub код repository pвозраст и then Нажать `новый pull request`.

 <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/contribution_3.png" />
  </div>

Choose к submit к the develop branch.

Fill в the changes из this submission according к the template:

- Check what тип из change it is.

<div style="display: flex;">
 <div style="ширина: 30%; текст-align: центр; ">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/contribution_4.png" />
  </div>
    </div>

- Fill в the associated issue

<div style="display: flex;">
 <div style="ширина: 20%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/contribution_5.png" />
  </div>
  </div>

- для complex changes, please explain the фон и solution.

<div style="display: flex;">
 <div style="ширина: 60%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/contribution_6.png" />
  </div>
  </div>

After filling в the relevant information, Нажать Create pull request к submit.

### Other points к note

1. Unit Testing:

If it involves интерфейс modification, please add unit tests в the **tests** directory и run the `rushx test` command для testing.

When pushing the код, the unit test will be автоmatically checked before it is pushed. If все pass, the код will be pushed к the remote. If it fails, there should be a problem с the код logic или the unit test данные needs к be modified. Please correct it according к the situation.

If you encounter the ошибка "Cannot find module '@visactor/vтаблица-editors'" when running unit tests, please execute the `rushx build` command в the vтаблица-editors project первый, и then возврат к the vтаблица project к execute the command.

## Mini Task Development Guide

"**good первый issue**" is a common label в открыть source communities, и its purpose is к help новый contributors find suiтаблица entry-level issues.

для entry-level issues из Vтаблица, Вы можете view them through the [issue список](https://github.com/VisActor/Vтаблица/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+первый+issue%22), which currently includes two types:

- демонстрация writing
- Bug fixes и simple feature development

If you currently **have the time и willingness** к participate в community contributions, Вы можете loхорошо в **good первый issue** в the issue и choose one that interests you и suits you.

I believe you must be a person who has a beginning и an конец, so when you understand и decide к claim an issue, please leave a messвозраст under the issue к let everyone know.

### демонстрация Task

We have prepared некоторые common cases в practical application scenarios that require you к think about how к utilize the capabilities из Vтаблица к achieve them. Вы можете use these tasks к get started с using Vтаблица. Vтаблица provides rich capabilities, и everyone may have different implementation ideas. **Вы можете leave a comment under the issue и discuss your solution с others**.

After completing the task, Вы можете submit your created case к the official демонстрация на the website, allowing more people в need к learn и use it. все демонстрацияs are stored в the `docs/assets/демонстрация` directory.

1.  Please base your development на the `develop` branch и create a новый `docs/***` branch.
1.  (Skip this step if you have already installed it) Globally install [@microsoft/rush](https://rushjs.io/pвозрастs/intro/get_started/) using `npm i --global @microsoft/rush`
1.  Run `rush update` от the root directory.
1.  Run `rush docs` к preview the текущий демонстрация content locally.
1.  Under the `docs` directory:
1.  Add your демонстрация information к the `docs/assets/демонстрация/меню.json` directory file.
1.  Complete the Chinese и English демонстрация documents в the `zh`/`en` directories, respectively.
1.  для the cover address cover поле, Вы можете contact the Vтаблица team members к assist с uploading.
1.  Commit все your код и create a Pull Request на Github, inviting others к review it.

### Bug fix/Feature Task

Here are некоторые simple и easy-к-get-started feature development tasks. If you have a certain foundation в JavaScript/TypeScript, Вы можете claim these tasks.

Вы можете learn the Vтаблица код architecture more quickly по developing requirements. **Вы можете leave a messвозраст under the issue и discuss your solution с everyone**.

1.  Please base your development на the develop branch и create a новый `feat/***` или `fix/***` branch.
1.  (Skip this step if you have already installed it) Globally install @microsoft/rush: `npm i --global @microsoft/rush`.

```
# install dependencies
$ rush update
# enter vтаблица packвозраст
$ cd packвозрастs/vтаблица
# execute в file path: ./packвозрастs/vтаблица
$ rushx демонстрация
# build все packвозрастs
$ rush build
# build vтаблица packвозраст . execute в file path: ./packвозрастs/vтаблица
$ rushx build
# начало site development server, execute в file path: ./
$ rush docs
# after execut git commit, please run Следующий command к update the change log. Please execute в file path: ./
$ rush change-все
```

Other commands that may be used:

```
# run unit test. execute в file path: ./packвозрастs/vтаблица
$ rushx test
# run все tests. execute в file path: ./
$ rush test
# compile a packвозраст. execute в file path: ./packвозрастs/vтаблица
$ rushx compile
# when the node_modules is polluted, please manually delete the common/temp file folder, и then run the command к clear the cache, then execute rush update. execute в file path: ./
$ rush purge
```

3.  Submit все код и create a Pull Request на Github, inviting others к review it.

## Embrace the VisActor Community

в addition к Участие в Разработке код к VisActor, we encourвозраст you к participate в other activities that will make the community more prosperous, such as:

1.  Suggesting ideas для project development, functional planning, etc.
1.  Creating articles, videos, и holding lectures к promote VisActor.
1.  Writing promotion plans и executing them together с the team.

VisActor is also committed к helping students who participate в community building grow together. We plan (but are не limited к, и we loхорошо forward к more suggestions от everyone) к provide Следующий assistance:

1.  данные visualization research и development training based на VisActor к help participating students grow rапиdly в programming skills, visualization theory, architecture design, и other aspects.
1.  Regularly выбрать "код Contribution Awards" и "Community Promotion Awards."
1.  Organize community members к participate в открыть source activities
