import { API_URL, SEARCH_PER_PAGE,ID_KEY } from './config';
import { getJSON,sendJSON,AJAX } from './helpers';

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

const createRecipeObject = (data) => {

	let { recipe } = data.data;
	return  {
		id: recipe.id,
		title: recipe.title,
		imageUrl: recipe.image_url,
		publisher: recipe.publisher,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		servings: recipe.servings,
		sourceUrl: recipe.source_url,
		...(recipe.key && {key: recipe.key})
	};
}

export const loadRecipe = async id => {
	try {
		const data = await AJAX(`${API_URL}/${id}?key=${ID_KEY}`);

		// let { recipe } = data.data;
		state.recipe = createRecipeObject(data);
		state.recipe.isBookmarked = state.bookmarks.some(bookmark => bookmark.id === state.recipe.id);
	} catch (e) {
		console.error(e.message);
		throw e;
	}
};

export const loadSearchResults = async query => {
	try {
		state.search.query = query;
		const data = await AJAX(`${API_URL}/?search=${query}&key=${ID_KEY}`);
		state.search.results = data.data.recipes.map(rec => {
			return {
				id: rec.id,
				title: rec.title,
				imageUrl: rec.image_url,
				publisher: rec.publisher,
				...(rec.key && {key: rec.key})
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

const persistBookmarks = () => localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

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
	persistBookmarks();

	// console.log('state.recipe', state.recipe);
};

export const createRecipe = async newRecipe => {
	try {
		// console.log('newRecipe', newRecipe);

		const ingredients = Object.entries(newRecipe).reduce((acc, [field, value]) => {
			if (field.startsWith('ingredient') && value.length) {
				// const ingArr = value.replaceAll(' ', '').split(',');
				const ingArr = value.split(',').map(el => el.trim());
				if (ingArr.length !== 3) throw new Error('Wrong ingredient format. Please use correct format!');
				// console.log('field', field, value);
				const [quantity, unit, description] = ingArr;
				return [...acc, { quantity: quantity ? quantity : null, unit, description }];
			} else {
				return acc;
			}
		}, []);

		// console.log('ingredients', ingredients);

		const payload = {
			title: newRecipe.title,
			publisher: newRecipe.publisher,
			ingredients,
			image_url: newRecipe.image,
			servings: +newRecipe.servings,
			source_url: newRecipe.sourceUrl,
			cooking_time: +newRecipe.cookingTime
		}

		const data = await AJAX(`${API_URL}?key=${ID_KEY}`, payload)
		state.recipe = createRecipeObject(data);
		handleBookmark(state.recipe, 'add');
	} catch (e) {
		throw e;
	}
};

const init = () => {
	const bookmarksStorage = localStorage.getItem('bookmarks');

	if (bookmarksStorage) state.bookmarks = JSON.parse(bookmarksStorage);
};

init();
