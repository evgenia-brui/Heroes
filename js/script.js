'use strict';
document.addEventListener('DOMContentLoaded', function(){
    const body = document.querySelector('body'),
        heroesList = document.querySelector('.heroes-list'),
        filterOpen = document.querySelector('.filter-open'),
        filterReset = document.querySelector('.filter-reset'),
        filterMovie = document.querySelector('.filter-movie');
    class AppData {
        constructor() {
            this.heroes         = [];
            this.filteredHeroes = [];
            this.movies         = new Set();
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
            const _this = this;
            heroesList.textContent = '';
            data.forEach((item, index) => {
                const {photo, name, movies, status = 'unknown', birthDay = 'unknown', deathDay = 'unknown', gender, species} = item;

                let moviesList = '';
                if (movies) {
                    for (let movie of movies) {
                        moviesList += `<div class="hero-movie">${movie}</div>`;
                    }
                }
                
                const card = document.createElement('div');
                card.className = 'hero';
                card.setAttribute('data-hero_id', index);
                card.addEventListener('click', _this.popupOpen.bind(_this));
                card.innerHTML = `
                    <div class="hero-photo"><img src="database/${photo}" alt="${name}" /></div>
                    <div class="hero-info">
                        <h2 class="hero-name">${name}</h2>
                        <div class="hero-property hero-status">${status === 'alive' ? status + ' (' + birthDay + ' - p.t.)' : status + ' (' + birthDay + ' - ' + deathDay + ')'}</div>
                        <div class="hero-property hero-gender">${gender} / ${species}</div>
                        <div class="hero-movies">${moviesList}</div>
                    </div>
                `;
                heroesList.appendChild(card);
            });
        }
        // Создание popup
        popupOpen(event) {
            const _this = this;
            let heroId = event.currentTarget.getAttribute('data-hero_id');

            const popup = document.createElement('div');
            popup.className = 'popup';
            popup.innerHTML = `
                <button class="popup-close"></button>
                <button class="popup-prev"></button>
                <button class="popup-next"></button>
                <div class="popup-content"></div>
            `;
            body.appendChild(popup);
            // вызываем функцию рендера карточки и передаем в нее героя
            this.popupRender(heroId);

            popup.addEventListener('click', event => {
                event.preventDefault();
                const target = event.target;
    
                if (!target.matches('.popup-close, .popup-prev, .popup-next')) {
                    return;
                }

                if (target.matches('.popup-close')) {
                    this.popupHeroClose();
                    return;
                }

                if (target.matches('.popup-next')) {
                    heroId++;
                } else if (target.matches('.popup-prev')) {
                    heroId--;
                }

                const heroesCount = this.filteredHeroes.length === 0 ? this.heroes.length : this.filteredHeroes.length;
                
                if (heroId >= heroesCount) {
                    heroId = 0;
                }
    
                if (heroId < 0) {
                    heroId = heroesCount - 1;
                }

                this.popupRender(heroId);
            });
        }
        // Закрытие popup
        popupHeroClose() {
            document.querySelector('.popup').remove();
        }
        // Вставка информации о герое в popup
        popupRender(heroId) {
            const popupContent = document.querySelector('.popup-content');
            const hero = this.filteredHeroes.length === 0 ? this.heroes[heroId] : this.filteredHeroes[heroId];
            const {photo, name, realName, actors, movies, status = 'unknown', birthDay = 'unknown', deathDay = 'unknown', gender, species} = hero;

            let moviesList = '';
            if (movies) {
                for (let movie of movies) {
                    moviesList += `<div class="hero-movie">${movie}</div>`;
                }
            }

            popupContent.innerHTML = `
                <div class="hero-card-big">
                    <div class="hero-photo"><img src="database/${photo}" alt="${name}" /></div>
                    <div class="hero-info">
                        <h2 class="hero-name">${name}<br /><span class="real-name">${realName}</span></h2>
                        <h3 class="hero-actor">Actor: ${actors}</h3>
                        <div class="hero-property hero-status">${status === 'alive' ? status + ' (' + birthDay + ' - present time)' : status + ' (' + birthDay + ' - ' + deathDay + ')'}</div>
                        <div class="hero-property hero-gender">${gender} / ${species}</div>
                        <div class="hero-movies">${moviesList}</div>
                    </div>
                </div>
            `;
        }
        slider() {
            const slider = document.querySelector('.portfolio-content'),
                slide = document.querySelectorAll('.portfolio-item');
            let currentSlide = 0;
    
            const prevSlide = (elem, index, strClass) => {
                elem[index].classList.remove(strClass);
            };
    
            const nextSlide = (elem, index, strClass) => {
                elem[index].classList.add(strClass);
            };
    
            slider.addEventListener('click', event => {
                event.preventDefault();
                const target = event.target;
    
                if (!target.matches('.portfolio-btn')) {
                    return;
                }
    
                prevSlide(slide, currentSlide, 'portfolio-item-active');
    
                if (target.matches('#arrow-right')) {
                    currentSlide++;
                } else if (target.matches('#arrow-left')) {
                    currentSlide--;
                }
    
                if (currentSlide >= slide.length) {
                    currentSlide = 0;
                }
    
                if (currentSlide < 0) {
                    currentSlide = slide.length - 1;
                }
    
                nextSlide(slide, currentSlide, 'portfolio-item-active');
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
                this.filteredHeroes = [];
                this.heroes.forEach(hero => {
                    if (hero.movies) {
                        hero.movies.forEach(movie => {
                            if (movie.trim() === target.textContent) this.filteredHeroes.push(hero);
                        });
                    }
                });
                this.renderCard(this.filteredHeroes);
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
            const _this = this;
            _this.getData()
                .then(_this.renderCard.bind(_this))
                .catch(error => {
                    heroesList.innerHTML = 'Произошла ошибка';
                    console.error(error);
                });
                _this.handler();
        }
        // Паралакс
        parallax(event) {
            document.querySelectorAll('.bg-stars img').forEach(layer => {
                let speed = layer.getAttribute('data-speed');
                layer.style.transform = `translate(${event.clientX * speed / 1000}px, ${event.clientY * speed / 1000}px)`;
            });
        }
        // Обработчики событий
        handler() {
            const _this = this;
            filterOpen.addEventListener('click', _this.filterToggle.bind(_this));
            filterReset.addEventListener('click', _this.filterReset.bind(_this));
            filterMovie.addEventListener('click', _this.filterByMovie.bind(_this));
            document.addEventListener('mousemove', _this.parallax.bind(_this));
        }
    };
    const appData = new AppData();
    appData.start();
});