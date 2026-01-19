import { getRandomArrayElement } from '../utils';

const mockPoints = [
  {
    id: 0,
    base_price: 1100,
    date_from: '2022-03-12T17:15:55.845Z',
    date_to: '2022-03-12T21:30:13.375Z',
    destination: 0,
    is_favorite: false,
    offers: [
      0
    ],
    type: 'taxi'
  },
  {
    id: 1,
    base_price: 700,
    date_from: '2019-06-12T12:10:55.845Z',
    date_to: '2019-06-12T15:22:13.375Z',
    destination: 1,
    is_favorite: false,
    offers: [],
    type: 'bus'
  },
  {
    id: 2,
    base_price: 300,
    date_from: '2020-07-10T15:31:16.845Z',
    date_to: '2020-07-10T23:56:13.375Z',
    destination: 3,
    is_favorite: true,
    offers: [
      1, 2
    ],
    type: 'train'
  },
  {
    id: 3,
    base_price: 500,
    date_from: '2020-09-01T14:15:13.845Z',
    date_to: '2020-09-02T19:12:13.375Z',
    destination: 2,
    is_favorite: true,
    offers: [
      0, 3
    ],
    type: 'restaurant'
  },
  {
    id: 4,
    base_price: 500,
    date_from: '2020-05-02T08:25:15.845Z',
    date_to: '2020-05-02T16:22:23.375Z',
    destination: 4,
    is_favorite: true,
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
