'use strict';
document.addEventListener('DOMContentLoaded', function(){
    const heroesList = document.querySelector('.heroes-list'),
        filterOpen = document.querySelector('.filter-open'),
        filterReset = document.querySelector('.filter-reset'),
        filterMovie = document.querySelector('.filter-movie');
    class AppData {
        constructor() {
            this.heroes = [];
            this.movies = new Set();
        }
        // Запрос к базе данных
        getData() {
            heroesList.innerHTML = `
            <div class="sk-wandering-cubes">
                <div class="sk-cube sk-cube-1"></div>
                <div class="sk-cube sk-cube-2"></div>
            </div>`;
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
        // Отображение списка фильмов в фильтре
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
        // Фильтрация по фильму
        filterByMovie(event) {
            const target = event.target;
            if (target.classList.contains('filter-movie-item')) {
                this.filterResetActive();
                target.classList.add('active');
                const filteredHeroes = [];
                this.heroes.forEach(hero => {
                    if (hero.movies) {
                        hero.movies.forEach(movie => {
                            if (movie.trim() === target.textContent) filteredHeroes.push(hero);
                        });
                    }
                })
                this.renderCard(filteredHeroes);
            }
        }
        // Убрать выбор фильма
        filterResetActive() {
            const filterItems = filterMovie.children;
            for (let item of filterItems) {
                item.classList.remove('active');
            }
        }
        // Показ фильтра
        filterToggle() {
            filterMovie.classList.toggle('hidden');
            filterReset.classList.toggle('hidden');
        }
        // Сброс фильтра
        filterReset() {
            this.filterResetActive();
            this.filterToggle();
            this.renderCard(this.heroes);
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
            filterOpen.addEventListener('click', _this.filterToggle.bind(_this));
            filterReset.addEventListener('click', _this.filterReset.bind(_this));
            filterMovie.addEventListener('click', _this.filterByMovie.bind(_this));
        }
    };
    const appData = new AppData();
    appData.start();
    console.log(appData);
});
/*

Попап
Кпопка Вверх

*/