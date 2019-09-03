/**
 * Отрисовка строки поиска
 * @return {string}
 */
export default () => {
  return `
    <input
      type="text"
      id="search__input"
      class="search__input"
      placeholder="START TYPING — SEARCH BY WORD, #HASHTAG OR DATE"
    />
    <label class="visually-hidden" for="search__input">Search</label>
  `;
};
