import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
	_parentElement = document.querySelector('.pagination');

	btnClickHandler(handler) {
		this._parentElement.addEventListener('click', function(e) {
			const btn = e.target.closest('.btn--inline');
			if(!btn) return;
			const pageToShow = +btn.dataset.goto;
			handler(pageToShow)
		})
	}

	_generateMarkup() {
		const numPage = Math.ceil(this._data.results.length / this._data.searchPerPage);
		console.log('numPage',numPage)
		const currentPage = this._data.page;
		//Page 1 and there are other pages
		if (currentPage === 1 && numPage > 1) {
			return this._generatePaginationBtn({
				classDir: 'next',
				iconDir: 'right',
				page: currentPage + 1,
			});
		}
		//Last page
		if (currentPage === numPage && numPage > 1) {
			return this._generatePaginationBtn({
				classDir: 'prev',
				iconDir: 'left',
				page: currentPage - 1,
			});
		}
		//Other page
		if (currentPage < numPage && currentPage > 1) {
			return `
                ${this._generatePaginationBtn({
																	classDir: 'prev',
																	iconDir: 'left',
																	page: currentPage - 1,
																})}
            ${this._generatePaginationBtn({
													classDir: 'next',
													iconDir: 'right',
													page: currentPage + 1,
												})}
            `;
		}

		//Page 1 and there are also other pages
		return '';
	}
	_generatePaginationBtn({ classDir, iconDir, page }) {
		//prettier-ignore
		return `
            <button class="btn--inline pagination__btn--${classDir}" data-goto="${page}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-${iconDir}"></use>
                </svg>
                <span>Page ${page}</span>
            </button>
        `
	}
}

export default new PaginationView();
