import { Env } from '../../../../tools/env';

export function importStyle() {
  if (Env.mode === 'node') {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = 'vtable-menu-styleSheet';
  styleElement.textContent = `
@keyframes vtable__menu-element--shown-animation {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.vtable__menu-element {
	position: absolute;
	box-sizing: border-box;
	border-radius: 4px;
	background-color: #fff;
	padding: 6px 0;
	/* pointer-events: none; */
	user-select: none;
	color: #000;
	max-width: 300px;
	z-index: 99999;
	border: #CCC 0.5px solid;
	cursor: default;
	width: max-content;
	box-shadow: 0px 8px 16px rgba(27, 31, 35, 0.12);
  max-height: 100%;
  overflow-y: auto;
}
.vtable__menu-element--hidden {
	opacity: 0;
	/* transform: translate(-50%, -50%); */
	transition: opacity 75ms linear;
	z-index: -9999;
}
.vtable__menu-element--shown {
	opacity: 1;
	/* transform: translate(-50%, -50%); */
	animation: vtable__menu-element--shown-animation 150ms ease-out;
}
.vtable__menu-element__content {
	font-family: Roboto;
	font-size: 12px;
	overflow: hidden;
	display: inline-block;
	/* height: 100%; */
	line-height: 30px;
}
.vtable__menu-element__item {
	height: 32px;
	padding: 0px 12px;
	cursor: pointer;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.vtable__menu-element__item:hover {
	background-color: rgba(27, 31, 35, 0.06);
}
.vtable__menu-element__icon{
	/* vertical-align: top; */
	display: flex;
	/* line-height: 30px; */
	margin-right: 6px;
}
.vtable__menu-element__no-event {
	pointer-events: none;
}
.vtable__menu-element--select {
	color: #2E68CF;
}.vtable__menu-element--normal {
	color: rgba(20, 20, 20, 0.9);;
}
.vtable__menu-element__split {
	height: 0px;
	border: 1px solid rgb(209, 213, 218);
	margin: 5px 0;
}
.vtable__menu-element__title {
	color: rgb(149, 149, 149);
}
.vtable__menu-element__arrow {
	position: absolute;
	right: 3px;
	font-weight: bold;
	margin-top: 1px;
}
.vtable__menu-element__item-text {
	margin-right: 15px;
}
`;

  document.head.appendChild(styleElement);
}
