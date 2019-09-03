import {
  getRandomValueRange,
  getFormatDate
} from './utils.js';

// Список фильтров
const FILTER_NAME_LIST = [
  `all`,
  `overdue`,
  `today`,
  `favorites`,
  `repeating`,
  `tags`,
  `archive`
];

// Список загоовков задач
const TASK_TITLE_LIST = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

// Список тэгов задач
const TASK_TAG_LIST = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `javascript`
];

// Список цветов баров у задач
const TASK_COLOR_LIST = [
  `pink`,
  `blue`,
  `black`,
  `yellow`,
  `green`
];

// Список дней недели
const DAYS_OF_WEEK = [
  `Mo`,
  `Tue`,
  `We`,
  `Th`,
  `Fr`,
  `Sa`,
  `Su`
];

/**
 * Возвращает дату плюс-минус 7 дней от текущей даты
 * @return {date}
 */
const getDueDate = () => {
  const curDate = new Date();
  const newDay = curDate.getDate() + getRandomValueRange(-7, 7);
  const newDate = new Date(curDate.setDate(newDay));

  return getFormatDate(newDate);
};

/**
 * Возвращает список хэштэгов в кол-ве (от 0 до 3)
 * @return {string}
 */
const getTags = () => {
  const tagsCount = getRandomValueRange(0, 3);
  let tagsList = [];

  for (let i = 1; i <= tagsCount; i++) {
    tagsList.push(TASK_TAG_LIST[getRandomValueRange(0, TASK_TAG_LIST.length - 1)]);
  }

  return tagsList;
};

/**
 * Возвращает объект с повторяющимеся днями недели
 * @return {object}
 */
const getRepeatingDays = () => {
  return DAYS_OF_WEEK.reduce((resultObj, day) => {
    resultObj[day] = !!getRandomValueRange(0, 1);
    return resultObj;
  }, {});
};

export {
  FILTER_NAME_LIST,
  TASK_TITLE_LIST,
  TASK_COLOR_LIST,
  getDueDate,
  getTags,
  getRepeatingDays
};
