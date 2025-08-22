#Multi-language support

## текст measurement

в order к improve the performance из tables, VTable uses a fast текст measurement scheme [@visactor/vutils TextMeasure](https://github.com/VisActor/VUtil/blob/main/packages/vutils/src/graphics/текст/measure/ textMeasure.ts), this текст measurement method has better support для English letters и full-ширина characters, but it may cause measurement errors и incorrect rendering effects для некоторые language characters. для multi-language support issues, there are two support options:

## Alphabetical текст support scheme

The VTable class provides the method `setCustomAlphabetCharSet` для users к configure the letters that need к be measured into the alphabet из the measurement tool. Executing it before creating a table instance allows the characters в the alphabet к be measured correctly. Take Cyrillic as an example:

```js
VTable.setCustomAlphabetCharSet('БВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯбвгдежзийклмнопрстуфхцчшщъыьэ юя');
```

## Hieroglyphic Support Scheme

для текст без an alphabet, VTable provides a downgrade method для текст measurement, `restoreMeasureText`, which is executed before creating a table instance. It can be restored от the fast текст measurement solution к the `measureText` provided по canvas, which will partially improve the performance из текст measurement. Decreased, but can support все текст that canvas can measure.

```js
VTable.restoreMeasureText();
```