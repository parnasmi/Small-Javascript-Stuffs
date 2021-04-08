// import icons from '../img/icons.svg'; //Parcel 1
import * as model from './model';
import recipeView from './views/recipeView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

const showRecipeController = async function () {
	try {
		const id = window.location.hash.slice(1);
		if(!id) return;
		recipeView.renderSpinner();

		//1) Loading recipe
		await model.loadRecipe(id);

		// 2) Render recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		console.error(err);
	}
};

const init = function () {
	recipeView.addHandlerRender(showRecipeController);
}

init();
// showRecipe();

///////////////////////////////////////
