import { Comment, Post } from "./mainPage";

function fillPostDetails() {
  const post = localStorage.getItem("selectedPost");
  const postParse = JSON.parse(post!);

  const postDetailsDiv = document.getElementById("text-content");

  const postTitleElement = document.createElement("h1");
  postTitleElement.textContent = postParse.title;

  const postImageElement = document.createElement("img");
  postImageElement.src = postParse.image!;
  postImageElement.alt = "Post Image";

  const postBodyElement = document.createElement("p");
  postBodyElement.textContent = postParse.body;

  const commentsContainer = document.getElementById("comments-container");

  postParse.comments.forEach((comment: Comment) => {
    const { name, email, body } = comment;

    const commentElement = document.createElement("div");
    commentElement.id = "name-email";

    const nameElement = document.createElement("p");
    nameElement.id = "comment-name";
    nameElement.textContent = name;

    const emailElement = document.createElement("p");
    emailElement.id = "comment-email";
    emailElement.textContent = email;

    const bodyElement = document.createElement("p");
    bodyElement.id = "comment-body";
    bodyElement.textContent = body;

    commentElement.appendChild(nameElement);
    commentElement.appendChild(emailElement);

    commentsContainer!.appendChild(commentElement);
    commentsContainer!.appendChild(bodyElement);
  });

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
