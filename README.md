# Little Lemon Food Ordering App
The application is a React Native Expo Food app.
Users will be capable of signing up on the Little Lemon restaurant app.
Users will have to go through a registration process.
Once they successfully complete that phase, they are redirected to a home screen.
Home screen will represent the landing screen after completing the onboarding flow, displaying a header, a banner with a search bar and a list of menu items where a user can filter each categories.
User can also customize their name, email, photo and and other user preferences through a Profile Screen.
Profile screen also contains four checkboxes enable specific email notifications, like order status, password changes,special offers, and newsletters.
Use AsyncStorage module to preserve the chosen preferences even when the user quits the application
When clicking the Logout button, user will redirect back to login page, clearing all data saved from Profile.
Use SQLite Database to populate, query and filter menu items.
## Overview
How to use the project
npm install && npm start
Then, a QR Code wil appear on your terminal.
On IOS Scan QR code through Camera app.
On Android : Scan QR code through Expo Go app.
You can also scan this QR CODE to view the project.
## Built with
React Native - React Native app built with expo
SQLite - For storing restaurant's menu items.
AsyncStorage - For storing user preferences.
StyleSheet - For styles
