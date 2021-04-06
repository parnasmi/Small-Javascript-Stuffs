export const state = {
	recipe: {},
};

export const loadRecipe = async id => {
	try {
		const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
		const data = await res.json();
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

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
