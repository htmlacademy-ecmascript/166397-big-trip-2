import dayjs from 'dayjs';
import { SortingType } from '../const';
import { getDuration } from './common';

const sorting = {
  [SortingType.DAY]: (points) => points.toSorted((a, b) => dayjs(a.date_from).diff(dayjs(b.date_from))),
  [SortingType.EVENT]: null,
  [SortingType.TIME]: (points) => points.toSorted((a, b) => getDuration(b.date_from, b.date_to).asMilliseconds() - getDuration(a.date_from, a.date_to).asMilliseconds()),
  [SortingType.PRICE]: (points) => points.toSorted((a, b) => b.base_price - a.base_price),
  [SortingType.OFFERS]: null,
};

export { sorting };
