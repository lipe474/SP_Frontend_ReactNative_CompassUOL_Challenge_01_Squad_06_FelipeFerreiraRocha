interface Post {
  id: number;
  title: string;
  body: string;
  image: string;
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    return posts.slice(0, 12);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
}

async function fetchPexelsImages(): Promise<any[]> {
  try {
    const response = await fetch(
      'https://api.pexels.com/v1/search?query=nature&orientation=landscape&per_page=12',
      {
        headers: {
          Authorization:
            'GklaqEoUQnwItsosMnN7j545MRDy0Eh0uJi9mWI540CeFnMr4GBwsCkh' // Substitua pela sua chave de API Pexels
        }
      }
    );

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Erro ao buscar imagens do Pexels:', error);
    return [];
  }
}

function createPostsElement(item: Post): HTMLDivElement {
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

function redirectToPostPage(post: Post) {
  localStorage.setItem('selectedPost', JSON.stringify(post));
  window.location.href = 'post.html';
}

function showPosts(posts: Post[]): HTMLDivElement {
  const gridPosts = document.createElement('div');
  gridPosts.classList.add('grid-articles');
  posts.forEach((item) => {
    gridPosts.appendChild(createPostsElement(item));
  });
  return gridPosts;
}

async function createAndAppendPostsContent(): Promise<void> {
  try {
    const posts = await fetchPosts();
    const pexelsImages = await fetchPexelsImages();

    const combinedObjects: Post[] = posts.map((post, index) => ({
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
  } catch (error) {
    console.error('Erro ao criar e inserir o conteúdo dos posts:', error);
  }
}

createAndAppendPostsContent();
