export class WebComponent extends HTMLElement {
  setStyles(styles) {
    const stylesProps = Object.keys(styles);
    stylesProps.forEach((prop) => {
      this.style[prop] = styles[prop];
    });
  }
}
