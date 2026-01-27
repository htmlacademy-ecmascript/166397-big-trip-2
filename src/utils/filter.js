import { FilterTypes } from '../const';
import { isFuturePoint, isPresentPoint, isPastPoint } from './point';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.FUTURE]: (points) => points.filter(({date_from: dateFrom }) => isFuturePoint(dateFrom)),
  [FilterTypes.PRESENT]: (points) => points.filter(({date_from: dateFrom, date_to: dateTo}) => isPresentPoint(dateFrom, dateTo)),
  [FilterTypes.PAST]: (points) => points.filter(({date_to: dateTo}) => isPastPoint(dateTo)),
};

export { filter };
