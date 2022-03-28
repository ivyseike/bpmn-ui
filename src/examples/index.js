import draw_canvas from "./draw_canvas";
draw_canvas.install = function (Vue) {
  Vue.component(draw_canvas.name, draw_canvas);
}
export default draw_canvas;
