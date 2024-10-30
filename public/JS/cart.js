const favoriteClcik = document.getElementById("favourite");

favoriteClcik.addEventListener("click", ()=>{
  sendFavorites();
})

const favRecipes = document.querySelectorAll(".fav");
const arr = [];


for (let i = 0; i < localStorage.length; i++) {
  const recipeId = localStorage.key(i);
  arr.push(recipeId); 
}


favRecipes.forEach((favRecipeIcon) => {
  const recipeId = favRecipeIcon.getAttribute("data-id");

  if (localStorage.getItem(recipeId)) {
    favRecipeIcon.style.color = "red"; 
  }


  favRecipeIcon.addEventListener("click", () => {
    if (localStorage.getItem(recipeId) === "true") {
      return; 
    }

    localStorage.setItem(recipeId, "true");
    favRecipeIcon.style.color = "red";
    arr.push(recipeId); 
    
  });
});


const sendFavorites = async () => {
  try {
    const response = await fetch("https://yammyrecipes.onrender.com/favourateRecipes", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ arr }), // Send updated array
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log("Data sent to backend:", data.message);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Handling removal of favorites

const removeFavourate = document.querySelectorAll(".removeFav");

removeFavourate.forEach((recipe) => {
  const recipeId = recipe.getAttribute("data-id");

  recipe.addEventListener("click", () => {

    localStorage.removeItem(recipeId);

    const index = arr.indexOf(recipeId);
    if (index > -1) {
      arr.splice(index, 1); 
    }

    recipe.closest('.card-container').remove();

    sendFavorites();
  });
});


