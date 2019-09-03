/**
 * Отрисовка фильтра
 * @param {string} filterName
 * @param {int} tasksCount
 * @return {string}
 */
export default (filterName, tasksCount) => {
  const disabledText = tasksCount === 0 ? `disabled` : ``;
  return `
    <input type="radio" id="filter__${filterName}" class="filter__input visually-hidden" name="filter" ${disabledText}/>
    <label for="filter__${filterName}" class="filter__label">
      ${filterName.toUpperCase()} <span class="filter__${filterName}-count">${tasksCount}</span>
    </label>
  `;
};
