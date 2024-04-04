User FeedBack Sample with Laravel & React

	This project is a combination of Laravel and React, allowing users to perform authentication, signup, login, and submit feedback.

Getting Started

	To get started with this project, follow the instructions below.

	Prerequisites
	PHP (= 8.1)
	Composer
	Node.js (>= 14.x)
	npm


Installation

	1 - Clone the repository to your local machine:
	2 - Navigate to the project directory:
	3 - Install PHP dependencies using Composer:
		composer install
		npm install
		cp .env.example .env
		php artisan key:generate
		php artisan migrate --seed

Usage

	php artisan serve
	npm run dev


if any react dependency not installed please install these

	npm install
	npm install --save-dev @vitejs/plugin-react
	npm install react@latest react-dom@latest 
	npm install react-router-dom@6
	npm install axios