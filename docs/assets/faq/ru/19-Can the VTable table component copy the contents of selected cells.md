# Может ли табличный компонент VTable копировать содержимое выбранных ячеек?

## Описание вопроса

Как VTable может включить горячие клавиши для копирования содержимого выбранных ячеек? Например, копирование в Excel.

## Решение

VTable имеет специальный элемент конфигурации горячих клавиш keyboardOptions, как показано ниже:

```javascript
{
   ...
   keyboardOptions:
   {
      /** Включить горячую клавишу выбрать все по умолчанию: false */
      selectAllOnCtrlA?: логический |SelectAllOnCtrlAOption;
      /** Горячая клавиша копирования по умолчанию не включена*/
      copySelected?: логический; //эта горячая клавиша копирования согласуется с горячей клавишей браузера
   }
}
```

## Результаты

[Онлайн демо](https://codesandbox.io/s/VTable-copy-sdwjhd)

## Ссылки

- [Руководство по взаимодействию выбора](https://visactor.io/VTable/guide/interaction/выбрать)
- [Связанное API](https://visactor.io/VTable/option/ListTable#keyboardOptions.copySelected)
- [github](https://github.com/VisActor/VTable)
