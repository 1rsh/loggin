chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.command === "runCommand") {
      var receivedCreds = msg.data;
      console.log(receivedCreds);
      // Process the received credentials as needed
    }
  });
  