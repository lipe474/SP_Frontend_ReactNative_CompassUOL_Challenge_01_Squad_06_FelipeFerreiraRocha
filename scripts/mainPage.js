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
            const response = yield fetch("https://jsonplaceholder.typicode.com/posts");
            const posts = yield response.json();
            const formattedPosts = yield Promise.all(posts.slice(0, 12).map((post) => __awaiter(this, void 0, void 0, function* () {
                const postResponse = yield fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
                const comments = yield postResponse.json();
                const formattedComments = comments.map((comment) => ({
                    name: comment.name,
                    email: comment.email,
                    body: comment.body
                }));
                return Object.assign(Object.assign({}, post), { title: capitalizeFirstLetter(post.title), body: capitalizeFirstLetter(post.body), comments: formattedComments });
            })));
            return formattedPosts;
        }
        catch (error) {
            console.error("Erro ao buscar posts:", error);
            return [];
        }
    });
}
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function fetchPexelsImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://api.pexels.com/v1/search?query=nature&orientation=landscape&per_page=12", {
                headers: {
                    Authorization: "GklaqEoUQnwItsosMnN7j545MRDy0Eh0uJi9mWI540CeFnMr4GBwsCkh" // Substitua pela sua chave de API Pexels
                }
            });
            const data = yield response.json();
            return data.photos;
        }
        catch (error) {
            console.error("Erro ao buscar imagens do Pexels:", error);
            return [];
        }
    });
}
function createPostsElement(item) {
    const postContainer = document.createElement("div");
    postContainer.classList.add("item");
    const postImage = document.createElement("img");
    postImage.classList.add("image-article");
    postImage.src = item.image;
    const postTitle = document.createElement("a");
    postTitle.classList.add("grid-text");
    postTitle.innerHTML = item.title;
    postTitle.href = `post.html`;
    // Adicionar evento de clique no título
    postTitle.addEventListener("click", (event) => {
        event.preventDefault();
        redirectToPostPage(item);
        window.location.href = postTitle.href;
    });
    postContainer.appendChild(postImage);
    postContainer.appendChild(postTitle);
    return postContainer;
}
function redirectToPostPage(post) {
    localStorage.setItem("selectedPost", JSON.stringify(post));
}
export function relatedPosts(posts) {
    localStorage.setItem("relatedPosts", JSON.stringify(posts));
}
function allPostsStorage(posts) {
    localStorage.setItem("allPosts", JSON.stringify(posts));
}
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function showPosts(posts) {
    const gridPosts = document.createElement("div");
    gridPosts.classList.add("grid-articles");
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
                image: pexelsImages[index].src.large,
                comments: post.comments.map((comment) => ({
                    name: comment.name,
                    email: comment.email,
                    body: comment.body
                }))
            }));
            allPostsStorage(combinedObjects);
            const gridArticles = showPosts(combinedObjects);
            const gridArticlesElement = document.getElementById("grid-articles");
            if (gridArticlesElement) {
                gridArticlesElement.appendChild(gridArticles);
            }
            return combinedObjects;
        }
        catch (error) {
            console.error("Erro ao criar e inserir o conteúdo dos posts:", error);
            return [];
        }
    });
}
const allRelatedPosts = createAndAppendPostsContent();
allRelatedPosts.then((posts) => {
    const shuffledPosts = shuffleArray(posts);
    relatedPosts(shuffledPosts.slice(0, 6));
});
