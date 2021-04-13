import View from './View';
import icons from 'url:../../img/icons.svg';
class PreviewView extends View {
	_parentElement = '';

	_generateMarkup() {
		const id = window.location.hash.slice(1);
		const {_data} = this;
		return `
            <li class="preview">
            <a class="preview__link ${id === _data.id ? 'preview__link--active' : ''}" href="#${_data.id}">
              <figure class="preview__fig">
                <img src="${_data.imageUrl}" alt="${_data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${_data.title}</h4>
                <p class="preview__publisher">${_data.publisher}</p>
                <div class="preview__user-generated ${!_data.key ? 'hidden' : ''}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
        `;
	}

}

export default new PreviewView();
