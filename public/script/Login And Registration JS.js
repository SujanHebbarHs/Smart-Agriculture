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




/* Function 1 to validate the password

// Function to validate the password
function validatePassword() {
  const password = document.getElementById('register_password').value;
  const confirmPassword = document.getElementById('register_confirm_password').value;


  // Check if the password matches the confirmed password
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
  }

  // Password is valid
  return true;
}

// Add an event listener to the form to validate the password on submission
const form = document.getElementById('register-new-user'); // Replace 'your-form-id' with your actual form's ID
form.addEventListener('submit', function (event) {
  if (!validatePassword()) {
    event.preventDefault(); // Prevent form submission if the password is not valid
  }
});

*/



// Function 2 to validate the password

const passwordInput = document.getElementById('register_password');
const confirmInput = document.getElementById('register_confirm_password');
const passwordPattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&+=]).*$/;


// Add an event listener to the password input field for checking the password as you type
passwordInput.addEventListener('input', function () {
  const password = passwordInput.value;
  const isPasswordValid = passwordPattern.test(password);
  console.log(password)
  console.log(isPasswordValid)
  // Optionally, you can display a message to the user
  if (!isPasswordValid) {
    // Replace 'passwordMessage' with the ID of the HTML element where you want to display the message
    passwordRequirementsModal.show(); // Show the modal
  } else {
    passwordRequirementsModal.hide(); // Hide the modal
  }
});

// Validate the password and confirm password when the form is submitted
document.getElementById('register-new-user').addEventListener('submit', function (event) {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const isPasswordValid = passwordPattern.test(password);

  if (!isPasswordValid) {
    // Prevent form submission if the password doesn't meet the requirements
    event.preventDefault();
    document.getElementById('register_password').textContent = 'Password requirements not met.';
  } else if (password !== confirm) {
    // Prevent form submission if password and confirm password don't match
    event.preventDefault();
    document.getElementById('register_password').textContent = 'Passwords do not match.';
  }
});



