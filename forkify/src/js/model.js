import { API_URL, SEARCH_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		searchPerPage: SEARCH_PER_PAGE,
	},
	bookmarks: [],
};

//https://forkify-api.herokuapp.com/v2
//5ed6604591c37cdc054bcd09
//5ed6604591c37cdc054bcac4
export const loadRecipe = async id => {
	try {
		const data = await getJSON(`${API_URL}/${id}`);

		let { recipe } = data.data;

		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			imageUrl: recipe.image_url,
			publisher: recipe.publisher,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
			servings: recipe.servings,
			sourceUrl: recipe.sourceUrl,
		};
		state.recipe.isBookmarked = state.bookmarks.some(bookmark => bookmark.id === recipe.id);
	} catch (e) {
		console.error(e.message);
		throw e;
	}
};

export const loadSearchResults = async query => {
	try {
		state.search.query = query;
		const data = await getJSON(`${API_URL}/?search=${query}`);
		state.search.results = data.data.recipes.map(rec => {
			return {
				id: rec.id,
				title: rec.title,
				imageUrl: rec.image_url,
				publisher: rec.publisher,
			};
		});
	} catch (e) {
		console.error(e.message);
		throw e;
	}
};

export const getSearchResultsPage = (page = state.search.page) => {
	state.search.page = page;
	const {
		search: { searchPerPage, results: searchResults },
	} = state;

	const start = (page - 1) * searchPerPage;
	const end = page * searchPerPage;

	const results = [...searchResults];
	return results.slice(start, end);
};

export const updateServings = newServing => {
	state.recipe.ingredients.forEach(ing => {
		ing.quantity = ing.quantity * (newServing / state.recipe.servings);
	});
	state.recipe.servings = newServing;
};

export const handleBookmark = (recipe, type) => {
	function markBookmarked(type) {
		if (recipe.id === state.recipe.id) state.recipe.isBookmarked = type === 'add';
	}

	if (type === 'add') {
		state.bookmarks.push(recipe);
		markBookmarked('add');
	} else {
		const index = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
		state.bookmarks.splice(index, 1);
		markBookmarked('remove');
	}

	// console.log('state.recipe', state.recipe);
};
