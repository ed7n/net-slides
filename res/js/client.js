const Client = (() => {
  function save(deck) {
    UI.populateStatusBar("NET server communication has been disabled.", 4);
    /*
    $.ajax(location.toString() + "save", {
      method: "PUT",
      data: {
        deck: JSON.stringify(deck),
      },
      success: data => {
        if (data.error || data.mood < 0)
          UI.populateStatusBar("<b>[Server]</b>&nbsp;" + data.message, 4); else {
          UI.populateStatusBar("<b>[Server]</b>&nbsp;" + data.message, 2);
          deck.id = data.data;
          UI.populateFieldsDeck(deck);
        }
      },
    });
    */
  }

  function update(deck) {
    UI.populateStatusBar("NET server communication has been disabled.", 4);
    /*
    $.ajax(location.toString() + "update", {
      method: "PUT",
      data: {
        deck: JSON.stringify(deck),
      },
      success: data => {
        UI.populateFieldsDeck(deck);
        if (data.error || data.mood < 0)
          UI.populateStatusBar("<b>[Server]</b>&nbsp;" + data.message, 4); else
          UI.populateStatusBar("<b>[Server]</b>&nbsp;" + data.message, 2);
      },
    });
    */
  }

  function load(id) {
    UI.populateStatusBar("NET server communication has been disabled.", 4);
    /*
    $.ajax(location.toString() + "load", {
      method: "PUT",
      data: {
        id: id,
      },
      success: data => {
        if (data.error || data.mood < 0)
          UI.populateStatusBar("<b>[Server]</b>&nbsp;" + data.message, 4); else
          Application.loadDeck(SlideDeck.make(data.data));
      },
    });
    */
  }

  return { save: save, update: update, load: load };
})();
