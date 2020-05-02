'use strict';
document.addEventListener('DOMContentLoaded', function(){
    const heroesList = document.querySelector('.heroes-list'),
        filterMovie = document.querySelector('.filter-movie');
    class AppData {
        constructor() {
            this.heroes = [];
            this.movies = new Set();
        }
        // Запрос к базе данных
        getData() {
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open('GET', './database/dbHeroes.json');
                request.setRequestHeader('Content-type', 'application/json');
                request.addEventListener('readystatechange', () => {
                    if (request.readyState !== 4) {
                        return;
                    }
                    if (request.status === 200) {
                        const response = JSON.parse(request.responseText);
                        this.heroes = response;
                        this.getMovies();
                        resolve(response);
                    } else {
                        reject(request.statusText);
                    }
                });
                request.send();
            });
        }
        // Генерация карточек
        createCard() {}
        // Вставка карточек на страницу
        renderCard(data) {
            console.log(data);
            heroesList.textContent = '';
            data.forEach(item => {
                const {photo, name, realName, actors, movies, status = 'unknown', birthDay = 'unknown', deathDay = 'unknown', gender, species} = item;

                let moviesList = '';
                if (movies) {
                    for (let movie of movies) {
                        moviesList += `<div class="hero-movie">${movie}</div>`;
                    }
                }
                
                const card = document.createElement('div');
                card.className = 'hero';
                card.innerHTML = `
                    <div class="hero-photo"><img src="database/${photo}" alt="${name}" /></div>
                    <div class="hero-info">
                        <h2 class="hero-name">${name} <span class="real-name">(${realName})</span></h2>
                        <div class="hero-property hero-actors">Актер: ${actors}</div>
                        <div class="hero-property hero-status">${status === 'alive' ? status + ' (' + birthDay + ' - н.в.)' : status + ' (' + birthDay + ' - ' + deathDay + ')'}</div>
                        <div class="hero-property hero-birthDay">birthDay: ${birthDay}</div>
                        <div class="hero-property hero-deathDay">deathDay: ${deathDay}</div>
                        <div class="hero-property hero-gender">${gender} / ${species}</div>
                        <div class="hero-movies">${moviesList}</div>
                    </div>
                `;
                heroesList.appendChild(card);
            });
        }
        // Фильтрация по фильму
        // Получение списка фильмов
        getMovies() {
            this.heroes.forEach(item => {
                const {movies} = item;
                if (movies) {
                    for (let movie of movies) {
                        this.movies.add(movie.trim());
                    }
                }
            });
            this.renderFilter();
        }
        renderFilter() {
            const movies = [...this.movies];
            movies.sort();
            for (let movie of movies) {
                const item = document.createElement('div');
                item.className = 'filter-movie-item';
                item.textContent = movie;
                filterMovie.appendChild(item);
            }
        }
        filterByMovie(event) {
            const target = event.target;
            if (target.classList.contains('filter-movie-item')) {
                const filterItems = filterMovie.children;
                for (let item of filterItems) {
                    item.classList.remove('active');
                }
                target.classList.add('active');
                this.renderCard(this.heroes.filter(hero => hero.movies && hero.movies.includes(target.textContent)));
            }
        }
        // Старт
        start() {
            this.getData()
                .then(this.renderCard)
                .catch(error => {
                    heroesList.innerHTML = 'Произошла ошибка';
                    console.error(error);
                });
                this.handler();
        }
        // Обработчики событий
        handler() {
            const _this = this;
            filterMovie.addEventListener('click', _this.filterByMovie.bind(_this));
        }
    };
    const appData = new AppData();
    appData.start();
    console.log(appData);
});
/*
2) При помощи ajax запросов к загруженному файлу сформировать на странице
карточки Героев со всеми данными (фото, имя, настоящее имя, список фильмов, статус).
3) Реализовать переключатели-фильтры по фильмам.
Выпадающее меню или список, на ваше усмотрение
Показывать только те карточки, которые подходят под выбранный фильтр.

Лоадинг
Попап

*/