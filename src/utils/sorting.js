import dayjs from 'dayjs';
import { SortingType } from '../const';
import { getDuration } from './common';

const sorting = {
  [SortingType.DAY]: (points) => points.toSorted((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom))),
  [SortingType.EVENT]: null,
  [SortingType.TIME]: (points) => points.toSorted((a, b) => getDuration(b.dateFrom, b.dateTo).asMilliseconds() - getDuration(a.dateFrom, a.dateTo).asMilliseconds()),
  [SortingType.PRICE]: (points) => points.toSorted((a, b) => b.basePrice - a.basePrice),
  [SortingType.OFFERS]: null,
};

export { sorting };
