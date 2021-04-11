// import icons from '../img/icons.svg'; //Parcel 1
// import recipeView from './views/RecipeView';
import * as model from './model';
import SearchView from './views/SearchView';
import ResultsView from './views/ResultsView';
import PaginationView from "./views/PaginationView";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RecipeView from "./views/RecipeView";

// https://forkify-api.herokuapp.com/v2

// if(module.hot) module.hot.accept();
const showRecipeController = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		RecipeView.renderSpinner();

		//0) Update results list
		ResultsView.update(model.getSearchResultsPage())

		//1) Loading recipe
		await model.loadRecipe(id);

		// 2) Render recipe
		RecipeView.render(model.state.recipe);
	} catch (err) {
		// console.error(err);
		RecipeView.renderError();
	}
};

const renderSearchResultAndPagination = (page = 1) => {
	//3) Render results
	ResultsView.render(model.getSearchResultsPage(page));

	//4) Render Pagination
	PaginationView.render(model.state.search)
}

const searchController = async function () {
	try {
		ResultsView.renderSpinner();
		//1) Get Search query
		const query = SearchView.getQuery();
		if (!query) return;

		//2) Load search results;
		await model.loadSearchResults(query);

		renderSearchResultAndPagination();
	} catch (e) {
		console.error(e);
	}
};
const paginationController = (pageToShow) => {
	renderSearchResultAndPagination(pageToShow)
}

const servingController = (updateTo) => {
	model.updateServings(updateTo);

	// Render recipe
	// RecipeView.render(model.state.recipe);
	RecipeView.update(model.state.recipe);
}

const init = function () {
	RecipeView.addHandlerRender(showRecipeController);
	SearchView.addHandlerSearch(searchController);
	PaginationView.btnClickHandler(paginationController)
	RecipeView.updateServingHandler(servingController)
};


init();
