# Contribution Guide

Firstly, I applaud your decision to join the ranks of open source contributors👍🏻. Moreover, we're very thankful you chose to participate in the VisActor community and contribute to this open-source project.

## VTable Contribution Guide

VisActor team usually develops and maintains issues on github. Please open [Github website](https://github.com/), click the `Sign up` button in the upper right corner, and register an account to start your first step in the open source journey.

If you can't open the Github site for some reason, you can also develop the project through [Gitee](https://gitee.com/VisActor/VTable).

In the [VTable repository](https://github.com/VisActor/VTable), we have a [guide](https://github.com/VisActor/VTable/blob/develop/CONTRIBUTING.zh-CN.md) for all open source contributors, which introduces version management, branch management, and other content. **Please take a few minutes to read and understand it**.

## Your First PullRequest

### Step1: Install Git

Git is a version control system used to track and manage code changes in software development projects. It helps developers record and manage code history, facilitate team collaboration, code version control, merge code, and more. With Git, you can track every version of every file and easily switch and compare between different versions. Git also provides branch management capabilities, allowing for multiple parallel development tasks to be performed simultaneously.

- Visit the Git official website: <https://git-scm.com/>
- Download the latest version of Git installer.
- Run the downloaded installer and follow the prompts in the installation wizard.
- After installation, you can use the `git version` command through the command line to confirm successful installation.

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_1.png" />
  </div>

### Step2: Fork the project

- You need to fork this project first, go to the [VTable project page](https://github.com/VisActor/VTable), and click the Fork button in the upper right corner

<div style="width: 80%; text-align: center;">
    <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_2.png" />
 </div>

- You will find the project "xxxx(your github username)/VTable" in your github account.
- On your local computer, use the following command to get a "VTable" folder.

```
// ssh
git clone git@github.com:xxxx(your github user name)/VTable.git
// https
git clone https://github.com/xxxx(your github user name)/VTable.git
```

### Step3: Get the Project Code

- Enter the VTable folder and add the remote address of VTable

```
git remote add upstram https://github.com/VisActor/VTable.git
```

- Get the latest source code of VTable

```
git pull upstram develop
```

### Step4: Create a Branch

- Okay, now we can start contributing our code. The default branch of VTable is the develop branch. Whether it is for feature development, bug fixes, or documentation writing, please create a new branch and merge it into the develop branch. Use the following code to create a branch:

```
// Create a feature development branch
git checkout -b feat/xxxx

// Create a development branch for issue fixing
git checkout -b fix/xxxx

// Create document, demo branch
git checkout -b docs/add-funnel-demo
```

- Now we can make changes to the code on the branch.
- Let's say we've added some code and committed it to the repository.
- `git commit -a -m "docs: add custom funnel demo and related docs"`. The commit message for VisActor follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

  - `<type>[optional scope]: <description>`.
  - Common `type` include docs (documentation, log changes), feat (new features), fix (bug fixes), refactor (code refactoring), etc. Please choose according to the actual situation.
  - Please write the description in English with short and accurate descriptions.
  - Before committing, we will perform commit lint checks. For details, see [inspection rules](https://github.com/VisActor/VTable/blob/develop/common/autoinstallers/lint/commitlint.config.js).

### Step5: Merge and Modify

- A common problem is that the remote upstram (@visactor/VTable) has been updated with new commits, which can cause conflicts when we submit a Pull Request. Therefore, we can merge the commits from other developers on the remote repository with our commits before submitting. To switch to the develop branch, use the following code:

```
git checkout develop
```

- Use the following code to pull the latest code from remote:

```
git pull upstram develop
```

- Switch back to your development branch.

```
git checkout docs/add-funnel-demo
```

- Merge the commit of develop into `add-funnel-demo`:

```
git rebase develop
```

- Commit the updated code to your own branch:

```
git push origin docs/add-funnel-demo
```

### Step6: Submit a Pull Request

You can click the `Pull requests `button on your GitHub code repository page and then click `New pull request`.

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_3.png" />
  </div>

Choose to submit to the develop branch.

Fill in the changes of this submission according to the template:

- Check what type of change it is.

<div style="display: flex;">
 <div style="width: 30%; text-align: center; ">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_4.png" />
  </div>
    </div>

- Fill in the associated issue

<div style="display: flex;">
 <div style="width: 20%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_5.png" />
  </div>
  </div>

- For complex changes, please explain the background and solution.

<div style="display: flex;">
 <div style="width: 60%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_6.png" />
  </div>
  </div>

After filling in the relevant information, click Create pull request to submit.

## Mini Task Development Guide

"**good first issue**" is a common label in open source communities, and its purpose is to help new contributors find suitable entry-level issues.

For entry-level issues of VTable, you can view them through the [issue list](https://github.com/VisActor/VTable/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22), which currently includes two types:

- Demo writing
- Bug fixes and simple feature development

If you currently **have the time and willingness** to participate in community contributions, you can look at **good first issue** in the issue and choose one that interests you and suits you.

I believe you must be a person who has a beginning and an end, so when you understand and decide to claim an issue, please leave a message under the issue to let everyone know.

### Demo Task

We have prepared some common cases in practical application scenarios that require you to think about how to utilize the capabilities of VTable to achieve them. You can use these tasks to get started with using VTable. VTable provides rich capabilities, and everyone may have different implementation ideas. **You can leave a comment under the issue and discuss your solution with others**.

After completing the task, you can submit your created case to the official demo on the website, allowing more people in need to learn and use it. All demos are stored in the `docs/assets/demo` directory.

1.  Please base your development on the `develop` branch and create a new `docs/***` branch.
1.  (Skip this step if you have already installed it) Globally install [@microsoft/rush](https://rushjs.io/pages/intro/get_started/) using `npm i --global @microsoft/rush`
1.  Run `rush update` from the root directory.
1.  Run `rush docs` to preview the current demo content locally.
1.  Under the `docs` directory:
1.  Add your demo information to the `docs/assets/demo/menu.json` directory file.
1.  Complete the Chinese and English demo documents in the `zh`/`en` directories, respectively.
1.  For the cover address cover field, you can contact the VTable team members to assist with uploading.
1.  Commit all your code and create a Pull Request on Github, inviting others to review it.

### Bug fix/Feature Task

Here are some simple and easy-to-get-started feature development tasks. If you have a certain foundation in JavaScript/TypeScript, you can claim these tasks.

You can learn the VTable code architecture more quickly by developing requirements. **You can leave a message under the issue and discuss your solution with everyone**.

1.  Please base your development on the develop branch and create a new `feat/***` or `fix/***` branch.
1.  (Skip this step if you have already installed it) Globally install @microsoft/rush: `npm i --global @microsoft/rush`.

```
# install dependencies
$ rush update
# enter vtable package
$ cd packages/vtable
# execute in file path: ./packages/vtable
$ rushx demo
# start site development server, execute in file path: ./
$ rush docs
# after execut git commit, please run the following command to update the change log. Please execute in file path: ./
$ rush change-all
```

3.  Submit all code and create a Pull Request on Github, inviting others to review it.

### Promotion Task Contribution Guide
A promotion task refers to the action of publicly releasing materials related to VisActor, such as articles, demos, videos, etc., across various media channels.

You can create a new issue, select the type others and tag it with promotion. Then, post it along with relevant links, screenshots, summaries, etc.

For example, see https://github.com/VisActor/VChart/issues/2858.

Every quarter, we will select some promotional works for VisActor and provide the authors with material rewards.

## Embrace the VisActor Community

In addition to contributing code to VisActor, we encourage you to participate in other activities that will make the community more prosperous, such as:

1.  Suggesting ideas for project development, functional planning, etc.
1.  Creating articles, videos, and holding lectures to promote VisActor.
1.  Writing promotion plans and executing them together with the team.

VisActor is also committed to helping students who participate in community building grow together. We plan (but are not limited to, and we look forward to more suggestions from everyone) to provide the following assistance:

1.  Data visualization research and development training based on VisActor to help participating students grow rapidly in programming skills, visualization theory, architecture design, and other aspects.
1.  Regularly select "Code Contribution Awards" and "Community Promotion Awards."
1.  Organize community members to participate in open source activities
