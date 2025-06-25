const list = document.querySelector('.search-list');
const search = document.querySelector('.input-search');
const repositories = document.querySelector('.repositories');

let currentResult = [];
API_URL = 'https://api.github.com/search/repositories?q=';

const clearList = () => {
    list.innerHTML = '';
    list.setAttribute('hidden', '');
}

const showList = () => {
    list.removeAttribute('hidden');
}

const createListItem = (repo) => {
    const item = document.createElement('li');
    item.textContent = repo.name;
    item.addEventListener('click', () => {
        addRepo(repo);
        search.value ='';
        clearList();
    })
    return item;
}

async function searchRequest() {
    let request = search.value.trim();

    if (!request) {
        clearList();
        return;
    }

    try {

        response = await fetch(`${API_URL}${encodeURIComponent(request)}&per_page=5`)
        const data = await response.json();
        currentResult = data.items || [];

        clearList();

        currentResult.forEach(repo => {
            const item = createListItem(repo);
            list.appendChild(item);
        })

        if(currentResult.length > 0) {
            showList();
        }
    }
    catch(error) {
        console.error('Ошибка при получении данных:', error);
        clearList();
    }
}



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
