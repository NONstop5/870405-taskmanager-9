/**
 * Генерации целого случайного числа из заданного диапазона
 * @param {int} minValue
 * @param {int} maxValue
 * @return {int}
 */
const getRandomValueRange = (minValue, maxValue) => {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

const getFormatDate = (date) => {
  const monthNames = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();

  return `${day} ${monthNames[monthIndex]}`;
};

export {
  getRandomValueRange,
  getFormatDate
};
