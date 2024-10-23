import { Env } from '../../../tools/env';

export function importStyle() {
  if (Env.mode === 'node') {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = 'vtable-tooltip-styleSheet';
  styleElement.textContent = `
@keyframes vtable__bubble-tooltip-element--shown-animation {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.vtable__bubble-tooltip-element {
	position: absolute;
	
	// pointer-events: none;
	//user-select: none;
	max-width: 300px;
	z-index: 99999;

	background: #FFFFFF;
    border: 1px solid #E6E8ED;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgb(27 31 35 / 8%);
    color: #141414;
    font-size: 13px;
}
.vtable__bubble-tooltip-element--hidden {
	opacity: 0;
  pointer-events: none;
	user-select: none;
	/* transform: translate(-50%, -50%); */
	transition: opacity 75ms linear;
}
.vtable__bubble-tooltip-element--shown {
	opacity: 1;
	/* transform: translate(-50%, -50%); */
	animation: vtable__bubble-tooltip-element--shown-animation 150ms ease-out;
}
.vtable__bubble-tooltip-element__content {
	/* font-size: .75rem; */
	padding: 6px 8px;
	min-height: 1em;
	line-height: 1.5;
	width: 100%;
	display: block;
	white-space: pre-wrap;
	margin: 0;
	box-sizing: border-box;
	overflow: auto;
	word-wrap: break-word;
	position: relative;
	background-color: #FFF;
	z-index: 2;
	border-radius: 4px;
}
/*  WebKit Microsoft Edge（新版）： */
.vtable__bubble-tooltip-element__content::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
/*  Opera Firefox  */
.vtable__bubble-tooltip-element__content > scrollbar-track {
  width: 0;
  height: 0;
  background-color: transparent;
}
/* Internet Explorer 11 和 Microsoft Edge（旧版） */
.vtable__bubble-tooltip-element__content > scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
.vtable__bubble-tooltip-element__triangle {
	/* font-size: .75rem; */
	position: absolute;
	width: 10px;
	height: 10px;
	display: block;
	transform: rotate(45deg);
    transform-origin: 50% 50% 0;
	z-index: 1;
	background-color: #FFF;
	border: 1px solid #E6E8ED;
}
`;

  document.head.appendChild(styleElement);
}
