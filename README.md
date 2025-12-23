# Job Application Autofill - Chrome Extension

A Chrome extension (Manifest V3) that automatically fills job application forms with intelligent field detection and data persistence.

## 🎥 Demo

### Extension Setup & Configuration
![Setup Demo](assets/setup-demo.gif)

### Autofill in Action
![Autofill Demo](assets/autofill-demo.gif)

## 🎯 Features

- **Smart Field Detection**: Recognizes 14+ field types using multiple selector strategies
- **Split Field Support**: Handles separate first/middle/last name fields and phone number components
- **Phone Format Handling**: Automatically extracts 10-digit numbers from international formats
- **Confirmation Fields**: Auto-fills email/phone verification fields
- **Character Limit Handling**: Smart truncation with word boundary preservation
- **Visual Feedback**: Green highlighting for successfully filled fields
- **Persistent Storage**: Chrome sync storage for cross-device data synchronization

## 🚀 Installation

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the extension folder
4. Pin the extension to your toolbar

## 📖 Usage

1. Click the extension icon and enter your information
2. Click **Save Settings**
3. Navigate to any job application form
4. Click **Autofill Form** button
5. Review and submit

## 🛠️ Technical Implementation

### Tech Stack
- **JavaScript ES6+**: Async/await, arrow functions, destructuring, array methods
- **Chrome Extension API (Manifest V3)**: Latest extension framework
- **Chrome Storage Sync API**: Cross-device data persistence
- **DOM Manipulation**: QuerySelector, event dispatching, computed styles

### Architecture

```
Extension Flow:
User Input → Chrome Storage → Content Script Injection → Field Detection → Autofill → Visual Feedback
```

**Key Components:**
- `manifest.json` - Manifest V3 configuration with permissions
- `popup.js` - Settings management and message passing (120 lines)
- `content.js` - Field detection and autofill logic (440 lines)
- `styles.css` - Modern responsive UI styling

### Field Detection Strategy

**Multi-Pattern Detection:**
- Attributes: name, id, placeholder, aria-label, autocomplete
- Negative patterns to exclude false positives (e.g., skill name ≠ first name)
- Visibility checking to skip hidden fields
- Priority-based filling for optimal results

**Supported Fields:**
First/Middle/Last Name, Full Name, Email, Email Confirm, Phone, Phone Confirm, Country Code, Skills, LinkedIn, GitHub, Portfolio, City

### Data Flow

1. **Save**: User input → Validation → Chrome storage
2. **Autofill**: Storage retrieval → Tab injection → Message passing → Field detection → Value insertion → Event triggering
3. **Feedback**: Success count → Status display

### Key Technical Decisions

**Phone Number Handling:**
```javascript
// Extracts 10-digit number from any format
function getPhoneWithoutCountryCode(phone) {
  const allDigits = phone.replace(/\D/g, '');
  if (allDigits.length === 11 && allDigits[0] === '1') return allDigits.substring(1);
  if (allDigits.length > 10) return allDigits.slice(-10);
  return allDigits;
}
```

**Full Name Construction:**
```javascript
// Dynamically builds full name from components
const fullName = [userData.firstName, userData.middleName, userData.lastName]
  .filter(n => n && n.trim())
  .join(' ');
```

**Character Limit Handling:**
```javascript
// Smart truncation preserving word boundaries
if (value.length > maxLength) {
  finalValue = field.tagName === 'TEXTAREA' 
    ? truncateText(value, maxLength)
    : value.substring(0, maxLength);
}
```

## 🧪 Testing

Test files included:
- `test-form.html` - Basic form testing
- `test-form-advanced.html` - Split fields and edge cases
- `test-edge-cases.html` - Comprehensive validation suite

**Real-world tested on:** LinkedIn, Indeed, Glassdoor, company career pages

## 📋 Project Structure

```
zobsai/
├── manifest.json              # Manifest V3 configuration
├── popup.html/js              # UI and settings (120 lines)
├── content.js                 # Field detection & autofill (440 lines)
├── styles.css                 # Responsive styling
├── icons/                     # Extension icons
├── assets/                    # Demo GIFs
└── test-*.html                # Test files
```

## 🔒 Security & Privacy

- Local-only storage (Chrome sync)
- No external API calls
- No data collection or tracking
- Secure permissions (activeTab, scripting, storage)


