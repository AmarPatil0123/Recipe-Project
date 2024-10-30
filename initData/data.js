const recipeData = [
    {
        title: "Cheesy Scrambled Eggs",
        description: "Creamy scrambled eggs with melted cheese for a quick breakfast.",
        ingredients: [
            "4 large eggs",
            "1/4 cup shredded cheddar cheese",
            "1 tablespoon butter",
            "1/4 teaspoon salt",
            "1/8 teaspoon black pepper"
        ],
        steps: [
            "Crack the eggs into a bowl and whisk with salt and pepper.",
            "Melt butter in a non-stick pan over medium heat.",
            "Pour the eggs into the pan and cook, stirring gently.",
            "When eggs are almost set, add the cheese and stir until melted.",
            "Serve immediately."
        ],
        category: "Breakfast",
        image: "https://media.istockphoto.com/id/174864655/photo/scrambled-egg-with-sausage.jpg?s=2048x2048&w=is&k=20&c=yqKI-9AjJdDI8mM8ZlFOkDkfNSLQOv5iBs8EG2SxQPo="
    },
    {
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta dish with bacon, eggs, and cheese.",
        ingredients: [
            "200g spaghetti",
            "100g pancetta",
            "2 large eggs",
            "1/2 cup grated Parmesan cheese",
            "2 garlic cloves, minced",
            "Salt and pepper to taste"
        ],
        steps: [
            "Cook spaghetti in salted water according to package instructions.",
            "Fry pancetta and garlic in a pan until crispy.",
            "In a bowl, whisk together eggs and Parmesan cheese.",
            "Drain pasta and toss with pancetta.",
            "Remove from heat, add egg mixture, and stir quickly to combine.",
            "Season with salt and pepper, then serve."
        ],
        category: "Dinner",
        image: "https://media.istockphoto.com/id/177413384/photo/pasta-with-carbonara.jpg?s=2048x2048&w=is&k=20&c=vfdvbZauI67q5kd5wGm8YQ1mpOKuX2hFlz1TbXwV_Xo="
    },
    {
        title: "Grilled Cheese Sandwich",
        description: "Crispy, golden bread with gooey melted cheese inside.",
        ingredients: [
            "2 slices of bread",
            "2 tablespoons butter",
            "2 slices of cheddar cheese"
        ],
        steps: [
            "Butter one side of each bread slice.",
            "Place one slice, butter side down, in a skillet over medium heat.",
            "Add the cheese on top and cover with the other bread slice, butter side up.",
            "Cook until the bread is golden and the cheese is melted, flipping once.",
            "Slice and serve."
        ],
        category: "Lunch",
        image: "https://media.istockphoto.com/id/1308448664/photo/grilled-cheese-spinach-and-tomato-sandwich-on-concrete-background.jpg?s=2048x2048&w=is&k=20&c=CocZsDn7oIhEHqrpQ_t7swyJl97Y0Ouie6T4s68Mfu4="
    },
    {
        title: "Chicken Caesar Salad",
        description: "Crisp romaine lettuce with grilled chicken, Parmesan, and Caesar dressing.",
        ingredients: [
            "2 cups romaine lettuce, chopped",
            "1 grilled chicken breast, sliced",
            "1/4 cup grated Parmesan cheese",
            "1/2 cup Caesar dressing",
            "1/4 cup croutons"
        ],
        steps: [
            "In a large bowl, toss lettuce with Caesar dressing.",
            "Top with grilled chicken, Parmesan cheese, and croutons.",
            "Serve immediately."
        ],
        category: "Lunch",
        image: "https://media.istockphoto.com/id/169986941/photo/chicken-salad.jpg?s=2048x2048&w=is&k=20&c=jWts2m-IHdzjz8c8CRGZBv30M9emq6ARPGLmUcimZ-8="
    },
    {
        title: "Chocolate Chip Cookies",
        description: "Classic cookies with a crispy edge and gooey center.",
        ingredients: [
            "1 cup butter, softened",
            "1 cup white sugar",
            "1 cup brown sugar",
            "2 large eggs",
            "2 teaspoons vanilla extract",
            "3 cups all-purpose flour",
            "1 teaspoon baking soda",
            "2 cups chocolate chips"
        ],
        steps: [
            "Preheat the oven to 350°F (175°C).",
            "Cream together butter, white sugar, and brown sugar.",
            "Beat in the eggs and vanilla extract.",
            "Stir in flour and baking soda until just combined.",
            "Fold in the chocolate chips.",
            "Drop by spoonfuls onto a baking sheet and bake for 10-12 minutes.",
            "Cool on a wire rack and enjoy."
        ],
        category: "Dessert",
        image: "https://media.istockphoto.com/id/905563616/photo/preparing-chocolate-chip-cookies.jpg?s=2048x2048&w=is&k=20&c=OL02rm4f66nCml2OmkbuUo6HfGMa5I9fKXXpHZlg4So="
    },
    {
        title: "Banana Smoothie",
        description: "A refreshing smoothie made with ripe bananas and milk.",
        ingredients: [
            "2 ripe bananas",
            "1 cup milk",
            "1 tablespoon honey",
            "1/4 teaspoon cinnamon",
            "1/2 cup ice cubes"
        ],
        steps: [
            "Add all ingredients to a blender.",
            "Blend until smooth.",
            "Pour into a glass and serve immediately."
        ],
        category: "Beverage",
        image: "https://media.istockphoto.com/id/505295890/photo/papaya-strawberry-banana-smoothie.jpg?s=2048x2048&w=is&k=20&c=ug03F1HE5YCwUUhAZDQmIjOEjV2Hiq7nefDFTMdY0u0="
    },
    {
        title: "Tomato Basil Soup",
        description: "Smooth tomato soup with fresh basil and a hint of garlic.",
        ingredients: [
            "4 large tomatoes, chopped",
            "1/4 cup fresh basil leaves",
            "1 onion, diced",
            "2 garlic cloves, minced",
            "2 cups vegetable broth",
            "Salt and pepper to taste"
        ],
        steps: [
            "In a large pot, sauté onions and garlic until softened.",
            "Add tomatoes and vegetable broth, and bring to a simmer.",
            "Cook for 15 minutes, then blend until smooth.",
            "Stir in fresh basil and season with salt and pepper.",
            "Serve hot."
        ],
        category: "Soup",
        image: "https://media.istockphoto.com/id/1201090615/photo/tomato-soup-with-basil-in-a-bowl.jpg?s=2048x2048&w=is&k=20&c=h1sgeWWOOsuCL9ih-OuWFZMCHq46n20Az5co56k3Zw0="
    },
    {
        title: "Garlic Butter Shrimp",
        description: "Juicy shrimp cooked in garlic butter, perfect for a quick dinner.",
        ingredients: [
            "500g shrimp, peeled and deveined",
            "3 tablespoons butter",
            "4 garlic cloves, minced",
            "1 tablespoon lemon juice",
            "1/4 teaspoon red pepper flakes",
            "Salt and pepper to taste"
        ],
        steps: [
            "Melt butter in a skillet over medium heat.",
            "Add garlic and cook until fragrant.",
            "Add shrimp and cook until pink and opaque.",
            "Stir in lemon juice and red pepper flakes.",
            "Season with salt and pepper, then serve."
        ],
        category: "Dinner",
        image: "https://media.istockphoto.com/id/155353180/photo/shrimp-scampi.jpg?s=2048x2048&w=is&k=20&c=4wTEaI7QAhUUlIms__n7tvlxTH3w3OkKjR4ngoPOWoM="
    },
    {
        title: "Greek Yogurt Parfait",
        description: "Layered Greek yogurt with fresh berries and granola.",
        ingredients: [
            "1 cup Greek yogurt",
            "1/2 cup mixed berries",
            "1/4 cup granola",
            "1 tablespoon honey"
        ],
        steps: [
            "In a serving glass, layer half of the yogurt, followed by berries and granola.",
            "Repeat the layers and drizzle with honey on top.",
            "Serve immediately."
        ],
        category: "Breakfast",
        image: "https://media.istockphoto.com/id/1159838603/photo/strawberry-and-blueberry-perfect-against-a-white-wood-background.jpg?s=2048x2048&w=is&k=20&c=78TVP0d8jq3mG9soBy_v6ttSQ__ugSzogB34lxvbkA0="
    },
    {
        title: "Veggie Stir Fry",
        description: "Quick and healthy stir fry with a variety of fresh vegetables.",
        ingredients: [
            "1 cup broccoli florets",
            "1 red bell pepper, sliced",
            "1 zucchini, sliced",
            "2 carrots, julienned",
            "2 tablespoons soy sauce",
            "1 tablespoon sesame oil",
            "2 garlic cloves, minced"
        ],
        steps: [
            "Heat sesame oil in a large pan over medium heat.",
            "Add garlic and stir until fragrant.",
            "Add the vegetables and stir-fry for 5-7 minutes until tender-crisp.",
            "Stir in soy sauce and cook for another minute.",
            "Serve hot with rice or noodles."
        ],
        category: "Dinner",
        image: "https://media.istockphoto.com/id/584747904/photo/stir-fried-vegetables.jpg?s=2048x2048&w=is&k=20&c=Rj6eti7PAL3sygxD8x4XOu1puDf71GrPlbNTkl1Yy9E="
    }
]

module.exports={data:recipeData};