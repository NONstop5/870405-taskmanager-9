class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;

    this._state = {};
  }

  /**
   * Отрисовка карточки задачи
   */
  get template() {
    throw new Error(`You have to define taskTemplate() method.`);
  }

  /**
   * Получаем ссылку на текущий елемент
   */
  get element() {
    return this._element;
  }

  /**
   * Создаем обработчики событий
   */
  addEvents() {
    throw new Error(`You have to define addEvents() method.`);
  }

  /**
   * Удаляем обработчики событий
   */
  removeEvents() {
    throw new Error(`You have to define removeEvents() method.`);
  }

  /**
   * Отрисовка задачи в заданном элементе
   * @return {Node}
   */
  render() {
    this._element = document.createElement(`div`);

    this._element.innerHTML = this.template;
    this._element = this._element.firstElementChild;
    this.addEvents();

    return this._element;
  }

  /**
   * Удаляем задачу в заданном элементе
   */
  unrender() {
    this.removeEvents();
    this._element.remove();
    this._element = null;
  }

  /**
   * Обновляет элемент
   */
  update() {}
}

export {
  AbstractComponent
};
