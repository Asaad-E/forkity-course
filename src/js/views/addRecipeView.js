import View from "./view";
import icons from "url:../../img/icons.svg";
import { RES_PER_PAGE } from "../config";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  _message = "Recipe was succesfully uploaded";

  constructor() {
    super();
    this._addHanlderToggleWindow();
  }

  _generateMarkup() {
    let html = `
    <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="Chocolate" required name="title" type="text" />
          <label>URL</label>
          <input value="https://github.com/Asaad-E" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="https://images.unsplash.com/photo-1610450949065-1f2841536c88?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" required name="image" type="text" />
          <label>Publisher</label>
          <input value="El Aissami" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="60" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="2" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Chocolate"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value=",,Milk"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=""
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;

    return html;
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHanlderToggleWindow() {
    this._btnOpen.addEventListener("click", () => {
      this.toggleWindow();
      this.render();
    });

    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));

    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = [...new FormData(this._parentElement)];

      handler(Object.fromEntries(data));
    });
  }
}

export default new AddRecipeView();
