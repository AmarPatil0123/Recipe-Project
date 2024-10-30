  //follow and Unfollow functionality

  let followBtn = document.querySelector(".follow");
  let ownerId = followBtn.getAttribute("ownerId")
  
  followBtn.addEventListener("click", ()=>{
    if(followBtn.innerHTML === "Follow"){
      followBtn.innerHTML = "Unfollow";
  
      fetch(`http://localhost:8080/follow/${ownerId}`)
      .then((response)=> response.json()).then((data)=>console.log(data)).catch((err)=>console.log(err))
      
    }else{
      followBtn.innerHTML = "Follow";
      fetch(`http://localhost:8080/unfollow/${ownerId}`)
      .then((response)=> response.json()).then((data)=>console.log(data)).catch((err)=>console.log(err))
      
    }
  })



// Like and Dislike

let like = document.querySelector(".like");
let dislike = document.querySelector(".dislike");

let likeCountElement = document.querySelector(".likeCount");
let dislikeCountElement = document.querySelector(".dislikeCount");

let likedRecipe = like.getAttribute("recipeId");
let dislikedRecipe = dislike.getAttribute("recipeId");

let recipeLikedUser = like.getAttribute("recipeLikedUser");
let recipeDislikedUser = dislike.getAttribute("recipeDislikedUser");

like.addEventListener("click", () => {
  like.style.pointerEvents = "none";
  dislike.style.pointerEvents = "none";

  fetch(`http://localhost:8080/like/${likedRecipe}/${recipeLikedUser}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      like.classList.replace("fa-regular", "fa-solid");
      dislike.classList.replace("fa-solid", "fa-regular");

      likeCountElement.innerHTML = Number(likeCountElement.innerHTML) + 1;

      if (Number(dislikeCountElement.innerHTML) > 0) {
        dislikeCountElement.innerHTML = Number(dislikeCountElement.innerHTML) - 1;
      }

      dislike.style.pointerEvents = "auto";
    })
    .catch((err) => {
      console.log(err);
      like.style.pointerEvents = "auto";
      dislike.style.pointerEvents = "auto";
    });
});

dislike.addEventListener("click", () => {
  like.style.pointerEvents = "none";
  dislike.style.pointerEvents = "none";

  fetch(`http://localhost:8080/dislike/${dislikedRecipe}/${recipeDislikedUser}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      dislike.classList.replace("fa-regular", "fa-solid");
      like.classList.replace("fa-solid", "fa-regular");

      dislikeCountElement.innerHTML = Number(dislikeCountElement.innerHTML) + 1;

      if (Number(likeCountElement.innerHTML) > 0) {
        likeCountElement.innerHTML = Number(likeCountElement.innerHTML) - 1;
      }

      like.style.pointerEvents = "auto";
    })
    .catch((err) => {
      console.log(err);
      like.style.pointerEvents = "auto";
      dislike.style.pointerEvents = "auto";
    });
});
