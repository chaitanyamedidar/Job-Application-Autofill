const autofillBtn = document.getElementById('autofillBtn');
const saveBtn = document.getElementById('saveBtn');
const statusDiv = document.getElementById('status');
const firstNameInput = document.getElementById('firstName');
const middleNameInput = document.getElementById('middleName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const skillsInput = document.getElementById('skills');
const linkedInInput = document.getElementById('linkedIn');
const githubInput = document.getElementById('github');
const portfolioInput = document.getElementById('portfolio');
const cityInput = document.getElementById('city');

function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
  }, 3000);
}

async function loadUserData() {
  try {
    const data = await chrome.storage.sync.get(['userData']);
    if (data.userData) {
      firstNameInput.value = data.userData.firstName || '';
      middleNameInput.value = data.userData.middleName || '';
      lastNameInput.value = data.userData.lastName || '';
      emailInput.value = data.userData.email || '';
      phoneInput.value = data.userData.phone || '';
      skillsInput.value = data.userData.skills || '';
      linkedInInput.value = data.userData.linkedIn || '';
      githubInput.value = data.userData.github || '';
      portfolioInput.value = data.userData.portfolio || '';
      cityInput.value = data.userData.city || '';
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    showStatus('Failed to load saved data', 'error');
  }
}

async function saveUserData() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  
  if (!firstName || !lastName) {
    showStatus('Please enter at least First Name and Last Name', 'error');
    return;
  }
  
  const middleName = middleNameInput.value.trim();
  const userData = {
    firstName,
    middleName,
    lastName,
    fullName: middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`,
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    skills: skillsInput.value.trim(),
    linkedIn: linkedInInput.value.trim(),
    github: githubInput.value.trim(),
    portfolio: portfolioInput.value.trim(),
    city: cityInput.value.trim()
  };
  
  try {
    await chrome.storage.sync.set({ userData });
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving user data:', error);
    showStatus('Failed to save settings', 'error');
  }
}

async function triggerAutofill() {
  try {
    const data = await chrome.storage.sync.get(['userData']);
    if (!data.userData) {
      showStatus('Please save your settings first!', 'error');
      return;
    }
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      showStatus('No active tab found', 'error');
      return;
    }
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    } catch (e) {}
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Send message to content script to autofill
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'autofill', userData: data.userData },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Connection error:', chrome.runtime.lastError);
          showStatus('Please refresh the page and try again', 'error');
          return;
        }
        
        if (response && response.success) {
          showStatus(`Autofilled ${response.fieldsFound} field(s)!`, 'success');
        } else {
          showStatus(response?.message || 'No fields found to autofill', 'info');
        }
      }
    );
  } catch (error) {
    console.error('Error triggering autofill:', error);
    showStatus('Failed to autofill form', 'error');
  }
}

autofillBtn.addEventListener('click', triggerAutofill);
saveBtn.addEventListener('click', saveUserData);
document.addEventListener('DOMContentLoaded', loadUserData);
