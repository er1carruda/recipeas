// script.js

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Função para carregar e renderizar as receitas no carrossel
     * @param {Array} recipes - Array contendo as receitas para o carrossel
     */
    function loadCarousel(recipes) {
        const carouselInner = document.getElementById('carousel-inner');
        carouselInner.innerHTML = ''; // Limpa o contêiner do carrossel antes de adicionar

        recipes.forEach((recipe, index) => {
            // Cria o elemento do item do carrossel
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) {
                carouselItem.classList.add('active');
            }

            // Cria o link para abrir a página de detalhes da receita
            const cardLink = document.createElement('a');
            cardLink.href = `receita.html?nome=${encodeURIComponent(recipe.nome)}`; // Link para receita.html com parâmetro
            cardLink.className = 'text-decoration-none text-dark';

            // Cria a imagem do carrossel
            const img = document.createElement('img');
            img.src = recipe.imagem || 'https://via.placeholder.com/800x400?text=Receita';
            img.className = 'd-block w-100 carousel-image';
            img.alt = `Imagem de ${recipe.nome}`;

            // Cria a legenda do carrossel
            const caption = document.createElement('div');
            caption.className = 'carousel-caption d-none d-md-block';

            const title = document.createElement('h5');
            title.textContent = recipe.nome;

            const description = document.createElement('p');
            description.textContent = recipe.descricao;

            // Monta a legenda
            caption.appendChild(title);
            caption.appendChild(description);

            // Adiciona a imagem e a legenda ao link
            cardLink.appendChild(img);
            cardLink.appendChild(caption);

            // Adiciona o link ao item do carrossel
            carouselItem.appendChild(cardLink);

            // Adiciona o item ao carrossel
            carouselInner.appendChild(carouselItem);
        });
    }

    /**
     * Função para carregar e renderizar todas as receitas na seção "Veja mais"
     * @param {Array} recipes - Array contendo todas as receitas
     */
    function loadRecipes(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.innerHTML = ''; // Limpa o container antes de adicionar

        recipes.forEach(recipe => {
            // Cria a coluna
            const colDiv = document.createElement('div');
            colDiv.className = 'col-6 col-md-4 col-lg-3 mb-4';
            // Removido o atributo data-aos para que a animação não dependa do scroll

            // Cria o card
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';

            // Cria a imagem do card
            const img = document.createElement('img');
            img.src = recipe.imagem || 'https://via.placeholder.com/300x200?text=Receita';
            img.className = 'card-img-top';
            img.alt = `Imagem de ${recipe.nome}`;

            // Cria o corpo do card
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // Cria o título do card
            const cardTitle = document.createElement('h6');
            cardTitle.className = 'card-title';
            cardTitle.textContent = recipe.nome;

            // Adiciona o título ao corpo do card
            cardBody.appendChild(cardTitle);

            // Adiciona a imagem e o corpo ao card
            cardDiv.appendChild(img);
            cardDiv.appendChild(cardBody);

            // Cria o link para abrir a página de detalhes da receita
            const cardLink = document.createElement('a');
            cardLink.href = `receita.html?nome=${encodeURIComponent(recipe.nome)}`; // Link para receita.html com parâmetro
            cardLink.className = 'text-decoration-none text-dark';

            // Adiciona o card ao link
            cardLink.appendChild(cardDiv);

            // Adiciona o link à coluna
            colDiv.appendChild(cardLink);

            // Adiciona a coluna ao container
            recipesContainer.appendChild(colDiv);
        });
    }

    /**
     * Função para obter as receitas estáticas do JSON
     * @returns {Promise<Array>} - Promise que resolve para um array de receitas
     */
    function getStaticRecipes() {
        return fetch('assets/data/receitas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar o arquivo JSON');
                }
                return response.json();
            });
    }

    /**
     * Função para obter as receitas do Local Storage
     * @returns {Array} - Array de receitas submetidas pelo usuário
     */
    function getUserRecipes() {
        const userRecipes = localStorage.getItem('userRecipes');
        return userRecipes ? JSON.parse(userRecipes) : [];
    }

    /**
     * Função para combinar receitas estáticas e do usuário
     * @param {Array} staticRecipes - Receitas do JSON
     * @param {Array} userRecipes - Receitas do Local Storage
     * @returns {Array} - Receitas combinadas
     */
    function combineRecipes(staticRecipes, userRecipes) {
        return [...staticRecipes, ...userRecipes];
    }

    /**
     * Função para carregar os dados e renderizar as seções
     */
    async function loadData() {
        try {
            const staticRecipes = await getStaticRecipes();
            const userRecipes = getUserRecipes();
            const allRecipes = combineRecipes(staticRecipes, userRecipes);

            // Carrega as três primeiras receitas no carrossel
            const carouselRecipes = allRecipes.slice(0, 3);
            loadCarousel(carouselRecipes);

            // Carrega todas as receitas na seção "Veja mais"
            loadRecipes(allRecipes);
        } catch (error) {
            console.error('Erro ao carregar as receitas:', error);
            // Exibe mensagem de erro no carrossel
            const carouselInner = document.getElementById('carousel-inner');
            carouselInner.innerHTML = '<div class="carousel-item active"><div class="d-flex justify-content-center align-items-center" style="height: 400px;"><p class="text-danger">Erro ao carregar o carrossel. Por favor, tente novamente mais tarde.</p></div></div>';

            // Exibe mensagem de erro na seção "Veja mais"
            const recipesContainer = document.getElementById('recipes-container');
            recipesContainer.innerHTML = '<p class="text-danger">Erro ao carregar as receitas. Por favor, tente novamente mais tarde.</p>';
        }
    }

    // Chama a função principal para carregar os dados
    loadData();

    // Inicialização do Carrossel
    var carouselElement = document.getElementById('recipeCarousel');
    var carousel = new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel'
    });

    // Funções para controlar o carrossel (opcional)
    window.stopCarousel = function() {
        carousel.pause();
    }

    window.startCarousel = function() {
        carousel.cycle();
    }
});
