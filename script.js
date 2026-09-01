// Range slider — update displayed value
const salarySlider = document.getElementById("salary");
const salaryDisplay = document.getElementById("salaryValue");

if (salarySlider && salaryDisplay) {
    salarySlider.addEventListener("input", function () {
        salaryDisplay.textContent = this.value;
    });
    // BUG: initial display says "10" but slider value is 700.
    // Not syncing on load — intentional.
}

// Form submission handler
const form = document.getElementById("expeditionForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Basic check: required fields
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const contactNumber = document.getElementById("contactNumber").value.trim();
        const dob = document.getElementById("dob").value;
        const terms = document.getElementById("terms").checked;
        const passport = document.getElementById("passport").files.length;

        if (!fullName || !email || !contactNumber || !dob || !terms || !passport) {
            alert("Please fill in all required fields.");
            return;
        }

        // BUG: email validation is very weak — only checks if @ exists,
        // does not check for domain, TLD, or proper format.
        // e.g. "a@b" passes, "user@.com" passes
        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }

        alert(
            "Registration submitted successfully!\n\n" +
            "Name: " + fullName + "\n" +
            "Email: " + email
        );
    });

    // Reset salary display when form is cleared
    form.addEventListener("reset", function () {
        // BUG: resets display to "10" but slider resets to 700 (its HTML value attribute).
        // Display and slider remain out of sync after reset.
        setTimeout(function () {
            salaryDisplay.textContent = "10";
        }, 0);
    });
}
