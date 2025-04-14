import { API_URL, TIMEOUT_SEC, RES_PER_PAGE, API_KEY } from "./config.js";
import { isObjectEmpty, timeout } from "./helpers.js";

class Model {
  #localstorageKey = "forkityBookmark";

  #stage = {
    recipe: {},
    recipes: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    bookmarks: [],
  };

  constructor() {
    this.loadData();
  }

  getRecipe() {
    return { ...this.#stage.recipe };
  }

  setRecipe(recipe) {
    this.#stage.recipe = recipe;
  }

  getRecipes() {
    return this.#stage.recipes.map((recipe) => {
      return { ...recipe };
    });
  }

  getTotalRecepies() {
    return this.#stage.recipes.length;
  }

  setPage(page) {
    this.#stage.page = page;
  }
  getPage() {
    return this.#stage.page;
  }

  getRecipesPages() {
    return this.getRecipes().slice(
      (this.#stage.page - 1) * this.#stage.resultsPerPage,
      this.#stage.page * this.#stage.resultsPerPage
    );
  }

  #formatRecipe(apiRecipe) {
    return {
      id: apiRecipe.id,
      title: apiRecipe.title,
      publisher: apiRecipe.publisher,
      sourceUrl: apiRecipe.source_url,
      image: apiRecipe.image_url,
      servings: apiRecipe.servings,
      cookingTime: apiRecipe.cooking_time,
      ingredients: apiRecipe.ingredients,
      key: apiRecipe.key ? apiRecipe.key : "",
    };
  }

  updateServings(newServings) {
    // guard
    if (isObjectEmpty(this.#stage.recipe) || newServings < 1) return;

    // update quantities
    this.#stage.recipe.ingredients.forEach((ingredient) => {
      ingredient.quantity =
        (ingredient.quantity * newServings) / this.#stage.recipe.servings;
    });

    // update servings
    this.#stage.recipe.servings = newServings;
  }

  async #getJSON(url) {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    if (!response.ok)
      throw new Error(`${response.status} - (${response.statusText})`);
    return response.json();
  }

  async #sentJSON(url, data) {
    const response = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      }),
      timeout(TIMEOUT_SEC),
    ]);

    if (!response.ok)
      throw new Error(`${response.status} - (${response.statusText})`);
    return response.json();
  }

  async loadRecipe(id) {
    try {
      const data = await this.#getJSON(`${API_URL}/${id}`);

      if (!data.data?.recipe) throw new Error("Recipe not found");

      const { recipe } = data.data;

      this.#stage.recipe = this.#formatRecipe(recipe);

      if (
        this.#stage.bookmarks.some(
          (recipe) => recipe.id === this.#stage.recipe.id
        )
      ) {
        this.#stage.recipe.bookmarked = true;
      } else {
        this.#stage.recipe.bookmarked = false;
      }
    } catch (error) {
      console.error("Model error:", error);
      throw error;
    }
  }

  async loadSearchRecipes(query) {
    try {
      // validating inputs
      if (typeof query !== "string" || !query.trim()) {
        throw new Error("Invalid query");
      }
      const sanitizedQuery = encodeURIComponent(query.trim());

      // get data from api
      const data = await this.#getJSON(
        `${API_URL}?search=${sanitizedQuery}?&key=${API_KEY}`
      );
      if (!data.data?.recipes) throw new Error("Recipes not found");

      // load data to the state
      this.#stage.recipes = data.data.recipes.map(this.#formatRecipe);
      this.#stage.page = 1;
    } catch (error) {
      console.error("Model error:", error);
      throw error;
    }
  }

  getBookmarksRecipes() {
    return this.#stage.bookmarks;
  }

  addBookmark(recipe) {
    this.#stage.bookmarks.push(recipe);

    if (recipe.id === this.#stage.recipe.id) {
      this.#stage.recipe.bookmarked = true;
    }

    this.saveData();
  }

  removeBookmark(recipe) {
    const index = this.#stage.bookmarks.findIndex(
      (book) => book.id === recipe.id
    );
    this.#stage.bookmarks.splice(index, 1);

    if (recipe.id === this.#stage.recipe.id) {
      this.#stage.recipe.bookmarked = false;
    }

    this.saveData();
  }

  saveData() {
    try {
      const data = JSON.stringify(this.#stage.bookmarks);

      localStorage.setItem(this.#localstorageKey, data);
    } catch (error) {
      console.error("Model error: fail to save data to local storage");
      console.error(error);
    }
  }

  loadData() {
    try {
      let data = localStorage.getItem(this.#localstorageKey);

      if (data) {
        this.#stage.bookmarks = JSON.parse(data);
      }
    } catch (error) {
      console.error("Model error: fail to load data to local storage");
      console.error(error);
    }
  }

  async uploadRecipe(newRecipe) {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((entry) => {
        const ingArr = entry[1].split(",").map((ing) => ing.trim());

        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format"
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await this.#sentJSON(`${API_URL}?&key=${API_KEY}`, recipe);
    return this.#formatRecipe(data.data.recipe);
  }
}

export default new Model();
