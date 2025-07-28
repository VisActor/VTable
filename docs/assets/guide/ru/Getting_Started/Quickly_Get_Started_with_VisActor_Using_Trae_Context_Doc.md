---
заголовок: Using Cursor с DeepSeek к Quickly Get Started с Unfamiliar компонентs

key words: VisActor, Vграфик, Vтаблица, VStory, VMind, VGrammar, VRender, Visualization, график, данные, таблица, Graph, Gis, LLM
---
в today's software development поле, developers face the challenge из continuously improving development efficiency и reducing the learning curve. The core purpose из this document is к help developers achieve this goal, especially по cleverly using **компонент official Документация** и combining tools like **Cursor** и **DeepSeek** к let AI автоmatically generate the обязательный код, quickly lowering the entry barrier. следующий, we will experiment с several projects в the relatively новый открыть-source project, VisActor (https://www.visactor.com; https://www.visactor.io/), an открыть-source visualization solution, к see how effective it is.

# Preparation

## Create a Test Project

для пример, I have a simple project initialized с `npx create-react-app my-app --template typescript`, which loхорошоs like this after starting:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/C4cabsu8gхорошоMv4xiaBtcDqvmnuf.gif' alt='' ширина='1000' высота='авто'>

## Obtain DeepSeek апи Key

регистрация с DeepSeek и create your апи key на the [DeepSeek апи](https://platform.deepseek.com/апи_keys) official website.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/JNQPbFzIOoYknHxr3aDcg60onCg.gif' alt='' ширина='1000' высота='авто'>

## Configure Cursor

Official website: https://www.cursor.com/

Download и регистрация, открыть your Vграфик project с Cursor, и configure Cursor.

Using DeepSeek-V3 as an пример, its апи model имя is `deepseek-chat`, и the апи address is https://апи.deepseek.com/v1. для more details, see the [апи usвозраст official website](https://апи-docs.deepseek.com/zh-cn).

Create a новый model на the model pвозраст, set the corresponding апи address и model имя.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WBBCb55WwoF3HUxnhGtc6P5Un5c.gif' alt='' ширина='1000' высота='авто'>

из course, Вы можете also use любой other AI model; here, we use DeepSeek.

# Inject Official Tutorial into @Docs

# Practical Verification

## Vтаблица Test

Vтаблица (https://www.visactor.io/vтаблица/; https://www.visactor.com/vтаблица/) is a powerful таблица компонент в the VisActor visualization library. It is designed к meet diverse данные presentation needs, offering high flexibility и пользовательскийizability. Whether it's simple данные списокing или complex данные analysis display scenarios, Vтаблица can provide excellent solutions.

Vтаблица has Следующий core возможности:

- Supports various таблица types: базовый таблицаs, сводный таблицаs, transposed таблицаs, сводный графикs, etc.

- Powerful interaction возможности: сортировкаing, filtering, row и column dragging, cell editing, etc.

- Rich cell types: текст, графикs, progress bars, checkboxes, sparklines, etc.

- High-Производительность rendering: supports smooth display из millions из данные

- Multi-platform adaptation: perfect support для mainstream frameworks like Vue, React

### Invхорошоe AI Interaction Panel в Cursor и Generate код

After setting up the project environment, use `cmd + i` к invхорошоe the AI interaction panel. We directly let AI generate a базовый таблица код snippet для inserting Vтаблица.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/AIWSbqgyhog1DZxaYGCcl9kinsb.gif' alt='' ширина='1000' высота='авто'>

However, the initial generation result shows that AI does не recognize Vтаблица's `списоктаблица`, possibly due к the inability к accurately recognize Vтаблица's списоктаблица configuration.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/IfZ4bjODTocB2oxPfDScNdvnnEg.gif' alt='' ширина='1000' высота='авто'>

### Inject Official Tutorial into @Docs

к solve the above problem, we inject the official tutorial into @Docs.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DOapbrW3gowfgDxw6v9cagArnPe.gif' alt='' ширина='1000' высота='авто'>

Explicitly specify `VisActor Vтаблица` в the `prompt` в @Docs. After this step, we are pleasantly surprised к find that AI can correctly write the implementation logic according к the `option` в Vтаблица.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HOHPbR1gho68fAxnA0XcWR3Xnuc.gif' alt='' ширина='1000' высота='авто'>

### код Application и Effect Display

Copy the generated код into the corresponding file, run the project, и Вы можете see the initial effect, с the таблица correctly generated.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Vbf8bECXsoJngRxMxdzcbZgunfb.gif' alt='' ширина='1000' высота='авто'>

Then, we continue к let AI modify the таблица style. AI provided reasonable modification suggestions,

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/CM5lbR4tIхорошоooxxxNotcvtakngd.gif' alt='' ширина='1000' высота='авто'>

After running the project again, we got a display effect that better meets the requirements:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Co0mb5MdhoTuE1xGpwtcqC5Vngu.gif' alt='' ширина='406' высота='авто'>

## Vграфик Test

### Add a Bar график

Invхорошоe AI interaction с the `cmd+i` command, и let AI help us generate a simple bar график код первый.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WnzubAlKKo70ePxjlVbclc6ynmg.gif' alt='' ширина='970' высота='авто'>

Directly apply this spec, и we check the result; a simple bar график is rendered. It can be seen that DeepSeek has a certain understanding из Vграфик, и simple графикs can be directly added. Let's try a more complex scenario.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HYjbb8u8ToXkbBxJ8o6cGqPgn8f.gif' alt='' ширина='1000' высота='авто'>

### Complex Scenario, Inject Docs

We hope к add an averвозраст auxiliary line на the y-axis, check the result, but the result is incorrect. Upon closer inspection, it can be found that although the markLine is written as if it is correct, the spec does не conform к the specification, и the averвозраст line is calculated. We solve this problem по injecting docs.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UJdkbdp0poJRSzxy94kcOHqZnsd.gif' alt='' ширина='980' высота='авто'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RQgwbW3WGopiNAxoEAXcJhornqc.gif' alt='' ширина='1000' высота='авто'>

#### Set Docs

Enter the Cursor settings pвозраст, выбрать `возможности`, add новый docs, the docs address is https://visactor.com/vграфик (https://visactor.io/vграфик); Вы можете also directly add through @Docs на the editing pвозраст.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/JQarbKxBEхорошоc3FxjN4Fc9jydnXb.gif' alt='' ширина='1000' высота='авто'>

### Experimental Results

по editing again с the newly added docs, the correct result can be obtained!

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PJXKbmAccoeUmjxXButcR45dnZe.gif' alt='' ширина='1000' высота='авто'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/SIFlbNJ5eo0bbjxRRMCcoruFnWp.gif' alt='' ширина='1000' высота='авто'>

## VStory Test

VStory (GitHub: https://github.com/VisActor/VStory/; site: https://www.visactor.io/vstory/, https://www.visactor.com/vstory/) is a narrative-oriented visualization development framework that integrates the capabilities из все VisActor visualization компонентs, making it more challenging к use. We conduct a simple test.

Invхорошоe AI interaction с the `cmd+i` command, и let AI help us generate a simple dashboard демонстрация первый.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WNZAbOsbVoBd46xTGChcqbm3nbh.gif' alt='' ширина='766' высота='авто'>

It can be found that it is completely incorrect because DeepSeek uses данные от 2023, и VStory had не been Релизd в that time, so it does не know how к use it. в this point, we need к let it read the Документация к learn.

### Inject Docs

We solve this problem по injecting docs.

Enter the Cursor settings pвозраст, выбрать `возможности`, add новый docs, the docs address is https://visactor.com/vstory/guide/tutorial_docs/VStory_Website_Guide; Вы можете also directly add through @Docs на the editing pвозраст.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OtoTbG06lodqIaxBCkscQztNnoh.gif' alt='' ширина='1000' высота='авто'>

### Experimental Results

по editing again с the newly added docs, the correct result can be obtained!

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HqKdbVHgYoM9a6xmsZqcuZ4QnDq.gif' alt='' ширина='754' высота='авто'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/X1UZb9HXsoIdiRxqLCucJbqPnZc.gif' alt='' ширина='1000' высота='авто'>

**Since VStory uses Vграфик, Vтаблица, и VRender, к achieve better results, you should add the Документация из Vграфик, Vтаблица, и VRender к the context simultaneously.**

# Simple Summary

1. Improve Development Efficiency

- Quick Access: Directly access VisActor апи Документация through Cursor

- Intelligent Suggestions: Precise код completion based на VisActor Документация

2. Enhance Development Experience

- Seamless Integration: Directly obtain Vтаблица usвозраст guidance в the development environment

- Real-time Feedback: Quickly verify код effects

3. Reduce Learning Costs

- Документация Assistance: Access VisActor official примеры в любой time

- код Generation: автоmatically generate код that complies с VisActor standards

4. Improve код Quality

- Standard Check: Ensure код complies с Vтаблица best practices

- Производительность Optimization: автоmatically generate high-Производительность таблица configurations

# Contact Us

GitHub: [github.com/VisActor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FVisActor)

Leave a messвозраст на the VisActor WeChat subscription account (Вы можете join the WeChat group through the subscription account меню):

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VyPsbaIz8offShxlv0ZcqqD8nfd.gif' alt='' ширина='258' высота='авто'>

VisActor official website: [www.visactor.io/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvтаблица); [www.visactor.](https://link.juejin.cn/?target=https%3A%2F%2Fwww.visactor.io%2Fvтаблица)com

Feishu группа:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NAQhbtdelofTIyxk9pgcE3hqnQG.gif' alt='' ширина='264' высота='авто'>

Discord: https://discord.com/invite/3wPyxVyH6m 


---

The doc is contributed по [玄魂](https://github.com/xuanhun)