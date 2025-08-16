//Sets initial properties
export function defineProperty(object, propertyName, val) {
  return (
    propertyName in object
      ? Object.defineProperty(object, propertyName, {
          value: val,
          enumerable: true,
          configurable: true,
          writable: true,
        })
      : (object[propertyName] = val),
    object
  );
}
