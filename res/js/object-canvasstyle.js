class CanvasColorModel {
  constructor(color) {
    this.value = color || "#000000";
  }
}

class CanvasGradientModel {
  constructor(type) {
    (this.type = type || "linear"), (this.x0 = 0.0);
    this.y0 = 0.0;
    this.r0 = 0.0;
    this.x1 = 0.0;
    this.y1 = 0.0;
    this.r1 = 0.0;
    this.stops = [];
  }
}

class CanvasPatternModel {
  constructor(image, repetition) {
    this.image = image || new ImageModel();
    this.repetition = repetition || "repeat";
  }
}

class FontModel {
  constructor(size, family) {
    this.size = Object.seal({
      magnitude: parseInt(size) || 10,
      unit: size.match(/[a-z]+/)[0] || "px",
    });
    this.family = family || "sans-serif";
    this.style = "";
    this.variant = "";
    this.weight = "";
    this.stretch = "";
    this.lineHeight = 1.0;
  }

  toCss(size) {
    let out = "";
    if (this.style) out += this.style + " ";
    if (this.variant) out += this.variant + " ";
    if (this.weight) out += this.weight + " ";
    if (this.stretch) out += this.stretch + " ";
    out += parseInt(size) || this.size.magnitude;
    let match = size.match(/[a-z]+/);
    if (match) out += match[0];
    else out += this.size.unit;
    out += " ";
    if (this.lineHeight) out += "/" + this.lineHeight + " ";
    return out + this.family;
  }

  getSize(unit) {
    return unit
      ? FontModel.convertLength(this.size.magnitude, this.size.unit, unit)
      : this.size.magnitude;
  }

  setSize(size) {
    this.size.magnitude = parseInt(size) || 10;
    let match = size.match(/[a-z]+/);
    if (match) this.size.unit = match[0];
    else this.size.unit = "px";
  }
}

FontModel.lengthUnits = Object.freeze({
  px: Object.freeze({ name: "pixel", plural: "pixels", label: "px", scale: 1 }),
  cm: Object.freeze({
    name: "centimeter",
    plural: "centimeters",
    label: "cm",
    scale: 96 / 2.54,
  }),
  mm: Object.freeze({
    name: "millimeter",
    plural: "millimeters",
    label: "mm",
    scale: 96 / 25.4,
  }),
  in: Object.freeze({ name: "inch", plural: "inches", label: "in", scale: 96 }),
  pc: Object.freeze({ name: "pica", plural: "picas", label: "pc", scale: 16 }),
  pt: Object.freeze({
    name: "point",
    plural: "points",
    label: "pt",
    scale: 3 / 4,
  }),
});

FontModel.convertLength = (value, unitFrom, unitTo) => {
  let units = FontModel.lengthUnits;
  if (unitFrom === unitTo) return value;
  if (!units.hasOwnProperty(unitFrom) || !units.hasOwnProperty(unitTo))
    throw "!units.has(unitFrom: " + unitFrom + " || unitTo: " + unitTo + ")";
  return (value / units[unitFrom].scale) * units[unitTo].scale;
};
