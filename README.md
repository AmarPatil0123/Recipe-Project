Recipe Blog Project


Table of Contents :
Project Overview
Features
Installation
Usage
Technologies Used
Schema Overview
Contributing
License
Project Overview
The Recipe Blog Project is a user-friendly platform for food enthusiasts to discover, create, and share recipes. Users can create an account to upload their own recipes with detailed instructions and images, browse recipes from other users, save favorites, and follow others to see recommended content.

Features
User Authentication: Secure registration, login, and logout.
Recipe Creation: Users can post recipes with images, ingredients, and step-by-step instructions.
Recipe Search and Filtering: Search for recipes by category, ingredient, or other criteria.
Social Interaction: Follow/unfollow other users, view their recipes, and leave reviews.
Favorites: Save recipes to a favorites list for easy access.
Recommendations: Discover new recipes based on liked content, followers’ activity, and past interactions.
Installation
To set up the project locally, follow these steps:

Clone the Repository:

bash
Copy code
git clone https://github.com/username/repo-name.git
cd repo-name
Install Dependencies:

bash
Copy code
npm install
Set Up Environment Variables: Create a .env file in the root directory with the following variables:

plaintext
Copy code
DATABASE_URI=your_mongo_database_uri
SESSION_SECRET=your_secret_key
Start the Development Server:

bash
Copy code
npm start
The app should now be running on http://localhost:3000.

Usage
Once the app is running:

Register or Log in to access all features.
Create a Recipe: Add a new recipe with a title, description, ingredients, and images.
Browse Recipes: Search recipes by keyword, category, or ingredient.
Save Favorites: Save recipes you like for quick access later.
Follow Users: Follow other food enthusiasts to see their latest recipes and recommendations.
Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express
Database: MongoDB
Authentication: Passport.js
Rich Text Editor: TinyMCE for recipe instructions
Image Upload: Multer for handling image uploads
Schema Overview
Here’s a quick overview of the main data models used in the project:

User Model:

name: String, required
email: String, required, unique
password: String, required
profile_image: String, optional
saved_recipes: Array of recipe references (IDs)
Recipe Model:

title: String, required
description: Text, optional
ingredients: Array of strings
steps: Array of strings
image: String, optional (URL or path to uploaded image)
created_by: Reference to User
category: String
Review Model:

rating: Number, required
comment: Text
user: Reference to User
recipe: Reference to Recipe
Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch-name).
Make your changes and commit them (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch-name).
Open a pull request and describe the changes you made.
License
This project is licensed under the MIT License. See the LICENSE file for details.
