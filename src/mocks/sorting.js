import { sorting } from '../utils/sorting';

function generateSorting(points) {
  return Object.entries(sorting).map(
    ([sortingType, sortingPoints]) => {
      const sorteredPoints = sortingPoints ? sortingPoints(points) : null;

      return ({
        type: sortingType,
        points: sorteredPoints,
      });
    },
  );
}

export { generateSorting };
