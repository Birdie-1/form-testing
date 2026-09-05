// ============================================
// Expedition Registration Form Logic
// ============================================

// DOM Elements
const form = document.getElementById("expeditionForm");
const salarySlider = document.getElementById("salary");
const salaryDisplay = document.getElementById("salaryValue");
const commentsField = document.getElementById("comments");
const charCount = document.getElementById("charCount");
const uploadZone = document.getElementById("uploadZone");
const passportInput = document.getElementById("passport");
const uploadFilename = document.getElementById("uploadFilename");
const dobInput = document.getElementById("dob");
const sections = document.querySelectorAll(".form-section");
const steps = document.querySelectorAll(".progress-steps .step");
const progressBar = document.querySelector(".progress-bar");
const progressPercent = document.getElementById("progressPercent");

// File Validation Constants
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ============================================
// 1. Range Slider (Fix Bug #1 & #2)
// ============================================
if (salarySlider && salaryDisplay) {
    // Immediately sync display value with slider value on page load
    salaryDisplay.textContent = salarySlider.value;

    salarySlider.addEventListener("input", function () {
        salaryDisplay.textContent = this.value;
    });
}

// ============================================
// 2. Date of Birth Limits (Fix Additional Bug: Age Validation)
// ============================================
if (dobInput) {
    const today = new Date();
    // Must be at least 18 years old
    const maxYear = today.getFullYear() - 18;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dobInput.max = `${maxYear}-${month}-${day}`;
    dobInput.min = "1924-01-01";
}

// ============================================
// 3. Character Counter
// ============================================
if (commentsField && charCount) {
    commentsField.addEventListener("input", function () {
        charCount.textContent = this.value.length;
    });
}

// ============================================
// 4. File Upload & Validation (Fix Bug #3 & Additional Bug: Drag-and-drop validation)
// ============================================
function validateAndDisplayFile(file) {
    clearFieldError(uploadZone);

    if (!file) {
        uploadFilename.textContent = "";
        return false;
    }

    const fileName = file.name || "";
    const fileExt = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

    const isExtValid = ALLOWED_EXTENSIONS.includes(fileExt);
    const isMimeValid = !file.type || ALLOWED_MIME_TYPES.includes(file.type);

    if (!isExtValid || !isMimeValid) {
        passportInput.value = "";
        uploadFilename.textContent = "";
        setFieldError(uploadZone, "Invalid file format. Only PDF, JPG, and PNG are allowed.");
        updateProgress();
        return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        passportInput.value = "";
        uploadFilename.textContent = "";
        setFieldError(uploadZone, "File exceeds maximum size of 10MB.");
        updateProgress();
        return false;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    uploadFilename.textContent = `📎 ${fileName} (${sizeInMB} MB)`;
    uploadFilename.style.color = "var(--green)";
    clearFieldError(uploadZone);
    updateProgress();
    return true;
}

if (uploadZone && passportInput) {
    // Clicking anywhere in the upload zone opens file chooser
    uploadZone.addEventListener("click", function (e) {
        if (e.target === passportInput) return;
        passportInput.click();
    });

    // Drag & Drop
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            try {
                const dt = new DataTransfer();
                dt.items.add(file);
                passportInput.files = dt.files;
            } catch (err) {
                // Fallback for older browsers
            }
            validateAndDisplayFile(file);
        }
    });

    passportInput.addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
            validateAndDisplayFile(this.files[0]);
        } else {
            uploadFilename.textContent = "";
            clearFieldError(uploadZone);
            updateProgress();
        }
    });
}

// ============================================
// 5. Inline Error Display Helpers
// ============================================
function setFieldError(element, message) {
    clearFieldError(element);
    element.classList.add("has-error", "input-error");
    const parent = element.closest(".form-group") || element.parentElement;
    if (parent) {
        const errorEl = document.createElement("span");
        errorEl.className = "field-error-msg";
        errorEl.textContent = message;
        parent.appendChild(errorEl);
    }
}

function clearFieldError(element) {
    element.classList.remove("has-error", "input-error");
    const parent = element.closest(".form-group") || element.parentElement;
    if (parent) {
        const existing = parent.querySelectorAll(".field-error-msg");
        existing.forEach(el => el.remove());
    }
}

function clearAllErrors() {
    document.querySelectorAll(".has-error, .input-error").forEach(el => {
        el.classList.remove("has-error", "input-error");
    });
    document.querySelectorAll(".field-error-msg").forEach(el => el.remove());
}

// ============================================
// 6. Real-time Progress Tracking (Fix Additional Bug: False completion)
// ============================================
function checkSectionComplete(index) {
    switch (index) {
        case 0: { // Personal Info
            const name = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("contactNumber").value.trim();
            const dob = document.getElementById("dob").value;
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
            return name.length >= 2 && emailRegex.test(email) && phone.replace(/[^0-9]/g, "").length >= 7 && Boolean(dob);
        }
        case 1: { // Experience & Role
            const exp = document.getElementById("experience").value;
            const roleChecked = document.querySelectorAll('input[name="role"]:checked').length > 0;
            return Boolean(exp) && roleChecked;
        }
        case 2: { // Preferences
            const regionChecked = Boolean(document.querySelector('input[name="region"]:checked'));
            const contactMethod = document.getElementById("contactMethod").value;
            return regionChecked && Boolean(contactMethod);
        }
        case 3: { // Documents
            return passportInput.files && passportInput.files.length > 0 && !uploadZone.classList.contains("has-error");
        }
        case 4: { // Final Notes & Terms
            return document.getElementById("terms").checked;
        }
        default:
            return false;
    }
}

function updateProgress() {
    let completedCount = 0;
    sections.forEach((_, i) => {
        const isDone = checkSectionComplete(i);
        if (steps[i]) {
            if (isDone) {
                steps[i].classList.add("completed");
                completedCount++;
            } else {
                steps[i].classList.remove("completed");
            }
        }
    });

    const percent = Math.round((completedCount / sections.length) * 100);
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressPercent) progressPercent.textContent = percent;
}

// Active step indicator on scroll
window.addEventListener("scroll", function () {
    let currentIdx = 0;
    sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 180) {
            currentIdx = idx;
        }
    });
    steps.forEach((step, idx) => {
        if (idx === currentIdx) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }
    });
}, { passive: true });

// ============================================
// 7. Form Submission & Comprehensive Validation
// ============================================
if (form) {
    form.addEventListener("input", function (e) {
        if (e.target.classList.contains("input-error")) {
            clearFieldError(e.target);
        }
        updateProgress();
    });

    form.addEventListener("change", function (e) {
        if (e.target.classList.contains("input-error")) {
            clearFieldError(e.target);
        }
        updateProgress();
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        clearAllErrors();

        let hasError = false;
        let firstInvalidElement = null;

        function markInvalid(element, message) {
            hasError = true;
            setFieldError(element, message);
            if (!firstInvalidElement) {
                firstInvalidElement = element;
            }
        }

        // 1. Full Name
        const fullNameInput = document.getElementById("fullName");
        const fullName = fullNameInput.value.trim();
        if (!fullName) {
            markInvalid(fullNameInput, "Full Name is required.");
        } else if (fullName.length < 2) {
            markInvalid(fullNameInput, "Please enter a valid full name (at least 2 characters).");
        }

        // 2. Email (Fix Bug #4: Robust RFC Validation)
        const emailInput = document.getElementById("email");
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!email) {
            markInvalid(emailInput, "Email address is required.");
        } else if (!emailRegex.test(email) || !email.includes(".") || email.split(".").pop().length < 2) {
            markInvalid(emailInput, "Please enter a valid email address (e.g. name@domain.com).");
        }

        // 3. Contact Number (Fix Additional Bug: Validate Phone Format)
        const phoneInput = document.getElementById("contactNumber");
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[0-9\-\+\s]{7,15}$/;
        const digits = phone.replace(/[^0-9]/g, "");
        if (!phone) {
            markInvalid(phoneInput, "Contact number is required.");
        } else if (!phoneRegex.test(phone) || digits.length < 7 || digits.length > 15) {
            markInvalid(phoneInput, "Please enter a valid phone number (7-15 digits).");
        }

        // 4. Date of Birth (Fix Additional Bug: DOB & Age Validation)
        const dobVal = dobInput.value;
        if (!dobVal) {
            markInvalid(dobInput, "Date of Birth is required.");
        } else {
            const birthDate = new Date(dobVal);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (birthDate > today) {
                markInvalid(dobInput, "Date of Birth cannot be in the future.");
            } else if (age < 18) {
                markInvalid(dobInput, "Applicants must be at least 18 years old.");
            } else if (age > 100) {
                markInvalid(dobInput, "Please enter a realistic date of birth.");
            }
        }

        // 5. Archaeology Experience (Fix Additional Bug: Missing Check)
        const expSelect = document.getElementById("experience");
        if (!expSelect.value || expSelect.value === "") {
            markInvalid(expSelect, "Please select your archaeology experience level.");
        }

        // 6. Preferred Role (Fix Additional Bug: Missing Check)
        const roleGrid = document.querySelector(".role-grid");
        const selectedRoles = document.querySelectorAll('input[name="role"]:checked');
        if (selectedRoles.length === 0) {
            markInvalid(roleGrid, "Please select at least one role for the expedition.");
        }

        // 7. Preferred Expedition Region (Fix Additional Bug: Missing Check)
        const radioList = document.querySelector(".radio-list");
        const selectedRegion = document.querySelector('input[name="region"]:checked');
        if (!selectedRegion) {
            markInvalid(radioList, "Please select your preferred expedition region.");
        }

        // 8. Preferred Contact Method (Fix Additional Bug: Missing Check)
        const contactMethodSelect = document.getElementById("contactMethod");
        if (!contactMethodSelect.value || contactMethodSelect.value === "") {
            markInvalid(contactMethodSelect, "Please select your preferred contact method.");
        }

        // 9. Passport / ID (Fix Bug #3: Type & Size Verification)
        if (!passportInput.files || passportInput.files.length === 0) {
            markInvalid(uploadZone, "Please upload your Passport or ID.");
        } else {
            const file = passportInput.files[0];
            const isFileValid = validateAndDisplayFile(file);
            if (!isFileValid) {
                hasError = true;
                if (!firstInvalidElement) firstInvalidElement = uploadZone;
            }
        }

        // 10. Terms & Conditions
        const termsInput = document.getElementById("terms");
        if (!termsInput.checked) {
            markInvalid(termsInput, "You must agree to the Terms and Conditions to submit.");
        }

        // If there are errors, scroll to the first invalid field
        if (hasError) {
            if (firstInvalidElement) {
                firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
                if (typeof firstInvalidElement.focus === "function") {
                    firstInvalidElement.focus();
                }
            }
            return;
        }

        // Form is 100% valid!
        const roleValues = Array.from(selectedRoles).map(r => r.value).join(", ");
        const countryCode = document.querySelector(".country-code").value;

        alert(
            "🎉 Registration Submitted Successfully!\n\n" +
            "• Name: " + fullName + "\n" +
            "• Email: " + email + "\n" +
            "• Phone: " + countryCode + " " + phone + "\n" +
            "• Experience: " + expSelect.value + "\n" +
            "• Roles: " + roleValues + "\n" +
            "• Region: " + selectedRegion.value + "\n" +
            "• Salary: $" + salarySlider.value + "/week\n" +
            "• File: " + passportInput.files[0].name + "\n\n" +
            "Welcome to the expedition, " + fullName + "!"
        );
    });

    // ============================================
    // 8. Form Reset Handler
    // ============================================
    form.addEventListener("reset", function () {
        setTimeout(function () {
            // Properly reset salary display to slider default value (700)
            if (salaryDisplay && salarySlider) {
                salaryDisplay.textContent = salarySlider.defaultValue || "700";
            }
            if (charCount) charCount.textContent = "0";
            if (uploadFilename) uploadFilename.textContent = "";

            clearAllErrors();

            // Reset progress
            steps.forEach(function (step, i) {
                step.classList.remove("completed");
                if (i === 0) step.classList.add("active");
                else step.classList.remove("active");
            });
            if (progressBar) progressBar.style.width = "0%";
            if (progressPercent) progressPercent.textContent = "0";
        }, 10);
    });
}
