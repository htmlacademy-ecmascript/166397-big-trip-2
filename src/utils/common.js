import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function getRandomArrayElement(elements) {
  return elements[Math.floor(Math.random() * elements.length)];
}

function getElementByKey(key, value, elements) {
  return elements.find((item) => item[key] === value);
}

function capitalizeString(value) {
  return value[0].toUpperCase() + value.slice(1, value.length);
}

function updateElement(elements, newElement) {
  return elements.map((item) => item.id === newElement.id ? newElement : item);
}

function getDuration(dateFrom, dateTo) {
  const formattedDateTo = dayjs(dateTo);
  const formattedDateFrom = dayjs(dateFrom);

  return dayjs.duration(formattedDateTo.diff(formattedDateFrom));
}

export { getRandomArrayElement, getElementByKey, capitalizeString, updateElement, getDuration };
