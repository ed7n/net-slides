class Instance {
  constructor(deck) {
    this.deck = deck || new SlideDeck();
    this.slide = "0";
    this.selection = Object.seal({
      slides: new Set(),
      slideObjects: new Set(),
      class: "deck",
      formPage: "properties",
    });
    this.changes = Object.seal({
      formFields: new Set(),
      objectModel: new Set(),
      objectFill: new Set(),
      objectStroke: new Set(),
    });
  }

  clearChanges() {
    this.changes.formFields.clear();
    this.changes.objectModel.clear();
    this.changes.objectFill.clear();
    this.changes.objectStroke.clear();
  }
}
