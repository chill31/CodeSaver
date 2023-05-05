// UTILITY CODE -->

function refreshPage() {
  window.location.href = window.location.href;
}

function copyText(text) {
  navigator.clipboard.writeText(text);
}

function notify(message, type, context) {
  let notificationDiv;
  if (
    document.getElementById("notification-area") === undefined ||
    document.getElementById("notification-area") === null
  ) {
    notificationDiv = document.createElement("div");
    notificationDiv.id = "notification-area";

    document.body.append(notificationDiv);
  } else {
    notificationDiv = document.getElementById("notification-area");
  }
  let createdDiv = document.createElement("div");
  let id = Math.random().toString(36).substring(2, 10);

  createdDiv.setAttribute("id", id);
  createdDiv.classList.add("notification", type);

  if (context) {
    createdDiv.classList.add("contextMenu");
  }

  createdDiv.innerHTML = `
<div class="cross">
  <span class="cross__spans span1"></span>
  <span class="cross__spans span2""></span>
</div>
${message}
<span class="notif notif-timer"></span>`;
  document.getElementById("notification-area").prepend(createdDiv);

  setTimeout(() => {
    let notifications = document
      .getElementById("notification-area")
      .getElementsByClassName("notification");
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].getAttribute("id") == id) {
        notifications[i].remove();
        break;
      }
    }
  }, 5000);
  const notifCrosses = document.querySelectorAll(".notification .cross");
  notifCrosses.forEach((e) => {
    e.addEventListener("click", () => {
      e.parentElement.remove();
    });
  });
}

// THE MAIN CODE ->

const addCodeBtn = document.querySelector(".add-code");
const mainContainer = document.querySelector(".code-container");

let allCodeDivs = document.querySelectorAll(".code-div");
let deleteBtns = document.querySelectorAll(".btn-delete");
let copyBtns = document.querySelectorAll(".btn-copy");
let toggleEditBtns = document.querySelectorAll(".btn-toggle-edit");
let allSelectLangs = document.querySelectorAll(".select-lang");
let codeTitles = document.querySelectorAll(".code-title");
let textAreas = document.querySelectorAll(".code-area");
let editAreas = document.querySelectorAll(".edit-area");

const savedCodes = JSON.parse(localStorage.getItem("codes"));
let locallySavedCodes = savedCodes ?? [];

if (savedCodes) {
  savedCodes.forEach((codeObject) => {
    const createdEl = document.createElement("div");
    createdEl.classList.add("code-div");

    createdEl.innerHTML = `
  <input type="text" class="code-title" placeholder="untitled" value="${
    codeObject.title
  }" maxlength="35">

  <select class="select-lang">
    <option value="html">HTML</option>
    <option value="xml">XML</option>
    <option value="javascript">Javascript</option>
    <option value="css">CSS</option>
    <option value="go">GO</option>
    <option value="python">Python</option>
    <option value="bash">BASH</option>
    <option value="java">Java</option>
    <option value="json">JSON</option>
    <option value="typescript">Typescript</option>
    <option value="c">C</option>
    <option value="csharp">C#</option>
    <option value="cpp">C++</option>
    <option value="swift">Swift</option>
    <option value="lua">Lua</option>
    <option value="d">D</option>
    <option value="php">PHP</option>
    <option value="git">Git</option>
    <option value="r">R</option>
    <option value="ruby">Ruby</option>
    <option value="yaml">YAML</option>
    <option value="none">Select language</option>
  </select>

  <div class="btn-group">

    <button class="btn btn-toggle-edit custom">
      <i class="bi-pencil-square"></i>
    </button>

    <button class="btn btn-delete custom">
      <i class="bi-trash"></i>
    </button>

    <button class="btn btn-copy custom">
      <i class="bi-clipboard"></i>
    </button>
  </div>

  <textarea class="area edit-area hide" spellcheck="false" placeholder="edit your code...">${
    codeObject.code
  }</textarea>
  <pre class="language-${codeObject.lang} area code-area">${codeObject.code
      .replaceAll("\n", "\n")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")}</pre>
`;

    mainContainer.append(createdEl);

    allCodeDivs = document.querySelectorAll(".code-div");
    deleteBtns = document.querySelectorAll(".btn-delete");
    copyBtns = document.querySelectorAll(".btn-copy");
    toggleEditBtns = document.querySelectorAll(".btn-toggle-edit");
    allSelectLangs = document.querySelectorAll(".select-lang");
    codeTitles = document.querySelectorAll(".code-title");
    textAreas = document.querySelectorAll(".code-area");
    editAreas = document.querySelectorAll(".edit-area");
  });
}

codeTitles.forEach((title, index) => {
  title.addEventListener("input", (e) => {
    locallySavedCodes[index].title = e.target.value;

    localStorage.setItem("codes", JSON.stringify(locallySavedCodes));
  });
});

toggleEditBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    locallySavedCodes[index].code = editAreas[index].value;
    textAreas[index].textContent = editAreas[index].value;
    localStorage.setItem("codes", JSON.stringify(locallySavedCodes));

    if (btn.querySelector("i").classList.contains("bi-check-lg")) {
      refreshPage();
    }

    btn.querySelector("i").classList.toggle("bi-check-lg");
    textAreas[index].classList.toggle("hide");
    editAreas[index].classList.toggle("hide");
  });
});

copyBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    copyText(textAreas[index].textContent);
    notify(
      `Copied code of <bold>${
        locallySavedCodes[index].title || "untitled"
      }</bold>`,
      "info"
    );
  });
});

deleteBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    allCodeDivs[index].remove();
    allCodeDivs = document.querySelectorAll(".code-div");

    locallySavedCodes = [];

    allCodeDivs.forEach((div) => {
      const divTitle = div.querySelector(".code-title").value;
      const divCode = div.querySelector(".code-area").textContent;
      const lang =
        div.querySelector(".select-lang")[
          div.querySelector(".select-lang").selectedIndex
        ].value;

      const newData = {
        title: divTitle,
        code: divCode,
        lang: lang,
      };

      locallySavedCodes.push(newData);
    });

    localStorage.setItem("codes", JSON.stringify(locallySavedCodes));
    refreshPage();
  });
});

allSelectLangs.forEach((select, index) => {
  select.querySelectorAll("option").forEach((option, i) => {
    if (option.value == locallySavedCodes[index].lang) {
      option.selected = true;
    }
  });

  select.addEventListener("change", () => {
    locallySavedCodes[index].lang = select[select.selectedIndex].value;
    localStorage.setItem("codes", JSON.stringify(locallySavedCodes));
    refreshPage();
  });
});

addCodeBtn.addEventListener("click", () => {
  const codeInfo = {
    title: "",
    code: "",
    lang: "none",
  };

  locallySavedCodes.push(codeInfo);
  localStorage.setItem("codes", JSON.stringify(locallySavedCodes));

  refreshPage();
});