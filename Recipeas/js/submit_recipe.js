// submit_recipe.js

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Função para obter as receitas do Local Storage
     * @returns {Array} - Array de receitas submetidas pelo usuário
     */
    function getUserRecipes() {
        const userRecipes = localStorage.getItem('userRecipes');
        return userRecipes ? JSON.parse(userRecipes) : [];
    }

    /**
     * Função para adicionar uma nova receita ao Local Storage
     * @param {Object} recipe - Objeto contendo os dados da receita
     */
    function addUserRecipe(recipe) {
        const userRecipes = getUserRecipes();
        userRecipes.push(recipe);
        localStorage.setItem('userRecipes', JSON.stringify(userRecipes));
    }

    /**
     * Função para validar a URL da imagem (opcional)
     * @param {string} url - URL da imagem
     * @returns {boolean} - Verdadeiro se válido, falso caso contrário
     */
    function isValidURL(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocolo
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domínio name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // porta e caminho
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(url);
    }

    /**
     * Função para lidar com a submissão do formulário
     * @param {Event} event - Evento de submissão
     */
    function handleFormSubmit(event) {
        event.preventDefault(); // Previne o comportamento padrão de submissão

        // Obter os valores dos campos
        const nome = document.getElementById('recipeName').value.trim();
        const descricao = document.getElementById('recipeDescription').value.trim();
        const imagem = document.getElementById('recipeImage').value.trim();
        const tempo_duracao_input = document.getElementById('recipeDuration').value.trim();
        const autor = document.getElementById('recipeAuthor').value.trim();
        const porcoes_input = document.getElementById('recipePortions').value.trim();
        const categoria = document.getElementById('recipeCategory').value.trim();
        const ingredientesInput = document.getElementById('recipeIngredientes').value.trim();
        const modo_preparoInput = document.getElementById('recipePreparo').value.trim();

        // Validar os campos obrigatórios
        if (!nome || !descricao || !tempo_duracao_input || !autor || !porcoes_input || !categoria || !ingredientesInput || !modo_preparoInput) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validar a URL da imagem, se fornecida
        if (imagem && !isValidURL(imagem)) {
            alert('Por favor, insira uma URL válida para a imagem.');
            return;
        }

        // Converter tempo_duracao para inteiro (minutos)
        const tempo_duracao = parseInt(tempo_duracao_input, 10);
        if (isNaN(tempo_duracao) || tempo_duracao <= 0) {
            alert('Por favor, insira um tempo de duração válido em minutos.');
            return;
        }

        // Converter porcoes para inteiro
        const porcoes = parseInt(porcoes_input, 10);
        if (isNaN(porcoes) || porcoes <= 0) {
            alert('Por favor, insira um número válido de porções.');
            return;
        }

        // Processar os ingredientes e o modo de preparo
        const ingredientes = ingredientesInput.split('\n').map(item => item.trim()).filter(item => item);
        const modo_preparo = modo_preparoInput.split('\n').map(item => item.trim()).filter(item => item);

        // Criar o objeto da nova receita
        const newRecipe = {
            nome,
            descricao,
            imagem: imagem || 'https://via.placeholder.com/800x400?text=Receita',
            tempo_duracao, // Agora é um número inteiro representando minutos
            autor,
            porcoes, // Agora é um número inteiro
            categoria,
            ingredientes,
            modo_preparo,
            data_enviado: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
        };

        // Adicionar a nova receita ao Local Storage
        addUserRecipe(newRecipe);

        // Feedback para o usuário
        alert('Receita enviada com sucesso!');

        // Resetar o formulário
        event.target.reset();

        // Redirecionar para a página inicial (opcional)
        window.location.href = 'index.html';
    }

    // Adicionar listener para o formulário
    const submitRecipeForm = document.getElementById('submitRecipeForm');
    submitRecipeForm.addEventListener('submit', handleFormSubmit);
});
