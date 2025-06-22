const list = document.querySelector('.search-list');
const search = document.querySelector('.input-search');
const repositories = document.querySelector('.repositories');

let currentResult = [];

const searchRequest = function () {
    let request = search.value.trim();

    if (request === '') {
        list.innerHTML = '';
        list.setAttribute('hidden', '');
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(request)}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            currentResult = data.items;
            list.innerHTML = '';

            currentResult.forEach(repo => {
                const item = document.createElement('li');
                item.textContent = repo.name;

                list.appendChild(item);

                item.addEventListener('click', () => {
                    addRepo(repo);
                    search.value = '';
                    list.innerHTML = '';
                    list.setAttribute('hidden', '');
                });
            });

            list.removeAttribute('hidden');
        });
};

const addRepo = function (repo) {
    const div = document.createElement('div');
    const title = document.createElement('h5');
    const owner = document.createElement('p');
    const stars = document.createElement('p');
    const removeBtn = document.createElement('button');

    title.innerHTML = `Name: ${repo.name}`;
    owner.innerHTML = `Owner: ${repo.owner.login}`;
    stars.innerHTML = `Stars: ${repo.stargazers_count}`;
    removeBtn.textContent = 'Удалить';

    removeBtn.addEventListener('click', () => div.remove());

    div.append(title, owner, stars, removeBtn);
    repositories.appendChild(div);
    div.classList.add('repo');
};

const debounce = function(callback, ms) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, ms);
    };
};

search.addEventListener('input', debounce(searchRequest, 700));







