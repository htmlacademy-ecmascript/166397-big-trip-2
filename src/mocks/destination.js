const mockDestinations = [
  {
    id: 0,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: []
  },
  {
    id: 1,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    name: 'Paris',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.'
      }
    ]
  },
  {
    id: 2,
    description: 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    name: 'London',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Aliquam id orci ut lectus varius viverra.'
      }
    ]
  },
  {
    id: 3,
    description: 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    name: 'Berlin',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'
      },
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Sed sed nisi sed augue convallis suscipit in sed felis.'
      },
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Aliquam erat volutpat.'
      }
    ]
  },
  {
    id: 4,
    description: 'Сondimentum sed nibh vitae',
    name: 'Lisbon',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam.'
      },
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Sed sed nisi sed augue convallis suscipit.'
      },
      {
        src: `https://loremflickr.com/248/152?random=${Math.round(Math.random() * 100)}`,
        description: 'Aliquam erat volutpat. Suscipit.'
      }
    ]
  },
];

function getMockDestinations() {
  return mockDestinations;
}

export { getMockDestinations };
