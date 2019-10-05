import menu from './components/menu.js';
import search from './components/search.js';
import createFilterItem from './components/create-filter.js';
import boardFilter from './components/board-filter.js';
import {
  FILTER_NAME_LIST,
  TASK_TITLE_LIST,
  TASK_COLOR_LIST,
  getDueDate,
  getHashtags,
  getRepeatingDays
} from './data.js';
import {Task} from './components/task.js';
import {TaskEdit} from './components/task-edit.js';
import loadMoreButton from './components/load-more-button.js';
import {getRandomValueRange} from './utils.js';

const TASK = {
  TOTAL_COUNT: 5,
  PER_PAGE: 3
};

const menuContainerElem = document.querySelector(`.control__btn-wrap`);
const mainSearchElem = document.querySelector(`.main__search`);
const mainFilterElem = document.querySelector(`.main__filter`);
const boardContainerElem = document.querySelector(`.board.container`);
const boardFilterContainerElem = boardContainerElem.querySelector(`.board__filter-list`);
const boardTasksElem = boardContainerElem.querySelector(`.board__tasks`);
let renderedTasks = 0;

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
 * Отрисовывает кнопку loadMore
 */
const showLoadMoreButton = () => {
  const loadMoreButtonElem = boardContainerElem.querySelector(`.load-more`);

  if (renderedTasks < TASK.TOTAL_COUNT) {
    loadMoreButtonElem.classList.remove(`visually-hidden`);
  } else {
    loadMoreButtonElem.classList.add(`visually-hidden`);
  }

  // Добавляем обработчики событий для кнопки load more
  addLoadMoreEvents();
};

/**
 * Добавляем обработчик события для фильтров
 */
const addFiltersEvents = () => {
  mainFilterElem.addEventListener(`click`, () => {
    boardTasksElem.innerHTML = ``;
    renderedTasks = 0;
    generateTasks(boardTasksElem);
  });
};

/**
 * Добавляем обработчик события для кнопки load more
 */
const addLoadMoreEvents = () => {
  const loadMoreButtonElem = boardContainerElem.querySelector(`.load-more`);

  loadMoreButtonElem.addEventListener(`click`, () => {
    generateTasks(boardTasksElem);
  });
};

/**
 * Заменяетодин компонент другим
 * @param {Element} containerElem
 * @param {object} newComponent
 * @param {object} oldComponent
 */
const replaceComponents = (containerElem, newComponent, oldComponent) => {
  newComponent.render();
  containerElem.replaceChild(newComponent.element, oldComponent.element);
  oldComponent.unrender();
};

/**
 * Создание заданного числа карточеек
 * @param {Element} containerTasksElem
 */
const generateTasks = (containerTasksElem) => {
  let taskCount = TASK.PER_PAGE <= TASK.TOTAL_COUNT ? TASK.PER_PAGE : TASK.TOTAL_COUNT;
  if (taskCount > TASK.TOTAL_COUNT - renderedTasks) {
    taskCount = TASK.TOTAL_COUNT - renderedTasks;
  }
  renderedTasks += taskCount;
  showLoadMoreButton();

  for (let i = 1; i <= taskCount; i++) {
    const taskObj = {
      id: i,
      title: TASK_TITLE_LIST[getRandomValueRange(0, TASK_TITLE_LIST.length - 1)],
      dueDate: getDueDate(),
      tags: getHashtags(),
      image: `http://picsum.photos/100/100?r=${Math.random()}`,
      color: {
        value: TASK_COLOR_LIST[getRandomValueRange(0, TASK_COLOR_LIST.length - 1)],
        list: TASK_COLOR_LIST
      },
      repeatingDays: getRepeatingDays(),
      isDate: !!getRandomValueRange(0, 1),
      isRepeate: !!getRandomValueRange(0, 1),
      isFavorite: !!getRandomValueRange(0, 1),
      isArchive: !!getRandomValueRange(0, 1),
      isDone: !!getRandomValueRange(0, 1)
    };

    const taskComponent = new Task(taskObj);
    const taskEditComponent = new TaskEdit(taskObj);

    containerTasksElem.appendChild(taskComponent.render());

    taskComponent.onEdit = () => {
      replaceComponents(containerTasksElem, taskEditComponent, taskComponent);
    };
    taskEditComponent.onSubmit = () => {
      replaceComponents(containerTasksElem, taskComponent, taskEditComponent);
    };
    taskEditComponent.onReset = () => {
      replaceComponents(containerTasksElem, taskComponent, taskEditComponent);
    };
    taskEditComponent.onKeyPress = () => {
      replaceComponents(containerTasksElem, taskComponent, taskEditComponent);
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

// Отрисовываем кнопку load more
boardContainerElem.insertAdjacentHTML(`beforeend`, loadMoreButton());

// Отрисовываем карточки задач
generateTasks(boardTasksElem);
