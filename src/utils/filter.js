import { FilterType } from '../const';
import { isFuturePoint, isPresentPoint, isPastPoint } from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(({dateFrom }) => isFuturePoint(dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter(({dateFrom, dateTo}) => isPresentPoint(dateFrom, dateTo)),
  [FilterType.PAST]: (points) => points.filter(({dateTo}) => isPastPoint(dateTo)),
};

export { filter };
