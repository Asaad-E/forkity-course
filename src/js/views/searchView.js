class searchView {
  #parentElement = document.querySelector(".search");

  getQuery() {
    return this.#parentElement.querySelector(".search__field").value;
  }

  clearform() {
    this.#parentElement.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
