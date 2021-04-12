

<br>
<p align="center">
  <h1>FLOAT CHAT</h1>

  <p align="center">
    An end-to-end encrypted web based chat application.
    <br>
    <a href="https://afternoon-cove-76712.herokuapp.com//">Check it out</a>
    
  </p>
</p>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- <p align="center"> 
    <img src="assets/images/bot_1.jpeg"  width="1000">
</p>
<br><br>
<p align="center"> 
    <img src="assets/images/bot_2.jpeg"  width="1000">
</p> -->

### What is FLOAT CHAT ?
It is a web based, end-to-end encrypted chat application to let users chat one-to-one securely.

### How it works
1) The message exchange takes place using Socket.io

2) A private, public key pair is generated for each user on login/signup. Private key is stored locally for the session and public key is published on the Virgil Cloud. 

3) The users communicate with the Virgil Cloud securely using a virgil jwt token, generated during login/signup.

4) The message is encrypted using reciever's public key and signed using sender's private key. Decryption takes place using reciever's private key and sender's public key.

### Features
1) One-to-one chat.

2) End-to-end encrypted.

3) User friendly UI

4) Easy to use.

### Built With

* [Node.js](https://nodejs.org/en/)
* [Socket.io](https://socket.io/)
* [Virgil Security SDK](https://virgilsecurity.com/)

## Instructions To Run Locally
You should have Node and npm installed (installed together).

- Clone the repository.
- 



## Contributors
1) [Ritik Kumar](https://github.com/iamr-kumar)
2) [Muskan Agarwal](https://github.com/muskan278) 
3) [Tushar Agarwal](https://github.com/TusharYaar)



