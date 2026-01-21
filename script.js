class PasswordStrengthChecker {
    constructor() {
        this.passwordInput = document.getElementById('password-input');
        this.toggleButton = document.getElementById('toggle-password');
        this.toggleIcon = document.getElementById('toggle-icon');
        this.strengthSection = document.getElementById('strength-section');
        this.emptyState = document.getElementById('empty-state');
        this.strengthBar = document.getElementById('strength-bar');
        this.strengthText = document.getElementById('strength-text');
        this.checklist = document.getElementById('checklist');
        this.feedbackSection = document.getElementById('feedback-section');
        this.suggestions = document.getElementById('suggestions');
        
        this.commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
            '123123', 'qwerty123', 'password1234', 'admin123', 'root', 'toor',
            'pass', 'test', 'guest', 'user', 'login', 'default'
        ];
        
        this.init();
    }
    
    init() {
        this.passwordInput.addEventListener('input', () => this.handlePasswordInput());
        this.toggleButton.addEventListener('click', () => this.togglePasswordVisibility());
        this.passwordInput.addEventListener('paste', (e) => {
            setTimeout(() => this.handlePasswordInput(), 10);
        });
    }
    
    togglePasswordVisibility() {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        this.toggleIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
    
    handlePasswordInput() {
        const password = this.passwordInput.value;
        
        if (password.length === 0) {
            this.hideStrengthSection();
            return;
        }
        
        this.showStrengthSection();
        const analysis = this.analyzePassword(password);
        this.updateUI(analysis);
    }
    
    showStrengthSection() {
        this.strengthSection.classList.remove('hidden');
        this.emptyState.classList.add('hidden');
        this.strengthSection.classList.add('slide-in');
    }
    
    hideStrengthSection() {
        this.strengthSection.classList.add('hidden');
        this.emptyState.classList.remove('hidden');
    }
    
    analyzePassword(password) {
        const checks = {
            length: password.length >= 8,
            length12: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            noCommon: !this.isCommonPassword(password)
        };
        
        let score = 0;
        let suggestions = [];
        
        if (checks.length) score += 1;
        if (checks.length12) score += 1;
        if (checks.uppercase) score += 1;
        if (checks.lowercase) score += 1;
        if (checks.numbers) score += 1;
        if (checks.special) score += 1;
        if (checks.noCommon) score += 1;
        
        if (!checks.length) suggestions.push('Use at least 8 characters');
        if (!checks.length12 && password.length >= 8) suggestions.push('Consider using 12+ characters for better security');
        if (!checks.uppercase) suggestions.push('Add uppercase letters');
        if (!checks.lowercase) suggestions.push('Add lowercase letters');
        if (!checks.numbers) suggestions.push('Include numbers');
        if (!checks.special) suggestions.push('Add special characters (!@#$%^&*)');
        if (!checks.noCommon) suggestions.push('Avoid common passwords');
        
        if (password.length > 0 && password.length < 6) {
            suggestions.push('Password is too short - very weak security');
        }
        
        const strength = this.calculateStrength(score, password.length);
        
        return {
            checks,
            score,
            maxScore: 7,
            strength,
            percentage: (score / 7) * 100,
            suggestions
        };
    }
    
    isCommonPassword(password) {
        const lowerPassword = password.toLowerCase();
        return this.commonPasswords.some(common => 
            lowerPassword.includes(common) || common.includes(lowerPassword)
        );
    }
    
    calculateStrength(score, length) {
        if (score <= 2) return 'weak';
        if (score <= 3) return 'fair';
        if (score <= 4) return 'good';
        if (score <= 6) return 'strong';
        return 'very-strong';
    }
    
    updateUI(analysis) {
        this.updateStrengthBar(analysis);
        this.updateStrengthText(analysis);
        this.updateChecklist(analysis.checks);
        this.updateSuggestions(analysis.suggestions);
    }
    
    updateStrengthBar(analysis) {
        const bar = this.strengthBar;
        bar.style.setProperty('--strength', `${analysis.percentage}%`);
        
        bar.className = `progress-bar h-full rounded-full strength-${analysis.strength}`;
    }
    
    updateStrengthText(analysis) {
        const text = this.strengthText;
        const strengthLabels = {
            'weak': 'Weak',
            'fair': 'Fair',
            'good': 'Good',
            'strong': 'Strong',
            'very-strong': 'Very Strong'
        };
        
        const strengthColors = {
            'weak': 'text-red-500',
            'fair': 'text-amber-500',
            'good': 'text-yellow-500',
            'strong': 'text-lime-500',
            'very-strong': 'text-green-500'
        };
        
        text.textContent = strengthLabels[analysis.strength];
        text.className = `text-sm font-bold strength-indicator ${strengthColors[analysis.strength]}`;
    }
    
    updateChecklist(checks) {
        Object.keys(checks).forEach(rule => {
            const item = document.querySelector(`[data-rule="${rule}"]`);
            if (item) {
                const icon = item.querySelector('i');
                if (checks[rule]) {
                    item.classList.add('completed');
                    icon.className = 'fas fa-check-circle mr-2 text-xs';
                } else {
                    item.classList.remove('completed');
                    icon.className = 'fas fa-circle mr-2 text-xs';
                }
            }
        });
    }
    
    updateSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.feedbackSection.classList.add('hidden');
            return;
        }
        
        this.feedbackSection.classList.remove('hidden');
        this.suggestions.innerHTML = suggestions
            .map(suggestion => `<li>• ${suggestion}</li>`)
            .join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthChecker();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const passwordInput = document.getElementById('password-input');
        if (document.activeElement === passwordInput) {
            passwordInput.blur();
        }
    }
});
