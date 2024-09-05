import { Env } from '../tools/env';

export function importStyle() {
  if (Env.mode === 'node') {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = 'vtable-style-styleSheet';
  styleElement.textContent = `
.vtable .input-container {
	position: absolute;
	top:0px;
}
.vtable .table-scrollable {
	position: absolute;
	overflow: scroll;
}
.vtable .table-scrollable::-webkit-scrollbar-button{
	background-color: transparent;
}
.vtable .table-scrollable::-webkit-scrollbar-track-piece{
	background-color: transparent;
}
.vtable .table-scrollable::-webkit-scrollbar-corner {
	background-color: transparent;
}
.vtable .table-scrollable::-webkit-scrollbar-thumb {
	border-radius      : 4px;
	background-color   : rgba(100, 100, 100, .5);
}

.vtable .table-scroll-end-point {
	opacity: 0;
	position: relative;
}
.vtable {
	/* 设置overflow: auto 应该是为了滚动条的某个问题 但设置了auto之后 dom的下拉菜单只能显示在vtable节点中 超出会截断;现在去掉auto 暂时滚动条的问题没有发现 */
	/* overflow: auto; */
	position: relative;
	width: 100%;
	height: 100%;
	text-align: left;
  -webkit-font-smoothing:auto;

  overflow: hidden; // for react-vtable dom custom element
}

.vtable-gantt {
	/* 设置overflow: auto 应该是为了滚动条的某个问题 但设置了auto之后 dom的下拉菜单只能显示在vtable节点中 超出会截断;现在去掉auto 暂时滚动条的问题没有发现 */
	/* overflow: auto; */
	position: absolute;
	width: 100%;
	height: 100%;
	text-align: left;
  -webkit-font-smoothing:auto;

  overflow: hidden; // for react-vtable dom custom element
}
.vtable .table-component-container {
  pointer-events: none;
  overflow: hidden;
  position: absolute;
  top: 0px;
  left: 0px;
}
.vtable > canvas {
	position: absolute;
	width: 0;
	height: 0;
}
.vtable .table-focus-control {
	position: relative !important;
	width: 1px;
	height: 1px;
	opacity: 0;
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	pointer-events: none;
	max-width: 500px;
	max-height: 500px;
	float: none !important;
}
.vtable input.table-focus-control::-ms-clear {
	visibility: hidden;
}
.vtable input.table-focus-control.composition {
	opacity: 1;
	max-width: none;
	max-height: none;
}
`;

  document.head.appendChild(styleElement);
}
