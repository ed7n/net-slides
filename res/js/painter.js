const Painter = (() => {
  const functions = Object.freeze({
    draw: Object.freeze({
      text: Object.freeze(drawText),
      raster: Object.freeze(drawRaster),
      vector: Object.freeze(drawVector),
    }),
    parse: Object.freeze({
      color: Object.freeze(parseColor),
      gradient: Object.freeze(parseGradient),
      pattern: Object.freeze(parsePattern),
    }),
  });

  const identity = Object.freeze({
    x: 0.0,
    y: 0.0,
    width: 1.0,
    height: 1.0,
    radius: 1.0,
    area: 1.0,
  });

  const noShadow = Object.freeze({
    blur: 0.0,
    color: "#000000",
    offsetX: 0.0,
    offsetY: 0.0,
  });

  function drawObject(canvasRenderingContext2d, slideObject, metricModifiers) {
    let c = canvasRenderingContext2d,
      o = slideObject,
      m = metricModifiers || identity,
      f = functions.draw[o.type];
    if (!f || !o.visible) return;
    c.save();
    f.call(this, c, o, m);
    c.restore();
  }

  function drawText(canvasRenderingContext2d, slideObject, metricModifiers) {
    let c = canvasRenderingContext2d,
      o = slideObject,
      mod = metricModifiers,
      met = getModifiedMetrics(o.metrics, mod),
      font = o.style.text.font;
    if (o.isStyleDisabled()) return;
    setStyle(c, o, met, mod);
    let yMax = met.y + met.height;
    let fontHeight = font.getSize("px");
    fontHeight += fontHeight * (font.lineHeight / 2);
    fontHeight *= mod.height;
    let strings = getTextLines(c, o.model, met.width);
    for (let i = 0; i < strings.length && met.y < yMax; i += 1) {
      if (o.style.fill.enabled) c.fillText(strings[i], met.x, met.y, met.width);
      if (o.style.stroke.enabled)
        c.strokeText(strings[i], met.x, met.y, met.width);
      met.y += fontHeight;
    }
  }

  function drawRaster(canvasRenderingContext2d, slideObject, metricModifiers) {
    let c = canvasRenderingContext2d,
      o = slideObject,
      mod = metricModifiers,
      met = getModifiedMetrics(o.metrics, mod);
    c.translate(met.width, met.height);
    c.rotate((o.metrics.rotation * Math.PI) / 180);
    c.translate(-met.width, -met.height);
    c.drawImage(
      parseImage(slideObject),
      o.object.x,
      o.object.y,
      o.object.width,
      o.object.height,
      met.x,
      met.y,
      met.width,
      met.height
    );
  }

  function drawVector(canvasRenderingContext2d, slideObject, metricModifiers) {
    let c = canvasRenderingContext2d,
      o = slideObject,
      mod = metricModifiers,
      met = getModifiedMetrics(o.metrics, mod);
    setStyle(c, o, met, mod);
    if (o.style.fill.enabled) c.fillRect(met.x, met.y, met.width, met.height);
    if (o.style.stroke.enabled)
      c.strokeRect(met.x, met.y, met.width, met.height);
  }

  function drawVoid(canvasRenderingContext2d, color) {
    let c = canvasRenderingContext2d;
    c.save();
    c.fillStyle = color;
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    c.restore();
  }

  function getMetricModifiers(canvasRenderingContext2d, metrics) {
    let c = canvasRenderingContext2d,
      m = metrics,
      radius = Math.min(c.canvas.width / m.width, c.canvas.height / m.height),
      out = {};
    out.x = m.offsetX * radius + (c.canvas.width - m.width * radius) / 2;
    out.y = m.offsetY * radius + (c.canvas.height - m.height * radius) / 2;
    out.width = radius;
    out.height = radius;
    out.radius = radius;
    out.area = radius * radius;
    return Object.freeze(out);
  }

  function getModifiedMetrics(metrics, metricModifiers) {
    let m = metricModifiers,
      out = jQuery.extend(true, {}, metrics);
    if (out.hasOwnProperty("offsetX"))
      out.offsetX = out.offsetX * m.width + m.x;
    if (out.hasOwnProperty("x")) out.x = out.x * m.width + m.x;
    if (out.hasOwnProperty("offsetY"))
      out.offsetY = out.offsetY * m.height + m.y;
    if (out.hasOwnProperty("y")) out.y = out.y * m.height + m.y;
    if (out.hasOwnProperty("width")) out.width *= m.width;
    if (out.hasOwnProperty("height")) out.height *= m.height;
    if (out.hasOwnProperty("radius")) out.radius *= m.radius;
    return Object.seal(out);
  }

  function parseStyle(
    canvasRenderingContext2d,
    style,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = style,
      mets = metrics,
      mods = metricModifiers,
      f = functions.parse[o.type];
    return f ? f.call(this, c, o, mets, mods) : "";
  }

  function parseColor(
    canvasRenderingContext2d,
    style,
    metrics,
    metricModifiers
  ) {
    let o = style.model;
    style.object = o.value;
    return style.object;
  }

  function parseGradient(
    canvasRenderingContext2d,
    style,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = style.model,
      mods = metricModifiers,
      out =
        o.type === "radial"
          ? c.createRadialGradient(
              o.x0 + mods.x + mods.width,
              (o.y0 + mods.y) * mods.height,
              o.r0 * mods.radius,
              (o.x1 + mods.x) * mods.width,
              (o.y1 + mods.y) * mods.height,
              o.r1 * mods.radius
            )
          : c.createLinearGradient(
              (o.x0 + mods.x) * mods.width,
              (o.y0 + mods.y) * mods.height,
              (o.x1 + mods.x) * mods.width,
              (o.y1 + mods.y) * mods.height
            );
    o.stops.forEach(([offset, color]) => {
      out.addColorStop(offset, color);
    });
    style.object = out;
    return out;
  }

  function parsePattern(canvasRenderingContext2d, style) {
    let c = canvasRenderingContext2d,
      o = style.model,
      out = c.createPattern(parseImage(o.image), o.repetition);
    style.object = out;
    return out;
  }

  function parseImage(slideObject) {
    let o = slideObject;
    if (typeof o.object === "image") return o.object;
    let out = new Image(o.metrics.width, o.metrics.height);
    out.src = o.model.source;
    o.object = out;
    return out;
  }

  function getTextLines(canvasRenderingContext2d, object, width) {
    let c = canvasRenderingContext2d;
    return warpText(c, object.split("\n"), width);
  }

  function warpText(canvasRenderingContext2d, strings, width) {
    let c = canvasRenderingContext2d;
    for (let i = 0; i < strings.length; i += 1) {
      for (let j = strings[i].length - 1; j > 0; j -= 1) {
        let string = strings[i].substring(0, j);
        if (c.measureText(string).width <= width) {
          if (j + 1 < strings[i].length) {
            strings.splice(i + 1, 0, strings[i].substring(j).trim());
            strings[i] = string.trim();
          }
          break;
        }
      }
    }
    return strings;
  }

  function setStyle(
    canvasRenderingContext2d,
    slideObject,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = slideObject,
      met = metrics,
      mod = metricModifiers;
    setStyleFill(c, o, met, mod);
    setStyleStroke(c, o, met, mod);
    setStyleLine(c, o, met, mod);
    setStyleText(c, o, met, mod);
    setStyleShadow(c, o, met, mod);
  }

  function setStyleFill(
    canvasRenderingContext2d,
    slideObject,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = slideObject.style.fill;
    c.fillStyle = parseStyle(c, o, metrics, metricModifiers);
  }

  function setStyleStroke(
    canvasRenderingContext2d,
    slideObject,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = slideObject.style.stroke;
    c.strokeStyle = parseStyle(c, o, metrics, metricModifiers);
  }

  function setStyleLine(
    canvasRenderingContext2d,
    slideObject,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = slideObject.style.line,
      m = metricModifiers;
    c.lineWidth = o.width * m.radius;
    c.lineCap = o.cap;
    c.lineJoin = o.join;
    c.miterLimit = o.miterLimit;
    c.setLineDash = o.dash;
    c.lineDashOffset = o.dashOffset;
  }

  function setStyleShadow(
    canvasRenderingContext2d,
    slideObject,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = slideObject.style.shadow,
      m = metricModifiers;
    if (!slideObject.style.shadow.enabled) {
      c.shadowBlur = noShadow.blur;
      c.shadowColor = noShadow.color;
      c.shadowOffsetX = noShadow.offsetX;
      c.shadowOffsetY = noShadow.offsetY;
    } else {
      c.shadowBlur = o.blur * m.radius;
      c.shadowColor = o.color;
      c.shadowOffsetX = o.offsetX * m.width;
      c.shadowOffsetY = o.offsetY * m.height;
    }
  }

  function setStyleText(
    canvasRenderingContext2d,
    slideObject,
    metrics,
    metricModifiers
  ) {
    let c = canvasRenderingContext2d,
      o = slideObject.style.text,
      met = metrics,
      mod = metricModifiers;
    if (slideObject.type != "text") return;
    c.font = o.font.toCss(o.font.getSize("px") * mod.height + "px");
    c.textAlign = o.align;
    let style = Painter.style("text.align." + o.align);
    if (style.hasOwnProperty("modify")) style.modify(met);
    c.textBaseline = o.baseline;
    style = Painter.style("text.baseline." + o.baseline);
    if (style.hasOwnProperty("modify")) style.modify(met);
    c.direction = o.direction;
  }
  return {
    drawObject: drawObject,
    drawVoid: drawVoid,
    getMetricModifiers: getMetricModifiers,
    getModifiedMetrics: getModifiedMetrics,
  };
})();
Painter.style = (key) => {
  const enumObject = Object.freeze({
    gradient: Object.freeze({
      type: Object.freeze({
        linear: Object.freeze({ label: "Linear", html: "Linear" }),
        radial: Object.freeze({ label: "Radial", html: "Radial" }),
      }),
    }),
    line: Object.freeze({
      cap: Object.freeze({
        butt: Object.freeze({ label: "Butt", html: "Butt" }),
        round: Object.freeze({ label: "Round", html: "Round" }),
        square: Object.freeze({ label: "Square", html: "Square" }),
      }),
      join: Object.freeze({
        miter: Object.freeze({ label: "Miter", html: "Miter" }),
        round: Object.freeze({ label: "Round", html: "Round" }),
        bevel: Object.freeze({ label: "Bevel", html: "Bevel" }),
      }),
    }),
    text: Object.freeze({
      align: Object.freeze({
        start: Object.freeze({ label: "Start", html: "Start" }),
        end: Object.freeze({ label: "End", html: "End" }),
        center: Object.freeze({
          label: "Center",
          html: "Center",
          modify: (metrics) => {
            metrics.x += metrics.width / 2;
          },
        }),
        left: Object.freeze({ label: "Left", html: "Left" }),
        right: Object.freeze({
          label: "Right",
          html: "Right",
          modify: (metrics) => {
            metrics.x += metrics.width;
          },
        }),
      }),
      baseline: Object.freeze({
        top: Object.freeze({ label: "Top", html: "Top" }),
        hanging: Object.freeze({ label: "Hanging", html: "Hanging" }),
        middle: Object.freeze({
          label: "Middle",
          html: "Middle",
          modify: (metrics) => {
            metrics.y += metrics.height / 2;
          },
        }),
        alphabetic: Object.freeze({ label: "Alphabetic", html: "Alphabetic" }),
        ideographic: Object.freeze({
          label: "Ideographic",
          html: "Ideographic",
        }),
        bottom: Object.freeze({
          label: "Bottom",
          html: "Bottom",
          modify: (metrics) => {
            metrics.y += metrics.height;
          },
        }),
      }),
      direction: Object.freeze({
        inherit: "Inherit",
        ltr: "Left-to-right",
        rtl: "Right-to-left",
      }),
    }),
    types: Object.freeze({
      color: {
        label: "Color",
        html: "Color",
        parse: "parseColor to be moved here",
      },
    }),
  });

  return key ? EDENObjects.getProperty(enumObject, key) : enumObject;
};
