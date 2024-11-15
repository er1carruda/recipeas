// all_recipes.js

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Função para obter todas as receitas (estáticas e do usuário)
     * @returns {Promise<Array>} - Promise que resolve para um array de receitas
     */
    async function getAllRecipes() {
        try {
            const staticRecipesResponse = await fetch('assets/data/receitas.json');
            if (!staticRecipesResponse.ok) {
                throw new Error('Erro ao carregar o arquivo JSON de receitas estáticas.');
            }
            const staticRecipes = await staticRecipesResponse.json();

            const userRecipes = localStorage.getItem('userRecipes');
            const parsedUserRecipes = userRecipes ? JSON.parse(userRecipes) : [];

            return [...staticRecipes, ...parsedUserRecipes];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * Função para preencher os filtros de Categoria e Autor
     * @param {Array} recipes - Array de todas as receitas
     */
    function populateFilters(recipes) {
        const categories = [...new Set(recipes.map(recipe => recipe.categoria || 'Outros'))];
        const authors = [...new Set(recipes.map(recipe => recipe.autor || 'Anônimo'))];

        const filterCategory = document.getElementById('filterCategory');
        const filterAuthor = document.getElementById('filterAuthor');

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = capitalizeFirstLetter(category);
            filterCategory.appendChild(option);
        });

        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = capitalizeFirstLetter(author);
            filterAuthor.appendChild(option);
        });
    }

    /**
     * Função para exibir as receitas na página
     * @param {Array} recipes - Array de receitas a serem exibidas
     */
    function displayRecipes(recipes) {
        const container = document.getElementById('all-recipes-container');
        container.innerHTML = ''; // Limpa o container antes de adicionar

        if (recipes.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhuma receita encontrada com os filtros selecionados.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 col-lg-4 mb-4';
            colDiv.setAttribute('data-aos', 'zoom-in');

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card h-100';

            const img = document.createElement('img');
            img.src = recipe.imagem || 'https://via.placeholder.com/300x200?text=Receita';
            img.className = 'card-img-top';
            img.alt = `Imagem de ${recipe.nome}`;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = recipe.nome;

            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = recipe.descricao;

            const viewButton = document.createElement('a');
            viewButton.href = `receita.html?nome=${encodeURIComponent(recipe.nome)}`;
            viewButton.className = 'btn btn-primary mt-auto';
            viewButton.textContent = 'Ver Receita';

            // Monta o card
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(viewButton);

            cardDiv.appendChild(img);
            cardDiv.appendChild(cardBody);

            colDiv.appendChild(cardDiv);
            container.appendChild(colDiv);
        });

        // Atualiza o AOS para animar os novos elementos
        AOS.refresh();
    }

    /**
     * Função para aplicar os filtros selecionados
     * @param {Array} recipes - Array de todas as receitas
     * @param {Object} filters - Objeto contendo os filtros aplicados
     * @returns {Array} - Array filtrada de receitas
     */
    function applyFilters(recipes, filters) {
        return recipes.filter(recipe => {
            // Filtro por Categoria
            if (filters.category && recipe.categoria !== filters.category) {
                return false;
            }
            // Filtro por Autor
            if (filters.author && recipe.autor !== filters.author) {
                return false;
            }
            // Filtro por Tempo de Duração
            if (filters.duration) {
                const duration = parseInt(filters.duration, 10);
                if (recipe.tempo_duracao > duration) {
                    return false;
                }
            }
            // Filtro por Porções
            if (filters.portions) {
                const [min, max] = getPortionsRange(filters.portions);
                if (recipe.porcoes < min || (max !== null && recipe.porcoes > max)) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Função para definir o intervalo de porções com base na seleção
     * @param {string} portions - Faixa de porções selecionada
     * @returns {Array} - Array contendo min e max porções
     */
    function getPortionsRange(portions) {
        switch (portions) {
            case '1-2':
                return [1, 2];
            case '3-4':
                return [3, 4];
            case '5-6':
                return [5, 6];
            case '7-10':
                return [7, 10];
            case '11+':
                return [11, null]; // null indica sem limite superior
            default:
                return [1, null];
        }
    }

    /**
     * Função para capitalizar a primeira letra de uma string
     * @param {string} string - String a ser capitalizada
     * @returns {string} - String com a primeira letra capitalizada
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Função para inicializar os filtros e exibir todas as receitas
     */
    async function init() {
        const allRecipes = await getAllRecipes();
        populateFilters(allRecipes);
        displayRecipes(allRecipes);

        // Adicionar evento de submissão do formulário de filtros
        const filtersForm = document.getElementById('filtersForm');
        filtersForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const category = document.getElementById('filterCategory').value;
            const author = document.getElementById('filterAuthor').value;
            const duration = document.getElementById('filterDuration').value;
            const portions = document.getElementById('filterPortions').value;

            const filters = { category, author, duration, portions };
            const filteredRecipes = applyFilters(allRecipes, filters);
            displayRecipes(filteredRecipes);
        });

        // Adicionar evento para limpar os filtros
        const clearFiltersBtn = document.getElementById('clearFilters');
        clearFiltersBtn.addEventListener('click', function () {
            document.getElementById('filtersForm').reset();
            displayRecipes(allRecipes);
        });
    }

    // Executa a função de inicialização
    init();
});
