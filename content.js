function shouldExcludeField(field, excludePatterns) {
  const text = [
    field.name,
    field.id,
    field.placeholder,
    field.getAttribute('aria-label')
  ].join(' ').toLowerCase();
  
  return excludePatterns.some(pattern => text.includes(pattern));
}

function getFirstName(fullName) {
  return fullName.trim().split(/\s+/)[0];
}

function getLastName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(' ') : '';
}

function getPhoneWithoutCountryCode(phone) {
  if (!phone) return '';
  const allDigits = phone.replace(/\D/g, '');
  if (allDigits.length === 11 && allDigits[0] === '1') return allDigits.substring(1);
  if (allDigits.length > 10) return allDigits.slice(-10);
  return allDigits;
}

function getCountryCode(phone) {
  if (!phone) return '1';
  const allDigits = phone.replace(/\D/g, '');
  if (allDigits.length === 11 && allDigits[0] === '1') return '1';
  if (allDigits.length > 10) return allDigits.slice(0, allDigits.length - 10);
  return '1';
}

function getMiddleName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > maxLength * 0.8 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

function getFieldMaxLength(field) {
  const maxLength = field.getAttribute('maxlength');
  return maxLength ? parseInt(maxLength) : Infinity;
}

function detectFormFields(fieldType) {
  const selectors = {
    firstName: [
      'input[name*="first" i][name*="name" i]',
      'input[name="firstname" i]',
      'input[name="fname" i]',
      'input[id*="first" i][id*="name" i]',
      'input[id="firstname" i]',
      'input[id="fname" i]',
      'input[placeholder*="first" i][placeholder*="name" i]',
      'input[autocomplete="given-name"]',
      'input[aria-label*="first" i][aria-label*="name" i]'
    ],
    lastName: [
      'input[name*="last" i][name*="name" i]',
      'input[name="lastname" i]',
      'input[name="lname" i]',
      'input[name*="surname" i]',
      'input[id*="last" i][id*="name" i]',
      'input[id="lastname" i]',
      'input[id="lname" i]',
      'input[id*="surname" i]',
      'input[placeholder*="last" i][placeholder*="name" i]',
      'input[placeholder*="surname" i]',
      'input[autocomplete="family-name"]',
      'input[aria-label*="last" i][aria-label*="name" i]'
    ],
    middleName: [
      'input[name*="middle" i][name*="name" i]',
      'input[name="middlename" i]',
      'input[name="mname" i]',
      'input[id*="middle" i][id*="name" i]',
      'input[id="middlename" i]',
      'input[placeholder*="middle" i][placeholder*="name" i]',
      'input[autocomplete="additional-name"]'
    ],
    fullName: [
      'input[name="name" i]:not([name*="first" i]):not([name*="last" i]):not([name*="middle" i]):not([name*="user" i]):not([name*="company" i])',
      'input[name="fullname" i]',
      'input[name*="full" i][name*="name" i]',
      'input[id="name" i]:not([id*="first" i]):not([id*="last" i]):not([id*="middle" i]):not([id*="user" i]):not([id*="company" i])',
      'input[id="fullname" i]',
      'input[id*="full" i][id*="name" i]',
      'input[placeholder*="full" i][placeholder*="name" i]',
      'input[autocomplete="name"]',
      'input[aria-label*="full" i][aria-label*="name" i]'
    ],
    email: [
      'input[type="email"]:not([name*="confirm" i]):not([id*="confirm" i]):not([name*="verify" i])',
      'input[name*="email" i]:not([name*="confirm" i]):not([name*="verify" i])',
      'input[id*="email" i]:not([id*="confirm" i]):not([id*="verify" i])',
      'input[placeholder*="email" i]:not([placeholder*="confirm" i]):not([placeholder*="verify" i])',
      'input[aria-label*="email" i]:not([aria-label*="confirm" i])',
      'input[autocomplete="email"]'
    ],
    emailConfirm: [
      'input[name*="confirm" i][name*="email" i]',
      'input[name*="verify" i][name*="email" i]',
      'input[id*="confirm" i][id*="email" i]',
      'input[id*="verify" i][id*="email" i]',
      'input[placeholder*="confirm" i][placeholder*="email" i]',
      'input[placeholder*="verify" i][placeholder*="email" i]'
    ],
    countryCode: [
      'input[name*="country" i][name*="code" i]',
      'input[name*="countrycode" i]',
      'input[id*="country" i][id*="code" i]',
      'input[id*="countrycode" i]',
      'input[placeholder*="country" i][placeholder*="code" i]',
      'select[name*="country" i][name*="code" i]',
      'select[id*="country" i][id*="code" i]'
    ],
    phone: [
      'input[type="tel"]:not([name*="country" i]):not([id*="country" i]):not([name*="confirm" i]):not([id*="confirm" i])',
      'input[name*="phone" i]:not([name*="country" i]):not([name*="confirm" i])',
      'input[name*="mobile" i]:not([name*="country" i]):not([name*="confirm" i])',
      'input[name*="contact" i]:not([name*="email" i]):not([name*="confirm" i])',
      'input[id*="phone" i]:not([id*="country" i]):not([id*="confirm" i])',
      'input[id*="mobile" i]:not([id*="country" i]):not([id*="confirm" i])',
      'input[id*="contact" i]:not([id*="email" i]):not([id*="confirm" i])',
      'input[placeholder*="phone" i]:not([placeholder*="country" i]):not([placeholder*="confirm" i])',
      'input[autocomplete="tel"]'
    ],
    phoneConfirm: [
      'input[name*="confirm" i][name*="phone" i]',
      'input[name*="confirm" i][name*="mobile" i]',
      'input[id*="confirm" i][id*="phone" i]',
      'input[id*="confirm" i][id*="mobile" i]',
      'input[placeholder*="confirm" i][placeholder*="phone" i]'
    ],
    linkedIn: [
      'input[name*="linkedin" i]',
      'input[name*="linked-in" i]',
      'input[id*="linkedin" i]',
      'input[id*="linked-in" i]',
      'input[placeholder*="linkedin" i]',
      'input[placeholder*="linkedin.com" i]',
      'input[aria-label*="linkedin" i]'
    ],
    portfolio: [
      'input[name*="portfolio" i]',
      'input[name*="website" i]:not([name*="company" i])',
      'input[name*="personal" i][name*="site" i]',
      'input[id*="portfolio" i]',
      'input[id*="website" i]:not([id*="company" i])',
      'input[placeholder*="portfolio" i]',
      'input[placeholder*="personal website" i]',
      'input[type="url"]:not([name*="linkedin" i]):not([name*="github" i])'
    ],
    github: [
      'input[name*="github" i]',
      'input[id*="github" i]',
      'input[placeholder*="github" i]',
      'input[placeholder*="github.com" i]'
    ],
    coverLetter: [
      'textarea[name*="cover" i][name*="letter" i]',
      'textarea[name*="coverletter" i]',
      'textarea[id*="cover" i][id*="letter" i]',
      'textarea[id*="coverletter" i]',
      'textarea[placeholder*="cover letter" i]',
      'textarea[placeholder*="why you" i]',
      'textarea[placeholder*="why are you interested" i]'
    ],
    skills: [
      'textarea[name*="skill" i]:not([name*="name" i])',
      'textarea[name*="experience" i]',
      'textarea[name*="expertise" i]',
      'textarea[id*="skill" i]:not([id*="name" i])',
      'textarea[id*="experience" i]',
      'textarea[id*="expertise" i]',
      'textarea[placeholder*="skill" i]:not([placeholder*="name" i])',
      'textarea[placeholder*="experience" i]',
      'textarea[aria-label*="skill" i]:not([aria-label*="name" i])',
      'input[name*="skill" i]:not([name*="name" i])',
      'input[id*="skill" i]:not([id*="name" i])'
    ],
    city: [
      'input[name*="city" i]:not([name*="prefer" i])',
      'input[id*="city" i]:not([id*="prefer" i])',
      'input[placeholder*="city" i]',
      'input[autocomplete="address-level2"]'
    ],
    currentCompany: [
      'input[name*="current" i][name*="company" i]',
      'input[name*="current" i][name*="employer" i]',
      'input[id*="current" i][id*="company" i]',
      'input[id*="current" i][id*="employer" i]',
      'input[placeholder*="current company" i]',
      'input[placeholder*="current employer" i]'
    ]
  };
  
  const fields = [];
  const selectionList = selectors[fieldType] || [];
  
  for (const selector of selectionList) {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Avoid duplicates and hidden fields
        if (!fields.includes(el) && isVisible(el)) {
          fields.push(el);
        }
      });
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
    }
  }
  
  return fields;
}

function isVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetParent !== null;
}

function fillField(field, value) {
  if (!field || !value) return false;
  
  const maxLength = getFieldMaxLength(field);
  let finalValue = value;
  
  if (value.length > maxLength) {
    finalValue = field.tagName === 'TEXTAREA' 
      ? truncateText(value, maxLength)
      : value.substring(0, maxLength);
  }
  
  field.value = finalValue;
  
  const events = [
    new Event('input', { bubbles: true }),
    new Event('change', { bubbles: true }),
    new Event('blur', { bubbles: true })
  ];
  events.forEach(event => field.dispatchEvent(event));
  
  // Add visual feedback
  field.style.transition = 'background-color 0.3s ease';
  field.style.backgroundColor = '#d4edda';
  
  setTimeout(() => {
    field.style.backgroundColor = '';
  }, 1000);
  
  return true;
}

function autofillForm(userData) {
  let fieldsFound = 0;
  const fullName = [userData.firstName, userData.middleName, userData.lastName]
    .filter(n => n && n.trim())
    .join(' ');
  
  const firstNameFields = detectFormFields('firstName');
  const lastNameFields = detectFormFields('lastName');
  const middleNameFields = detectFormFields('middleName');
  
  if (firstNameFields.length > 0 && userData.firstName) {
    firstNameFields.forEach(field => {
      if (fillField(field, userData.firstName)) fieldsFound++;
    });
  }
  
  if (middleNameFields.length > 0 && userData.middleName) {
    middleNameFields.forEach(field => {
      if (fillField(field, userData.middleName)) fieldsFound++;
    });
  }
  
  if (lastNameFields.length > 0 && userData.lastName) {
    lastNameFields.forEach(field => {
      if (fillField(field, userData.lastName)) fieldsFound++;
    });
  }
  
  if (firstNameFields.length === 0 && lastNameFields.length === 0) {
    const fullNameFields = detectFormFields('fullName');
    if (fullNameFields.length > 0 && fullName) {
      fullNameFields.forEach(field => {
        if (fillField(field, fullName)) fieldsFound++;
      });
    }
  }
  
  const emailFields = detectFormFields('email');
  if (emailFields.length > 0 && userData.email) {
    emailFields.forEach(field => {
      if (fillField(field, userData.email)) fieldsFound++;
    });
  }
  
  const emailConfirmFields = detectFormFields('emailConfirm');
  if (emailConfirmFields.length > 0 && userData.email) {
    emailConfirmFields.forEach(field => {
      if (fillField(field, userData.email)) fieldsFound++;
    });
  }
  
  const countryCodeFields = detectFormFields('countryCode');
  if (countryCodeFields.length > 0 && userData.phone) {
    const countryCode = getCountryCode(userData.phone);
    countryCodeFields.forEach(field => {
      if (field.tagName === 'SELECT') {
        const option = Array.from(field.options).find(opt => 
          opt.value.includes(countryCode) || opt.text.includes(countryCode)
        );
        if (option) {
          field.value = option.value;
          field.dispatchEvent(new Event('change', { bubbles: true }));
          fieldsFound++;
        }
      } else {
        if (fillField(field, '+' + countryCode)) fieldsFound++;
      }
    });
  }
  
  const phoneFields = detectFormFields('phone');
  if (phoneFields.length > 0 && userData.phone) {
    const phoneValue = getPhoneWithoutCountryCode(userData.phone);
    phoneFields.forEach(field => {
      if (fillField(field, phoneValue)) fieldsFound++;
    });
  }
  
  const phoneConfirmFields = detectFormFields('phoneConfirm');
  if (phoneConfirmFields.length > 0 && userData.phone) {
    const phoneValue = getPhoneWithoutCountryCode(userData.phone);
    phoneConfirmFields.forEach(field => {
      if (fillField(field, phoneValue)) fieldsFound++;
    });
  }
  
  const skillsFields = detectFormFields('skills');
  if (skillsFields.length > 0 && userData.skills) {
    skillsFields.forEach(field => {
      if (fillField(field, userData.skills)) fieldsFound++;
    });
  }
  
  if (userData.linkedIn) {
    const linkedInFields = detectFormFields('linkedIn');
    linkedInFields.forEach(field => {
      if (fillField(field, userData.linkedIn)) fieldsFound++;
    });
  }
  
  if (userData.github) {
    const githubFields = detectFormFields('github');
    githubFields.forEach(field => {
      if (fillField(field, userData.github)) fieldsFound++;
    });
  }
  
  if (userData.portfolio) {
    const portfolioFields = detectFormFields('portfolio');
    portfolioFields.forEach(field => {
      if (fillField(field, userData.portfolio)) fieldsFound++;
    });
  }
  
  if (userData.city) {
    const cityFields = detectFormFields('city');
    cityFields.forEach(field => {
      if (fillField(field, userData.city)) fieldsFound++;
    });
  }
  
  return {
    success: fieldsFound > 0,
    fieldsFound,
    message: fieldsFound > 0 
      ? `Successfully autofilled ${fieldsFound} field(s)` 
      : 'No compatible form fields found on this page'
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autofill') {
    try {
      const result = autofillForm(request.userData);
      sendResponse(result);
    } catch (error) {
      console.error('Autofill error:', error);
      sendResponse({
        success: false,
        fieldsFound: 0,
        message: 'Error: ' + error.message
      });
    }
  }
  return true;
});
