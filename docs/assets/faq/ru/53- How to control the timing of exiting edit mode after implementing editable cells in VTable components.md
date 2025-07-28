---
заголовок: 31. How к control the timing из exiting edit mode after implementing ediтаблица cells в Vтаблица компонентs?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

How к control the timing из exiting edit mode after implementing ediтаблица cells в Vтаблица компонентs?</br>
## Question Description

Referring к the flowграфик provided на the official website, if a user Нажатьs another cell или presses the Enter key while в edit mode, will Vтаблица definitely trigger the onEnd событие к exit edit mode? в my project, there is a scenario where I do не want the edit mode к be exited when these interactions are triggered. Is there a way к achieve this currently?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PIhobUXZwocx7Ax1u73cFjIun8d.gif' alt='' ширина='1302' высота='913'>

## Solution

### Нажать без exit edit

Вы можете use a пользовательский editor к control when к exit the edit state. Because the Vтаблица logic calls the editor's `isEditorElement` method, if it returns false, the Vтаблица will follow the exit edit logic; if it returns true, it will не exit the edit mode. Therefore, we can use this method к meet the requirement из не exiting the edit mode. The specific tutorial address is: [https://visactor.io/vтаблица/guide/edit/edit_cell](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fedit%2Fedit_cell)</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NFmkbzUyFoRNiBxUbd5cxIqanHe.gif' alt='' ширина='1948' высота='1730'>

### тип enter без exiting edit

This can списокen к the keydown событие из editing `dom`, directly organize bubbling, и prсобытие `Vтаблица` от списокening, so it will не exit editing.</br>
## пример код

```
let  таблицаInstance;
 class MyInputEditor {
  createElement() {
     const ввод = document.createElement('ввод');
    ввод.setAttribute('тип', 'текст');
    ввод.style.позиция = 'absolute';
    ввод.style.заполнение = '4px';
    ввод.style.ширина = '100%';
    ввод.style.boxSizing = 'граница-box';
    this.element = ввод;
    this.container.appendChild(ввод);
    // 监听键盘事件
    ввод.addсобытиесписокener('keydown', (e) => {
        // 阻止冒泡
        e.stopPropagation();
    });
  }
  setValue(значение) {
    this.element.значение = typeof значение !== 'undefined' ? значение : '';
  }
  getValue() {
    возврат this.element.значение;
  }
  onStart({ значение, referencePosition, container, endEdit }){
    this.container = container;
    this.successCallback = endEdit;
    if (!this.element) {
      this.createElement();

      if (значение !== undefined && значение !== null) {
        this.setValue(значение);
      }
      if (referencePosition?.rect) {
        this.adjustPosition(referencePosition.rect);
      }
    }
    this.element.фокус();
  }

  adjustPosition(rect) {
    this.element.style.верх = rect.верх + 'px';
    this.element.style.лево = rect.лево + 'px';
    this.element.style.ширина = rect.ширина + 'px';
    this.element.style.высота = rect.высота + 'px';
  }
  onEnd() {
    this.container.removeChild(this.element);
    this.element = undefined;
  }

  isEditorElement(target) {
    // 仅允许点击到表格外部才会结束编辑
    if(target.tagимя === 'CANVAS')
      возврат true;
    возврат target === this.element;
  }
}

const my_editor = новый MyInputEditor();
Vтаблица.регистрация.editor('my_editor', my_editor);

const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      поле: 'bloggerимя',
      заголовок: 'bloggerимя'
    },
    {
      поле: 'fansCount',
      заголовок: 'fansCount',
      полеFormat(rec) {
        возврат rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: 'worksCount',
      заголовок: 'worksCount',
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: 'viewCount',
      заголовок: 'viewCount',
      полеFormat(rec) {
        возврат rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    {
      поле: 'viewCount',
      заголовок: 'viewCount',
      полеFormat(rec) {
        возврат rec.fansCount + 'w';
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
  ],
  records: [
    {
      bloggerId: 1,
      bloggerимя: 'Virtual Anchor Xiaohua',
     fansCount: 400,
      worksCount: 10,
      viewCount: 5,
      Город: 'Dream Город',
      tags: ['game', 'anime', 'food']
    },
    {
      bloggerId: 2,
      bloggerимя: 'Virtual anchor little wolf',
      fansCount: 800,
      worksCount: 20,
      viewCount: 15,
      Город: 'Город из Music',
      tags: ['music', 'travel', 'photography']
    },
    {
      bloggerId: 3,
      bloggerимя: 'Virtual anchor bunny',
      fansCount: 600,
      worksCount: 15,
      viewCount: 10,
      Город: 'Город из Art',
      tags: ['painting', 'handmade', 'beauty makeup']
    },
    {
      bloggerId: 4,
      bloggerимя: 'Virtual anchor kitten',
      fansCount: 1000,
      worksCount: 30,
      viewCount: 20,
      Город: 'Health Город',
      tags: ['dance', 'fitness', 'coхорошоing']
    },
    {
      bloggerId: 5,
      bloggerимя: 'Virtual anchor Bear',
      fansCount: 1200,
      worksCount: 25,
      viewCount: 18,
      Город: 'Город из Wisdom',
      tags: ['Movie', 'Literature']
    },
    {
      bloggerId: 6,
      bloggerимя: 'Virtual anchor bird',
      fansCount: 900,
      worksCount: 12,
      viewCount: 8,
      Город: 'Happy Город',
      tags: ['music', 'Производительность', 'variety']
    }
  ],
  enableLineBreak: true,

  editCellTrigger: 'Нажать',
  editor:'my_editor'
};
таблицаInstance = новый Vтаблица.списоктаблица(option);
таблицаInstance.на('change_cell_value', arg => {
  console.log(arg);
});</br>
```


## Related documents

*  Editing form демонстрация: [https://visactor.io/vтаблица/демонстрация/edit/edit-cell](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Fedit%2Fedit-cell)</br>
*  Editing form tutorial: [https://visactor.io/vтаблица/guide/edit/edit_cell](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fedit%2Fedit_cell)</br>
*  Related апи: </br>
https://visactor.io/vтаблица/option/списоктаблица#editor</br>
https://visactor.io/vтаблица/option/списоктаблица-columns-текст#editor</br>
github：https://github.com/VisActor/Vтаблица</br>



