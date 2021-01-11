const Input = (() => {
  const fields = Object.seal({
    intermediate: new Map(),
    menu: new Map(),
    model: new Map(),
  });

  const forms = Object.seal({ model: new Map(), selection: new Map() });
  const actionMaps = Object.seal({ menu: new Map(), model: new Map() });

  const fieldMaps = Object.seal({
    intermediate: new Map(),
    model: new Map(),
    selection: new Map(),
  });

  function getField(key) {
    return key.startsWith("selection")
      ? $(fieldMaps.selection.get(key))
      : $(fieldMaps.model.get(key));
  }

  function disable(key) {
    let field = getField(key);
    if (!field) return;
    field.prop("disabled", true);
  }

  function enable(key) {
    let field = getField(key);
    if (!field) return;
    fieldMaps.model.get(key).prop("disabled", false);
  }

  function off(key, event) {
    let field = getField(key);
    if (!field) return;
    field.off(event);
  }

  function on(key, event, handler) {
    let field = getField(key);
    if (!field) return;
    field.on(event, handler);
  }

  function placeholder(key, value) {
    let field = getField(key);
    if (!field) return;
    if (typeof value === "undefined") return field.prop("placeholder");
    field.prop("placeholder", value);
  }

  function type(key, value) {
    let field = getField(key);
    if (!field) return;
    if (typeof value === "undefined") return field.prop("type");
    field.prop("type", value);
  }

  function val(key, value) {
    let field = getField(key);
    if (!field) return;
    if (typeof value === "undefined") {
      if (field.filter(":checkbox").length === 1) return field.prop("checked");
      return field.val();
    }
    if (typeof value === "boolean") field.prop("checked", value);
    else field.val(value);
  }

  function hideForm(key) {
    let form = forms.model.get(key);
    if (!form) return;
    form.hide();
  }

  function showForm(key) {
    let form = forms.model.get(key);
    if (!form) return;
    form.show();
  }

  function showFormSolo(key) {
    let shows = $();
    let hides = $();
    forms.model.forEach((value, mapKey) => {
      if (mapKey === key) shows = shows.add(value);
      else hides = hides.add(value);
    });
    hides.hide();
    shows.show();
  }

  function onMenuClick(key, handler) {
    let menu = actionMaps.menu.get(key);
    if (!menu) return;
    menu.click(handler);
  }

  function initializeFieldMaps() {
    actionMaps.menu
      .set("file.save", $("#menu-file-save"))
      .set("file.load", $("#menu-file-load"))
      .set("file.close", $("#menu-file-close"))
      .set("deck.properties", $("#menu-deck-properties"))
      .set("slide.properties", $("#menu-slide-properties"))
      .set("slide.content", $("#menu-slide-content"))
      .set("slide.metrics", $("#menu-slide-metrics"))
      .set("object.properties", $("#menu-object-properties"))
      .set("object.content", $("#menu-object-content"))
      .set("object.metrics", $("#menu-object-metrics"))
      .set("object.fill", $("#menu-object-fill"))
      .set("object.stroke", $("#menu-object-stroke"))
      .set("object.line", $("#menu-object-line"))
      .set("object.shadow", $("#menu-object-shadow"))
      .set("object.text", $("#menu-object-text"));
    actionMaps.model
      .set("file.save.toFile", $("#button-save-toFile"))
      .set("file.save.toNet", $("#button-save-toNet"))
      .set("file.load.fromFile", $("#button-load-fromFile"))
      .set("file.load.fromNet", $("#button-load-fromNet"))
      .set("deck.insertSlide", $("#menu-deck-insertSlide"))
      .set("deck.removeSlides", $("#menu-deck-removeSlides"))
      .set("slide.insertObject", $("#menu-slide-insertObject"))
      .set("slide.removeObjects", $("#menu-slide-removeObjects"))
      .set("update.deck", $("#update-deck"))
      .set("update.slides", $("#update-slide"))
      .set("update.objects", $("#update-object"));
    fieldMaps.intermediate
      .set("file.load.fileName", $("#input-load-fileName"))
      .set("file.load.netId", $("#input-load-netId"));
    fieldMaps.model
      .set("deck.id", $("#input-deck-id"))
      .set("deck.name", $("#input-deck-name"))
      .set("deck.caption", $("#input-deck-caption"))
      .set("deck.author", $("#input-deck-author"))
      .set("slide.name", $("#input-slide-name"))
      .set("slide.caption", $("#input-slide-caption"))
      .set("slide.author", $("#input-slide-author"))
      .set("slide.type", $("#input-slide-type"))
      .set("slide.visible", $("#input-slide-visible"))
      .set("slide.notes", $("#input-slide-notes"))
      .set("slide.metrics.offsetX", $("#input-slide-offsetX"))
      .set("slide.metrics.offsetY", $("#input-slide-offsetY"))
      .set("slide.metrics.width", $("#input-slide-width"))
      .set("slide.metrics.height", $("#input-slide-height"))
      .set("object.name", $("#input-object-name"))
      .set("object.caption", $("#input-object-caption"))
      .set("object.author", $("#input-object-author"))
      .set("object.type", $("#input-object-type"))
      .set("object.visible", $("#input-object-visible"))
      .set("object.metrics.x", $("#input-object-x"))
      .set("object.metrics.y", $("#input-object-y"))
      .set("object.metrics.width", $("#input-object-width"))
      .set("object.metrics.height", $("#input-object-height"))
      .set("object.metrics.rotation", $("#input-object-rotation"))
      .set("object.style.fill.enabled", $("#input-object-fillEnabled"))
      .set("object.style.fill.model.value", $("#input-object-fillColor"))
      .set("object.style.stroke.enabled", $("#input-object-strokeEnabled"))
      .set("object.style.stroke.model.value", $("#input-object-strokeColor"))
      .set("object.style.line.width", $("#input-object-lineWidth"))
      .set("object.style.line.cap", $("#input-object-lineCap"))
      .set("object.style.line.join", $("#input-object-lineJoin"))
      .set("object.style.line.miterLimit", $("#input-object-lineMiterLimit"))
      .set("object.style.line.dash", $("#input-object-lineDash"))
      .set("object.style.line.dashOffset", $("#input-object-lineDashOffset"))
      .set("object.style.shadow.enabled", $("#input-object-shadowEnabled"))
      .set("object.style.shadow.blur", $("#input-object-shadowBlur"))
      .set("object.style.shadow.color", $("#input-object-shadowColor"))
      .set("object.style.shadow.offsetX", $("#input-object-offsetX"))
      .set("object.style.shadow.offsetY", $("#input-object-offsetY"))
      .set("object.style.text.font.family", $("#input-object-fontFamily"))
      .set(
        "object.style.text.font.size.magnitude",
        $("#input-object-fontSize-magnitude")
      )
      .set("object.style.text.font.size.unit", $("#input-object-fontSize-unit"))
      .set("object.style.text.font.style", $("#input-object-fontStyle"))
      .set("object.style.text.font.variant", $("#input-object-fontVariant"))
      .set("object.style.text.font.weight", $("#input-object-fontWeight"))
      .set("object.style.text.font.stretch", $("#input-object-fontStretch"))
      .set(
        "object.style.text.font.lineHeight",
        $("#input-object-fontLineHeight")
      )
      .set("object.style.text.align", $("#input-object-textAlign"))
      .set("object.style.text.baseline", $("#input-object-textBaseline"))
      .set("object.style.text.direction", $("#input-object-textDirection"));
    fieldMaps.selection
      .set("selection.slide", $("#input-selection-slide"))
      .set("selection.object", $("#input-selection-object"));
  }

  function populateFieldSlides(options) {
    populateFieldSelect(fieldMaps.selection.get("selection.slide"), options);
  }

  function populateFieldSlideObjects(options) {
    populateFieldSelect(fieldMaps.selection.get("selection.object"), options);
  }

  function populateFieldSelect(field, options) {
    field = field.filter("select");
    field.empty();
    options.forEach(([value, html]) => {
      field.append(Input.builder.makeOption(value, html));
    });
  }

  return {
    fields: fields,
    forms: forms,
    actionMaps: actionMaps,
    fieldMaps: fieldMaps,
    disable: disable,
    enable: enable,
    off: off,
    on: on,
    placeholder: placeholder,
    type: type,
    val: val,
    hideForm: hideForm,
    showForm: showForm,
    showFormSolo: showFormSolo,
    onMenuClick: onMenuClick,
    initializeFieldMaps: initializeFieldMaps,
    populateFieldSlides: populateFieldSlides,
    populateFieldSlideObjects: populateFieldSlideObjects,
  };
})();
Input.builder = (function () {
  function makeFieldText(id, label, classes, properties) {
    return makeContainer(id + "-container", "input textarea")
      .append(makeLabel(id + "-label", label, id))
      .append($("<br>"))
      .append(makeText(id, classes, properties));
  }

  function makeFieldCheckBox(id, label, classes, properties) {
    return makeContainer(id + "-container", "input checkbox")
      .append(makeLabel(id + "-label", label, id))
      .append(makeCheckBox(id, classes, properties));
  }

  function makeFieldColor(id, label, classes, properties) {
    return makeContainer(id + "-container", "input color")
      .append(makeLabel(id + "-label", label, id))
      .append(makeColor(id, classes, properties));
  }

  function makeFieldFile(id, label, classes, properties) {
    return makeContainer(id + "-container", "input file")
      .append(makeLabel(id + "-label", label, id))
      .append("<br>")
      .append(makeFile(id, classes, properties));
  }

  function makeFieldMenu(id, items, html, classes, properties) {
    let out = makeContainer(id + "", "input menu")
      .append(
        $("<span>", {
          id: id + "-label",
          class: "uiInput menu",
        }).append(html)
      )
      .addClass(classes)
      .prop(properties || {});
    if (items && items.length > 0) {
      let childContainer = makeContainer(id + "-childContainer", "panel menu");
      items.forEach((html) => {
        childContainer.append(html);
      });
      out.append(childContainer);
      if (!out.hasClass("root"))
        out.append($("<span>", { class: "uiInput menu arrow" }).append("►"));
    }
    return out;
  }

  function makeFieldNumber(id, label, classes, properties) {
    return makeContainer(id + "-container", "input number")
      .append(makeLabel(id + "-label", label, id))
      .append($("<br>"))
      .append(makeNumber(id, classes, properties));
  }

  function makeFieldSelect(id, options, label, classes, properties) {
    return makeContainer(id + "-container", "input select")
      .append(makeLabel(id + "-label", label, id))
      .append(makeSelect(id, options, classes, properties));
  }

  function makeFieldTextArea(id, label, classes, properties) {
    return makeContainer(id + "-container", "input textarea")
      .append(makeLabel(id + "-label", label, id))
      .append($("<br>"))
      .append(makeTextArea(id, classes, properties));
  }

  function makeButton(id, html, classes, properties) {
    return $("<button>", {
      id: id,
      class: "uiInput button",
      type: "button",
    })
      .addClass(classes)
      .prop(properties || {})
      .append(html);
  }

  function makeCheckBox(id, classes, properties) {
    return $("<input>", {
      id: id,
      class: "uiInput checkbox",
      type: "checkbox",
    })
      .addClass(classes)
      .prop(properties || {});
  }

  function makeColor(id, classes, properties) {
    return $("<input>", {
      id: id,
      class: "uiInput color",
      type: "color",
    })
      .addClass(classes)
      .prop(properties || {});
  }

  function makeContainer(id, classes, properties) {
    return $("<div>", {
      id: id,
      class: "uiContainer",
    })
      .addClass(classes)
      .prop(properties || {});
  }

  function makeFieldset(id, legend, classes, properties) {
    let out = $("<fieldset>", {
      id: id,
      class: "uiPanel fieldset",
    })
      .addClass(classes)
      .prop(properties || {});
    return legend ? out.append($("<legend>", {}).append(legend)) : out;
  }

  function makeFile(id, classes, properties) {
    return $("<input>", {
      id: id,
      class: "uiInput file",
      type: "file",
    })
      .addClass(classes)
      .prop(properties || {});
  }

  function makeLabel(id, html, target, classes, properties) {
    return $("<label>", {
      id: id,
      for: target,
    })
      .addClass(classes)
      .prop(properties || {})
      .append(html);
  }

  function makeNumber(id, classes, properties) {
    return $("<input>", {
      id: id,
      class: "uiInput number",
      type: "number",
    })
      .addClass(classes)
      .prop(properties || {});
  }

  function makeOption(value, html) {
    return $("<option>", { value: value }).append(html);
  }

  function makeSelect(id, options, classes, properties) {
    let out = $("<select>", {
      id: id,
      class: "uiInput select",
    })
      .addClass(classes)
      .prop(properties || {});
    options.forEach(([value, text]) => {
      let type = typeof text;
      if (type === "object")
        out.append(makeOption(value, text.html || text.label || value));
      else if (type === "string") out.append(makeOption(value, text || value));
      else out.append(makeOption(value, value));
    });
    return out;
  }

  function makeSpan(id, html, classes, properties) {
    return $("<span>", { id: id })
      .append(html)
      .addClass(classes)
      .prop(properties || {});
  }

  function makeText(id, classes, properties) {
    return $("<input>", {
      id: id,
      class: "uiInput textarea",
      type: "text",
    })
      .addClass(classes)
      .prop(properties || {});
  }

  function makeTextArea(id, classes, properties) {
    return $("<textarea>", {
      id: id,
      class: "uiInput textarea",
    })
      .addClass(classes)
      .prop(properties || {});
  }
  return {
    makeFieldText: makeFieldText,
    makeFieldCheckBox: makeFieldCheckBox,
    makeFieldColor: makeFieldColor,
    makeFieldFile: makeFieldFile,
    makeFieldMenu: makeFieldMenu,
    makeFieldNumber: makeFieldNumber,
    makeFieldSelect: makeFieldSelect,
    makeFieldTextArea: makeFieldTextArea,
    makeText: makeText,
    makeButton: makeButton,
    makeCheckBox: makeCheckBox,
    makeColor: makeColor,
    makeContainer: makeContainer,
    makeFieldset: makeFieldset,
    makeFile: makeFile,
    makeLabel: makeLabel,
    makeNumber: makeNumber,
    makeOption: makeOption,
    makeSelect: makeSelect,
    makeSpan: makeSpan,
    makeTextArea: makeTextArea,
  };
})();
{
  let b = Input.builder;
  let intermediate = Input.fields.intermediate;
  let menu = Input.fields.menu;
  let model = Input.fields.model;
  let selection = Input.fieldMaps.selection;
  intermediate
    .set(
      "file.save.fileNotice",
      b.makeSpan(
        "save-fileNotice",
        "Due to platform limitations, the file must be presented as a download.<br><br>No" +
          " data is sent to the server."
      )
    )
    .set("file.save.toFile", b.makeButton("button-save-toFile", "Save to File"))
    .set(
      "file.save.netNotice",
      b.makeSpan(
        "save-netNotice",
        "This will upload the deck data to the server for safekeeping.<br><br>Decks that " +
          "are new to the server will be assigned a NET-ID for future reference."
      )
    )
    .set("file.save.toNet", b.makeButton("button-save-toNet", "Save to NET"))
    .set(
      "file.load.fileNotice",
      b.makeSpan("load-fileNotice", "Specify the JSON file denoting the deck.")
    )
    .set(
      "file.load.fileName",
      b.makeFieldFile("input-load-fileName", "File", "", {
        accept: "application/json",
      })
    )
    .set(
      "file.load.fromFile",
      b.makeButton("button-load-fromFile", "Load from File")
    )
    .set(
      "file.load.netNotice",
      b.makeSpan(
        "load-netNotice",
        "Enter the NET-ID that was assigned to the deck."
      )
    )
    .set(
      "file.load.netId",
      b.makeFieldText("input-load-netId", "NET-ID", "long")
    )
    .set(
      "file.load.fromNet",
      b.makeButton("button-load-fromNet", "Load from NET")
    );
  model
    .set(
      "deck.id",
      b.makeFieldText("input-deck-id", "NET ID", "long", { readonly: true })
    )
    .set("deck.name", b.makeFieldText("input-deck-name", "Name", "long"))
    .set(
      "deck.caption",
      b.makeFieldTextArea("input-deck-caption", "Caption", "long", {
        rows: "1",
      })
    )
    .set("deck.author", b.makeFieldText("input-deck-author", "Author", "long"))
    .set("slide.name", b.makeFieldText("input-slide-name", "Name", "long"))
    .set(
      "slide.caption",
      b.makeFieldTextArea("input-slide-caption", "Caption", "long", {
        rows: "1",
      })
    )
    .set(
      "slide.author",
      b.makeFieldText("input-slide-author", "Author", "long")
    )
    .set(
      "slide.type",
      b.makeFieldSelect(
        "input-slide-type",
        Object.entries(Slide.types),
        "Type:"
      )
    )
    .set("slide.visible", b.makeFieldCheckBox("input-slide-visible", "Visible"))
    .set(
      "slide.notes",
      b.makeFieldTextArea("input-slide-notes", "Notes", "long", { rows: "8" })
    )
    .set(
      "slide.metrics.offsetX",
      b.makeFieldNumber("input-slide-offsetX", "X offset", "", {
        max: 32767,
        min: -32768,
        step: 1,
      })
    )
    .set(
      "slide.metrics.offsetY",
      b.makeFieldNumber("input-slide-offsetY", "Y offset", "", {
        max: 32767,
        min: -32768,
        step: 1,
      })
    )
    .set(
      "slide.metrics.width",
      b.makeFieldNumber("input-slide-width", "Width", "", {
        max: 32767,
        min: 0,
        step: 1,
      })
    )
    .set(
      "slide.metrics.height",
      b.makeFieldNumber("input-slide-height", "Height", "", {
        max: 32767,
        min: 0,
        step: 1,
      })
    )
    .set("object.name", b.makeFieldText("input-object-name", "Name", "long"))
    .set(
      "object.caption",
      b.makeFieldTextArea("input-object-caption", "Caption", "long", {
        rows: "1",
      })
    )
    .set(
      "object.author",
      b.makeFieldText("input-object-author", "Author", "long")
    )
    .set(
      "object.type",
      b.makeFieldSelect(
        "input-object-type",
        Object.entries(SlideObject.types),
        "Type:"
      )
    )
    .set(
      "object.visible",
      b.makeFieldCheckBox("input-object-visible", "Visible")
    )
    .set(
      "object.metrics.x",
      b.makeFieldNumber("input-object-x", "X", "", {
        max: 32767,
        min: -32768,
        step: 1,
      })
    )
    .set(
      "object.metrics.y",
      b.makeFieldNumber("input-object-y", "Y", "", {
        max: 32767,
        min: -32768,
        step: 1,
      })
    )
    .set(
      "object.metrics.width",
      b.makeFieldNumber("input-object-width", "Width", "", {
        min: 0,
        max: 32767,
        step: 1,
      })
    )
    .set(
      "object.metrics.height",
      b.makeFieldNumber("input-object-height", "Height", "", {
        min: 0,
        max: 32767,
        step: 1,
      })
    )
    .set(
      "object.metrics.rotation",
      b.makeFieldNumber("input-object-rotation", "Rotation", "", {
        max: 32767,
        min: -32768,
        step: 0.1,
      })
    )
    .set(
      "object.style.fill.type",
      b.makeFieldSelect(
        "inputObjectFillType",
        Object.entries(Painter.style().types),
        "Type:"
      )
    )
    .set(
      "object.style.fill.enabled",
      b.makeFieldCheckBox("input-object-fillEnabled", "Enabled")
    )
    .set(
      "object.style.fill.model.properties.value",
      b.makeFieldColor("input-object-fillColor", "Color:")
    )
    .set(
      "object.style.stroke.type",
      b.makeFieldSelect(
        "inputObjectStrokeType",
        Object.entries(Painter.style().types),
        "Type:"
      )
    )
    .set(
      "object.style.stroke.enabled",
      b.makeFieldCheckBox("input-object-strokeEnabled", "Enabled")
    )
    .set(
      "object.style.stroke.model.properties.value",
      b.makeFieldColor("input-object-strokeColor", "Color:")
    )
    .set(
      "object.style.line.width",
      b.makeFieldNumber("input-object-lineWidth", "Width", "", {
        max: 32767,
        min: 0,
        step: 1,
      })
    )
    .set(
      "object.style.line.cap",
      b.makeFieldSelect(
        "input-object-lineCap",
        Object.entries(Painter.style().line.cap),
        "Cap:"
      )
    )
    .set(
      "object.style.line.join",
      b.makeFieldSelect(
        "input-object-lineJoin",
        Object.entries(Painter.style().line.join),
        "Join:"
      )
    )
    .set(
      "object.style.line.miterLimit",
      b.makeFieldNumber("input-object-lineMiterLimit", "Miter limit", "", {
        max: 32767,
        min: 0,
        step: 0.1,
      })
    )
    .set(
      "object.style.line.dash",
      b.makeFieldText("input-object-lineDash", "Dash", "long", {
        placeholder: "[]",
      })
    )
    .set(
      "object.style.line.dashOffset",
      b.makeFieldNumber("input-object-lineDashOffset", "Dash offset", "", {
        max: 32767,
        min: -32768,
        step: 0.1,
      })
    )
    .set(
      "object.style.shadow.enabled",
      b.makeFieldCheckBox("input-object-shadowEnabled", "Enabled")
    )
    .set(
      "object.style.shadow.blur",
      b.makeFieldNumber("input-object-shadowBlur", "Blur", "", {
        min: 0,
        max: 32767,
        step: 0.1,
      })
    )
    .set(
      "object.style.shadow.color",
      b.makeFieldColor("input-object-shadowColor", "Color:")
    )
    .set(
      "object.style.shadow.offsetX",
      b.makeFieldNumber("input-object-offsetX", "X offset", "", {
        min: -32768,
        max: 32767,
        step: 1,
      })
    )
    .set(
      "object.style.shadow.offsetY",
      b.makeFieldNumber("input-object-offsetY", "Y offset", "", {
        min: -32768,
        max: 32767,
        step: 1,
      })
    )
    .set(
      "object.style.text.font.family",
      b.makeFieldText("input-object-fontFamily", "Family")
    )
    .set(
      "object.style.text.font.size.magnitude",
      b.makeFieldNumber("input-object-fontSize-magnitude", "Size", "short", {
        min: 0,
        max: 32767,
        step: 1,
      })
    )
    .set(
      "object.style.text.font.size.unit",
      b.makeFieldSelect(
        "input-object-fontSize-unit",
        Object.entries(FontModel.lengthUnits),
        "Unit:"
      )
    )
    .set(
      "object.style.text.font.style",
      b.makeFieldText("input-object-fontStyle", "Style", "", {
        placeholder: "normal",
      })
    )
    .set(
      "object.style.text.font.variant",
      b.makeFieldText("input-object-fontVariant", "Variant", "", {
        placeholder: "normal",
      })
    )
    .set(
      "object.style.text.font.weight",
      b.makeFieldText("input-object-fontWeight", "Weight", "", {
        placeholder: "normal",
      })
    )
    .set(
      "object.style.text.font.stretch",
      b.makeFieldText("input-object-fontStretch", "Stretch", "", {
        placeholder: "normal",
      })
    )
    .set(
      "object.style.text.font.lineHeight",
      b.makeFieldNumber("input-object-fontLineHeight", "Line Height", "short", {
        min: 0,
        max: 32767,
        step: 0.1,
      })
    )
    .set(
      "object.style.text.align",
      b.makeFieldSelect(
        "input-object-textAlign",
        Object.entries(Painter.style().text.align),
        "Align:"
      )
    )
    .set(
      "object.style.text.baseline",
      b.makeFieldSelect(
        "input-object-textBaseline",
        Object.entries(Painter.style().text.baseline),
        "Baseline:"
      )
    )
    .set(
      "object.style.text.direction",
      b.makeFieldSelect(
        "input-object-textDirection",
        Object.entries(Painter.style().text.direction),
        "Direction:"
      )
    );
  selection
    .set(
      "selection.slide",
      b.makeSelect("input-selection-slide", [], "list full", {
        multiple: "multiple",
      })
    )
    .set(
      "selection.object",
      b.makeSelect("input-selection-object", [], "list full", {
        multiple: "multiple",
      })
    );
  Input.forms.model
    .set(
      "file.save",
      b
        .makeFieldset("panel-save", "Save", "form")
        .append(
          b
            .makeFieldset("panel-save-toFile", "Save to File")
            .append(intermediate.get("file.save.fileNotice"))
            .append("<br><br>")
            .append(intermediate.get("file.save.toFile"))
        )
        .append(
          b
            .makeFieldset("panel-save-toNet", "Save to NET")
            .append(intermediate.get("file.save.netNotice"))
            .append("<br><br>")
            .append(intermediate.get("file.save.toNet"))
        )
    )
    .set(
      "file.load",
      b
        .makeFieldset("panel-load", "Load", "form")
        .append(
          b
            .makeFieldset("panel-load-fromFile", "Load from File")
            .append(intermediate.get("file.load.fileNotice"))
            .append("<br><br>")
            .append(intermediate.get("file.load.fileName"))
            .append(intermediate.get("file.load.fromFile"))
        )
        .append(
          b
            .makeFieldset("panel-load-fromNet", "Load from NET")
            .append(intermediate.get("file.load.netNotice"))
            .append("<br><br>")
            .append(intermediate.get("file.load.netId"))
            .append(intermediate.get("file.load.fromNet"))
        )
    )
    .set(
      "deck.properties",
      b
        .makeFieldset("panel-deck-properties", "Deck Properties", "form")
        .append(model.get("deck.id"))
        .append(model.get("deck.name"))
        .append(model.get("deck.caption"))
        .append(model.get("deck.author"))
    )
    .set(
      "slide.properties",
      b
        .makeFieldset("panel-slide-properties", "Slide Properties", "form")
        .append(model.get("slide.name"))
        .append(model.get("slide.caption"))
        .append(model.get("slide.author"))
    )
    .set(
      "slide.metrics",
      b
        .makeFieldset("panel-slide-metrics", "Slide Metrics", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("slide.metrics.offsetX"))
            .append(model.get("slide.metrics.offsetY"))
        )
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("slide.metrics.width"))
            .append(model.get("slide.metrics.height"))
        )
    )
    .set(
      "slide.content",
      b
        .makeFieldset("panel-slide-content", "Slide Content", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("slide.type"))
            .append(model.get("slide.visible"))
        )
        .append(model.get("slide.notes"))
    )
    .set(
      "object.properties",
      b
        .makeFieldset("panel-object-properties", "Object Properties", "form")
        .append(model.get("object.name"))
        .append(model.get("object.caption"))
        .append(model.get("object.author"))
    )
    .set(
      "object.metrics",
      b
        .makeFieldset("panel-object-metrics", "Object Metrics", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.metrics.x"))
            .append(model.get("object.metrics.y"))
        )
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.metrics.width"))
            .append(model.get("object.metrics.height"))
        )
        .append(model.get("object.metrics.rotation"))
    )
    .set(
      "object.content",
      b
        .makeFieldset("panel-object-content", "Object Content", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.type"))
            .append(model.get("object.visible"))
        )
        .append(b.makeContainer("input-object-content", "input"))
    )
    .set(
      "object.fill",
      b
        .makeFieldset("panel-object-fill", "Fill", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.fill.type"))
            .append(model.get("object.style.fill.enabled"))
        )
        .append(model.get("object.style.fill.model.properties.value"))
    )
    .set(
      "object.stroke",
      b
        .makeFieldset("panel-object-stroke", "Stroke", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.stroke.type"))
            .append(model.get("object.style.stroke.enabled"))
        )
        .append(model.get("object.style.stroke.model.properties.value"))
    )
    .set(
      "object.line",
      b
        .makeFieldset("panel-object-line", "Line", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.line.width"))
            .append(model.get("object.style.line.miterLimit"))
        )
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.line.join"))
            .append(model.get("object.style.line.cap"))
        )
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.line.dash"))
            .append(model.get("object.style.line.dashOffset"))
        )
    )
    .set(
      "object.shadow",
      b
        .makeFieldset("panel-object-shadow", "Shadow", "form")
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.shadow.color"))
            .append(model.get("object.style.shadow.enabled"))
        )
        .append(model.get("object.style.shadow.blur"))
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.shadow.offsetX"))
            .append(model.get("object.style.shadow.offsetY"))
        )
    )
    .set(
      "object.text",
      b
        .makeFieldset("panel-object-text", "Text", "form")
        .append(
          b
            .makeFieldset("panel-object-font", "Font")
            .append(
              b
                .makeContainer("", "input row")
                .append(model.get("object.style.text.font.family"))
                .append(model.get("object.style.text.font.size.magnitude"))
            )
            .append(model.get("object.style.text.font.size.unit"))
            .append(
              b
                .makeContainer("", "input row")
                .append(model.get("object.style.text.font.style"))
                .append(model.get("object.style.text.font.variant"))
            )
            .append(model.get("object.style.text.font.weight"))
            .append(
              b
                .makeContainer("", "input row")
                .append(model.get("object.style.text.font.stretch"))
                .append(model.get("object.style.text.font.lineHeight"))
            )
        )
        .append(
          b
            .makeContainer("", "input row")
            .append(model.get("object.style.text.align"))
            .append(model.get("object.style.text.baseline"))
            .append(model.get("object.style.text.direction"))
        )
    );
  Input.forms.selection
    .set(
      "Slide",
      b
        .makeFieldset("panel-slide", "Slides", "full")
        .append(
          b
            .makeContainer("", "input full")
            .append(selection.get("selection.slide"))
        )
    )
    .set(
      "Object",
      b
        .makeFieldset("panel-object", "Objects", "full")
        .append(
          b
            .makeContainer("", "input full")
            .append(selection.get("selection.object"))
        )
    );
  menu
    .set("file.load", b.makeFieldMenu("menu-file-load", [], "Load from..."))
    .set("file.save", b.makeFieldMenu("menu-file-save", [], "Save to..."))
    .set("file.close", b.makeFieldMenu("menu-file-close", [], "Close"))
    .set(
      "file",
      b.makeFieldMenu(
        "menu-file",
        [menu.get("file.save"), menu.get("file.load")],
        "File",
        "root"
      )
    )
    .set(
      "deck.properties",
      b.makeFieldMenu("menu-deck-properties", [], "Properties")
    )
    .set(
      "deck.insertSlide",
      b.makeFieldMenu("menu-deck-insertSlide", [], "Insert Slide")
    )
    .set(
      "deck.removeSlides",
      b.makeFieldMenu("menu-deck-removeSlides", [], "Remove Slide(s)")
    )
    .set(
      "deck",
      b.makeFieldMenu(
        "menu-deck",
        [
          menu.get("deck.properties"),
          menu.get("deck.insertSlide"),
          menu.get("deck.removeSlides"),
        ],
        "Deck",
        "root"
      )
    )
    .set("slide.content", b.makeFieldMenu("menu-slide-content", [], "Content"))
    .set("slide.metrics", b.makeFieldMenu("menu-slide-metrics", [], "Metrics"))
    .set(
      "slide.properties",
      b.makeFieldMenu("menu-slide-properties", [], "Properties")
    )
    .set(
      "slide.insertObject",
      b.makeFieldMenu("menu-slide-insertObject", [], "Insert Object")
    )
    .set(
      "slide.removeObjects",
      b.makeFieldMenu("menu-slide-removeObjects", [], "Remove Object(s)")
    )
    .set(
      "slide",
      b.makeFieldMenu(
        "menu-slide",
        [
          menu.get("slide.content"),
          menu.get("slide.metrics"),
          menu.get("slide.properties"),
          menu.get("slide.insertObject"),
          menu.get("slide.removeObjects"),
        ],
        "Slide",
        "root"
      )
    )
    .set(
      "object.content",
      b.makeFieldMenu("menu-object-content", [], "Content")
    )
    .set(
      "object.metrics",
      b.makeFieldMenu("menu-object-metrics", [], "Metrics")
    )
    .set("object.fill", b.makeFieldMenu("menu-object-fill", [], "Fill"))
    .set("object.stroke", b.makeFieldMenu("menu-object-stroke", [], "Stroke"))
    .set("object.line", b.makeFieldMenu("menu-object-line", [], "Line"))
    .set("object.shadow", b.makeFieldMenu("menu-object-shadow", [], "Shadow"))
    .set("object.text", b.makeFieldMenu("menu-object-text", [], "Text"))
    .set(
      "object.style",
      b.makeFieldMenu(
        "menu-object-style",
        [
          menu.get("object.fill"),
          menu.get("object.stroke"),
          menu.get("object.line"),
          menu.get("object.shadow"),
          menu.get("object.text"),
        ],
        "Style"
      )
    )
    .set(
      "object.properties",
      b.makeFieldMenu("menu-object-properties", [], "Properties")
    )
    .set(
      "object",
      b.makeFieldMenu(
        "menu-object",
        [
          menu.get("object.content"),
          menu.get("object.metrics"),
          menu.get("object.style"),
          menu.get("object.properties"),
        ],
        "Object",
        "root"
      )
    );
}
