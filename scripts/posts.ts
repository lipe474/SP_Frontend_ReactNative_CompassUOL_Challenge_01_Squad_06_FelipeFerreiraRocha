import { Post } from "./mainPage";

function fillPostDetails() {
  const post = localStorage.getItem("selectedPost");
  const { title, body, image } = JSON.parse(post!);

  const postDetailsDiv = document.getElementById("text-content");

  const postTitleElement = document.createElement("h1");
  postTitleElement.textContent = title;

  const postImageElement = document.createElement("img");
  postImageElement.src = image!;
  postImageElement.alt = "Post Image";

  const postBodyElement = document.createElement("p");
  postBodyElement.textContent = body;

  postDetailsDiv!.appendChild(postTitleElement);
  postDetailsDiv!.appendChild(postImageElement);
  postDetailsDiv!.appendChild(postBodyElement);
}

function fillRelatedPosts() {
  const relatedPosts = localStorage.getItem("relatedPosts");
  const relatedPostsArray = JSON.parse(relatedPosts!);

  const relatedPostsDiv = document.getElementById("grid-articles");

  relatedPostsArray.forEach((post: any) => {
    const { title, image } = post;

    const relatedPostElement = document.createElement("div");
    relatedPostElement.classList.add("item");

    const relatedPostImageElement = document.createElement("img");
    relatedPostImageElement.classList.add("image-article");
    relatedPostImageElement.src = image!;
    relatedPostImageElement.alt = "Post Image";

    const relatedPostTitleElement = document.createElement("a");
    relatedPostTitleElement.classList.add("grid-text");
    relatedPostTitleElement.textContent = title;
    relatedPostTitleElement.href = `post.html`;

    relatedPostTitleElement.addEventListener("click", (event) => {
      event.preventDefault();
      redirectToRelatedPostPage(post);
      window.location.href = relatedPostTitleElement.href;
    });

    relatedPostElement.appendChild(relatedPostImageElement);
    relatedPostElement.appendChild(relatedPostTitleElement);

    relatedPostsDiv!.appendChild(relatedPostElement);
  });
}

function redirectToRelatedPostPage(post: Post) {
  localStorage.setItem("selectedPost", JSON.stringify(post));
}
export function shuffleArray2(array: Post[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateRelatedPosts() {
  const allPosts = localStorage.getItem("allPosts");
  const allPostsArray = JSON.parse(allPosts!);

  const relatedPosts = shuffleArray2(allPostsArray).slice(0, 6);
  localStorage.setItem("relatedPosts", JSON.stringify(relatedPosts));
}

fillPostDetails();
fillRelatedPosts();
updateRelatedPosts();
