const EDENObjects = (() => {
  const lineEnding = Object.freeze({ lf: "\n", crlf: "\r\n", cr: "\r" });

  function getChildObjectAndKey(object, key) {
    if (!object || !key) return undefined;
    let keys = key.trim().split(".", 2);
    keys.forEach((key) => {
      if (key.length === 0) throw 'key.trim().split(".", 2)[i].length === 0';
    });
    return keys.length === 1
      ? [object, key]
      : getChildObjectAndKey(
          object[keys[0]],
          key.substring(key.indexOf(".") + 1)
        );
  }

  function getEntries(object) {
    let out = [];
    Object.entries(object).forEach(([key, value]) => {
      if (typeof value === "object") {
        let children = getEntries(value);
        children.forEach((child) => {
          child[0] = key + "." + child[0];
        });
        Array.prototype.push.apply(out, children);
      } else out.push([key, value]);
    });
    return out;
  }

  function getKeys(object) {
    let entries = getEntries(object);
    let out = [];
    entries.forEach(([key]) => {
      out.push(key);
    });
    return out;
  }

  function getProperty(object, key) {
    let parent = getChildObjectAndKey(object, key);
    return parent[0][parent[1]];
  }

  function setProperty(object, key, value) {
    let parent = getChildObjectAndKey(object, key);
    parent[0][parent[1]] = value;
  }

  return {
    lineEnding: lineEnding,
    getChildObjectAndKey: getChildObjectAndKey,
    getEntries: getEntries,
    getKeys: getKeys,
    getProperty: getProperty,
    setProperty: setProperty,
  };
})();
