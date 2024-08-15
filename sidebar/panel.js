let myWindowId;
const contentBox = document.getElementById("content");
contentBox.placeholder = "Subject goes here..\n\nBody content here..";

browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
  myWindowId = windowInfo.id;
  //console.log(myWindowId);
});

initialize();

function initialize() {
  // get notes from storage and update text box
  let storedNotes = localStorage.getItem("scratchPadText") || [];
  contentBox.value = storedNotes;

  let container = document.getElementById("content");

  let emailField = document.createElement("input");
  // emailField.required = true;
  // emailField.setAttribute("required", "");
  emailField.contentEditable = false;
  //emailField.required = true;
  emailField.style.width = "230px";
  emailField.type = "email";
  emailField.id = "email";
  let storedEmail = localStorage.getItem("email");

  if (!storedEmail) {
    emailField.placeholder = "enter an email or clickup board!";
    // alert("Please fill out the input field!");
  } else if (storedEmail) {
    emailField.value = storedEmail;
  }

  let saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "sendButton";
  saveButton.style.width = "100px";
  saveButton.textContent = "Send";
  container.before(emailField);
  container.before(saveButton);
  saveButton.addEventListener("click", function () {
    let email = emailField.value;
    localStorage.setItem("email", email);
    const subject = storedNotes.slice(0, storedNotes.indexOf("\n"));
    const notes = storedNotes.slice(storedNotes.indexOf("\n"))
    // create a new tab and send an email with the text
    /*  browser.tabs.create({
      url: "https://app.clickup.com/login",
    }); */
        browser.tabs.create({
          url: `mailto:${email}?subject=${subject}&body=${notes}`,
        });
  });
  // Make the content box editable as soon as the user mouses over the sidebar.
  const mail = document.getElementById("email");
  mail.addEventListener("mouseover", () => {
    emailField.style.width = "250px";

    console.log("mail");
    emailField.setAttribute("contenteditable", true);
  });
  //When the user mouses out, save the current contents of the box.
  mail.addEventListener("mouseout", () => {
    emailField.setAttribute("contenteditable", false);
    emailField.style.width = "230px";

    let email = document.getElementById("email").value;
    // Save the current contents of the box to local storage.
    localStorage.setItem("email", email);
  });
  //console.log(sendToLink.textContent);

  // get bookmarks from storage
  let existingTabs = JSON.parse(localStorage.getItem("Tab")) || [];
  if (existingTabs.length > 0) {
    //console.log("bookmarks", existingTabs);
    existingTabs.forEach((tab) => {
      addTabToUI(tab);
    });
  } else {
    console.log("checked for existing items...nothing");
  }

  // Make the content box editable as soon as the user mouses over the sidebar.
  window.addEventListener("mouseover", () => {
    contentBox.setAttribute("contenteditable", true);
  });
  //When the user mouses out, save the current contents of the box.
  window.addEventListener("mouseout", () => {
    contentBox.setAttribute("contenteditable", false);
    let scratchPadText = document.getElementById("content").value;
    // Save the current contents of the box to local storage.
    localStorage.setItem("scratchPadText", scratchPadText);
  });
}

btn = document.querySelector("#addTabButton");
//console.log("btn", btn);
btn.addEventListener("click", function () {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(saveItems, onError);
  function onError(error) {
    console.error(`Error: ${error}`);
  }
});

// add new items to storage
function saveItems(tabs) {
  console.log("tabsq", tabs);

  // Check if tabs are valid
  if (tabs.length === 0) return;

  let id = tabs[0].id;
  let host = tabs[0].url;
  let title = tabs[0].title;
  let url = tabs[0].url;
  let favIconUrl = tabs[0].favIconUrl;

  // Retrieve the existing array from localStorage, or initialize it as an empty array if it doesn't exist
  let existingTabs = JSON.parse(localStorage.getItem("Tab")) || [];
  // Check if the tab already exists in localStorage
  const tabExists = existingTabs.some((tab) => tab.id === id);
  let container = document.getElementById("content");
  if (tabExists) {
    /*     emailErrorMsg.style.visibility = "hidden";
     */ //emailErrorMsg.removeChild(emailErrorMsg);
    let emailErrorMsg = document.createElement("div");
    emailErrorMsg.classList = "error";
    setTimeout(() => {
      const el = document.querySelector(".error");
      el.remove();
    }, "500");

    emailErrorMsg.innerHTML = "<p>This tab is already in your list!</p>";

    container.before(emailErrorMsg);
    //console.log("Tab already exists, not adding duplicate.");
    return;
  }

  // Create the new tab object
  const newTab = {
    id: id,
    timestamp: new Date().toLocaleString(),
    title: title,
    url: url,
    favIconUrl: favIconUrl,
  };

  // Add the new tab to the existing array
  existingTabs.push(newTab);

  // Save the updated array back to localStorage
  localStorage.setItem("Tab", JSON.stringify(existingTabs));

  // Add the new tab to the UI
  addTabToUI(newTab);
}

function addTabToUI(tab) {
  const ul = document.querySelector(".tabsList");
  const li = document.createElement("li");
  const titleSpan = document.createElement("a");
  const hostnameSpan = document.createElement("a");
  const closeBtn = document.createElement("span");

  const imgLink = document.createElement("a");
  const img = document.createElement("img");

  ul.appendChild(li);
  li.className = "tab";

  li.appendChild(imgLink);
  imgLink.appendChild(img);

  li.appendChild(closeBtn);
  li.appendChild(titleSpan);
  li.appendChild(hostnameSpan);

  titleSpan.className = "title";
  titleSpan.href = tab.url;
  titleSpan.textContent = tab.title;

  hostnameSpan.className = "url";
  hostnameSpan.href = tab.url;
  hostnameSpan.textContent = tab.url;

  imgLink.href = tab.url;

  img.className = "tabIcon";
  img.src = tab.favIconUrl;

  closeBtn.className = "close";
  closeBtn.textContent = "x";

  closeBtn.addEventListener("click", function () {
    this.parentNode.remove(); // This will remove the li element
    removeTabFromStorage(tab.id);
  });
}

function removeTabFromStorage(id) {
  let existingTabs = JSON.parse(localStorage.getItem("Tab")) || [];
  existingTabs = existingTabs.filter((tab) => tab.id !== id);
  localStorage.setItem("Tab", JSON.stringify(existingTabs));
}

// remove all bookmark items from sidebar
const resetBtn = document.querySelector(".resetButton");
resetBtn.addEventListener("click", function () {
  // clear the local storage
  localStorage.clear();
  document.getElementById("content").value = "";

  const li = document.getElementsByClassName("tab");
  //console.log(li);

  while (li.length != 0) {
    li[0].remove();
  }
});
