document.addEventListener("DOMContentLoaded", function() {
  // let logIn = document.getElementById('logIn');
  let saveCreds = document.getElementById('saveCreds');
  rollNo = document.getElementById('rollNo');
  pwd = document.getElementById('pwd');
  Q1 = document.getElementById('Q1');
  Q1A = document.getElementById('Q1A');
  Q2 = document.getElementById('Q2');
  Q2A = document.getElementById('Q2A');
  Q3 = document.getElementById('Q3');
  Q3A = document.getElementById('Q3A');
  AtKGP = document.getElementById('atkgp');
  console.log(AtKGP.checked);;

  

  const form = document.getElementById('myForm');

  var setQuestions = false;

  function getSecurityQuestion(){
    var request = new XMLHttpRequest();
    request.open("POST", "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    chrome.storage.local.get(['rollNo'], (result=>{

                var formData = "user_id=" + encodeURIComponent(result.rollNo);

                request.send(formData);
                request.onreadystatechange = function() {
                  if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status) {
                      var responseText = request.responseText;
                      // getSecurityQuestion.question = responseText;
                      chrome.storage.local.set({"tempQues": responseText});
                    } else {
                      console.error("Request failed with status:", request.status);
                      chrome.storage.local.set({"tempQues": -1});
                      // getSecurityQuestion.question = -1;
                    }
                  }
                };
              }));


  }



  function getAllSecurityQuestions() {
    var questions = [];
  
    function makeRequest() {
      var request = new XMLHttpRequest();
      request.open("POST", "https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm", true);
      request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['rollNo'], (result) => {
          var formData = "user_id=" + encodeURIComponent(result.rollNo);
          request.send(formData);
          request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                var responseText = request.responseText.trim();
                resolve(responseText);
              } else {
                reject(new Error("Request failed with status: " + request.status));
              }
            }
          };
        });
      });
    }
  
    function processResponse(response) {
      var distinctQuestions = response.split('\n').filter((question) => {
        return question.trim().length > 0 && !questions.includes(question);
      });
  
      questions = questions.concat(distinctQuestions);
  
      if (questions.length < 3) {
        return makeRequest().then(processResponse);
      } else {
        return questions.slice(0, 3); // Return the first 3 distinct questions
      }
    }
  
    return makeRequest().then(processResponse);
  }
  
  // Usage:





  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    const inputs = form.querySelectorAll('input');
    let isFilled = false;

    inputs.forEach((input) => {
      if (input.value.trim() != '') {
        isFilled = true;
      }});
      if(saveCreds.textContent === 'Get Questions'){
      if(isFilled){
          chrome.storage.local.set({
              'rollNo': rollNo.value.trim() != '' ? rollNo.value : null,
              'pwd': pwd.value.trim() != '' ? pwd.value : null
            },()=>{
                console.log('data had been stored');
                displaySaved();
                getAllSecurityQuestions()
                .then((questions) => {
                  chrome.storage.local.set({"Q1":questions[0], "Q2":questions[1], "Q3":questions[2]}, ()=>{
                    console.log("Got Questions", questions);
                  });
                  chrome.storage.local.set({"setQuestions": true});
                  document.getElementById('Q1T').textContent = questions[0];
                  document.getElementById('Q1').hidden=true;
                  document.getElementById('Q2T').textContent = questions[1];
                  document.getElementById('Q2').hidden=true;
                  document.getElementById('Q3T').textContent = questions[2];
                  document.getElementById('Q3').hidden=true;
                  document.getElementById('questions').style.display = 'block';
                  document.getElementById('atkgp').checked = result.atkgp;
                  saveCreds.textContent = 'Update';
                })
                .catch((error) => {
                  console.error(error);
                });
            });
            alert("Getting Questions..");
      }}
      else{
        chrome.storage.local.set({
          'rollNo': rollNo.value.trim() != '' ? rollNo.value : null,
          'pwd': pwd.value.trim() != '' ? pwd.value : null,
          'Q1A': Q1A.value.trim() != '' ? Q1A.value : null,
          'Q2A': Q2A.value.trim() != '' ? Q2A.value : null,
          'Q3A': Q3A.value.trim() != '' ? Q3A.value : null,
          'atkgp': AtKGP.checked
        },()=>{
            console.log('data had been stored');
            displaySaved();
            chrome.storage.local.get(['setQuestions', 'Q1', 'Q2', 'Q3', 'atkgp'], (result => {
              console.log(result);
              if(result.setQuestions){
                document.getElementById('Q1T').textContent = result.Q1;
                document.getElementById('Q1').hidden=true;
                document.getElementById('Q2T').textContent = result.Q2;
                document.getElementById('Q2').hidden=true;
                document.getElementById('Q3T').textContent = result.Q3;
                document.getElementById('Q3').hidden=true;
                document.getElementById('questions').style.display = 'block';
                document.getElementById('atkgp').checked = result.atkgp;
                saveCreds.textContent = 'Update';
              }
            }))
        });
        alert("Saved Successfully!");
      }
  });


  chrome.storage.local.get([
      'rollNo',
      'pwd',
      'Q1',
      'Q1A',
      'Q2',
      'Q2A',
      'Q3',
      'Q3A',
      'atkgp'], (result=>{
          rollNo.placeholder = result.rollNo ? result.rollNo : "Enter Roll Number";   
          if(result.rollNo){
            chrome.storage.local.get(['setQuestions', 'Q1', 'Q2', 'Q3', 'atkgp'], (result => {
              if(result.setQuestions){
                document.getElementById('Q1T').textContent = result.Q1;
                document.getElementById('Q1').hidden=true;
                document.getElementById('Q2T').textContent = result.Q2;
                document.getElementById('Q2').hidden=true;
                document.getElementById('Q3T').textContent = result.Q3;
                document.getElementById('Q3').hidden=true;
                document.getElementById('questions').style.display = 'block';
                document.getElementById('atkgp').checked = result.atkgp;
                saveCreds.textContent = 'Update';
              }
            }));
          }
          pwd.placeholder = result.pwd ? "\u2022".repeat(result.pwd.length) : "Enter Password";
          Q1.placeholder = result.Q1 ? result.Q1 : "Enter ERP Q1";
          Q1A.placeholder = result.Q1A ? "\u2022".repeat(result.Q1A.length) : "Enter ERP A1";
          Q2.placeholder = result.Q2 ? result.Q2 : "Enter ERP Q2";
          Q2A.placeholder = result.Q2A ? "\u2022".repeat(result.Q2A.length) : "Enter ERP A2";
          Q3.placeholder = result.Q3 ? result.Q3 : "Enter ERP Q3";
          Q3A.placeholder = result.Q3A ? "\u2022".repeat(result.Q3A.length) : "Enter ERP A3";
          rollNo.value = result.rollNo ? result.rollNo : null;
          pwd.value = result.pwd ? result.pwd : null;
          Q1.value = result.Q1 ? result.Q1 : null;
          Q1A.value = result.Q1A ? result.Q1A : null;
          Q2.value = result.Q2 ? result.Q2 : null;
          Q2A.value = result.Q2A ? result.Q2A : null;
          Q3.value = result.Q3 ? result.Q3 : null;
          Q3A.value = result.Q3A ? result.Q3A : null;
          AtKGP.checked = result.atkgp ? result.atkgp : null;
      }));




  function displaySaved(){
      rollNo.value = null;
      pwd.value = null;
      Q1.value = null;
      Q1A.value = null;
      Q2.value = null;
      Q2A.value = null;
      Q3.value = null;
      Q3A.value = null;
      chrome.storage.local.get([
          'rollNo',
          'pwd',
          'Q1',
          'Q1A',
          'Q2',
          'Q2A',
          'Q3',
          'Q3A',
          'atkgp'], (result=>{
              rollNo.placeholder = result.rollNo ? result.rollNo : "Enter your Roll Number";
              pwd.placeholder = result.pwd ? "\u2022".repeat(result.pwd.length) : "Enter Password";
              Q1.placeholder = result.Q1 ? result.Q1 : "Enter ERP Q1";
              Q1A.placeholder = result.Q1A ? "\u2022".repeat(result.Q1A.length) : "Enter ERP A1";
              Q2.placeholder = result.Q2 ? result.Q2 : "Enter ERP Q2";
              Q2A.placeholder = result.Q2A ? "\u2022".repeat(result.Q2A.length) : "Enter ERP A2";
              Q3.placeholder = result.Q3 ? result.Q3 : "Enter ERP Q3";
              Q3A.placeholder = result.Q3A ? "\u2022".repeat(result.Q3A.length) : "Enter ERP A3";
              rollNo.value = result.rollNo ? result.rollNo : "Enter your Roll Number";
              pwd.value = result.pwd ? result.pwd : null;
              Q1.value = result.Q1 ? result.Q1 : null;
              Q1A.value = result.Q1A ? result.Q1A : null;
              Q2.value = result.Q2 ? result.Q2 : null;
              Q2A.value = result.Q2A ? result.Q2A : null;
              Q3.value = result.Q3 ? result.Q3 : null;
              Q3A.value = result.Q3A ? result.Q3A : null;
              AtKGP.value = result.atkgp ? result.atkgp : null;
          }))
      
  };


  window.addEventListener('load', () => {
      chrome.storage.local.get([
        'rollNo',
        'pwd',
        'Q1',
        'Q1A',
        'Q2',
        'Q2A',
        'Q3',
        'Q3A',
        'atkgp'
      ], function (result) {
        var credtoSend = result;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {data: credtoSend}, function(response) {});  
          setTimeout(function () {console.log('Sent to Content Script!')}, 500);
        });
      
      });
    });






// DOM End
});