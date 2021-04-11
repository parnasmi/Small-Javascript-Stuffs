import View from './View';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
	_parentElement = document.querySelector('.results');
	_errorMessage = 'No recipes has been found for your query. Please try another query.'
	_message = '';

	_generateMarkup() {
		return this._data.map(this._generatePreview);
	}

	_generatePreview(preview) {
		const id = window.location.hash.slice(1);
		return `
            <li class="preview">
            <a class="preview__link ${id === preview.id ? 'preview__link--active' : ''}" href="#${preview.id}">
              <figure class="preview__fig">
                <img src="${preview.imageUrl}" alt="${preview.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${preview.title}</h4>
                <p class="preview__publisher">${preview.publisher}</p>
              </div>
            </a>
          </li>
        `;
	}
}

export default new ResultsView();
