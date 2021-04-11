import View from './View';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
	_parentElement = document.querySelector('.upload')
	_overlay = document.querySelector('.overlay');
	_openBtn = document.querySelector('.nav__btn--add-recipe')
	_window = document.querySelector('.add-recipe-window');
	_closeBtn = document.querySelector('.btn--close-modal');

	constructor() {
		super();
		this.showRecipeModalHandler();
		this.hideRecipeModalHandler();
	}

	toggleModal() {
		this._window.classList.toggle('hidden');
		this._overlay.classList.toggle('hidden');
	}

	showRecipeModalHandler() {
		this._openBtn.addEventListener('click', this.toggleModal.bind(this));
	}
	hideRecipeModalHandler() {
		this._closeBtn.addEventListener('click', this.toggleModal.bind(this));
		this._overlay.addEventListener('click', this.toggleModal.bind(this));
	}

	formSubmitHandler(handler) {
		this._parentElement.addEventListener('submit', function(e){
			e.preventDefault()
			const dataArr = [...new FormData(this)];
			const data = Object.fromEntries(dataArr);
			handler(data)
		})
	}

}

export default new AddRecipeView();
