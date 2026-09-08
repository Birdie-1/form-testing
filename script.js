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
            const nameValid = name.length >= 2 && name.length <= 50 && /^[a-zA-Z\u0E00-\u0E7F\u0400-\u04FF\s'\-]+$/.test(name);
            const phoneDigits = phone.replace(/[^0-9]/g, "");
            const phoneValid = /^[0-9\-\+\s]+$/.test(phone) && phone.length <= 15 && phoneDigits.length >= 7 && phoneDigits.length <= 15;
            const strictEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,10}$/;
            const emailValid = email.length <= 100 && !/[^\x00-\x7F]/.test(email) && strictEmailRegex.test(email);
            return nameValid && emailValid && phoneValid && Boolean(dob);
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
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("contactNumber");

    // 1. Full Name Live Validation
    const nameRegex = /^[a-zA-Z\u0E00-\u0E7F\u0400-\u04FF\s'\-]+$/;

    function validateFullNameLive(isBlurOrSubmit = false) {
        if (!fullNameInput) return true;
        const rawVal = fullNameInput.value;
        const val = rawVal.trim();

        if (!val) {
            if (isBlurOrSubmit) {
                setFieldError(fullNameInput, "Full Name is required.");
            } else {
                clearFieldError(fullNameInput);
            }
            return false;
        }

        // Check for special characters or numbers immediately on every input
        if (!nameRegex.test(val)) {
            setFieldError(fullNameInput, "Numbers and special characters are not permitted.");
            return false;
        }

        if (rawVal.length > 50) {
            setFieldError(fullNameInput, "Full Name must not exceed 50 characters.");
            return false;
        }

        if (val.length < 2) {
            if (isBlurOrSubmit) {
                setFieldError(fullNameInput, "Full Name must be between 2 and 50 characters.");
                return false;
            }
            clearFieldError(fullNameInput);
            return false;
        }

        clearFieldError(fullNameInput);
        return true;
    }

    if (fullNameInput) {
        fullNameInput.addEventListener("input", function () {
            validateFullNameLive(false);
        });
        fullNameInput.addEventListener("blur", function () {
            validateFullNameLive(true);
        });
    }

    // 2. Email Live Validation (Strict ASCII, No Thai characters, valid domain & TLD)
    const strictEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,10}$/;

    function validateEmailLive(isBlurOrSubmit = false) {
        if (!emailInput) return true;
        const rawVal = emailInput.value;
        const val = rawVal.trim();

        if (!val) {
            if (isBlurOrSubmit) {
                setFieldError(emailInput, "Email address is required.");
            } else {
                clearFieldError(emailInput);
            }
            return false;
        }

        if (rawVal.length > 100) {
            setFieldError(emailInput, "Email address must not exceed 100 characters.");
            return false;
        }

        if (/[^\x00-\x7F]/.test(val)) {
            setFieldError(emailInput, "Email cannot contain Thai or non-ASCII characters.");
            return false;
        }

        if (isBlurOrSubmit) {
            if (!strictEmailRegex.test(val)) {
                setFieldError(emailInput, "Please enter a valid email address (e.g. name@domain.com).");
                return false;
            }
        } else if (emailInput.classList.contains("input-error")) {
            if (!strictEmailRegex.test(val)) {
                setFieldError(emailInput, "Please enter a valid email address (e.g. name@domain.com).");
                return false;
            }
        }

        clearFieldError(emailInput);
        return true;
    }

    if (emailInput) {
        emailInput.addEventListener("input", function () {
            validateEmailLive(false);
        });
        emailInput.addEventListener("compositionend", function () {
            validateEmailLive(false);
        });
        emailInput.addEventListener("keyup", function () {
            validateEmailLive(false);
        });
        emailInput.addEventListener("blur", function () {
            validateEmailLive(true);
        });
        emailInput.addEventListener("paste", function () {
            setTimeout(function () {
                validateEmailLive(false);
            }, 10);
        });
    }

    // 3. Contact Number Live Validation
    function validatePhoneLive(isBlurOrSubmit = false) {
        if (!phoneInput) return true;
        const rawVal = phoneInput.value;
        const val = rawVal.trim();

        if (!val) {
            if (isBlurOrSubmit) {
                setFieldError(phoneInput, "Contact number is required.");
            } else {
                clearFieldError(phoneInput);
            }
            return false;
        }

        if (rawVal.length > 15) {
            setFieldError(phoneInput, "Contact number must not exceed 15 characters.");
            return false;
        }

        if (!/^[0-9\-\+\s]+$/.test(val)) {
            setFieldError(phoneInput, "Only digits, '+', '-', and spaces are permitted.");
            return false;
        }

        const digits = val.replace(/[^0-9]/g, "");
        if (isBlurOrSubmit || phoneInput.classList.contains("input-error")) {
            if (digits.length < 7 || digits.length > 15) {
                setFieldError(phoneInput, "Contact number must contain between 7 and 15 digits.");
                return false;
            }
        }

        clearFieldError(phoneInput);
        return true;
    }

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            validatePhoneLive(false);
        });
        phoneInput.addEventListener("blur", function () {
            validatePhoneLive(true);
        });
    }

    form.addEventListener("input", function (e) {
        if (e.target !== fullNameInput && e.target !== emailInput && e.target !== phoneInput && e.target.classList.contains("input-error")) {
            clearFieldError(e.target);
        }
        updateProgress();
    });

    // Initial validation for restored/cached input values on page load
    setTimeout(function () {
        if (fullNameInput && fullNameInput.value) validateFullNameLive(false);
        if (emailInput && emailInput.value) validateEmailLive(false);
        if (phoneInput && phoneInput.value) validatePhoneLive(false);
        updateProgress();
    }, 100);

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
        if (!validateFullNameLive(true)) {
            hasError = true;
            if (!firstInvalidElement) firstInvalidElement = fullNameInput;
        }

        // 2. Email
        if (!validateEmailLive(true)) {
            hasError = true;
            if (!firstInvalidElement) firstInvalidElement = emailInput;
        }

        // 3. Contact Number
        if (!validatePhoneLive(true)) {
            hasError = true;
            if (!firstInvalidElement) firstInvalidElement = phoneInput;
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
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
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
