class ImageModel {
  constructor(width, height, source) {
    this.metrics = Object.seal({
      x: 0.0,
      y: 0.0,
      width: width || 240,
      height: height || 240,
    });
    this.source = source;
  }

  copyObject() {
    let out = new ImageModel(this.width, this.height, this.source);
    jQuery.extend(true, out.metrics, this.metrics);
    return out;
  }

  toJSON() {
    return copyObject();
  }
}
