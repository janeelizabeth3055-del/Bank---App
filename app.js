let beneficiaries = JSON.parse(localStorage.getItem("beneficiaries")) || [];
function loadBeneficiaries() {
  let select = document.getElementById("to-account");

  select.innerHTML = `<option value="">Select Account</option>`;

  beneficiaries.forEach((b, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.text = `${b.name} - ${b.bank} (${b.account})`;
    select.appendChild(option);
  });

  // Add new option
  let newOption = document.createElement("option");
  newOption.value = "new";
  newOption.text = "+ Add New Account";
  select.appendChild(newOption);
}

function handleAccountSelect() {
  let select = document.getElementById("to-account");
  let value = select.value;

  if (value === "new") {

    let acc = prompt("Enter 10-digit account number");

    if (!acc || acc.length !== 10 || isNaN(acc)) {
      showToast("Invalid account number");
      select.value = "";
      return;
    }

    let bank = detectBank(acc);
    let name = "John Doe"; // fake API response

    let newBeneficiary = {
      account: acc,
      bank: bank,
      name: name
    };

    beneficiaries.push(newBeneficiary);
    localStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));

    showToast("Account added");

    // reload dropdown
    loadBeneficiaries();

    // auto-select new account
    select.value = beneficiaries.length - 1;
  }
}

function detectBank(accountNumber) {
  if (accountNumber.startsWith("0")) return "GTBank";
  if (accountNumber.startsWith("1")) return "Access Bank";
  if (accountNumber.startsWith("2")) return "UBA";
  return "Unknown Bank";
}

function resolveAccount() {
  let acc = document.getElementById("account-number").value;

  if (acc.length !== 10) {
    showToast("Account number must be 10 digits");
    return;
  }

  let bank = detectBank(acc);

  // Fake account name
  let name = "John Doe";

  document.getElementById("bank-name").value = bank;
  document.getElementById("account-name").value = name;
}


let transactionLimit = localStorage.getItem("limit") || 500000;
function setLimit() {
  let newLimit = parseFloat(prompt("Enter new transaction limit"));

  if (!newLimit || newLimit <= 0) return;

  transactionLimit = newLimit;
  localStorage.setItem("limit", newLimit);

  updateUI();
}
let balance = 1088850;

let transactions = [
  {
    type: "Withdrawal",
    description: "RDI/0206 BR DEP/REFER TO MAKER/MCCANN DIST",
    amount: 10000,
    status: "posted",
    date: "02/11/2026",
    balanceAfter: 502193.92
  },
  {
    type: "Withdrawal ACH CHASE CREDI...",
    description: "TYPE:RETRY PYMT ID:4766039224",
    amount: 32000,
    status: "posted",
    date: "02/11/2026",
    balanceAfter: 22193.92
  },
  {
    type: "Deposit",
    description: "DEPOSIT BY CHECKMAIL TRANS...",
    amount: 200000,
    status: "posted",
    date: "01/21/2026",
    balanceAfter: 5806.08
  },
  {
    type: "Deposit",
    description: "DEPOSIT BY CHECKMAIL TRANS...",
    amount: 6000,
    status: "pending",
    date: "01/14/2026",
    balanceAfter: 255806.08
  },
  {
    type: "Deposit",
    description: "DEPOSIT BY CHECKMAIL TRANS...",
    amount: 60000,
    status: "posted",
    date: "01/11/2026",
    balanceAfter: 155806.08
  },
  {
    type: "Deposit",
    description: "DEPOSIT BY CHECKMAIL TRANS...",
    amount: 18000,
    status: "pending",
    date: "01/3/2026",
    balanceAfter: 205806.08
  },
];

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

let currentFilter = "all";

/* NAV */
function goToTransactions() {
  document.getElementById("dashboard-screen").style.display = "none";
  document.getElementById("transaction-screen").style.display = "block";
  updateUI();
}

function goBack() {
  document.getElementById("transaction-screen").style.display = "none";
  document.getElementById("dashboard-screen").style.display = "block";
}

/* MODAL */
function openTransfer() {
  document.getElementById("transaction-screen").style.display = "none";
  document.getElementById("transfer-screen").style.display = "block";

  loadBeneficiaries(); // ✅ THIS LINE FIXES YOUR ISSUE
}

function backToTransactions() {
  document.getElementById("transfer-screen").style.display = "none";
  document.getElementById("transaction-screen").style.display = "block";
}

function submitTransfer() {
  let amount = document.getElementById("transfer-amount").value;
  let memo = document.getElementById("transfer-memo").value || "Transfer";
  let selected = document.getElementById("to-account").value;

if (!selected) {
  showToast("Select account");
  return;
}

let b = beneficiaries[selected];

if (!b) {
  showToast("Invalid selection");
  return;
}

let to = `${b.name} - ${b.bank} (${b.account})`;

  if (!amount || amount <= 0) {
    showToast("Enter valid amount");
    return;
  }

  if (amount > balance) {
    showToast("Insufficient funds");
    return;
  }
  

  // Save temp data
  localStorage.setItem("tempTransfer", JSON.stringify({
    amount,
    memo,
    to
  }));
  

  

  // Fill confirmation screen
  document.getElementById("confirm-to").innerText = to;
  document.getElementById("confirm-amount").innerText = Number(amount).toLocaleString();
  document.getElementById("confirm-memo").innerText = memo;

  // Switch screen
  document.getElementById("transfer-screen").style.display = "none";
  document.getElementById("confirm-screen").style.display = "block";
}

function backToTransfer() {
  document.getElementById("confirm-screen").style.display = "none";
  document.getElementById("transfer-screen").style.display = "block";
}

function goToPin() {
  document.getElementById("confirm-screen").style.display = "none";
  document.getElementById("pin-screen").style.display = "block";
}

function backToConfirm() {
  document.getElementById("pin-screen").style.display = "none";
  document.getElementById("confirm-screen").style.display = "block";
}

function processTransfer() {
  let pin = document.getElementById("pin-input").value;

  if (pin !== "1234") {
    showToast("Incorrect PIN");
    return;
  }

  let data = JSON.parse(localStorage.getItem("tempTransfer"));

  // Fake processing
  showToast("Processing transfer...");

  setTimeout(() => {
    showToast("Oop! it's not you, it's us. Try again later");

    // Clear PIN
    document.getElementById("pin-input").value = "";

    // Go back to transactions
    document.getElementById("pin-screen").style.display = "none";
    document.getElementById("transaction-screen").style.display = "block";

  }, 2000);
}


function closeTransfer() {
  document.getElementById("transfer-modal").style.display = "none";
}

/* SEND */
function sendMoney() {
  let to = document.getElementById("recipient").value;
  let amount = parseFloat(document.getElementById("amount").value);

  if (!to || amount <= 0) return;

  balance -= amount;

  transactions.unshift({
  type: "Withdrawal",
  description: "Transfer to " + to,
  amount: amount,
  status: "posted",
  date: new Date().toLocaleDateString(),
  balanceAfter: balance
});
  saveData();
  if (amount > transactionLimit) {
  alert("Exceeds transaction limit");
  return;
}
  updateUI();
  closeTransfer();
}

/* DEPOSIT */
function depositMoney() {
  let amount = parseFloat(prompt("Enter amount"));

  if (!amount) return;

  balance += amount;

  transactions.unshift({
  type: "Deposit",
  description: "Cash Top Up",
  amount: amount,
  status: "posted",
  date: new Date().toLocaleDateString(),
  balanceAfter: balance
});

  updateUI();
  saveData();
}

/* FILTER */
function filterTx(type) {
  currentFilter = type;
  updateUI();
}

/* UI */
function updateUI() {

  document.getElementById("balance").innerText =
    "$" + balance.toLocaleString();

  document.getElementById("transaction-balance").innerText =
    "$" + balance.toLocaleString();

  let list = document.getElementById("transaction-list");
  list.innerHTML = "";

    // UPDATE LIMIT
  document.getElementById("tx-limit").innerText =
    "$" + Number(transactionLimit).toLocaleString();

  // CALCULATE PENDING
  let pendingTx = transactions.filter(tx => tx.status === "pending");

  document.getElementById("pending-count").innerText =
    pendingTx.length;

  let totalPending = pendingTx.reduce((sum, tx) => sum + tx.amount, 0);

  document.getElementById("pending-total").innerText =
    "$" + totalPending.toLocaleString();

  transactions
    .filter(tx => {
  let search = document.getElementById("search-input")?.value.toLowerCase() || "";

  let matchesFilter =
    currentFilter === "all" || tx.status === currentFilter;

  let matchesSearch =
    tx.type.toLowerCase().includes(search) ||
    tx.description.toLowerCase().includes(search);

  return matchesFilter && matchesSearch;
})
    .forEach(tx => {

      let li = document.createElement("li");

      let isDebit = tx.type === "Transfer";

      li.innerHTML = `
  <div class="tx-card">

    <div class="tx-top">
      <span class="tx-type">${tx.type}</span>
      <span class="tx-amount ${tx.type === "Withdrawal" ? "debit" : "credit"}">
        ${tx.type === "Withdrawal" ? "-" : "+"}$${tx.amount.toLocaleString()}
      </span>
    </div>

    <div class="tx-desc">
      ${tx.description}
    </div>

    <div class="tx-bottom">
      <span>${tx.date}</span>
      <span>Balance: $${tx.balanceAfter.toLocaleString()}</span>
    </div>

  </div>
`;

      list.appendChild(li);
    });
}

updateUI();


// Login placement //
function login() {
  let username = document.getElementById("login-username").value.trim();
  let password = document.getElementById("login-password").value.trim();

  let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
  let lockTime = localStorage.getItem("lockTime");

  // 🔒 CHECK IF LOCKED
  if (lockTime && Date.now() < parseInt(lockTime)) {
    let secondsLeft = Math.ceil((lockTime - Date.now()) / 1000);
    alert("Too many attempts. Try again in " + secondsLeft + " seconds");
    return;
  }

  // reset lock if expired
  if (lockTime && Date.now() > parseInt(lockTime)) {
    localStorage.removeItem("lockTime");
    localStorage.setItem("loginAttempts", 0);
    attempts = 0;
  }

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  // ✅ CORRECT LOGIN
  if (username === "smither6069@gmail.com" && password === "Smither4321$") {

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("loginAttempts", 0);

    showToast("Logging in...");
    document.getElementById("bottom-nav").style.display = "flex";

    setTimeout(() => {
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("dashboard-screen").style.display = "block";
      loadUser();
    }, 800);
    

  } 
  
  // ❌ WRONG LOGIN
  else {
    attempts++;

    localStorage.setItem("loginAttempts", attempts);

    let remaining = 3 - attempts;

    if (remaining <= 0) {
      let lockUntil = Date.now() + 30000; // 30 seconds
      localStorage.setItem("lockTime", lockUntil);

      alert("Too many attempts. Account locked for 30 seconds.");
    } else {
      alert("Invalid login. " + remaining + " attempt(s) left.");
    }
  }
}

window.onload = function () {

  let isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn === "true") {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("dashboard-screen").style.display = "block";
  document.getElementById("bottom-nav").style.display = "flex";
  loadUser();
}

  updateUI();
};

function logout() {
  localStorage.removeItem("loggedIn");
  location.reload();
}





function loadUser() {
  document.getElementById("welcome-text").innerText =
    "Hello Michael";

  document.getElementById("user-name").innerText = "Michael";
}




function toggleProfileMenu() {
  let menu = document.getElementById("profile-menu");

  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}



function loadEarlier() {
  let btn = document.getElementById("load-earlier-btn");

  if (btn) btn.innerText = "Loading...";

  showToast("Fetching transactions...");

  setTimeout(() => {
    if (btn) btn.innerText = "Load Earlier Transactions";

    showToast("Oops, we can’t load earlier transactions right now. Try again later.");
  }, 1500);
}

function showToast(message) {
  let toast = document.getElementById("toast");

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function openUnavailable() {
  showLoader();

  setTimeout(() => {
    hideLoader();

    document.getElementById("transfer-screen").style.display = "none";
    document.getElementById("unavailable-screen").style.display = "block";
  }, 1000);
}

function backToTransferFromUnavailable() {
  document.getElementById("unavailable-screen").style.display = "none";
  document.getElementById("transfer-screen").style.display = "block";
}

function showLoader() {
  let loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = "Loading...";
  loader.style.position = "fixed";
  loader.style.top = "0";
  loader.style.left = "0";
  loader.style.right = "0";
  loader.style.bottom = "0";
  loader.style.background = "rgba(0,0,0,0.5)";
  loader.style.color = "white";
  loader.style.display = "flex";
  loader.style.alignItems = "center";
  loader.style.justifyContent = "center";
  loader.style.fontSize = "20px";
  loader.style.zIndex = "2000";

  document.body.appendChild(loader);
}

function hideLoader() {
  let loader = document.getElementById("loader");
  if (loader) loader.remove();
}


function showUnavailableToast() {
  showToast("Oops! This feature is not available yet.");
}

function depositMoney() {
  showUnavailableToast();
}
