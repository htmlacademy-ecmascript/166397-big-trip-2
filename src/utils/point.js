import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { getDuration } from './common';

const DATE_FORMATE = 'MMM D';
const TIME_FORMATE = 'HH:mm';
const DATE_AND_TIME_FORMATE = 'DD/MM/YY HH:mm';

dayjs.extend(isBetween);

function humanizePointDate(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_FORMATE) : '';
}

function humanizePointTime(pointTime) {
  return pointTime ? dayjs(pointTime).format(TIME_FORMATE) : '';
}

function padNumber(value) {
  return value.toString().padStart(2, '0');
}

function toISOString(date) {
  return dayjs(date).toISOString();
}

function humanizeDuration(dateFrom, dateTo) {
  const formattedDuration = getDuration(dateFrom, dateTo);
  const days = formattedDuration.days() ? formattedDuration.days() : Math.floor(formattedDuration.asDays());
  const hours = formattedDuration.hours();
  const minutes = formattedDuration.minutes();

  const formattedDays = padNumber(days);
  const formattedHourse = padNumber(hours);
  const formattedMinutes = padNumber(minutes);

  return `${days ? `${formattedDays}D` : ''} ${days || hours ? `${formattedHourse}H` : ''} ${formattedMinutes}M`;
}

function humanizePointDateAndTime(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_AND_TIME_FORMATE) : '';
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

export { humanizePointDate, humanizePointTime, getDuration, humanizeDuration, humanizePointDateAndTime, isFuturePoint, isPresentPoint, isPastPoint, toISOString };
