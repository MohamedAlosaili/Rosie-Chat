# Rosie Chat


### Description 

Rosie Chat is a fullstack web application that allow users to create accounts 

and send/receive messages (text, images, videos) in a group or private chats.


### Motivation
I built this app to put the concepts that I have learned in Reactjs & Firebase into an actual project


### Application Stack:
> Fronend

 - [Reactjs](https://reactjs.org/)

 - [Tailwindcss](https://tailwindcss.com/)

 - [Framer-motion](https://www.framer.com/motion/)

> Backend

 - [Firebase](https://console.firebase.google.com/u/2/)


### App Features
- Auth users and signin/signup
- Authenticate with Google accounts
- Verify accounts using email
- Create private and group chats
- Send images and videos
- Light and Dark modes


### Run project locally
Node => v18.12.1 

NPM => v8.19.2

If you haven't had node installed in your machine install it from [here](https://nodejs.org/en/) then follow these steps:

1 - Create a project in [Firebase console](https://console.firebase.google.com/u/2/)

2 - After creating a project, from the left side navigator click the gear icon next to 'Project Overview' 
    then go to the general tab, scroll down to the bottom, and copy the `firebaseConfig` object  

3 - Next create `firebaseConfig.js` file in `src/rosie-firebase` directory and paste the `firebaseConfig` as a default export
```
export default {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
}
```

4 - Instal the dependencies 

``` 
npm install 
```

5 - Run the server 

```
npm run dev
```