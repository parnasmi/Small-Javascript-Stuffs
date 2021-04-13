// import icons from '../img/icons.svg'; //Parcel 1
// import recipeView from './views/RecipeView';
import * as model from './model';
import SearchView from './views/SearchView';
import ResultsView from './views/ResultsView';
import BookmarksView from "./views/BookmarksView";
import PaginationView from './views/PaginationView';
import AddRecipeView from "./views/AddRecipeView";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RecipeView from './views/RecipeView';
import { state } from './model';
import {MODAL_CLOSE_TIMEOUT_SEC} from './config'

// https://forkify-api.herokuapp.com/v2

// if(module.hot) module.hot.accept();
const showRecipeController = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		RecipeView.renderSpinner();

		//0) Update results list
		ResultsView.update(model.getSearchResultsPage());
		BookmarksView.update(model.state.bookmarks);
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
	// console.log('state after results', { state, page });
	//4) Render Pagination
	PaginationView.render(model.state.search);
};

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
const paginationController = pageToShow => {
	renderSearchResultAndPagination(pageToShow);
};

const servingController = updateTo => {
	model.updateServings(updateTo);

	// Update recipe
	RecipeView.update(model.state.recipe);
};

const addBookmarkController = () => {
	//1) Add/Remove Bookmark
	if(model.state.recipe.isBookmarked) model.handleBookmark(state.recipe, 'remove');
	else model.handleBookmark(state.recipe, 'add');

	//2) Update Recipe
	RecipeView.update(state.recipe);

	//3) Render bookmarks
	BookmarksView.render(model.state.bookmarks);

};

const recoverBookmarksController = () => {
	BookmarksView.render(model.state.bookmarks);
}
const submitController = async (data) => {
	try {
		//1) Render spinner
		AddRecipeView.renderSpinner();
		//2) Send data
		await model.createRecipe(data)

		//3) render recipe
		RecipeView.render(state.recipe)

		//4) Show Success message
		AddRecipeView.renderSuccess('Recipe was successfully uploaded');

		//5) Render bookmarks
		BookmarksView.render(model.state.bookmarks);
		window.history.pushState(null, '', `#${model.state.recipe.id}`)
		setTimeout(() => {
			AddRecipeView.toggleModal();
		}, MODAL_CLOSE_TIMEOUT_SEC * 1000)
		// console.log('state recipe', model.state.recipe)
	} catch(ex) {
		console.error(ex)
		AddRecipeView.renderError(ex)
	}
}

const init = function () {
	BookmarksView.loadStorageBookmarkHandler(recoverBookmarksController);
	RecipeView.addHandlerRender(showRecipeController);
	SearchView.addHandlerSearch(searchController);
	PaginationView.btnClickHandler(paginationController);
	RecipeView.updateServingHandler(servingController);
	RecipeView.addBookmarkHandler(addBookmarkController);
	AddRecipeView.formSubmitHandler(submitController)
};

init();
