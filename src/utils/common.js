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

function getDuration(dateFrom, dateTo) {
  const formattedDateTo = dayjs(dateTo);
  const formattedDateFrom = dayjs(dateFrom);

  return dayjs.duration(formattedDateTo.diff(formattedDateFrom));
}

function isEscKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}

export { getRandomArrayElement, getElementByKey, capitalizeString, getDuration, isEscKey };
