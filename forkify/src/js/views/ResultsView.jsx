import View from './View';
import PreviewView from './PreviewView';
class ResultsView extends View {
	_parentElement = document.querySelector('.results');
	_errorMessage = 'No recipes has been found for your query. Please try another query.';
	_message = '';

	_generateMarkup() {
		return this._data.map(result => PreviewView.render(result, false)).join('');
	}
}

export default new ResultsView();
