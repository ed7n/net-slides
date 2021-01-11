class SlideDeck {
  constructor(id) {
    this.id = id || "0";
    this.name = "";
    this.caption = "";
    this.author = "";
    this.slides = [new Slide("title")];
  }
}

SlideDeck.make = (object) => {
  let out = jQuery.extend(true, new SlideDeck(), object);
  for (let i = 0; i < object.slides.length; i += 1)
    out.slides[i] = Slide.make(out.slides[i]);
  return out;
};

class Slide {
  constructor(type, width, height) {
    this.name = "";
    this.caption = "";
    this.author = "";
    this.visible = true;
    this.type = type || "content";
    this.notes = "";
    this.metrics = Object.seal({
      offsetX: 0.0,
      offsetY: 0.0,
      width: width || 960.0,
      height: height || 720.0,
      rotation: 0.0,
    });
    this.content = Object.seal({
      fixed: Object.seal({
        drop: Object.seal(
          new SlideObject("vector", this.metrics.width, this.metrics.height)
        ),
        head: Object.seal(new SlideObject("text")),
        body: Object.seal(new SlideObject("text")),
        foot: Object.seal(new SlideObject("text")),
      }),
      free: [],
    });
    Slide.applyTemplate(this);
    this.content.fixed.drop.style.fill.model.value = "#FFFFFF";
  }
}

Slide.types = Object.freeze({
  title: Object.freeze({
    label: "Title",
    layout: Object.freeze({
      head: Object.freeze({
        x: 0.05,
        y: 0.325,
        width: 0.9,
        height: 0.2,
        rotation: 0,
        fontSize: 0.1,
        textAlign: "center",
      }),
      body: Object.freeze({
        x: 0.05,
        y: 0.5,
        width: 0.9,
        height: 0.3,
        rotation: 0.0,
        fontSize: 0.05,
        textAlign: "center",
      }),
      foot: Object.freeze({
        x: 0.05,
        y: 0.9,
        width: 0.9,
        height: 0.05,
        rotation: 0.0,
        fontSize: 0.03,
      }),
    }),
  }),
  section: Object.freeze({
    label: "Section",
    layout: Object.freeze({
      head: Object.freeze({
        x: 0.05,
        y: 0.4,
        width: 0.9,
        height: 0.2,
        rotation: 0,
        fontSize: 0.1,
        textAlign: "start",
      }),
      body: Object.freeze({
        x: 0.05,
        y: 0.6,
        width: 0.9,
        height: 0.3,
        rotation: 0.0,
        fontSize: 0.05,
        textAlign: "start",
      }),
      foot: Object.freeze({
        x: 0.05,
        y: 0.9,
        width: 0.9,
        height: 0.05,
        rotation: 0.0,
        fontSize: 0.03,
      }),
    }),
  }),
  content: Object.freeze({
    label: "Content",
    layout: Object.freeze({
      head: Object.freeze({
        x: 0.05,
        y: 0.1,
        width: 0.9,
        height: 0.1,
        rotation: 0,
        fontSize: 0.08,
        textAlign: "start",
      }),
      body: Object.freeze({
        x: 0.05,
        y: 0.25,
        width: 0.9,
        height: 0.6,
        rotation: 0.0,
        fontSize: 0.05,
        textAlign: "start",
      }),
      foot: Object.freeze({
        x: 0.05,
        y: 0.9,
        width: 0.9,
        height: 0.05,
        rotation: 0.0,
        fontSize: 0.03,
      }),
    }),
  }),
});

Slide.applyTemplate = Object.freeze((slide) => {
  let width = slide.metrics.width,
    height = slide.metrics.height;
  Object.entries(Slide.types[slide.type].layout).forEach(([key, value]) => {
    let slideObject = slide.content.fixed[key];
    slideObject.metrics.x = width * value.x;
    slideObject.metrics.y = height * value.y;
    if (value.hasOwnProperty("width"))
      slideObject.metrics.width = width * value.width;
    if (value.hasOwnProperty("height"))
      slideObject.metrics.height = height * value.height;
    if (value.hasOwnProperty("rotation"))
      slideObject.metrics.rotation = value.rotation;
    if (value.hasOwnProperty("fontSize"))
      slideObject.style.text.font.setSize(height * value.fontSize + "px");
    if (value.hasOwnProperty("textAlign"))
      slideObject.style.text.align = value.textAlign;
  });
});

Slide.make = (object) => {
  let out = jQuery.extend(true, new Slide(), object);
  out.content.fixed.head = SlideObject.make(out.content.fixed.head);
  out.content.fixed.body = SlideObject.make(out.content.fixed.body);
  out.content.fixed.foot = SlideObject.make(out.content.fixed.foot);
  out.content.fixed.drop = SlideObject.make(out.content.fixed.drop);
  for (let i = 0; i < out.content.free.length; i += 1)
    out.content.free[i] = SlideObject.make(out.content.free[i]);
  return out;
};

class SlideObject {
  constructor(type, width, height) {
    this.name = "";
    this.caption = "";
    this.author = "";
    this.visible = true;
    this.type = type || "text";
    this.model = "";
    this.object = undefined;
    this.metrics = Object.seal({
      x: 0.0,
      y: 0.0,
      width: width || 240.0,
      height: height || 240.0,
      rotation: 0.0,
    });
    this.style;
    SlideObject.applyTemplate(this);
  }

  applyType(type) {
    let model = SlideObject.types[type].model;
    this.type = type;
    this.model = model ? new model() : "";
    this.object = undefined;
  }

  copyObject() {
    let object = this.object;
    let fillObject = this.style.fill.object;
    let strokeObject = this.style.stroke.object;
    this.object = undefined;
    this.style.fill.object = undefined;
    this.style.stroke.object = undefined;
    let out = jQuery.extend(
      true,
      new SlideObject(this.type, this.width, this.height),
      this
    );
    this.object = object;
    this.style.fill.object = fillObject;
    this.style.stroke.object = strokeObject;
    return out;
  }

  toJSON() {
    return this.copyObject();
  }

  isFillEnabled() {
    return this.style.fill.enabled;
  }

  isStrokeEnabled() {
    return this.style.stroke.enabled;
  }

  isStyleDisabled() {
    return !this.isFillEnabled() && !this.isStrokeEnabled();
  }
}

SlideObject.make = (object) => {
  let out = jQuery.extend(true, new SlideObject(), object);
  out.style.text.font = jQuery.extend(
    true,
    new FontModel("0px"),
    out.style.text.font
  );
  return out;
};

SlideObject.types = Object.freeze({
  text: Object.freeze({
    label: "Text",
    style: Object.freeze(() => {
      return Object.seal({
        fill: Object.seal({
          enabled: true,
          type: "color",
          model: new CanvasColorModel("#000000"),
          object: undefined,
        }),
        stroke: Object.seal({
          enabled: false,
          type: "color",
          model: new CanvasColorModel("#000000"),
          object: undefined,
        }),
        line: Object.seal({
          width: 1.0,
          cap: "butt",
          join: "miter",
          miterLimit: "10",
          dash: [],
          dashOffset: 0.0,
        }),
        shadow: Object.seal({
          enabled: false,
          blur: 1.0,
          color: "#000000",
          offsetX: 0.0,
          offsetY: 0.0,
        }),
        text: Object.seal({
          font: Object.seal(new FontModel("20pt", "Arial")),
          align: "start",
          baseline: "top",
          direction: "inherit",
        }),
      });
    }),
    model: String,
    input: Object.freeze({
      getPanels: Object.freeze(() => {
        let fields = new Map().set(
          "",
          Input.builder.makeFieldTextArea(
            "inputContentModelText",
            "Text",
            "long",
            { rows: 4 }
          )
        );
        return Object.freeze(new Map().set("", fields.get("")));
      }),
      getFieldMap: Object.freeze(() => {
        return Object.freeze(new Map().set("", $("#inputContentModelText")));
      }),
    }),
  }),
  raster: Object.freeze({
    label: "Raster",
    style: Object.freeze(() => {
      return Object.seal({
        fill: Object.seal({
          enabled: false,
          type: "color",
          model: new CanvasColorModel("#000000"),
          object: undefined,
        }),
        stroke: Object.seal({
          enabled: false,
          type: "color",
          model: new CanvasColorModel("#000000"),
          object: undefined,
        }),
        line: Object.seal({
          width: 1.0,
          cap: "butt",
          join: "miter",
          miterLimit: "10",
          dash: [],
          dashOffset: 0.0,
        }),
        shadow: Object.seal({
          enabled: false,
          blur: 1.0,
          color: "#000000",
          offsetX: 0.0,
          offsetY: 0.0,
        }),
        text: Object.seal({
          font: Object.seal(new FontModel("20pt", "Arial")),
          align: "start",
          baseline: "top",
          direction: "inherit",
        }),
      });
    }),
    model: ImageModel,
    input: Object.freeze({
      getPanels: Object.freeze(() => {
        let fields = new Map().set(
          "",
          "<i>Raster input fields have not been implemented.</i>"
        );
        return Object.freeze(new Map().set("", fields.get("")));
      }),
      getFieldMap: Object.freeze(() => {
        return Object.freeze(new Map());
      }),
    }),
  }),
  vector: Object.freeze({
    label: "Vector",
    style: Object.freeze(() => {
      return Object.seal({
        fill: Object.seal({
          enabled: true,
          type: "color",
          model: new CanvasColorModel("#5f9fbf"),
          object: undefined,
        }),
        stroke: Object.seal({
          enabled: false,
          type: "color",
          model: new CanvasColorModel("#000000"),
          object: undefined,
        }),
        line: Object.seal({
          width: 1.0,
          cap: "butt",
          join: "miter",
          miterLimit: "10",
          dash: [],
          dashOffset: 0.0,
        }),
        shadow: Object.seal({
          enabled: false,
          blur: 1.0,
          color: "#000000",
          offsetX: 0.0,
          offsetY: 0.0,
        }),
        text: Object.seal({
          font: Object.seal(new FontModel("20pt", "Arial")),
          align: "start",
          baseline: "top",
          direction: "inherit",
        }),
      });
    }),
    model: undefined,
    input: Object.freeze({
      getPanels: Object.freeze(() => {
        let fields = new Map().set(
          "",
          "<i>Only rectangular vectors are supported for now.</i>"
        );
        return Object.freeze(new Map().set("", fields.get("")));
      }),
      getFieldMap: Object.freeze(() => {
        return Object.freeze(new Map());
      }),
    }),
  }),
});

SlideObject.applyTemplate = Object.freeze((slideObject) => {
  slideObject.style = SlideObject.types[slideObject.type].style();
});
