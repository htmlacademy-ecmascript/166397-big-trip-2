import { getRandomArrayElement } from '../utils';

const mockPoints = [
  {
    id: 0,
    basePrice: 1100,
    dateFrom: '2022-03-12T17:15:55.845Z',
    dateTo: '2022-03-12T21:30:13.375Z',
    destination: 0,
    isFavorite: false,
    offers: [
      0
    ],
    type: 'taxi'
  },
  {
    id: 1,
    basePrice: 700,
    dateFrom: '2019-06-12T12:10:55.845Z',
    dateTo: '2019-06-12T15:22:13.375Z',
    destination: 1,
    isFavorite: false,
    offers: [],
    type: 'bus'
  },
  {
    id: 2,
    basePrice: 300,
    dateFrom: '2020-07-10T15:31:16.845Z',
    dateTo: '2020-07-10T23:56:13.375Z',
    destination: 3,
    isFavorite: true,
    offers: [
      1, 2
    ],
    type: 'train'
  },
  {
    id: 3,
    basePrice: 500,
    dateFrom: '2020-09-01T14:15:13.845Z',
    dateTo: '2020-09-02T19:12:13.375Z',
    destination: 2,
    isFavorite: true,
    offers: [
      0, 3
    ],
    type: 'restaurant'
  },
  {
    id: 4,
    basePrice: 500,
    dateFrom: '2020-05-02T08:25:15.845Z',
    dateTo: '2020-05-02T16:22:23.375Z',
    destination: 4,
    isFavorite: true,
    offers: [
      0, 1
    ],
    type: 'flight'
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };
