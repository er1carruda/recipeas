// receita.js

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Função para obter o parâmetro 'nome' da URL
     * @returns {string|null} - Nome da receita ou null se não encontrado
     */
    function getRecipeNameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('nome');
    }

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
     * Função para exibir os detalhes da receita
     * @param {Object} recipe - Objeto contendo os dados da receita
     */
    function displayRecipeDetails(recipe) {
        const container = document.getElementById('recipeDetails');

        // Criar elementos HTML para exibir os detalhes
        const title = document.createElement('h2');
        title.textContent = recipe.nome;

        const image = document.createElement('img');
        image.src = recipe.imagem || 'https://via.placeholder.com/800x400?text=Receita';
        image.alt = `Imagem de ${recipe.nome}`;
        image.className = 'img-fluid mb-4';

        const description = document.createElement('p');
        description.textContent = recipe.descricao;

        const detailsList = document.createElement('ul');
        detailsList.className = 'list-group list-group-flush mb-4';

        const durationItem = document.createElement('li');
        durationItem.className = 'list-group-item';
        durationItem.innerHTML = `<strong>Tempo de Duração:</strong> ${recipe.tempo_duracao} min`;

        const portionsItem = document.createElement('li');
        portionsItem.className = 'list-group-item';
        portionsItem.innerHTML = `<strong>Porções:</strong> ${recipe.porcoes}`;

        const authorItem = document.createElement('li');
        authorItem.className = 'list-group-item';
        authorItem.innerHTML = `<strong>Autor:</strong> ${recipe.autor}`;

        const categoryItem = document.createElement('li');
        categoryItem.className = 'list-group-item';
        categoryItem.innerHTML = `<strong>Categoria:</strong> ${recipe.categoria}`;

        detailsList.appendChild(durationItem);
        detailsList.appendChild(portionsItem);
        detailsList.appendChild(authorItem);
        detailsList.appendChild(categoryItem);

        const ingredientesSection = document.createElement('div');
        ingredientesSection.className = 'mb-4';
        const ingredientesTitle = document.createElement('h4');
        ingredientesTitle.textContent = 'Ingredientes';
        const ingredientesList = document.createElement('ul');
        ingredientesList.className = 'list-group';
        recipe.ingredientes.forEach(ingrediente => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = ingrediente;
            ingredientesList.appendChild(li);
        });
        ingredientesSection.appendChild(ingredientesTitle);
        ingredientesSection.appendChild(ingredientesList);

        const preparoSection = document.createElement('div');
        preparoSection.className = 'mb-4';
        const preparoTitle = document.createElement('h4');
        preparoTitle.textContent = 'Modo de Preparo';
        const preparoList = document.createElement('ol');
        preparoList.className = 'list-group list-group-numbered';
        recipe.modo_preparo.forEach(passo => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = passo;
            preparoList.appendChild(li);
        });
        preparoSection.appendChild(preparoTitle);
        preparoSection.appendChild(preparoList);

        // Montar o conteúdo
        container.appendChild(title);
        container.appendChild(image);
        container.appendChild(description);
        container.appendChild(detailsList);
        container.appendChild(ingredientesSection);
        container.appendChild(preparoSection);
    }

    /**
     * Função para inicializar a página de receita
     */
    async function init() {
        const recipeName = getRecipeNameFromURL();
        if (!recipeName) {
            alert('Receita não especificada.');
            return;
        }

        const allRecipes = await getAllRecipes();
        const recipe = allRecipes.find(r => r.nome.toLowerCase() === recipeName.toLowerCase());

        if (!recipe) {
            alert('Receita não encontrada.');
            return;
        }

        displayRecipeDetails(recipe);
    }

    // Executa a função de inicialização
    init();
});
