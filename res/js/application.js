const Application = (() => {
  const INSTANCE = new Instance();
  var fieldChangeEvent = "change";
  var autoUpdate = false;

  function attachChangeListenerFormField(key, jQueryObject) {
    jQueryObject.on(fieldChangeEvent, () => {
      INSTANCE.changes.formFields.add(key);
    });
  }

  function attachChangeListenerObjectModel(key, jQueryObject) {
    jQueryObject.on(fieldChangeEvent, () => {
      INSTANCE.changes.objectModel.add(key);
    });
  }

  function attachChangeListenerObjectType(key, jQueryObject) {
    jQueryObject.on("change", () => {
      let slideObjects = getSelectedSlideObjects();
      let value = Input.val(key);
      slideObjects.forEach((slideObject) => {
        slideObject.applyType(value);
      });
      UI.populateFieldsSlideObject(slideObjects);
      UI.populateFieldsSlideObjectContent(slideObjects);
      drawSelectedSlide();
    });
  }

  function attachChangeListenerSlideType(key, jQueryObject) {
    jQueryObject.on("change", () => {
      let slides = getSelectedSlides();
      let value = Input.val(key);
      slides.forEach((slide) => {
        slide.type = value;
        Slide.applyTemplate(slide);
      });
      UI.populateFieldsSlide(slides);
      drawSelectedSlide();
    });
  }

  function drawSelectedSlide() {
    drawSlide(getSelectedSlide());
  }

  function fetchSelectionSlide() {
    setSelectionSlide(Input.val("selection.slide"));
  }

  function fetchSelectionSlideObject() {
    setSelectionSlideObject(Input.val("selection.object"));
  }

  function getDifferencesSlide(slides) {
    let out = new Set();
    if (slides.length < 2) return out;
    let filter = ([key]) => {
      return !key.startsWith("content.");
    };
    let s,
      t = EDENObjects.getEntries(slides[0]).filter(filter);
    for (let i = 1; i < slides.length; i += 1) {
      s = t;
      t = EDENObjects.getEntries(slides[i]).filter(filter);
      console.assert(s.length === t.length, s.length + " != " + t.length);
      for (let j = 0; j < s.length; j += 1) {
        if (s[j][1] !== t[j][1]) out.add(s[j][0]);
      }
    }
    return out;
  }

  function getDifferencesSlideObjects(slideObjects) {
    let out = new Set();
    if (slideObjects.length < 2) return out;
    let filter = ([key]) => {
      return (
        !key.startsWith("model") &&
        !key.startsWith("object") &&
        !key.startsWith("style.fill.model") &&
        !key.startsWith("style.fill.object") &&
        !key.startsWith("style.stroke.model") &&
        !key.startsWith("style.stroke.object")
      );
    };
    let s,
      t = EDENObjects.getEntries(slideObjects[0]).filter(filter);
    for (let i = 1; i < slideObjects.length; i += 1) {
      s = t;
      t = EDENObjects.getEntries(slideObjects[i]).filter(filter);
      console.assert(s.length === t.length, s.length + " != " + t.length);
      for (let j = 0; j < s.length; j += 1) {
        if (s[j][1] !== t[j][1]) out.add(s[j][0]);
      }
    }
    return out;
  }

  function setSelectionSlide(values) {
    if (typeof values === "undefined") {
      values = [];
      INSTANCE.selection.slides.forEach((value) => {
        values.push(value);
      });
    }
    if (values.length === 0) {
      INSTANCE.slide = undefined;
      INSTANCE.selection.slides.clear();
      UI.populateFieldsSlide([]);
      UI.populateFieldsSlideObject([]);
      UI.populateFieldsSlideObjectContent([]);
      UI.populateFieldsSlideObjects();
      if (getSelectedDeck().slides.length === 0) UI.populateFieldsSlides([]);
      drawSelectedSlide();
      return;
    }
    let focusChange = false;
    INSTANCE.selection.slides.clear();
    if (values.includes(INSTANCE.slide)) {
      if (values.length > 1) INSTANCE.selection.slideObjects.clear();
    } else {
      INSTANCE.slide = values[0].toString();
      INSTANCE.selection.slideObjects.clear();
      if (values.length < 2) focusChange = true;
    }
    values.forEach((value) => {
      INSTANCE.selection.slides.add(value);
    });
    UI.populateFieldsSlide(getSelectedSlides());
    Input.val("selection.slide", values);
    if (focusChange) {
      let slide = getSelectedSlide();
      INSTANCE.clearChanges();
      UI.populateFieldsSlideObjects(slide ? slide.content : undefined);
      setSelectionSlideObject(slide ? ["body"] : []);
      drawSelectedSlide();
    }
  }

  function setSelectionSlideObject(values) {
    if (typeof values === "undefined") {
      values = [];
      INSTANCE.selection.slideObjects.forEach((value) => {
        values.push(value);
      });
    }
    if (values.length === 0) {
      INSTANCE.selection.slideObjects.clear();
      UI.populateFieldsSlideObject([]);
      UI.populateFieldsSlideObjectContent([]);
      UI.populateFieldsSlideObjects(getSelectedSlide().content);
      return;
    }
    INSTANCE.selection.slides.clear();
    INSTANCE.selection.slides.add(INSTANCE.slide);
    INSTANCE.selection.slideObjects.clear();
    values.forEach((value) => {
      INSTANCE.selection.slideObjects.add(value);
    });
    INSTANCE.clearChanges();
    let slideObjects = getSelectedSlideObjects();
    UI.populateFieldsSlideObject(slideObjects);
    UI.populateFieldsSlideObjectContent(slideObjects);
    Input.val("selection.object", values);
  }

  function setSelectionClass(value) {
    setSelectionKey(value + "." + INSTANCE.selection.formPage);
  }

  function setSelectionFormPage(value) {
    setSelectionKey(INSTANCE.selection.class + "." + value);
  }

  function setSelectionKey(key) {
    let splitIndex = key.indexOf(".");
    let modelClass = key.substring(0, splitIndex);
    let property = key.substring(splitIndex + 1);
    INSTANCE.selection.class = modelClass;
    INSTANCE.selection.formPage = property;
    UI.setPageForm(key);
  }

  function updateSelectedDeck() {
    updateDeck(getSelectedDeck());
    UI.populateStatusBar("Updated deck");
  }

  function updateSelectedSlides() {
    let slides = getSelectedSlides();
    updateSlides(slides);
    UI.populateFieldsSlides(getSelectedDeck().slides);
    setSelectionSlide();
    drawSelectedSlide();
    UI.populateStatusBar("Updated " + slides.length + " slide(s)");
  }

  function updateSelectedSlideObjects() {
    let deck = getSelectedDeck();
    let slideObjects = getSelectedSlideObjects();
    updateSlideObjects(slideObjects);
    UI.populateFieldsSlides(deck.slides);
    setSelectionSlide();
    UI.populateFieldsSlideObjects(getSelectedSlideFrom(INSTANCE).content);
    setSelectionSlideObject();
    drawSelectedSlide();
    UI.populateStatusBar("Updated " + slideObjects.length + " object(s)");
  }

  function drawSlide(slide) {
    UI.drawContent(this, (canvasRenderingContext2d) => {
      let c = canvasRenderingContext2d;
      Painter.drawVoid(c, "#bfbfbf");
      if (!slide) return;
      let o = slide.content.fixed,
        m = Painter.getMetricModifiers(c, slide.metrics);
      if (o.drop.visible) Painter.drawObject(c, o.drop, m);
      if (o.foot.visible) Painter.drawObject(c, o.foot, m);
      if (o.body.visible) Painter.drawObject(c, o.body, m);
      if (o.head.visible) Painter.drawObject(c, o.head, m);
      o = slide.content.free;
      o.forEach((slideObject) => {
        if (slideObject.visible) Painter.drawObject(c, slideObject, m);
      });
    });
  }

  function getSelectedDeck() {
    return getSelectedDeckFrom(INSTANCE);
  }

  function getSelectedSlide() {
    return getSelectedSlideFrom(INSTANCE);
  }

  function getSelectedSlides() {
    return getSelectedSlidesFrom(INSTANCE);
  }

  function getSelectedSlideObjects() {
    return getSelectedSlideObjectsFrom(INSTANCE);
  }

  function getSelectedDeckFrom(instance) {
    return instance ? instance.deck : undefined;
  }

  function getSelectedSlideFrom(instance) {
    return instance ? instance.deck.slides[instance.slide] : undefined;
  }

  function getSelectedSlidesFrom(instance) {
    let out = [];
    if (!instance) return out;
    instance.selection.slides.forEach((slide) => {
      out.push(instance.deck.slides[slide]);
    });
    return out;
  }

  function getSelectedSlideObjectsFrom(instance) {
    let out = [];
    if (!instance) return out;
    let content = getSelectedSlideFrom(instance).content;
    instance.selection.slideObjects.forEach((slideObject) => {
      out.push(
        content.fixed.hasOwnProperty(slideObject)
          ? content.fixed[slideObject]
          : content.free[slideObject]
      );
    });
    return out;
  }

  function insertSlide(index) {
    let container = getSelectedDeck().slides;
    let selection = [];
    index =
      isNaN(index) || parseInt(index) >= container.length
        ? container.length - 1
        : parseInt(index);
    let type, width, height;
    if (index < 0) {
      if (container.length === 0) {
        width = 960;
        height = 720;
      } else {
        width = container[0].metrics.width;
        height = container[0].metrics.height;
      }
      type = "title";
    } else {
      type = "content";
      width = container[index].metrics.width;
      height = container[index].metrics.height;
    }
    container.splice((index += 1), 0, new Slide(type, width, height));
    if (INSTANCE.selection.slides.size > 1) {
      INSTANCE.selection.slides.forEach((slide) => {
        slide = parseInt(slide);
        selection.push(
          slide >= index ? (slide + 1).toString() : slide.toString()
        );
      });
    } else selection.push([index.toString()]);
    UI.populateFieldsSlides(container);
    setSelectionSlide(selection);
    UI.populateStatusBar("Inserted slide");
  }

  function insertSlideObject(index) {
    let slide = getSelectedSlide();
    if (!slide) return;
    let container = slide.content.free;
    let selection = [];
    index =
      isNaN(index) || parseInt(index) >= container.length
        ? container.length - 1
        : parseInt(index);
    container.splice((index += 1), 0, new SlideObject());
    if (INSTANCE.selection.slideObjects.size > 1) {
      INSTANCE.selection.slideObjects.forEach((slideObject) => {
        if (
          slideObject === "head" ||
          slideObject === "body" ||
          slideObject === "foot" ||
          slideObject === "drop"
        ) {
          selection.push(slideObject);
        } else {
          slideObject = parseInt(slideObject);
          selection.push(
            slideObject >= index
              ? (slideObject + 1).toString()
              : slideObject.toString()
          );
        }
      });
    } else selection.push([index.toString()]);
    UI.populateFieldsSlideObjects(slide.content);
    setSelectionSlideObject(selection);
    UI.populateStatusBar("Inserted object");
  }

  function removeSlides(indexes) {
    let container = getSelectedDeck().slides;
    let removedIndexes = [];
    let selection = [];
    indexes.forEach((index) => {
      index =
        isNaN(index) || parseInt(index) >= container.length
          ? container.length - 1
          : parseInt(index);
      let indexString = index.toString();
      if (INSTANCE.selection.slides.has(indexString))
        INSTANCE.selection.slides.delete(indexString);
      for (let i = 0; i < removedIndexes.length; i += 1) {
        if (index >= removedIndexes[i]) {
          index -= 1;
          break;
        }
      }
      container.splice(index, 1);
      for (let i = 0; i < removedIndexes.length; i += 1) {
        if (removedIndexes[i] > index) removedIndexes[i] -= 1;
      }
      removedIndexes.push(index);
    });
    INSTANCE.selection.slides.forEach((slide) => {
      selection.push(parseInt(slide));
    });
    removedIndexes.forEach((index) => {
      for (let i = 0; i < selection.length; i += 1) {
        if (selection[i] >= index) {
          if (--selection[i] < 0) selection.splice(i--, 1);
        }
      }
    });
    if (
      indexes.length === 1 &&
      selection.length === 0 &&
      container.length >= indexes[0] &&
      indexes[0] > 0
    ) {
      selection.push(indexes[0] - 1);
    }
    UI.populateFieldsSlides(getSelectedDeck().slides);
    setSelectionSlide(selection);
    UI.populateStatusBar("Removed " + removedIndexes.length + " slide(s)", 3);
  }

  function removeSlideObjects(indexes) {
    let slide = getSelectedSlide();
    if (!slide) return;
    let container = slide.content.free;
    let removedIndexes = [];
    let selection = [];
    indexes.forEach((index) => {
      index =
        isNaN(index) || parseInt(index) >= container.length
          ? container.length - 1
          : parseInt(index);
      let indexString = index.toString();
      if (INSTANCE.selection.slideObjects.has(indexString))
        INSTANCE.selection.slideObjects.delete(indexString);
      for (let i = 0; i < removedIndexes.length; i += 1) {
        if (index >= removedIndexes[i]) {
          index -= 1;
          break;
        }
      }
      container.splice(index, 1);
      for (let i = 0; i < removedIndexes.length; i += 1) {
        if (removedIndexes[i] > index) removedIndexes[i] -= 1;
      }
      removedIndexes.push(index);
    });
    INSTANCE.selection.slideObjects.forEach((slide) => {
      selection.push(
        slide === "head" ||
          slide === "body" ||
          slide === "foot" ||
          slide === "drop"
          ? slide
          : parseInt(slide)
      );
    });
    removedIndexes.forEach((index) => {
      for (let i = 0; i < selection.length; i += 1) {
        if (!isNaN(selection[i]) && selection[i] >= index) {
          if (--selection[i] < 0) selection.splice(i--, 1);
        }
      }
    });
    if (
      indexes.length === 1 &&
      selection.length === 0 &&
      container.length >= indexes[0] &&
      container.length > 0
    ) {
      selection.push(indexes[0] - 1);
    }
    UI.populateFieldsSlideObjects(slide.content);
    setSelectionSlideObject(selection);
    UI.populateStatusBar("Removed " + removedIndexes.length + " object(s)", 3);
  }

  function updateDeck(deck) {
    updateModel("deck", [deck]);
  }

  function updateSlides(slides) {
    updateModel("slide", slides);
  }

  function updateSlideObjects(slideObjects) {
    updateModel("object", slideObjects);
  }

  function updateModel(modelKey, models) {
    INSTANCE.changes.formFields.forEach((change) => {
      if (change.startsWith(modelKey + ".")) {
        let key = change.substring(modelKey.length + 1);
        let value = Input.val(change);
        if (Input.type(change) === "number") value = parseFloat(value);
        models.forEach((object) => {
          EDENObjects.setProperty(object, key, value);
        });
        INSTANCE.changes.formFields.delete(change);
      }
    });
    if (!modelKey.startsWith("object") || models.length > 1) return;
    let object = models[0];
    SlideObject.types[object.type].input.getFieldMap().forEach((field, key) => {
      if (INSTANCE.changes.objectModel.has(key)) {
        let value = field.val();
        if (field.prop("type") === "number") value = parseFloat(value);
        if (key) EDENObjects.setProperty(object.model, key, value);
        else object.model = value;
        INSTANCE.changes.objectModel.delete(key);
      }
    });
  }

  function loadFromFile(instance) {
    let reader = new FileReader();
    let files = Input.fieldMaps.intermediate.get("file.load.fileName").get(0)
      .files;
    if (files.length === 0) {
      UI.populateStatusBar("Nothing to load", 4);
      return;
    }
    reader.onload = (event) => {
      loadDeck(SlideDeck.make(JSON.parse(event.target.result)));
    };
    reader.readAsText(files[0]);
  }

  function saveToFile(instance) {
    let element = $("<a>", {
      href:
        "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(instance.deck)),
      download: instance.deck.name
        ? instance.deck.name + ".nd.json"
        : "Unnamed Deck.nd.json",
    }).css("display", "none");
    $("body").append(element);
    element.get(0).click();
    $("body").detach(element);
  }

  function loadDeck(deck) {
    INSTANCE.deck = deck;
    INSTANCE.clearChanges();
    UI.populateFieldsSlides(getSelectedDeck().slides);
    UI.populateFieldsSlideObjects(getSelectedSlide().content);
    UI.populateFieldsDeck(deck);
    setSelectionSlide(["0"]);
    setSelectionSlideObject(["body"]);
    drawSelectedSlide();
    UI.populateStatusBar("The deck has been loaded into the application", 1);
  }

  {
    window.onresize = () => {
      UI.resize();
      drawSelectedSlide();
    };
    Input.fieldMaps.model.forEach((value, key) => {
      attachChangeListenerFormField(key, value);
    });
    attachChangeListenerSlideType(
      "slide.type",
      Input.fieldMaps.model.get("slide.type")
    );
    attachChangeListenerObjectType(
      "object.type",
      Input.fieldMaps.model.get("object.type")
    );
    Input.fieldMaps.selection
      .get("selection.slide")
      .on("change", () => {
        fetchSelectionSlide();
      })
      .on("dblclick", () => {
        UI.setPageForm("slide.content");
      });
    Input.fieldMaps.selection
      .get("selection.object")
      .on("change", () => {
        fetchSelectionSlideObject();
      })
      .on("dblclick", () => {
        UI.setPageForm("object.content");
      });
    Input.actionMaps.menu.forEach((_value, key) => {
      Input.onMenuClick(key, () => {
        setSelectionKey(key);
      });
    });
    Input.actionMaps.model.get("file.save.toFile").on("click", () => {
      saveToFile(INSTANCE);
    });
    Input.actionMaps.model.get("file.save.toNet").on("click", () => {
      let deck = getSelectedDeck();
      if (deck.id !== "0") Client.update(deck);
      else Client.save(deck);
    });
    Input.actionMaps.model.get("file.load.fromFile").on("click", () => {
      loadFromFile(INSTANCE);
    });
    Input.actionMaps.model.get("file.load.fromNet").on("click", () => {
      Client.load(Input.fieldMaps.intermediate.get("file.load.netId").val());
    });
    Input.actionMaps.model.get("deck.insertSlide").on("click", () => {
      insertSlide(Input.val("selection.slide")[0]);
    });
    Input.actionMaps.model.get("deck.removeSlides").on("click", () => {
      removeSlides(Input.val("selection.slide"));
    });
    Input.actionMaps.model.get("slide.insertObject").on("click", () => {
      insertSlideObject(Input.val("selection.object")[0]);
    });
    Input.actionMaps.model.get("slide.removeObjects").on("click", () => {
      removeSlideObjects(Input.val("selection.object"));
    });
    Input.actionMaps.model.get("update.deck").on("click", () => {
      updateSelectedDeck();
    });
    Input.actionMaps.model.get("update.slides").on("click", () => {
      updateSelectedSlides();
    });
    Input.actionMaps.model.get("update.objects").on("click", () => {
      updateSelectedSlideObjects();
    });
    UI.populateFieldsSlides(getSelectedDeck().slides);
    UI.populateFieldsSlideObjects(getSelectedSlide().content);
    UI.setPageForm("deck.properties");
  }

  return {
    attachChangeListenerFormField: attachChangeListenerFormField,
    attachChangeListenerSlideType: attachChangeListenerSlideType,
    attachChangeListenerObjectModel: attachChangeListenerObjectModel,
    attachChangeListenerObjectType: attachChangeListenerObjectType,
    compareSlides: getDifferencesSlide,
    compareSlideObjects: getDifferencesSlideObjects,
    drawSelectedSlide: drawSelectedSlide,
    setSelectionSlide: setSelectionSlide,
    setSelectionSlideObject: setSelectionSlideObject,
    loadDeck: loadDeck,
  };
})();

function initialize() {
  Application.setSelectionSlide(["0"]);
  Application.setSelectionSlideObject(["body"]);
  UI.resize();
  Application.drawSelectedSlide();
}
