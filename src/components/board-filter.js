/**
 * Отрисовка фильтров доски
 * @return {string}
 */
export default () => {
  return `
    <a href="#" class="board__filter">SORT BY DEFAULT</a>
    <a href="#" class="board__filter">SORT BY DATE up</a>
    <a href="#" class="board__filter">SORT BY DATE down</a>
  `;
};
