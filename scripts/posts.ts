function fillPostDetails() {
  const post = localStorage.getItem('selectedPost');
  const { title, body, image } = JSON.parse(post!);

  const postDetailsDiv = document.getElementById('text-content');

  const postTitleElement = document.createElement('h1');
  postTitleElement.textContent = title;

  const postImageElement = document.createElement('img');
  postImageElement.src = image!;
  postImageElement.alt = 'Post Image';

  const postBodyElement = document.createElement('p');
  postBodyElement.textContent = body;

  postDetailsDiv!.appendChild(postTitleElement);
  postDetailsDiv!.appendChild(postImageElement);
  postDetailsDiv!.appendChild(postBodyElement);
}

fillPostDetails();
