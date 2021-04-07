import {API_URL} from "./config";
import {getJSON} from "./helpers";

export const state = {
	recipe: {},
};

//https://forkify-api.herokuapp.com/v2
//5ed6604591c37cdc054bcd09
//5ed6604591c37cdc054bcac4
export const loadRecipe = async id => {
	try {
		const data = await getJSON(`${API_URL}/${id}`);

		let { recipe } = data.data;

		state.recipe = {
			cookingTime: recipe.cooking_time,
			id: recipe.id,
			imageUrl: recipe.image_url,
			ingredients: recipe.ingredients,
			publisher: recipe.publisher,
			servings: recipe.servings,
			sourceUrl: recipe.sourceUrl,
			title: recipe.title,
		};
	} catch (e) {
		console.error(e.message);
	}
};
