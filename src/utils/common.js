function getRandomArrayElement(elements) {
  return elements[Math.floor(Math.random() * elements.length)];
}

function getElementByKey(key, value, elements) {
  return elements.find((item) => item[key] === value);
}

export { getRandomArrayElement, getElementByKey };
