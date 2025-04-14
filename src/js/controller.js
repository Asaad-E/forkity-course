import "core-js/actual";
import "core-js/stable";
import "regenerator-runtime/runtime";

import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";

import addRecipeView from "./views/addRecipeView.js";

import model from "./model.js";
import searchView from "./views/searchView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

async function init() {
  recipeView.addHashChangeHandler(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlNewBookmark);
  recipeView.renderMessage();

  searchView.addHandlerSearch(controlSearchResult);

  paginationView.addHandlerPaginnation(controlPagination);

  bookmarkView.render(model.getBookmarksRecipes());

  addRecipeView.addHandlerUpload(controlAddRecipe);
}

async function controlRecipes() {
  try {
    // Get ID
    let ID = window.location.hash;
    if (!ID) return;
    ID = ID.slice(1);

    // Show Spinner
    recipeView.renderSpinner();

    // Load recipe
    await model.loadRecipe(ID);

    // rendering recipe
    recipeView.render(model.getRecipe());

    // update the search and bookmark view
    resultView.update(model.getRecipesPages());
    bookmarkView.render(model.getBookmarksRecipes());
  } catch (error) {
    console.error("Tecnical error:", error);
    recipeView.renderErrorMessage();
  }
}

async function controlSearchResult() {
  try {
    // get query
    const query = searchView.getQuery();
    if (!query) return;

    // render spiner
    resultView.renderSpinner();

    // get recipes
    console.log(query);
    await model.loadSearchRecipes(query);
    const recipes = model.getRecipes();

    console.log(recipes);

    // show error
    if (recipes.length === 0) {
      resultView.renderErrorMessage();
      return;
    }

    // show data
    resultView.render(model.getRecipesPages());
    searchView.clearform();

    console.log({
      length: model.getRecipes().length,
      page: model.getPage(),
    });

    // show pagination
    paginationView.render({
      length: model.getTotalRecepies(),
      page: model.getPage(),
    });
  } catch (error) {
    console.error("Tecnical error:", error);
    resultView.renderErrorMessage();
  }
}

function controlPagination(nextPage) {
  // update model
  model.setPage(nextPage);

  // render result
  resultView.render(model.getRecipesPages());

  // render new paginnation
  paginationView.render({
    length: model.getTotalRecepies(),
    page: model.getPage(),
  });
}

function controlServings(newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.getRecipe());
}

function controlNewBookmark() {
  const currentRecipe = model.getRecipe();

  // add or remove bookmark
  if (currentRecipe.bookmarked) {
    model.removeBookmark(currentRecipe);
  } else {
    model.addBookmark(currentRecipe);
  }

  // update current recipe view
  recipeView.update(model.getRecipe());

  // display all bookmarks
  bookmarkView.render(model.getBookmarksRecipes());
}

async function controlAddRecipe(data) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload recipe to the server
    const newRecipe = await model.uploadRecipe(data);

    // add to bookmark
    model.addBookmark(newRecipe);
    bookmarkView.render(model.getBookmarksRecipes());

    //render recipe
    model.setRecipe(newRecipe);
    recipeView.render(model.getRecipe());

    // RENDER SUCCES MSG
    addRecipeView.renderMessage();

    // change id in url
    window.history.pushState(null, "", `#${newRecipe.id}`);

    // CLOSE FORM
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderErrorMessage(error.message);
  }

  console.log("ehhehehehehehehehhehe");
}

// init
init();
