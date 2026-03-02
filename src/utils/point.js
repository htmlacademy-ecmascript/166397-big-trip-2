import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { getDuration } from './common';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const DATE_AND_TIME_FORMAT = 'DD/MM/YY HH:mm';

dayjs.extend(isBetween);

function humanizePointDate(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_FORMAT) : '';
}

function humanizePointTime(pointTime) {
  return pointTime ? dayjs(pointTime).format(TIME_FORMAT) : '';
}

function padNumber(value) {
  return value.toString().padStart(2, '0');
}

function humanizeDuration(dateFrom, dateTo) {
  const formattedDuration = getDuration(dateFrom, dateTo);
  const days = Math.floor(formattedDuration.asDays()) >= 1 ? Math.floor(formattedDuration.asDays()) : 0;
  const hours = formattedDuration.hours();
  const minutes = formattedDuration.minutes();

  const formattedDays = padNumber(days);
  const formattedHourse = padNumber(hours);
  const formattedMinutes = padNumber(minutes);

  return `${days ? `${formattedDays}D` : ''} ${days || hours ? `${formattedHourse}H` : ''} ${formattedMinutes}M`;
}

function humanizePointDateAndTime(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_AND_TIME_FORMAT) : '';
}

function isFuturePoint(dateFrom) {
  return dateFrom && dayjs(dateFrom).isAfter(dayjs(), 'D');
}

function isPresentPoint(dateFrom, dateTo) {
  return dateFrom && dateTo && dayjs().isBetween(dateFrom, dateTo, 'D', '[]');
}

function isPastPoint(dateTo) {
  return dateTo && dayjs(dateTo).isBefore(dayjs(), 'D');
}

export { humanizePointDate, humanizePointTime, humanizeDuration, humanizePointDateAndTime, isFuturePoint, isPresentPoint, isPastPoint };
