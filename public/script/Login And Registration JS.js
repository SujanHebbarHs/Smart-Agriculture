var a, b, c, d;
a = document.getElementById("one");
b = document.getElementById("two");
c = document.getElementById("three");
d = document.getElementById("four");
var r = document.getElementById("b1");
var s = document.getElementById("b2");
var b1=document.getElementById("b1");


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








// Function 2 to validate the password

const passwordInput = document.getElementById('register_password');
const confirmInput = document.getElementById('register_confirm_password');
const passwordPattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&+=]).*$/;
const passwordRequirementsModal = document.getElementById('passwordRequirementsModal');




// Validate the password and confirm password when the form is submitted
document.getElementById('register-new-user').addEventListener('submit', function (event) {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const isPasswordValid = passwordPattern.test(password);

  if (!isPasswordValid && password===confirm) {
    // Prevent form submission if the password doesn't meet the requirements
    event.preventDefault();
    document.getElementById('password_do_not_match').setAttribute('hidden', 'hidden');
    document.getElementById('password_hint').removeAttribute('hidden');
   
  } 

  // Password matches the regEx but do not match the confirm password
  else if(isPasswordValid && password!==confirm){
    event.preventDefault();
    document.getElementById('password_hint').setAttribute('hidden', 'hidden');
    document.getElementById('password_do_not_match').removeAttribute('hidden');
  }
  //Both case ie., do not match regEx as well as passwords do not match each other
  else if(!isPasswordValid && password!==confirm){
    event.preventDefault();
    document.getElementById('password_do_not_match').removeAttribute('hidden');
    document.getElementById('password_hint').removeAttribute('hidden');
  }
  //All case good
  else{
    document.getElementById('password_hint').setAttribute('hidden', 'hidden');
    document.getElementById('password_do_not_match').setAttribute('hidden', 'hidden');
  }
 
});



