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
      selectAllOnCtrlA?: boolean |SelectAllOnCtrlAOption;
      /** Горячая клавиша копирования по умолчанию не включена*/
      copySelected?: boolean; //эта горячая клавиша копирования согласуется с горячей клавишей браузера
   }
}
```

## Результаты

[Онлайн демо](https://codesandbox.io/s/vtable-copy-sdwjhd)

## Ссылки

- [Руководство по взаимодействию выбора](https://visactor.io/vtable/guide/interaction/select)
- [Связанное API](https://visactor.io/vtable/option/ListTable#keyboardOptions.copySelected)
- [github](https://github.com/VisActor/VTable)
