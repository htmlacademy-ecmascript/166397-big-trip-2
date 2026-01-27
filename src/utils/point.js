import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const DATE_FORMATE = 'MMM D';
const TIME_FORMATE = 'HH:mm';
const DATE_AND_TIME_FORMATE = 'DD/MM/YY HH:mm';

dayjs.extend(duration);

function humanizePointDate(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_FORMATE) : '';
}

function humanizePointTime(pointTime) {
  return pointTime ? dayjs(pointTime).format(TIME_FORMATE) : '';
}

function humanizeDuration(dateFrom, dateTo) {
  const formattedDateTo = dayjs(dateTo);
  const formattedDateFrom = dayjs(dateFrom);

  const formattedDuration = dayjs.duration(formattedDateTo.diff(formattedDateFrom));
  const days = formattedDuration.days() ? formattedDuration.days() : Math.floor(formattedDuration.asDays());
  const hours = formattedDuration.hours();
  const minutes = formattedDuration.minutes();

  return `${days ? `${days}D` : ''} ${hours ? `${hours}H` : ''} ${minutes}M`;
}

function humanizePointDateAndTime(pointDate) {
  return pointDate ? dayjs(pointDate).format(DATE_AND_TIME_FORMATE) : '';
}

export { humanizePointDate, humanizePointTime, humanizeDuration, humanizePointDateAndTime };
