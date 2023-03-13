let allTabs = [];
let shownTabs = [];
let currentItemIndex = -1;
document.addEventListener('DOMContentLoaded', function () {
    // your code to run when the popup is opened goes here
    // Retrieve a list of the currently open tabs and send it back to the content script
    browser.tabs.query({ active: true, currentWindow: true }).then(tabsInput1 => {
        let tabId = tabsInput1[0].id;
        // Send message to content script in the targeted tab
        browser.tabs.query({}).then((tabsInput) => {
            console.log("tabsInput", tabsInput);
            const tabsList = tabsInput.map((tab) => {
                return { url: tab.url, title: tab.title, icon: tab.favIconUrl, id: tab.id };
            });
            allTabs = tabsList;
            shownTabs = tabsList;
            drawSuggestionItems(allTabs);
        });
    });
});

function drawSuggestionItems(items) {
    console.log("here");
    let suggestionsDiv = document.getElementById("suggestions-zx");
    let ulNode = suggestionsDiv.querySelector("ul");
    ulNode.innerHTML = "";
    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        // Append the new item to the list
        ulNode.appendChild(drawOneLI(element));
    }
    console.log(ulNode.firstChild);
}

const input = document.getElementById("autocomplete-input");
input.addEventListener("input", function () {
    // Get the current value of the input field
    const value = input.value.toLowerCase();
    if (allTabs === undefined || allTabs.length === 0) return;
    // Loop through the options and add any that match the input value to the list
    let tempList = [];
    for (let i = 0; i < allTabs.length; i++) {
        const option = allTabs[i].title.toLowerCase();
        if (option.includes(value)) {
            tempList.push(allTabs[i]);
        }
    }
    drawSuggestionItems(tempList);
    shownTabs = tempList;
    currentItemIndex = -1;
});

function drawOneLI(oneLI) {
    // Create a new list item element
    const newItem = document.createElement("li");
    newItem.style.display = "flex";
    newItem.style.alignItems = "center"
    newItem.tabIndex = "-1";
    // Create a new image element
    const newImg = document.createElement("img");

    // Set the source of the image element
    newImg.src = oneLI.icon;
    newImg.style.width = "16px";
    newImg.style.marginRight = "10px";
    newImg.style.marginLeft = "5px";

    // Append the image to the list item
    newItem.appendChild(newImg);

    const textNode = document.createElement("p");
    textNode.textContent = oneLI.title;
    // Set the text content of the new item
    newItem.appendChild(textNode);
    newItem.classList.add("mui-list__item");
    newItem.onclick = () => {
        browser.tabs.update(oneLI.id, { active: true });
        hidePopup();
    }
    return newItem;
}
// When the user clicks anywhere on the page
document.addEventListener("click", function (event) {
    // If the click was outside of the popup
    let popup2 = document.getElementById("my-popup2");
    if (!popup2.contains(event.target)) {
        // Hide the popup
        hidePopup();
    }
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    let suggestionsDiv = document.getElementById("suggestions-zx");
    let ulNode = suggestionsDiv.querySelector("ul");
    let allLiNodes = ulNode.childNodes;

    if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();

        // Set the focus to the next or previous li element
        if (key === 'ArrowUp' && currentItemIndex == 0) {
            input.focus();
            currentItemIndex = -1;
            return;
        } else if (key === 'ArrowUp' && currentItemIndex > 0) {
            currentItemIndex--;
        } else if (key === 'ArrowDown' && currentItemIndex < allLiNodes.length - 1) {
            currentItemIndex++;
        } else if (key === 'ArrowDown' && currentItemIndex == allLiNodes.length - 1) {
            input.focus();
            currentItemIndex = -1;
        } else if (key === 'ArrowUp' && currentItemIndex == -1) {
            currentItemIndex = allLiNodes.length - 1;
        }

        allLiNodes[currentItemIndex].focus();
    } else if (key === "Enter") {
        event.preventDefault();
        allLiNodes[currentItemIndex].click();
    } else {
        input.focus();
    }
})

function hidePopup() {
    window.close();
}


