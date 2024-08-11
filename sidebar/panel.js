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
  // Save the current contents of the box to local storage.
  browser.tabs.query({ windowId: myWindowId, active: true }).then((tabs) => {
    //console.log({ windowId: myWindowId, active: true });
    let textBox = document.getElementById("content").value;
    console.log(textBox);
    /*     contentBox.textContent;
     */ localStorage.setItem("Text box", textBox);
  });
});
/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
/* function updateContent() {
  browser.tabs
    .query({ windowId: myWindowId, active: true })
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url);
    })
    .then((storedInfo) => {
      contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
} */

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
  let id = tabs[0].id;
  let host = tabs[0].url;
  let domain = new URL(host).hostname.replace("www.", "");
  let title = tabs[0].title;
  let url = tabs[0].url;
  let faviconUrl = tabs[0].favIconUrl;

  const btn = document.querySelector("#addTabButton");
  btn.addEventListener("click", addItem);

  function addItem() {
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
    //url = str.substring(0, 10);
    /*   urlSpan.className = "url";
    urlSpan.textContent = url; */

    titleSpan.className = "title";
    titleSpan.href = url;
    titleSpan.textContent = title;

    hostnameSpan.className = "url";
    hostnameSpan.href = url;
    hostnameSpan.textContent = domain;

    imgLink.href = url;

    img.className = "tabIcon";
    img.href = url;
    img.src = faviconUrl;

    closeBtn.className = "close";
    closeBtn.textContent = "x";

    // save to local storage
    let timestamp = new Date().toLocaleString();
    let uniqueId = id++;
    /*  source.forEach((item, i) => {
      item.id = i + 1;
    }); */
    const tabGroup = [];
    tabGroup.push(uniqueId);
    tabGroup.push(timestamp);
    tabGroup.push(id);
    tabGroup.push(title);
    tabGroup.push(url);
    tabGroup.push(faviconUrl);

    localStorage.setItem(uniqueId, tabGroup);

    // Add event listener to the close button after it's added to the DOM
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.remove(); // This will remove the li element
      localStorage.removeItem(uniqueId);
    });

    // remove all bookmark items from sidebar
    const resetBtn = document.querySelector(".resetButton");
    resetBtn.addEventListener("click", function () {
      // clear the local storage
      localStorage.clear();

      const li = document.getElementsByClassName("tab");
      // console.log(li);
      while (li.length > 0) {
        // New JS remove Function
        li[0].remove();
        // Safer cross browser
        // Has to traverse by going up to the parent and removing the child
        // Which is itself, the li element.
        li[0].parentNode.removeChild(li[0]);
      }
      // tab.remove();
      //this.parentNode.remove(); // This will remove the li element
    });
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

browser.tabs
  .query({ currentWindow: true, active: true })
  .then(logTabs, onError);

browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
  myWindowId = windowInfo.id;
  //console.log(myWindowId);
});
