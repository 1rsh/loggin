console.log("Content Script Succesfully Injected!")

var inlineScript = document.querySelectorAll("script")[6];
let scriptText = inlineScript.textContent;
let modifiedScript = scriptText.replace("alert(json.msg);", "");
modifiedScript = modifiedScript.replace("json", "");

inlineScript.textContent = modifiedScript;

var consoleLogHistory = [];

function interceptConsoleLog() {
  var originalConsoleLog = console.log;

  console.log = function() {
    var args = Array.from(arguments);
    consoleLogHistory.push(args);

    // Call the original console.log function
    originalConsoleLog.apply(console, args);
  };
}



function fetchFromErp(endpoint, user_id) {
  var xhr = new XMLHttpRequest();
  const requestURL = "https://erp.iitkgp.ac.in" + endpoint;
  xhr.open("POST", requestURL, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var formData = "user_id=" + encodeURIComponent(user_id);
  xhr.send(formData);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var responseText = xhr.responseText;
        var output = responseText;
      } else {
        console.error("Request failed with status:", xhr.status);
        var output = null;
      }
      chrome.storage.local.set({'savedQuestion': output}, () => {console.log("Saved Question: ", output);})
    }
    return output
  };
};








chrome.runtime.onMessage.addListener((msg, sender, response) => {
    var receivedCreds = msg.data;
    console.log(receivedCreds);
    // Process the received credentials as needed
    response("True");
    var userField = document.getElementById("user_id");
    const newValue = receivedCreds.rollNo;
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(userField, newValue);

    var ev2 = new Event('blur', { bubbles: true});
    userField.dispatchEvent(ev2);




    userField.value = receivedCreds.rollNo;
    document.querySelector("#password").value = receivedCreds.pwd;
    document.querySelector("#question").click();
    console.log('Waiting...');
    setTimeout(function () {
      var retrievedQuestion = document.querySelector("#question").textContent;
      console.log(retrievedQuestion);
      let answer;
      switch (retrievedQuestion){
        case receivedCreds.Q1:
          answer = receivedCreds.Q1A;
          break;
        
        case receivedCreds.Q2:
          answer = receivedCreds.Q2A;
          break;

        case receivedCreds.Q3:
          answer = receivedCreds.Q3A;
          break;
      }
      console.log(answer);
      document.querySelector("#answer").value= answer;
    }, 1000);


    

    
    document.querySelector("#getotp1").click();
    
    let otp;
    setTimeout(function () {
      console.log('Waiting...');
      otp = prompt("Please enter OTP: ");
      if(otp!=null){
        document.querySelector("#email_otp1").value = otp;
        document.querySelector("#loginFormSubmitButton").click();
        }
    }, 1000);
    
});