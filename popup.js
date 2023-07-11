document.addEventListener("DOMContentLoaded", function() {
  let logIn = document.getElementById('logIn');
  let saveCreds = document.getElementById('saveCreds');
  rollNo = document.getElementById('rollNo');
  pwd = document.getElementById('pwd');
  Q1 = document.getElementById('Q1');
  Q1A = document.getElementById('Q1A');
  Q2 = document.getElementById('Q2');
  Q2A = document.getElementById('Q2A');
  Q3 = document.getElementById('Q3');
  Q3A = document.getElementById('Q3A');


  const form = document.getElementById('myForm');








  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    const inputs = form.querySelectorAll('input');
    let isFilled = true;

    inputs.forEach((input) => {
      if (input.value.trim() === '') {
        isFilled = false;
      }});

      if(isFilled){
          chrome.storage.local.set({
              'rollNo': rollNo.value,
              'pwd': pwd.value,
              'Q1': Q1.value,
              'Q1A': Q1A.value,
              'Q2': Q2.value,
              'Q2A': Q2A.value,
              'Q3': Q3.value,
              'Q3A': Q3A.value
            },()=>{
                console.log('data had been stored');
                displaySaved();
                alert("Saved Successfully!");
            });
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
      'Q3A'], (result=>{
          rollNo.placeholder = result.rollNo ? result.rollNo : "Enter Roll Number";
          pwd.placeholder = result.pwd ? "\u2022".repeat(result.pwd.length) : "Enter Password";
          Q1.placeholder = result.Q1 ? result.Q1 : "Enter ERP Q1";
          Q1A.placeholder = result.Q1A ? "\u2022".repeat(result.Q1A.length) : "Enter ERP A1";
          Q2.placeholder = result.Q2 ? result.Q2 : "Enter ERP Q2";
          Q2A.placeholder = result.Q2A ? "\u2022".repeat(result.Q2A.length) : "Enter ERP A2";
          Q3.placeholder = result.Q3 ? result.Q3 : "Enter ERP Q3";
          Q3A.placeholder = result.Q3A ? "\u2022".repeat(result.Q3A.length) : "Enter ERP A3";
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
          'Q3A'], (result=>{
              rollNo.placeholder = result.rollNo ? result.rollNo : "Enter your Roll Number";
              pwd.placeholder = result.pwd ? "\u2022".repeat(result.pwd.length) : "Enter Password";
              Q1.placeholder = result.Q1 ? result.Q1 : "Enter ERP Q1";
              Q1A.placeholder = result.Q1A ? "\u2022".repeat(result.Q1A.length) : "Enter ERP A1";
              Q2.placeholder = result.Q2 ? result.Q2 : "Enter ERP Q2";
              Q2A.placeholder = result.Q2A ? "\u2022".repeat(result.Q2A.length) : "Enter ERP A2";
              Q3.placeholder = result.Q3 ? result.Q3 : "Enter ERP Q3";
              Q3A.placeholder = result.Q3A ? "\u2022".repeat(result.Q3A.length) : "Enter ERP A3";
          }))
      
  };




  logIn.addEventListener('click', () => {
      chrome.storage.local.get([
        'rollNo',
        'pwd',
        'Q1',
        'Q1A',
        'Q2',
        'Q2A',
        'Q3',
        'Q3A'
      ], function (result) {
        var credtoSend = result;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {data: credtoSend}, function(response) {});  
          setTimeout(result, 500);
        });
      
      });
    });
});