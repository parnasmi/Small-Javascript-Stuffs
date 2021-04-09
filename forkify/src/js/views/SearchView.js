class SearchView {
    #parentEl = document.querySelector('.search');
    #queryEl = this.#parentEl.querySelector('.search__field');
    #clearInput() {
        this.#queryEl.value = '';
    }

    getQuery() {
        const query = this.#queryEl.value;
        this.#clearInput();
        return query;
    }

    addHandlerSearch(handler) {
        this.#parentEl.addEventListener('submit',function(e){
            e.preventDefault();

            handler();
        })
    }


}

export default new SearchView();