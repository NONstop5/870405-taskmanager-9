import menu from './components/menu.js';
import search from './components/search.js';
import createFilterItem from './components/create-filter.js';
import boardFilter from './components/board-filter.js';
import {
  FILTER_NAME_LIST,
  TASK_TITLE_LIST,
  TASK_COLOR_LIST,
  getDueDate,
  getTags,
  getRepeatingDays
} from './data.js';
import {Task} from './components/task.js';
import {TaskEdit} from './components/task-edit.js';
import loadMoreButton from './components/load-more-button.js';
import {getRandomValueRange} from './utils.js';

const menuContainerElem = document.querySelector(`.control__btn-wrap`);
const mainSearchElem = document.querySelector(`.main__search`);
const mainFilterElem = document.querySelector(`.main__filter`);
const boardFilterContainerElem = document.querySelector(`.board__filter-list`);
const boardTasksElem = document.querySelector(`.board__tasks`);

/**
 * Создание заданного перечня фильтров
 * @param {array} filterList
 */
const generateFilters = (filterList) => {
  mainFilterElem.innerHTML = filterList.reduce((resultHtml, filterNameItem) => {
    return resultHtml + createFilterItem(filterNameItem, getRandomValueRange(0, 115));
  }, ``);
};

/**
 * Добавляем обработчик события для фильтров
 */
const addFiltersEvents = () => {
  mainFilterElem.addEventListener(`click`, () => {
    boardTasksElem.innerHTML = ``;
    generateTasks(boardTasksElem, 7);
  });
};

/**
 * Создание заданного числа карточеек
 * @param {Element} containerTasksElem
 * @param {int} taskCount
 */
const generateTasks = (containerTasksElem, taskCount) => {
  containerTasksElem.innerHTML = ``;
  for (let i = 1; i <= taskCount; i++) {
    const taskObj = {
      id: i,
      title: TASK_TITLE_LIST[getRandomValueRange(0, TASK_TITLE_LIST.length - 1)],
      dueDate: getDueDate(),
      tags: getTags(),
      image: `http://picsum.photos/100/100?r=${Math.random()}`,
      color: {
        value: TASK_COLOR_LIST[getRandomValueRange(0, TASK_COLOR_LIST.length - 1)],
        list: TASK_COLOR_LIST
      },
      repeatingDays: getRepeatingDays(),
      isDate: !!getRandomValueRange(0, 1),
      isRepeate: !!getRandomValueRange(0, 1),
      isFavorite: !!getRandomValueRange(0, 1),
      isDone: !!getRandomValueRange(0, 1)
    };

    const taskComponent = new Task(taskObj);
    const taskEditComponent = new TaskEdit(taskObj);

    containerTasksElem.appendChild(taskComponent.render());

    taskComponent.onEdit = () => {
      taskEditComponent.render();
      containerTasksElem.replaceChild(taskEditComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    taskEditComponent.onSubmit = () => {
      taskComponent.render();
      containerTasksElem.replaceChild(taskComponent.element, taskEditComponent.element);
      taskEditComponent.unrender();
    };
  }
};

// Отрисовываем меню
menuContainerElem.innerHTML = menu();

// Отрисовываем строки поиска
mainSearchElem.innerHTML = search();

// Отрисовываем фильтры
generateFilters(FILTER_NAME_LIST);

// Добавляем обработчики событий главным фильтрам
addFiltersEvents();

// Отрисовываем фильтры доски
boardFilterContainerElem.innerHTML = boardFilter();

// Отрисовываем карточки задач
generateTasks(boardTasksElem, 3);

// Отрисовываем кнопку load more
boardTasksElem.insertAdjacentHTML(`afterend`, loadMoreButton());
