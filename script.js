// ============================================
// Range Slider
// ============================================
const salarySlider = document.getElementById("salary");
const salaryDisplay = document.getElementById("salaryValue");

if (salarySlider && salaryDisplay) {
    salarySlider.addEventListener("input", function () {
        salaryDisplay.textContent = this.value;
    });
    // BUG: initial display says "10" but slider value is 700.
    // Not syncing on page load — intentional.
}

// ============================================
// Character Counter
// ============================================
const commentsField = document.getElementById("comments");
const charCount = document.getElementById("charCount");

if (commentsField && charCount) {
    commentsField.addEventListener("input", function () {
        charCount.textContent = this.value.length;
    });
}

// ============================================
// File Upload — drag & drop + display filename
// ============================================
const uploadZone = document.getElementById("uploadZone");
const passportInput = document.getElementById("passport");
const uploadFilename = document.getElementById("uploadFilename");

if (uploadZone && passportInput) {
    // Click zone to trigger file input
    uploadZone.addEventListener("click", function (e) {
        // Don't re-trigger if they clicked the hidden input or the label
        if (e.target === passportInput) return;
        if (e.target.closest(".upload-btn")) return;
    });

    // Drag events
    uploadZone.addEventListener("dragover", function (e) {
        e.preventDefault();
        uploadZone.classList.add("dragover");
    });

    uploadZone.addEventListener("dragleave", function () {
        uploadZone.classList.remove("dragover");
    });

    uploadZone.addEventListener("drop", function (e) {
        e.preventDefault();
        uploadZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
            passportInput.files = e.dataTransfer.files;
            showFilename(e.dataTransfer.files[0].name);
        }
    });

    // Show filename on change
    passportInput.addEventListener("change", function () {
        if (this.files.length) {
            showFilename(this.files[0].name);
        }
    });

    function showFilename(name) {
        if (uploadFilename) {
            uploadFilename.textContent = "📎 " + name;
        }
    }
}

// ============================================
// Progress Tracker
// ============================================
const sections = document.querySelectorAll(".form-section");
const steps = document.querySelectorAll(".progress-steps .step");
const progressBar = document.querySelector(".progress-bar");
const progressPercent = document.getElementById("progressPercent");

function updateProgress() {
    // Count sections that have at least one filled required field
    let completed = 0;

    sections.forEach(function (section, i) {
        const inputs = section.querySelectorAll("input[required], select[required]");
        let sectionFilled = false;

        inputs.forEach(function (input) {
            if (input.type === "checkbox" || input.type === "radio") {
                if (input.checked) sectionFilled = true;
            } else if (input.value && input.value !== "" && !input.matches("option[disabled]")) {
                sectionFilled = true;
            }
        });

        // Also check non-required but filled fields
        const allInputs = section.querySelectorAll("input, select, textarea");
        allInputs.forEach(function (input) {
            if (input.type === "checkbox" || input.type === "radio") {
                if (input.checked) sectionFilled = true;
            } else if (input.type !== "range" && input.type !== "file" && input.value && input.value !== "") {
                sectionFilled = true;
            }
        });

        if (steps[i]) {
            if (sectionFilled) {
                steps[i].classList.add("completed");
                completed++;
            } else {
                steps[i].classList.remove("completed");
            }
        }
    });

    const percent = Math.round((completed / sections.length) * 100);
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressPercent) progressPercent.textContent = percent;
}

// Listen for input events on the form to update progress
const form = document.getElementById("expeditionForm");

if (form) {
    form.addEventListener("input", updateProgress);
    form.addEventListener("change", updateProgress);

    // ============================================
    // Form Submission
    // ============================================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

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

        // BUG: email validation is very weak — only checks if @ exists.
        // "a@b", "user@.com", "@test" all pass.
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

    // ============================================
    // Form Reset
    // ============================================
    form.addEventListener("reset", function () {
        // BUG: resets display to "10" but slider resets to 700.
        setTimeout(function () {
            if (salaryDisplay) salaryDisplay.textContent = "10";
            if (charCount) charCount.textContent = "0";
            if (uploadFilename) uploadFilename.textContent = "";

            // Reset progress
            steps.forEach(function (step) {
                step.classList.remove("completed");
            });
            if (progressBar) progressBar.style.width = "0%";
            if (progressPercent) progressPercent.textContent = "0";
        }, 0);
    });
}
