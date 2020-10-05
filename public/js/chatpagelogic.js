// var currentContact,
//     contact = "User",
//     userImageCB = "https://img.icons8.com/clouds/50/000000/user.png";

// // ============== Structure I am Following=============
// // alert("connected");

// // Contact_details = {
// //     id,
// //     Chats = {
// //     sender("user","contact"),
// //     message
// // }
// // }
// Contacts = new Array;



// //icons array for randomizing the functions
// icons = ["https://img.icons8.com/bubbles/50/000000/user-male.png",
//     "https://img.icons8.com/clouds/50/000000/user-male.png",
//     "https://img.icons8.com/clouds/50/000000/user.png",
//     "https://img.icons8.com/bubbles/50/000000/user.png"
// ]



// // =====================================Functions Start from here=====================

// // Some Random Fun Stuff
// //it randomizes the icon of the Chats Array 
// // ie give random icons to chats and is called only once in a session
// $("#chat_names_ul li").each(function(list) { //Called AutoMaticly
//     // console.log($(this).attr("id"));
//     chang = $(this).attr("id");
//     numm = Math.floor(Math.random() * Math.floor(4));
//     $("#" + chang + " img").prop("src", icons[numm]);
//     Contacts.push({ id: chang, Chats: new Array });
// });



// ////////////function to create the chats in the chat box/////////////////
// // it takes the id of the selected user 
// // called from ul click 
// function Chat_contact(currentContact) {
//     if (currentContact) {
//         $("#chat_window_ul").html(" ");
//     }
//     Contacts.forEach(contact => {
//         if (currentContact === contact.id) {
//             if (contact.Chats) {
//                 contactImageCB = $("#" + contact.id + " img").attr("src");
//                 contact.Chats.forEach(chats => {
//                     if (chats.sender === "user") {
//                         $("#chat_window_ul").append("<li class='user_message'><span>" + chats.message + "</span> <img src=" + userImageCB + " /></li>");
//                     } else {
//                         $("#chat_window_ul").append("<li class='contact_message'> <img src=" + contactImageCB + "/> <span>" + chats.message + " </li>");
//                     }
//                 });
//             }
//         }
//     });
// };




// ////////////////Function to Highlight the Selected Chat 
// // ////////////and Pass its id to display chat in the chat box
// $("#chat_names_ul").on("click", "li", function() {
//     currentContact = $(this).attr("id");
//     $("#chat_names_ul li").each(function(list) {
//         $(this).removeClass("active"); // this first remove the css class from every contact
//     });
//     $(this).addClass("active"); // this adds the css class to the active contact
//     Chat_contact(currentContact);
// });




// // ///////////////function to send the chat
// $("#send_button").click(function() {
//     var inn = $("#input_message").val();
//     $("#input_message").val("");
//     if (currentContact) {
//         $("#chat_window_ul").append("<li class='user_message'><span>" + inn + "</span> <img src=" + userImageCB + " /></li>");
//         Contacts.forEach(function(contact) {
//             if (contact.id === currentContact) {
//                 contact.Chats.push({ sender: "user", message: inn });
//                 // Call the Function to Encrypt the message
//                 // ===========write your Socket function here 
//                 //  the message is in the variable "inn"
//             }
//         });

//     }
// });

// const socket = io();
// console.log(user);






// // ///////////// function to Recieve Message
// //////========Call this function when a message is recieved and DECRYPTED
// // function will append to the list locally maintained and if the chat window 
// // of the same user is active will show in the chat_window
// // will also change the last recieved message of the contact
// // if the message is recieved from a new user then the user is added to the list
// function Appendmessage(id, message) {
//     var found = false;
//     Contacts.forEach(function(contact) {
//         if (contact.id === id) {
//             found = true;
//             contact.Chats.push({ sender: "contact", message: message });
//             $("#" + id + " span").eq(1).html(message);
//             if (currentContact === id) {
//                 Chat_contact(currentContact);
//             }
//         }
//     });
//     if (found === false) {
//         Contacts.push({ id: id, Chats: new Array });
//         $("#chat_names_ul").append(
//             "<li id=" + id + "><img src=" + icons[Math.floor(Math.random() * Math.floor(4))] + " <span class='chat_contacts'></span>" +
//             id + "<span> <br>" + message + "</span><hr>");
//     }
// }

// // ============================Function for Adding A new User============
// $("#basic-addon1").click(function() {
//     // send a request to server to check is the user exits
//     // if the user exists  execute the below function///
//     ///// Add an alert Statement///
//     alert("Enter Username is Invalid");

//     Appendmessage($("#basic-addon1_input").val(), "Start Chatting");
//     $("#basic-addon1_input").val("");

// });








// // ////////============testing Function
// Appendmessage("Tushar", "how do you do");