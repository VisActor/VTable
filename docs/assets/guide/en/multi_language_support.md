#Multi-language support

## Text measurement

In order to improve the performance of tables, VTable uses a fast text measurement scheme [@visactor/vutils TextMeasure](https://github.com/VisActor/VUtil/blob/main/packages/vutils/src/graphics/text/measure/ textMeasure.ts), this text measurement method has better support for English letters and full-width characters, but it may cause measurement errors and incorrect rendering effects for some language characters. For multi-language support issues, there are two support options:

## Alphabetical text support scheme

The VTable class provides the method `setCustomAlphabetCharSet` for users to configure the letters that need to be measured into the alphabet of the measurement tool. Executing it before creating a table instance allows the characters in the alphabet to be measured correctly. Take Cyrillic as an example:

```js
VTable.setCustomAlphabetCharSet('БВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯбвгдежзийклмнопрстуфхцчшщъыьэ юя');
```

## Hieroglyphic Support Scheme

For text without an alphabet, VTable provides a downgrade method for text measurement, `restoreMeasureText`, which is executed before creating a table instance. It can be restored from the fast text measurement solution to the `measureText` provided by canvas, which will partially improve the performance of text measurement. Decreased, but can support all text that canvas can measure.

```js
VTable.restoreMeasureText();
```