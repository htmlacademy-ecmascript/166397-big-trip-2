import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { getDuration } from './common';

const DATE_FORMAT = 'MMM D';
const DATE_ALT_FORMAT = 'D';
const TIME_FORMAT = 'HH:mm';
const DATE_AND_TIME_FORMAT = 'DD/MM/YY HH:mm';

dayjs.extend(isBetween);

function humanizePointDate(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_FORMAT) : '';
}

function humanizePointTime(pointTime) {
  return pointTime ? dayjs(pointTime).format(TIME_FORMAT) : '';
}

function humanizeTripDates(startTime, endTime) {
  const formattedStartTime = dayjs(startTime);
  const formattedEndTime = dayjs(endTime);

  let result = `${formattedStartTime.format(DATE_FORMAT)} — ${formattedEndTime.format(DATE_FORMAT)}`;

  if (formattedStartTime.get('month') === formattedEndTime.get('month') && formattedStartTime.get('year') === formattedEndTime.get('year')) {
    result = `${formattedStartTime.format(DATE_ALT_FORMAT)} — ${formattedEndTime.format(DATE_FORMAT)}`;
  }

  return result;
}

function padNumber(value) {
  return value.toString().padStart(2, '0');
}

function toISOString(date) {
  return date.toISOString();
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

export { humanizePointDate, humanizePointTime, humanizeDuration, humanizePointDateAndTime, isFuturePoint, isPresentPoint, isPastPoint, toISOString, humanizeTripDates };
