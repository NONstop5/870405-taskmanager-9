import {Component} from "./component";

class TaskEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._image = data.image;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

    this._state = {
      isDate: data.isDate,
      isRepeate: data.isRepeate,
      isFavorite: data.isFavorite,
      isDone: data.isDone,
    };

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
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
        <input type="hidden" name="hashtag" value="repeat" class="card__hashtag-hidden-input" />
        <button type="button" class="card__hashtag-name">
          #${tagValue}
        </button>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>
    `;
    }, ``);

    return `
    <div class="card__hashtag">
      <div class="card__hashtag-list">
        ${tagsHtml}
      </div>
      <label>
        <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here" />
      </label>
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
   * Генерация html-кода хэштэгов
   * @param {array} tags
   * @return {string}
   */
  _generateTaskHashtags(tags) {
    const tagsHtml = tags.reduce((resultHtml, tagValue) => {
      return resultHtml + `
      <span class="card__hashtag-inner">
        <input type="hidden" name="hashtag" value="repeat" class="card__hashtag-hidden-input" />
        <button type="button" class="card__hashtag-name">
          #${tagValue}
        </button>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>
    `;
    }, ``);

    return `
    <div class="card__hashtag">
      <div class="card__hashtag-list">
        ${tagsHtml}
      </div>

      <label>
        <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here" />
      </label>
    </div>
  `;
  }

  /**
   * Возвращает повторяется задача или нет в виде текста
   * @param {boolean} isRepeat
   * @return {string}
   */
  _getTaskRepeatText(isRepeat) {
    return isRepeat ? `yes` : `no`;
  }

  /**
   * Генерация html-кода дней недели
   * @param {object} repeatingDays
   * @param {integer} id
   * @return {string}
   */
  _generateTaskDaysHtml(repeatingDays, id) {
    let daysHtml = ``;
    for (let day in repeatingDays) {
      if (repeatingDays[day] !== undefined) {
        daysHtml += `
        <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-${day}-${id}" name="repeat" value="${day}" ${repeatingDays[day] ? `checked` : ``} />
        <label class="card__repeat-day" for="repeat-${day}-${id}">${day}</label>
      `;
      }
    }

    return daysHtml;
  }

  /**
   * Генерация html - кода цветов
   * @param {object} colorObj
   * @param {integer} id
   * @return {string}
   */
  _generateTaskColorsHtml(colorObj, id) {
    return colorObj.list.reduce((resultHtml, color) => {
      return resultHtml + `
      <input type="radio" id="color-${color}-${id}" class="card__color-input card__color-input--${color} visually-hidden" name="color" value="${color}" ${color === colorObj.value ? `checked` : ``} />
      <label for="color-${color}-${id}" class="card__color card__color--${color}">${color}</label>
    `;
    }, ``);
  }

  /**
   * Отрисовка карточки задачи
   * @return {string}
   */
  get template() {
    const taskControlBlock = `
    <div class="card__control">
      <button type="button" class="card__btn card__btn--edit card__btn--disabled">
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
      <button class="card__date-deadline-toggle" type="button">
        date: <span class="card__date-status">yes</span>
      </button>

      <fieldset class="card__date-deadline">
        <label class="card__input-deadline-wrap">
          <input class="card__date" type="text" placeholder="23 September" name="date" value="${this._dueDate}" />
        </label>
        <label class="card__input-deadline-wrap">
          <input class="card__time" type="text" placeholder="11:15 PM" name="time" value="00:00 AM" />
        </label>
      </fieldset>

      <button class="card__repeat-toggle" type="button">
        repeat:<span class="card__repeat-status">${this._getTaskRepeatText(this._getIsRepeatTask(this._repeatingDays))}</span>
      </button>

      <fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${this._generateTaskDaysHtml(this._repeatingDays, this._id)}
        </div>
      </fieldset>
    </div>
  `;

    const taskImageBlock = `
    <label class="card__img-wrap">
      <input type="file" class="card__img-input visually-hidden" name="img" />
      <img src="${this._image}" alt="task picture" class="card__img" />
    </label>
  `;

    const taskColorBlock = `
    <div class="card__colors-inner">
      <h3 class="card__colors-title">Color</h3>
      <div class="card__colors-wrap">
        ${this._generateTaskColorsHtml(this._color, this._id)}
      </div>
    </div>
  `;

    const taskSettingsBlock = `
    <div class="card__settings">
      <div class="card__details">
        ${taskDateBlock}
        ${this._generateTaskHashtags(this._tags)}
      </div>
      ${taskImageBlock}
      ${taskColorBlock}
    </div>

  `;

    const taskStatusButtonsBlock = `
    <div class="card__status-btns">
      <button class="card__save" type="submit">save</button>
      <button class="card__delete" type="button">delete</button>
    </div>
  `;

    return `
    <article class="card card--edit ${this._getTaskBarType(this._getIsRepeatTask(this._repeatingDays))} card--${this._getTaskColor(this._color.value, this._getIsDeadline(this._dueDate))}">
      <form class="card__form" method="get">
        <div class="card__inner">
        ${taskControlBlock}
        ${taskColorBarBlock}
        ${taskTextareaBlock}
        ${taskSettingsBlock}
        ${taskStatusButtonsBlock}
        </div>
      </form>
    </article>
  `;
  }

  _onSubmitButtonClick() {
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _onChangeDate() {}

  _onChangeRepeated() {}

  /**
   * Создаем обработчики событий
   */
  addEvents() {
    const cardBtnSubmitElem = this._element.querySelector(`.card__save`);
    cardBtnSubmitElem.addEventListener(`click`, this._onSubmitButtonClick.bind(this));
  }

  /**
   * Удаляем обработчики событий
   */
  removeEvents() {
    const cardBtnSubmitElem = this._element.querySelector(`.card__save`);
    cardBtnSubmitElem.removeEventListener(`click`, this._onSubmitButtonClick.bind(this));
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
  TaskEdit
};
