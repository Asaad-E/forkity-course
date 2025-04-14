import View from "./view";
import icons from "url:../../img/icons.svg";
import { RES_PER_PAGE } from "../config";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    let html = "";

    if (this._data.page > 1) {
      html += this._generateMarkupButton(-1);
    }

    if (this._data.page < Math.ceil(this._data.length / RES_PER_PAGE)) {
      html += this._generateMarkupButton(1);
    }

    return html;
  }

  addHandlerPaginnation(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const target = e.target.closest(".btn--inline");
      if (!target) return;

      const nextPage = parseInt(target.dataset.target);

      handler(nextPage);
    });
  }

  _generateMarkupButton(dir) {
    const num = `<span>Page ${this._data.page + dir}</span>`;
    const arrow = `
    <svg class="search__icon">
        <use href="${icons}#icon-arrow-${dir > 0 ? "right" : "left"}"></use>
    </svg>`;

    const html = `
    <button class="btn--inline pagination__btn--${
      dir > 0 ? "next" : "prev"
    }" data-target="${this._data.page + dir}" >
        
    ${dir > 0 ? num + arrow : arrow + num}
        
    </button>
    `;

    return html;
  }
}

export default new PaginationView();
