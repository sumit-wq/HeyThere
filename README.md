
HeyThere App
HeyThere is a mobile application that allows users to connect with people nearby through a user-friendly and intuitive interface. The app provides features for user registration, login, discovering nearby users on a Mapbox map, and chatting with them using the React Native Gifted Chat UI component. This README file provides detailed information about the HeyThere app, its features, and how to set it up and use it.

Features
The HeyThere app comes with the following features:

User Registration and Login: Users can create an account by registering with their mobile number and password. Existing users can log in with their credentials.

Nearby User Discovery: Once logged in, users can discover and connect with other nearby users using the app. The app utilizes location services to show users who are within a certain radius.

Filter: People with radius from 1km to 30km from top right filter Icon

User Profiles: Each user has a profile that displays their basic information, such as name, profile picture, and a short bio.

Chatting: Users can initiate conversations with other nearby users by sending text messages within the app.

Technologies Used
The HeyThere app is built using the following technologies:

React Native: The app's frontend is developed using React Native, a popular JavaScript framework for building cross-platform mobile applications.

Firebase: Firebase is used for backend services, including user authentication, real-time database for chat functionality, and cloud storage for user data.

Mapbox API: The app utilizes the Mapbox API and Mapbox React Native SDK to display a map with user locations.

React Navigation: Navigation within the app is implemented using React Navigation, allowing smooth navigation between screens.

Getting Started
To run the HeyThere app on your local machine, follow these steps:

1.) Clone the repository:
git clone https://github.com/your-username/HeyThere.git
cd HeyThere

2.) Install dependencies:
npm install

3.) Set up Firebase:
Create a new Firebase project at https://console.firebase.google.com/.
Enable Firebase Authentication and Realtime Database in the project settings.
Add your Android and iOS app configurations to the Firebase project.

4.) Add Firebase configuration to the app:

For Android: Download the google-services.json file from Firebase and place it in the android/app/ directory.
For iOS: Download the GoogleService-Info.plist file from Firebase and place it in the ios/ directory.

5.) Set up Mapbox:

Create a Mapbox account at https://www.mapbox.com/.
Obtain your Mapbox access token.
Add the Mapbox access token to the app configuration.

6.) Start the app:

For Android: Run npx react-native run-android.
For iOS: Run npx react-native run-ios.

7.) The app should open on your emulator or connected device, showing a map with nearby users' locations and providing the ability to chat with them.

Contributing
Contributions to the HeyThere app are welcome! If you find a bug or have a feature request, please create an issue on GitHub. If you'd like to contribute code, follow these steps:

Fork the repository and create a new branch.
Make your changes and commit them.
Push the changes to your forked repository.
Create a pull request to the main repository.

Contact
For any inquiries or support related to the HeyThere app, please contact:

Email: kumarsumit925@gmail.com


Acknowledgments
The HeyThere app is inspired by the idea of connecting people nearby and building meaningful relationships.
Special thanks to the open-source community for providing invaluable resources and tools.
