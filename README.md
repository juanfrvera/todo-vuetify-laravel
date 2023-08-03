# The Laravel project uses Sanctum to protect the routes

# The laravel backend was made with php 8.1 and composer, you will need those installed in order to run the application.
# You need to have XML, Curl, php-mbstring extensions enabled in php
To run the laravel server you need to run the following commands:
# 1. Go to the server's root folder:
`cd ./todo-laravel`

# 2. Connect your database: for this you need to enter the URL and credentials  in the `.env` file at the root of ./todo-laravel

# 3 Once the db is connected, run the migrations so the starting tables are created:
`php artisan migrate`

# 4 Run the server
`php artisan serve`

# This Laravel api uses a postgres database so you will need a postgres driver in order to access and run commands on it,
# I recommend installing it with: sudo apt-get install php8.1-pgsql
# You can change the version of php if you use another different than 8.1


# To run the frontend you need to use Node 18, and then run the following commands
# 1. Go to the frontend's root folder:
`cd ./todo-vuetify`
# 2. If you didn't installed the dependencies yet, install them:
`npm install`
# 3. Start the frontend
`npm run dev`