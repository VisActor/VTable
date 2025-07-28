# Link hyperlinke тип

в the daily данные analytics process, we often encounter некоторые данные that needs к be consulted в detail, и these details are usually на another pвозраст или site. в this case, if the relevant links can be embedded directly into the таблица, the work efficiency из данные analytics will be greatly improved. Vтаблица achieves this requirement through the configuration из the link hyperlinke тип.

## Hyperlinke тип specific configuration

следующий, we will explain the configuration items unique к the link тип one по one:

*   `linkJump` The по умолчанию значение is `true`If this is `true`The link will be Нажатьable к jump к the specified address; if `false`, the link will не have a jump функция и will only be displayed в текст form.

*   `linkDetect` The по умолчанию значение is `true`When set к `true` The program will check the links regularly, и only links that meet the URL rules will be displayed as Нажатьable hyperlinkes. для template link types, this configuration item does не take effect.

*   `templateLink` Used к define template link addresses. для пример, configure к `'https://www.google.com.hk/search?q={имя}`, в which `имя` Is the поле имя из the данные source property. This makes it easier к quickly generate link addresses. `templateLink` can also be a функция `(record, col, row, таблица) => строка`, `record` is the данные record, `col` is the column index, `row` is the row index, `таблица` is the таблица instance. 

# пример из hyperlinke в таблица display

следующий, we use a concrete пример к показать how the link тип can be applied к a таблица.

Suppose we have a список из users that contains the user's имя, birthday, details link, etc. We want к display this information в the таблица и quickly jump к the corresponding pвозраст when viewing the details. к do this, we can configure списоктаблица like this:

```javascript liveдемонстрация template=vтаблица
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      поле: 'имя',
      заголовок: 'имя',
      cellType: 'link',
      templateссылка: 'https://www.google.com.hk/search?q={имя}',
      linkJump: true,
      ширина: 'авто'
    },
    {
      поле: 'link',
      заголовок: 'persional link',
      cellType: 'link',
      linkJump: true,
      ширина: 'авто',
      полеFormat(rec) {
        возврат rec['имя'] + '\'s link'
      }
    },
    {
      "поле": "возраст",
      "title": "возраст"
    },
    {
      "поле": "sex",
      "title": "sex"
    },
    {
      "поле": "phone",
      "title": "phone"
    },
    {
      "поле": "address",
      "title": "address"
    },
  ],
  "records": [
    { "имя": "zhang_san", "возраст": 20, "sex": "female", "phone": "123456789", "address": "beijing haidian", "link": 'https://www.google.com.hk' },
    { "имя": "li_si", "возраст": 30, "sex": "female", "phone": "23456789", "address": "beijing chaoyang", "link": 'https://www.google.com.hk' },
    { "имя": "wang_wu", "возраст": 40, "sex": "male", "phone": "3456789", "address": "beijing fengtai", "link": 'https://www.google.com.hk' }
  ]
}
const таблицаInstance = новый списоктаблица(option);

```

в this configuration, we include `имя`,`birthdate` и `profile_url` поле. Where profile\_url`字段被设置为 link 类型，并且开启了`linkJump`和`linkDetect 'configuration. This way, when we view the таблица, we can see that the link к the details is displayed correctly в the cell, и we can Нажать directly к the details pвозраст.
