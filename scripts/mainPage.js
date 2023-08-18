"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://jsonplaceholder.typicode.com/posts');
            const posts = yield response.json();
            return posts.slice(0, 12);
        }
        catch (error) {
            console.error('Erro ao buscar posts:', error);
            return [];
        }
    });
}
function fetchPexelsImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://api.pexels.com/v1/search?query=nature&orientation=landscape&per_page=12', {
                headers: {
                    Authorization: 'GklaqEoUQnwItsosMnN7j545MRDy0Eh0uJi9mWI540CeFnMr4GBwsCkh' // Substitua pela sua chave de API Pexels
                }
            });
            console.log(response.headers, 'response');
            const rateLimitHeader = response.headers.get('X-Ratelimit-Limit');
            if (rateLimitHeader) {
                const remainingRequests = parseInt(rateLimitHeader, 10);
                console.log(`Remaining requests: ${remainingRequests}`);
            }
            else {
                console.log('Rate limit information not found in response headers.');
            }
            const data = yield response.json();
            return data.photos;
        }
        catch (error) {
            console.error('Erro ao buscar imagens do Pexels:', error);
            return [];
        }
    });
}
function createPostsElement(item) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('item');
    const postImage = document.createElement('img');
    postImage.classList.add('image-article');
    postImage.src = item.image;
    const postTitle = document.createElement('a');
    postTitle.classList.add('grid-text');
    postTitle.innerHTML = item.title;
    postTitle.href = `post.html`;
    // Adicionar evento de clique no título
    postTitle.addEventListener('click', (event) => {
        event.preventDefault();
        redirectToPostPage(item);
        window.location.href = postTitle.href;
    });
    postContainer.appendChild(postImage);
    postContainer.appendChild(postTitle);
    return postContainer;
}
function redirectToPostPage(post) {
    localStorage.setItem('selectedPost', JSON.stringify(post));
    window.location.href = 'post.html';
}
function showPosts(posts) {
    const gridPosts = document.createElement('div');
    gridPosts.classList.add('grid-articles');
    posts.forEach((item) => {
        gridPosts.appendChild(createPostsElement(item));
    });
    return gridPosts;
}
function createAndAppendPostsContent() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield fetchPosts();
            const pexelsImages = yield fetchPexelsImages();
            const combinedObjects = posts.map((post, index) => ({
                id: post.id,
                title: post.title,
                body: post.body,
                image: pexelsImages[index].src.large
            }));
            const gridArticles = showPosts(combinedObjects);
            const gridArticlesElement = document.getElementById('grid-articles');
            if (gridArticlesElement) {
                gridArticlesElement.appendChild(gridArticles);
            }
        }
        catch (error) {
            console.error('Erro ao criar e inserir o conteúdo dos posts:', error);
        }
    });
}
createAndAppendPostsContent();
