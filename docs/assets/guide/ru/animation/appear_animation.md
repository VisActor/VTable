# таблица entry animation

Vтаблица provides entry animation функция, supports displaying the gradual entry effect when the таблица is initialized, и supports configuring the animation direction, duration, delay, etc.

<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/appear-animation.gif" style="flex: 0 0 50%; заполнение: 10px;">
</div>

## Entry animation configuration items

в option, `animationAppear` is the configuration item для the entry animation, и currently supports Следующий configurations:

Вы можете configure true к включить the по умолчанию animation, или Вы можете configure the animation parameters:
- `тип` The тип из the entry animation, currently supports `все` и `one-по-one`, и the по умолчанию is `one-по-one`
- `direction` The direction из the entry animation, currently supports `row` и `column`, и the по умолчанию is `row`
- `duration` The duration из a single animation, в milliseconds, для `one-по-one`, it is the duration из one animation, и the по умолчанию is 500
- `delay` The delay из the animation, в milliseconds; для `one-по-one`, it is the time difference between the two animations, для `все`, it is the delay из все animations, и the по умолчанию is 0

для specific usвозраст, please refer к [демонстрация](../../демонстрация/animation/appear-animation)