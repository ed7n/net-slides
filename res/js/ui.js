const UI = (() => {
  const body = Object.freeze({
    container: $(".uiContainer.body").filter(":first"),
    left: $(".uiContainer.body > .uiContainer.panel").filter(":eq(0)"),
    content: $(".uiContainer.body > .uiContainer.panel").filter(":eq(1)"),
    right: $(".uiContainer.body > .uiContainer.panel").filter(":eq(2)"),
  });

  const menu = $("#application-menu");
  const message = $("#application-message");
  const canvas = document.querySelector("#digitalNET-slide");

  function clearContent() {
    let c = get2dDrawingContext();
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  }

  function drawContent(thisObject, drawFunction, args) {
    let c = get2dDrawingContext();
    c.save();
    let out = drawFunction.call(thisObject, c, args);
    c.restore();
    return out;
  }

  function populateFieldsDeck(deck) {
    EDENObjects.getEntries(deck).forEach(([key, value]) => {
      if (!key.startsWith("slides.")) Input.val("deck." + key, value);
    });
  }

  function populateFieldsSlide(slides) {
    if (slides.length === 0) {
      Input.fieldMaps.model.forEach((value, key) => {
        if (key.startsWith("slide.")) value.val("");
      });
      return;
    }
    let diff = Application.compareSlides(slides);
    EDENObjects.getEntries(slides[0])
      .filter(([key]) => {
        return !key.startsWith("content.");
      })
      .forEach(([key, value]) => {
        key = "slide." + key;
        Input.placeholder(key, "");
        Input.val(key, value);
      });
    diff.forEach((key) => {
      key = "slide." + key;
      Input.placeholder(key, "(keep)");
      Input.val(key, "");
    });
  }

  function populateFieldsSlideObject(slideObjects) {
    if (slideObjects.length === 0) {
      Input.fieldMaps.model.forEach((value, key) => {
        if (key.startsWith("object.")) value.val("");
      });
      return;
    }
    let diff = Application.compareSlideObjects(slideObjects);
    EDENObjects.getEntries(slideObjects[0])
      .filter(([key]) => {
        return !key.startsWith("model") && !key.startsWith("object");
      })
      .forEach(([key, value]) => {
        key = "object." + key;
        Input.placeholder(key, "");
        Input.val(key, value);
      });
    diff.forEach((key) => {
      key = "object." + key;
      Input.placeholder(key, "(keep)");
      Input.val(key, "");
    });
  }

  function populateFieldsSlideObjectContent(slideObjects) {
    if (slideObjects.length !== 1) {
      $("#input-object-content").html(
        "<i>Select only one object to view its contents.</i>"
      );
      return;
    }
    let slideObject = slideObjects[0];
    let input = SlideObject.types[slideObject.type].input;
    let container = $("#input-object-content").html("");
    input.getPanels().forEach((value) => {
      container.append(value);
    });
    input.getFieldMap().forEach((field, key) => {
      field.val(
        key
          ? EDENObjects.getProperty(slideObject.model, key)
          : slideObject.model
      );
      Application.attachChangeListenerObjectModel(key ? key : "", field);
    });
  }

  function populateFieldsSlides(slides) {
    if (!slides) {
      Input.populateFieldSlides([]);
      return;
    }
    let options = [];
    for (let i = 0; i < slides.length; i += 1) {
      let slide = slides[i];
      options.push([
        i.toString(),
        "<small><b>" +
          (i + 1) +
          "</b>:&nbsp;" +
          slide.name +
          "</small><br>&nbsp;" +
          slide.content.fixed.head.model.toString(),
      ]);
    }
    Input.populateFieldSlides(options);
  }

  function populateFieldsSlideObjects(slideContents) {
    if (!slideContents) {
      Input.populateFieldSlideObjects([]);
      return;
    }
    let options = [];
    let fixed = slideContents.fixed;
    let free = slideContents.free;
    for (let i = 0; i < free.length; i += 1) {
      let slideObject = free[i];
      options.push([
        i.toString(),
        "<small><b>" + (i + 1) + "</b>:&nbsp;" + slideObject.name,
      ]);
    }
    options.push(["head", "<small><b>Head</b>:&nbsp;" + fixed.head.name]);
    options.push(["body", "<small><b>Body</b>:&nbsp;" + fixed.body.name]);
    options.push(["foot", "<small><b>Foot</b>:&nbsp;" + fixed.foot.name]);
    options.push([
      "drop",
      "<small><b>Backdrop: </b></small> " + fixed.drop.name,
    ]);
    Input.populateFieldSlideObjects(options);
  }

  function populateStatusBar(text, elevation) {
    if (typeof text === "undefined")
      text = "<i>Application message cleared</i>";
    if (!elevation) elevation = 0;
    let color;
    switch (elevation) {
      case 1:
        color = "#7f7fff";
        break;
      case 2:
        color = "#7fff7f";
        break;
      case 3:
        color = "#ffff7f";
        break;
      case 4:
        color = "#ff7f7f";
        break;
      default:
        color = "";
    }
    message.html(text);
    message.css("background-color", color);
  }

  function resize() {
    canvas.width = Math.floor(body.content.innerWidth());
    canvas.height = Math.floor(body.content.innerHeight());
    Painter.drawVoid(get2dDrawingContext(), "#7f7f7f");
  }

  function setPageForm(key) {
    Input.showFormSolo(key);
  }

  function get2dDrawingContext() {
    return canvas.getContext("2d");
  }
  {
    Input.forms.model.forEach((value) => {
      body.right.append(value);
    });
    Input.forms.selection.forEach((value) => {
      body.left.append(value);
    });
    Input.fields.menu.forEach((value) => {
      if (value.hasClass("root")) menu.append(value);
    });
    Input.initializeFieldMaps();
  }

  return {
    clearContent: clearContent,
    drawContent: drawContent,
    populateFieldsDeck: populateFieldsDeck,
    populateFieldsSlide: populateFieldsSlide,
    populateFieldsSlides: populateFieldsSlides,
    populateFieldsSlideObject: populateFieldsSlideObject,
    populateFieldsSlideObjects: populateFieldsSlideObjects,
    populateFieldsSlideObjectContent: populateFieldsSlideObjectContent,
    populateStatusBar: populateStatusBar,
    resize: resize,
    setPageForm: setPageForm,
  };
})();
