function getRandomArrayElement(elements) {
  return elements[Math.floor(Math.random() * elements.length)];
}

function getElementByKey(key, value, elements) {
  return elements.find((item) => item[key] === value);
}

function capitalizeString(value) {
  return value[0].toUpperCase() + value.slice(1, value.length);
}

export { getRandomArrayElement, getElementByKey, capitalizeString };
