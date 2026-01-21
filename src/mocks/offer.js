const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: '0',
        title: 'Upgrade to a business class',
        price: 120
      },
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: '0',
        title: 'Cras aliquet varius magna',
        price: 120
      },
      {
        id: '1',
        title: 'Lorem ipsum dolor sit amet',
        price: 100
      },
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: '0',
        title: 'Aliquam id orci ut lectus varius viverra',
        price: 120
      },
      {
        id: '1',
        title: 'Nunc fermentum tortor ac porta dapibus',
        price: 500
      },
      {
        id: '2',
        title: 'In rutrum ac purus sit amet tempus',
        price: 300
      },
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: '0',
        title: 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
        price: 120
      },
      {
        id: '1',
        title: 'Phasellus eros mauris',
        price: 200
      },
      {
        id: '2',
        title: 'Condimentum sed nibh vitae',
        price: 310
      },
      {
        id: '3',
        title: 'Sodales efficitur ipsum',
        price: 1000
      },
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: '0',
        title: 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
        price: '1220'
      },
      {
        id: '1',
        title: 'Phasellus eros mauris',
        price: 230
      },
      {
        id: '2',
        title: 'Condimentum sed nibh vitae',
        price: 440
      },
      {
        id: '3',
        title: 'Sodales efficitur ipsum',
        price: 110
      },
    ]
  },
];


function getMockOffers() {
  return mockOffers;
}

export { getMockOffers };
