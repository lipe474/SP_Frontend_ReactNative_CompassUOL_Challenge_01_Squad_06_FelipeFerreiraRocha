export interface Post {
  id: number;
  title: string;
  body: string;
  image: string;
  comments: Comment[];
}

export interface Comment {
  name: string;
  email: string;
  body: string;
}
async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await response.json();

    const formattedPosts = await Promise.all(
      posts.slice(0, 12).map(async (post: Post) => {
        const postResponse = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
        );
        const comments = await postResponse.json();

        const formattedComments = comments.map((comment: Comment) => ({
          name: comment.name,
          email: comment.email,
          body: comment.body
        }));

        return {
          ...post,
          title: capitalizeFirstLetter(post.title),
          body: capitalizeFirstLetter(post.body),
          comments: formattedComments
        };
      })
    );

    return formattedPosts;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return [];
  }
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function fetchPexelsImages(): Promise<any[]> {
  try {
    const response = await fetch(
      "https://api.pexels.com/v1/search?query=nature&orientation=landscape&per_page=12",
      {
        headers: {
          Authorization:
            "GklaqEoUQnwItsosMnN7j545MRDy0Eh0uJi9mWI540CeFnMr4GBwsCkh" // Substitua pela sua chave de API Pexels
        }
      }
    );

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error("Erro ao buscar imagens do Pexels:", error);
    return [];
  }
}

function createPostsElement(item: Post): HTMLDivElement {
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

function redirectToPostPage(post: Post) {
  localStorage.setItem("selectedPost", JSON.stringify(post));
}

export function relatedPosts(posts: Post[]) {
  localStorage.setItem("relatedPosts", JSON.stringify(posts));
}

function allPostsStorage(posts: Post[]) {
  localStorage.setItem("allPosts", JSON.stringify(posts));
}

export function shuffleArray(array: Post[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showPosts(posts: Post[]): HTMLDivElement {
  const gridPosts = document.createElement("div");
  gridPosts.classList.add("grid-articles");
  posts.forEach((item) => {
    gridPosts.appendChild(createPostsElement(item));
  });
  return gridPosts;
}

async function createAndAppendPostsContent(): Promise<Post[]> {
  try {
    const posts = await fetchPosts();
    const pexelsImages = await fetchPexelsImages();

    const combinedObjects: Post[] = posts.map((post, index) => ({
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
  } catch (error) {
    console.error("Erro ao criar e inserir o conteúdo dos posts:", error);
    return [];
  }
}

const allRelatedPosts = createAndAppendPostsContent();
allRelatedPosts.then((posts) => {
  const shuffledPosts = shuffleArray(posts);
  relatedPosts(shuffledPosts.slice(0, 6));
});
