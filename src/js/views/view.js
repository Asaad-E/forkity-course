import icons from "url:../../img/icons.svg";

export default class View {
  _parentElement;
  _data;
  _errorMessage;
  _message;

  constructor() {}

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @returns
   *
   * @returns {undefined}
   * @this {Object} View object
   * @author Asaad El Aissami
   */
  render(data) {
    this._data = data;

    if (Array.isArray(data) && data.length === 0)
      return this.renderErrorMessage();

    this._clear();
    const markup = this._generateMarkup();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];

      // replace textContext
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
    });
  }

  renderSpinner() {
    const html = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("beforeend", html);
  }

  renderErrorMessage(message = this._errorMessage) {
    this._clear();

    const html = `
        <div class="error">
    
            <div>
              <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
    
            <p>${message}</p>
            
          </div>`;

    this._parentElement.insertAdjacentHTML("beforeend", html);
  }

  renderMessage(message = this._message) {
    this._clear();

    const html = `
        <div class="message">
    
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
    
              <p>${message}</p>
        </div>`;

    this._parentElement.insertAdjacentHTML("beforeend", html);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _generateMarkup() {}
}
