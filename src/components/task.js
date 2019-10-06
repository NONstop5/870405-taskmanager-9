import {AbstractComponent} from "./abstract-component";

class Task extends AbstractComponent {
  constructor(data) {
    super();
    this.id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._image = data.image;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

    this._state = {
      isFavorite: data.isFavorite,
      isDone: data.isDone,
    };

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  /**
   * Генерация html-кода хэштэгов
   * @param {array} tags
   * @return {string}
   */
  _generateTaskHashtags(tags) {
    const tagsHtml = tags.reduce((resultHtml, tagValue) => {
      return resultHtml + `
      <span class="card__hashtag-inner">
        <button type="button" class="card__hashtag-name">
          #${tagValue}
        </button>
      </span>
    `;
    }, ``);

    return `
    <div class="card__hashtag">
      <div class="card__hashtag-list">
        ${tagsHtml}
      </div>
    </div>
  `;
  }

  /**
   * Возвращает класс для смены класса кнопок задачи
   * @param {boolean} isDisabled
   * @return {string}
   */
  _getTaskDisabledClass(isDisabled) {
    const TaskDisabledClassList = {
      true: ``,
      false: ` card__btn--disabled`
    };

    return TaskDisabledClassList[isDisabled];
  }

  /**
   * Возвращает является ли задача просроченной
   * @param {string} dueDateStr
   * @return {boolean}
   */
  _getIsDeadline(dueDateStr) {
    const curDate = new Date();
    const dueDateArr = dueDateStr.split(` `);
    const dueDate = new Date(Date.parse(`${dueDateArr[1]} ${dueDateArr[0]}, 2019`));
    return curDate > dueDate;
  }

  /**
   * Возвращает цвет бара задачи в зависимости её просроченности
   * @param {string} color
   * @param {boolean} isDeadline
   * @return {string}
   */
  _getTaskColor(color, isDeadline) {
    return isDeadline ? `deadline` : color;
  }

  /**
   * Возвращает повторяется задача или нет
   * @param {object} repeatingDays
   * @return {boolean}
   */
  _getIsRepeatTask(repeatingDays) {
    for (let dayValue in repeatingDays) {
      if (repeatingDays[dayValue]) {
        return dayValue;
      }
    }

    return false;
  }

  /**
   * Возвращает класс повторяющейся задачи
   * @param {boolean} isRepeat
   * @return {string}
   */
  _getTaskBarType(isRepeat) {
    return isRepeat ? `card--repeat` : ``;
  }

  /**
   * Отрисовка карточки задачи
   * @return {string}
   */
  get template() {
    const taskControlBlock = `
    <div class="card__control">
      <button type="button" class="card__btn card__btn--edit">
        edit
      </button>
      <button type="button" class="card__btn card__btn--archive${this._getTaskDisabledClass(this._state.isDone)}">
        archive
      </button>      
      <button type="button" class="card__btn card__btn--favorites${this._getTaskDisabledClass(this._state.isFavorite)}">
        favorites
      </button>
    </div>
  `;

    const taskColorBarBlock = `
    <div class="card__color-bar">
      <svg class="card__color-bar-wave" width="100%" height="10">
        <use xlink:href="#wave"></use>
      </svg>
    </div>
  `;

    const taskTextareaBlock = `
  <div class="card__textarea-wrap">
    <label>
      <textarea class="card__text" placeholder="Start typing your text here..." name="text">${this._title}</textarea>
    </label>
  </div>
  `;

    const taskDateBlock = `
    <div class="card__dates">
      <fieldset class="card__date-deadline">
        <label class="card__input-deadline-wrap">
          <input class="card__date" type="text" placeholder="23 September" name="date" value="${this._dueDate}" />
        </label>
        <label class="card__input-deadline-wrap">
          <input class="card__time" type="text" placeholder="11:15 PM" name="time" value="00:00 AM" />
        </label>
      </fieldset>
    </div>
  `;

    const taskImageBlock = `
    <label class="card__img-wrap">
      <input type="file" class="card__img-input visually-hidden" name="img" />
      <img src="${this._image}" alt="task picture" class="card__img" />
    </label>
  `;

    const taskSettingsBlock = `
    <div class="card__settings">
      <div class="card__details">
        ${taskDateBlock}
        ${this._generateTaskHashtags(this._tags)}
      </div>
      ${taskImageBlock}
    </div>

  `;

    return `
    <article class="card ${this._getTaskBarType(this._getIsRepeatTask(this._repeatingDays))} card--${this._getTaskColor(this._color.value, this._getIsDeadline(this._dueDate))}">
      <form class="card__form" method="get">
        <div class="card__inner">
        ${taskControlBlock}
        ${taskColorBarBlock}
        ${taskTextareaBlock}
        ${taskSettingsBlock}
        </div>
      </form>
    </article>
  `;
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  /**
   * Создаем обработчики событий
   */
  addEvents() {
    const cardBtnEditElem = this._element.querySelector(`.card__btn--edit`);

    cardBtnEditElem.addEventListener(`click`, this._onEditButtonClick);
  }

  /**
   * Удаляем обработчики событий
   */
  removeEvents() {
    const cardBtnEditElem = this._element.querySelector(`.card__btn--edit`);

    cardBtnEditElem.removeEventListener(`click`, this._onEditButtonClick);
  }

  /**
   * Обновляет элемент
   * @param {object} data
   */
  update(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._image = data.image;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
  }
}

export {
  Task
};
