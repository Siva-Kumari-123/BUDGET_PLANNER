
// Switch between pages
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");
}

// Registration
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    if (localStorage.getItem("user_" + email)) {
        alert("An account with this email already exists!");
        return;
    }

    const user = { name, email, password };

    localStorage.setItem("user_" + email, JSON.stringify(user));
    localStorage.setItem("currentEmail", email);

    document.getElementById("profileName").value = name;

    alert("Account created successfully! Please complete your profile.");

    showPage("profilePage");
});

// Calculate age from DOB
document.getElementById("dob").addEventListener("change", function() {
    const birth = new Date(this.value + "T00:00:00");
    const today = new Date();

    if (isNaN(birth.getTime()) || birth > today) {
        document.getElementById("age").value = "";
        alert("Please select a valid date of birth.");
        return;
    }

    let age = today.getFullYear() - birth.getFullYear();

    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    document.getElementById("age").value = age;
});

// Save personal details
document.getElementById("profileForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = localStorage.getItem("currentEmail");

    if (!email) {
        alert("Please register or login first.");
        showPage("loginPage");
        return;
    }

    const profile = {
        name: document.getElementById("profileName").value.trim(),
        mobile: document.getElementById("mobile").value,
        dob: document.getElementById("dob").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        profession: document.getElementById("profession").value,
        salary: document.getElementById("salary").value,
        savings: document.getElementById("savings").value,
        city: document.getElementById("city").value.trim()
    };

    localStorage.setItem("profile_" + email, JSON.stringify(profile));

    showDashboard(profile);

    alert("Your personal details have been saved!");
});

// Login
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const savedUser = localStorage.getItem("user_" + email);

    if (!savedUser) {
        alert("Account not found. Please register first.");
        return;
    }

    const user = JSON.parse(savedUser);

    if (user.password !== password) {
        alert("Incorrect password!");
        return;
    }

    localStorage.setItem("currentEmail", email);

    const profile = localStorage.getItem("profile_" + email);

    if (profile) {
        showDashboard(JSON.parse(profile));
    } else {
        document.getElementById("profileName").value = user.name;
        showPage("profilePage");
    }
});

// Dashboard
function showDashboard(profile) {
    document.getElementById("welcomeName").textContent = profile.name.split(" ")[0];

    const details = [
        ["Full Name", profile.name],
        ["Mobile", profile.mobile],
        ["Age", profile.age + " years"],
        ["Date of Birth", profile.dob],
        ["Gender", profile.gender],
        ["Profession", profile.profession],
        ["Monthly Income", "₹" + Number(profile.salary).toLocaleString("en-IN")],
        ["Savings Goal", "₹" + Number(profile.savings).toLocaleString("en-IN")],
        ["City", profile.city]
    ];

    document.getElementById("profileSummary").innerHTML =
        details.map(([label, value]) => `
            <div>
                ${label}
                <strong>${escapeHTML(value)}</strong>
            </div>
        `).join("");

    showPage("dashboardPage");
}

// Escape user input before showing it in HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Logout
function logout() {
    localStorage.removeItem("currentEmail");
    document.getElementById("loginForm").reset();
    showPage("loginPage");
}
