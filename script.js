// ✅ Input Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function sanitizeInput(input) {
    return input.trim()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
}

// Additional validation functions
function validateUsername(username) {
    // Username: 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

function validatePhone(phone) {
    // Phone: Thai format or international format
    const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateAge(age) {
    const numAge = parseInt(age);
    return numAge >= 1 && numAge <= 120;
}

function validateWebsite(url) {
    if (!url) return true; // Optional field
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function validatePasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
    return checks;
}

// DOM Elements
const form = document.getElementById('registrationForm');
const validationResults = document.getElementById('validationResults');
const sanitizationResults = document.getElementById('sanitizationResults');
const clearFormBtn = document.getElementById('clearForm');

// Form fields
const fields = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    phone: document.getElementById('phone'),
    age: document.getElementById('age'),
    website: document.getElementById('website'),
    bio: document.getElementById('bio'),
    terms: document.getElementById('terms')
};

// Real-time validation
function setupRealTimeValidation() {
    // Username validation
    fields.username.addEventListener('input', function() {
        const isValid = validateUsername(this.value);
        updateFieldValidation(this, isValid, 'Username must be 3-20 characters, alphanumeric and underscore only');
    });

    // Email validation
    fields.email.addEventListener('input', function() {
        const isValid = validateEmail(this.value);
        updateFieldValidation(this, isValid, 'Please enter a valid email address');
    });

    // Password validation with strength indicator
    fields.password.addEventListener('input', function() {
        const strength = validatePasswordStrength(this.value);
        const isValid = validatePassword(this.value);
        
        updateFieldValidation(this, isValid, 'Password does not meet requirements');
        updatePasswordRequirements(strength);
    });

    // Confirm password validation
    fields.confirmPassword.addEventListener('input', function() {
        const isValid = this.value === fields.password.value;
        updateFieldValidation(this, isValid, 'Passwords do not match');
    });

    // Phone validation
    fields.phone.addEventListener('input', function() {
        const isValid = validatePhone(this.value);
        updateFieldValidation(this, isValid, 'Please enter a valid Thai phone number');
    });

    // Age validation
    fields.age.addEventListener('input', function() {
        const isValid = validateAge(this.value);
        updateFieldValidation(this, isValid, 'Age must be between 1 and 120');
    });

    // Website validation
    fields.website.addEventListener('input', function() {
        const isValid = validateWebsite(this.value);
        updateFieldValidation(this, isValid, 'Please enter a valid URL');
    });

    // Bio sanitization demonstration
    fields.bio.addEventListener('input', function() {
        const original = this.value;
        const sanitized = sanitizeInput(original);
        
        if (original !== sanitized) {
            sanitizationResults.innerHTML = `
                <h4>🔍 Sanitization Results:</h4>
                <div class="sanitization-demo">
                    <strong>Original:</strong> ${original}<br>
                    <strong>Sanitized:</strong> ${sanitized}
                </div>
            `;
        } else {
            sanitizationResults.innerHTML = `
                <h4>✅ No HTML detected</h4>
                <p>Your input is clean and safe.</p>
            `;
        }
    });
}

// Update field validation status
function updateFieldValidation(field, isValid, errorMessage) {
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        errorElement.textContent = '';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        errorElement.textContent = errorMessage;
    }
    
    updateValidationResults();
}

// Update password requirements display
function updatePasswordRequirements(strength) {
    const checks = ['length', 'uppercase', 'lowercase', 'number'];
    
    checks.forEach(check => {
        const element = document.getElementById(`${check}-check`);
        if (strength[check]) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    });
}

// Update validation results display
function updateValidationResults() {
    const results = [];
    
    // Check all fields
    if (fields.username.value) {
        results.push({
            field: 'Username',
            valid: validateUsername(fields.username.value)
        });
    }
    
    if (fields.email.value) {
        results.push({
            field: 'Email',
            valid: validateEmail(fields.email.value)
        });
    }
    
    if (fields.password.value) {
        results.push({
            field: 'Password',
            valid: validatePassword(fields.password.value)
        });
    }
    
    if (fields.confirmPassword.value) {
        results.push({
            field: 'Password Confirmation',
            valid: fields.confirmPassword.value === fields.password.value
        });
    }
    
    if (fields.phone.value) {
        results.push({
            field: 'Phone',
            valid: validatePhone(fields.phone.value)
        });
    }
    
    if (fields.age.value) {
        results.push({
            field: 'Age',
            valid: validateAge(fields.age.value)
        });
    }
    
    if (fields.website.value) {
        results.push({
            field: 'Website',
            valid: validateWebsite(fields.website.value)
        });
    }
    
    if (fields.terms.checked) {
        results.push({
            field: 'Terms & Conditions',
            valid: true
        });
    }
    
    // Display results
    if (results.length > 0) {
        const resultsHTML = results.map(result => `
            <div class="validation-item">
                <span>${result.field}</span>
                <span class="validation-status ${result.valid ? 'valid' : 'invalid'}">
                    ${result.valid ? '✅ Valid' : '❌ Invalid'}
                </span>
            </div>
        `).join('');
        
        validationResults.innerHTML = `
            <h4>📊 Field Validation Status</h4>
            ${resultsHTML}
        `;
    } else {
        validationResults.innerHTML = `
            <p>Fill out the form to see validation results...</p>
        `;
    }
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        username: fields.username.value,
        email: fields.email.value,
        password: fields.password.value,
        confirmPassword: fields.confirmPassword.value,
        phone: fields.phone.value,
        age: fields.age.value,
        website: fields.website.value,
        bio: fields.bio.value,
        terms: fields.terms.checked
    };
    
    // Validate all fields
    const validation = {
        username: validateUsername(formData.username),
        email: validateEmail(formData.email),
        password: validatePassword(formData.password),
        confirmPassword: formData.password === formData.confirmPassword,
        phone: validatePhone(formData.phone),
        age: validateAge(formData.age),
        website: validateWebsite(formData.website),
        terms: formData.terms
    };
    
    // Check if all validations pass
    const allValid = Object.values(validation).every(v => v);
    
    if (allValid) {
        // Sanitize data before processing
        const sanitizedData = {
            ...formData,
            username: sanitizeInput(formData.username),
            bio: sanitizeInput(formData.bio)
        };
        
        // Show success message
        showSuccessMessage('Form submitted successfully!', sanitizedData);
        
        // Reset form
        setTimeout(() => {
            form.reset();
            resetValidation();
        }, 2000);
    } else {
        // Show error message
        showErrorMessage('Please fix the validation errors before submitting.');
        
        // Add shake animation to invalid fields
        Object.keys(validation).forEach(key => {
            if (!validation[key] && fields[key]) {
                fields[key].classList.add('shake');
                setTimeout(() => fields[key].classList.remove('shake'), 500);
            }
        });
    }
});

// Clear form
clearFormBtn.addEventListener('click', function() {
    form.reset();
    resetValidation();
    validationResults.innerHTML = '<p>Fill out the form to see validation results...</p>';
    sanitizationResults.innerHTML = '<p>Enter HTML in the bio field to see sanitization in action...</p>';
});

// Reset validation state
function resetValidation() {
    Object.values(fields).forEach(field => {
        if (field && field.classList) {
            field.classList.remove('valid', 'invalid');
        }
    });
    
    // Reset password requirements
    document.querySelectorAll('.password-requirements li').forEach(li => {
        li.classList.remove('valid');
    });
}

// Show success message
function showSuccessMessage(message, data) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3>🎉 ${message}</h3>
        <div class="sanitization-demo">
            <strong>Sanitized Data:</strong><br>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 400px;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<h3>❌ ${message}</h3>`;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f56565;
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 400px;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupRealTimeValidation();
    
    // Add some example data for testing
    console.log('Lab 3: Input Validation & Sanitization loaded successfully!');
    console.log('Try entering these test values:');
    console.log('- Username: test123');
    console.log('- Email: test@example.com');
    console.log('- Password: TestPass123');
    console.log('- Phone: 0812345678');
    console.log('- Bio: <script>alert("XSS")</script>');
}); 