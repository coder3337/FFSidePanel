let myWindowId;
const contentBox = document.querySelector("#content");

/* display previously-saved stored notes on startup */

/* initialize();

function initialize() {
  let gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    let noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
      let curValue = results[noteKey];
      displayNote(noteKey, curValue);
    }
  }, onError);
} */

/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  contentBox.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  contentBox.setAttribute("contenteditable", false);
  browser.tabs.query({ windowId: myWindowId, active: true }).then((tabs) => {
    let contentToStore = {};
    contentToStore[tabs[0].title] = contentBox.textContent;
    contentToStore[tabs[0].url] = contentBox.textContent;
    browser.storage.local.set(contentToStore);
  });
});
/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
  browser.tabs
    .query({ windowId: myWindowId, active: true })
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url);
    })
    .then((storedInfo) => {
      contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
}

/*
Update content when a new tab becomes active.
*/
//browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
//browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
/* browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
}); */

function logTabs(tabs) {
  //console.log(tabs[0]);
  const title = tabs[0].title;
  const url = tabs[0].url;
  const tabIconUrl = tabs[0].favIconUrl;


  const btn = document.querySelector("#addTabButton");
  btn.addEventListener("click", clicked);

  function clicked() {
    const ul = document.querySelector(".tabsList");
    const li = document.createElement("li");
    li.innerHTML = `<a href="https://${url}"><span class="activeTabIcon"><img src="${tabIconUrl}"></span><span class="close">x</span></a>
<span class="title"><a href="https://${title}">${title}</a></span> <br> <span class="url"><a href="https://${url}">${url}</a></span>`;
    ul.appendChild(li);

    // Add event listener to the close button after it's added to the DOM
    const closeBtn = li.querySelector(".close");
    closeBtn.addEventListener("click", function () {
      this.parentNode.parentNode.remove(); // This will remove the li element
    });
  }
}


//let id = tabs[0].id;
// link each tab to each panel

//console.log(title);
/*   browser.tabs.create({ url: "https://www.example.com" }); */
//console.log("window" + myWindowId);

// tabs[0].url requires the `tabs` permission or a matching host permission.

/*   console.log(tabs[0].title);
  console.log(tabs[0].url); */
/*   let id = tabs[0].id;
  let title = tabs[0].title; */
// let url = tabs[0].url;
/*   console.log(id);
  console.log(title); */
// console.log(title + " || " + url);


function onError(error) {
  console.error(`Error: ${error}`);
}

browser.tabs
  .query({ currentWindow: true, active: true })
  .then(logTabs, onError);
  
// sidebar.js

browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
  myWindowId = windowInfo.id;
  console.log(myWindowId);
});
