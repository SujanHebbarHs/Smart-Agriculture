var a, b, c, d;
a = document.getElementById("one");
b = document.getElementById("two");
c = document.getElementById("three");
d = document.getElementById("four");
var r = document.getElementById("b1");
var s = document.getElementById("b2");
var b1=document.getElementById("b1");

//Registered Successfully Toast Message

window.addEventListener('load', function () {
  const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
 

  liveToast.show();
  

});

r.onclick = function ()
{
    d.classList.add("mover");
    a.classList.add("hide");
    a.classList.remove("show");
    c.classList.add("movel2");
    b.classList.add("hide");
    b.classList.remove("show");
    c.classList.remove("hide");
    c.classList.add("show");
    d.classList.remove("hide");
    d.classList.add("show");
}
s.onclick = function ()
{
    b.classList.add("mover2");
    c.classList.add("hide");
    c.classList.remove("show");
    a.classList.add("movel");
    d.classList.add("hide");
    d.classList.remove("show");
    b.classList.remove("hide");
    b.classList.add("show");
    a.classList.remove("hide");
    a.classList.add("show");
}




const loginForm = document.getElementById('login_form');

//Incorrect password while logging in.
const incorrectPassword = document.getElementById('incorrectPassword');
incorrectPassword.setAttribute('hidden', 'hidden');

loginForm.addEventListener('submit',async function (event) {
  event.preventDefault();
  const email = document.getElementById('login_email').value;
  const password = document.getElementById('login_password').value;
  
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email,password})
  });

  const data = await response.json();
  console.log(data);
  if(data.condition === true){
    console.log("one");
    if(data.privilege == true){
      console.log("Two");
      window.location.href = '/adminLogin'
    
    }
    else{

      window.location.href = '/home';

    }
  }
  else if (data.condition === false) {
    const message = data.msg;
    incorrectPassword.innerHTML = message;
    incorrectPassword.removeAttribute('hidden');
  }

});


// Function 2 to validate the password

const passwordInput = document.getElementById('register_password');
const confirmInput = document.getElementById('register_confirm_password');
const passwordPattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&+=]).*$/;
const passwordRequirementsModal = document.getElementById('passwordRequirementsModal');

const bankAcc = document.getElementById('bankAccountNumber');
const bankAccConfirm = document.getElementById('bankAccountNumberConfirm');
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const state = document.getElementById("selectState");
const address = document.getElementById("address");
// Get all radio buttons with the specified name
const radioButtons = document.querySelectorAll('input[name="role"]');



// Validate the password and confirm password when the form is submitted
document.getElementById('register-new-user').addEventListener('submit', async function (event) {

  event.preventDefault();

  let role = null;

  // Use for...of loop to iterate through the radio buttons
for (let radioButton of radioButtons) {
  console.log(radioButton.value + " oii");
    if (radioButton.checked) {
        role = radioButton.value;
        break; // Break the loop once a checked radio button is found
    }
}

console.log(role);

  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const isPasswordValid = passwordPattern.test(password);

  




  if (!isPasswordValid && password===confirm) {
    // Prevent form submission if the password doesn't meet the requirements
   
    document.getElementById('password_do_not_match').setAttribute('hidden', 'hidden');
    document.getElementById('password_hint').removeAttribute('hidden');
   
  } 

  // Password matches the regEx but do not match the confirm password
  else if(isPasswordValid && password!==confirm){
 
    document.getElementById('password_hint').setAttribute('hidden', 'hidden');
    document.getElementById('password_do_not_match').removeAttribute('hidden');
  }
  //Both case ie., do not match regEx as well as passwords do not match each other
  else if(!isPasswordValid && password!==confirm){
  
    document.getElementById('password_do_not_match').removeAttribute('hidden');
    document.getElementById('password_hint').removeAttribute('hidden');
  }
  //All case good
  else{
    document.getElementById('password_hint').setAttribute('hidden', 'hidden');
    document.getElementById('password_do_not_match').setAttribute('hidden', 'hidden');

    //Validate the bank account number

    const bankAccNum = bankAcc.value;
    const bankAccNumConfirm = bankAccConfirm.value;
    if(bankAccNum!==bankAccNumConfirm){
  
      document.getElementById('bank_account_do_not_match').removeAttribute('hidden');
    }
    else{
      document.getElementById('bank_account_do_not_match').setAttribute('hidden', 'hidden');

      const response2 = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
    
          name:fullName.value,
          email:email.value,
          password:passwordInput.value,
          cpassword:confirmInput.value,
          state:state.value,
          address:address.value,
          bankAcc:bankAcc.value,
          CbankAcc:bankAccConfirm.value,
          role,
    
        })
      });
      const data = await response2.json();
    
    
      if(data.condition == true){
    
        window.location.href = "/registerSuccess";
      }
    
      else if(data.condition == false){
    
      const liveErrorToast = new bootstrap.Toast(document.getElementById('liveErrorToast'));
      const errorToastMsg = document.getElementById("errorToastMsg");
      const errorMsg = data.msg;
      
      errorToastMsg.innerText = errorMsg;
      liveErrorToast.show();

    
      }

    }

    }

  


  

});



