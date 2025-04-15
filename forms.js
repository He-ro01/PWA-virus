// =================== Auth Switcher ===================
const AuthSwitcher = (() => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    return {
        ShowSignup: () => {
            signupForm.style.display = "flex";
            loginForm.style.display = "none";
        },
        ShowLogin: () => {
            signupForm.style.display = "none";
            loginForm.style.display = "flex";
        },
        init: () => { },
    };
})();

// =================== Main Script ===================
document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const passwordInput = document.getElementById("signup_password");
    const loginSwitch = document.getElementById("login-switcher");
    const signupSwitch = document.getElementById("register-switcher");

    AuthSwitcher.init();

    loginSwitch.addEventListener("click", () => {
        AuthSwitcher.ShowLogin();
    });

    signupSwitch.addEventListener("click", () => {
        AuthSwitcher.ShowSignup();
    });

    // ===================== Password Live Check =====================
 

    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.trim() === "") {
            requirementsDiv.style.display = "none";
        }
    });

    const barsContainer = document.querySelector(".password-strength-bars");

    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        let passwordStrength = 0;

        if (password.length >= 8) passwordStrength++;
        if (/[A-Z]/.test(password)) passwordStrength++;
        if (/[0-9]/.test(password)) passwordStrength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) passwordStrength++;

        barsContainer.innerHTML = "";

        for (let i = 0; i < 4; i++) {
            const unit = document.createElement("div");
            unit.classList.add("password-strength-fill-unit");

            if (i < passwordStrength) {
                if (passwordStrength <= 1) {
                    unit.classList.add("red");
                } else if (passwordStrength === 2) {
                    unit.classList.add("orange");
                } else if (passwordStrength >= 3) {
                    unit.classList.add("green");
                }
            }

            barsContainer.appendChild(unit);
        }
    });



    function isPasswordValid(password) {
        return (
            password.length >= 8
        );
    }

    // ===================== TOGGLER: Button Spinner =====================
    function toggleButtonLoading(button, isLoading) {
        const spinner = button.querySelector(".spinner");
        const span = button.querySelector("span");
        if (spinner && span) {
            spinner.style.display = isLoading ? "inline-block" : "none";
            span.style.display = isLoading ? "none" : "inline";
            button.disabled = isLoading;
        }
    }

    // ===================== SIGNUP =====================
    signupForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const signupButton = signupForm.querySelector("button[type='submit']");
        toggleButtonLoading(signupButton, true);


        const mobileInput = document
            .getElementById("signup-mobile-number")
            .value.trim();

        const password = passwordInput.value;
        const confirmPassword = document.getElementById("confirm-password").value;
        displayInputError(passwordInput, password !== confirmPassword, "Passwords dont match")

        if (password !== confirmPassword) {
            toggleButtonLoading(signupButton, false);
            return;
        }
        displayInputError(passwordInput,!isPasswordValid(password),"password must be 8 digits" )
        if (!isPasswordValid(password)) {
            toggleButtonLoading(signupButton, false);
            return;
        }

        let formattedMobileNumber = mobileInput.startsWith("0")
            ? "234" + mobileInput.slice(1)
            : mobileInput;

        try {

            const data = {
               
                mobileNumber: formattedMobileNumber,
                password,
            };

            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem("zd_token", result.token);
                alert("Signup successful!");
                console.log("Token:", result.token);
                signupForm.reset();
                location.reload();
            } else {
                showError("username", result.error || "Signup failed.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Something went wrong!");
        }

        toggleButtonLoading(signupButton, false);
    });

    // ===================== LOGIN =====================
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginButton = loginForm.querySelector("button[type='submit']");
        toggleButtonLoading(loginButton, true);

        const data = {
            email: document.getElementById("login-phone").value,
            password: document.getElementById("login_password").value,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem("zd_token", result.token);
                alert("Login successful");
                console.log("User:", result.user);
                loginForm.reset();
                location.reload();
            } else {
                alert(result.message || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong!");
        }

        toggleButtonLoading(loginButton, false);
    });

    // ===================== LOGOUT =====================
    document.getElementById("logout-button")?.addEventListener("click", () => {
        localStorage.removeItem("zd_token");
        sessionStorage.removeItem("zd_token");
        location.reload();
    });
});

function displayInputError(startElement, show, error) {
    if (!startElement) return;

    // Climb up DOM to find the nearest parent with class "field"
    let fieldElement = startElement;
    while (fieldElement && !fieldElement.classList.contains("field")) {
        fieldElement = fieldElement.parentElement;
    }

    // If no .field found, use the original element
    const field = fieldElement || startElement;
    const wrapper = field.querySelector(".input-field-wrapper");
    let errorDiv = field.querySelector(".input-error");

    if (show) {
        if (!errorDiv) {
            errorDiv = document.createElement("div");
            errorDiv.className = "input-error";
            errorDiv.innerHTML = `
                <span class="material-icons">error</span>
                <span></span>
            `;
        }

        const errorText = errorDiv.querySelector("span:last-child");
        errorText.textContent = error;
        errorDiv.style.display = "flex";

        // Only insert if not already in the DOM
        if (!field.contains(errorDiv)) {
            if (wrapper) {
                wrapper.insertAdjacentElement("afterend", errorDiv);
            } else {
                field.appendChild(errorDiv);
            }
        }
    } else {
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}
