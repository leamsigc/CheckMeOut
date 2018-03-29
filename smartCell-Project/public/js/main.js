window.addEventListener("DOMContentLoaded", function() {
  console.log("content loaded ....");

  const menu = document.querySelector("nav"),
        menuToggle = document.querySelector(".menu_toggle");

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  const form = document.querySelector("#form");
  form.addEventListener("submit",submitForm);
});

//submit form 
function submitForm(e){
    //prevent default
    e.preventDefault();
    
    //get all the values from the form 
    const name = document.querySelector('#name').value,
    email = document.querySelector('#email').value,
    phone = document.querySelector('#phone').value,
    message = document.querySelector('#message').value,
    captcha = document.querySelector('#g-recaptcha-response').value;
    
    console.log(`name:${name} email:${email} phone:${phone} msg:${message}`);
    
    if(!name || !email || !phone || !message ){
        alertMessage('red','Please fill all the field please ',2000);
        return false;
    }

    //fetch to end point
    fetch('/send',{
        method:'POST',
        headers:{
            'Accept':'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body:JSON.stringify({
            name:name,
            email:email,
            phone:phone,
            message:message,
            captcha:captcha
        })
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
        if(data.success === false){
            alertMessage('red',data.msg,2000);
        }
        else {
            //reset all the form values
            alertMessage('green',data.msg,9000);
        }
    });
    document.querySelector('#name').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#phone').value = '';
    document.querySelector('#message').value = '';
    document.querySelector('#g-recaptcha-response').value = '';
    
}
//custom error
function alertMessage(color, msg,time) {
  const parentElement = document.querySelector("#form");
  const beforeElement = document.querySelector(
    "#form > fieldset:first-of-type"
  );
  let div = document.createElement("div");
  div.className = "alert";
  div.style.background = color;

  div.appendChild(document.createTextNode(msg));
  parentElement.insertBefore(div, beforeElement);
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, time);
}
