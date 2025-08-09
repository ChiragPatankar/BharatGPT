# 🧪 BharatGPT Testing Guide

## 🌐 Your Live BharatGPT URL
**https://bharatgpt-server.officialchiragp1605.workers.dev**

## 🔧 Testing Methods

### 1. **PowerShell/Command Line Testing**
```powershell
# Test 1: Service Health
curl https://bharatgpt-server.officialchiragp1605.workers.dev/health

# Test 2: Service Info (see all features)
curl https://bharatgpt-server.officialchiragp1605.workers.dev/

# Test 3: Regional Information
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/location?pincode=110001"

# Test 4: Government Schemes
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/schemes?location=Maharashtra"

# Test 5: All Supported Languages
curl https://bharatgpt-server.officialchiragp1605.workers.dev/languages
```

### 2. **AI Chat Testing (PowerShell)**
```powershell
# Hindi Farming Question (Delhi)
Invoke-RestMethod -Uri "https://bharatgpt-server.officialchiragp1605.workers.dev/ask" -Method POST -ContentType "application/json" -Body '{"prompt":"सर्दी में दिल्ली में कौन सी फसल बोनी चाहिए?","location":"110001","language":"hi","userType":"farmer"}'

# English Government Scheme Query (Mumbai)
Invoke-RestMethod -Uri "https://bharatgpt-server.officialchiragp1605.workers.dev/ask" -Method POST -ContentType "application/json" -Body '{"prompt":"How can I apply for PM-Kisan scheme?","location":"400001","language":"en","userType":"farmer"}'

# Marathi Agricultural Question (Maharashtra)
Invoke-RestMethod -Uri "https://bharatgpt-server.officialchiragp1605.workers.dev/ask" -Method POST -ContentType "application/json" -Body '{"prompt":"महाराष्ट्रात कोणत्या शेतकरी योजना आहेत?","location":"400001","language":"mr","userType":"farmer"}'
```

### 3. **Web Browser Testing**
Just paste these URLs in your browser:

```
https://bharatgpt-server.officialchiragp1605.workers.dev/
https://bharatgpt-server.officialchiragp1605.workers.dev/health
https://bharatgpt-server.officialchiragp1605.workers.dev/location?pincode=560001
https://bharatgpt-server.officialchiragp1605.workers.dev/schemes?location=Karnataka
https://bharatgpt-server.officialchiragp1605.workers.dev/languages
```

### 4. **Postman/API Testing Tool**
Import this collection:

**POST** `https://bharatgpt-server.officialchiragp1605.workers.dev/ask`
Headers: `Content-Type: application/json`
Body:
```json
{
  "prompt": "Tell me about crops suitable for winter in Delhi",
  "location": "110001",
  "language": "en",
  "userType": "farmer"
}
```

## 🎯 Key Test Scenarios

### **Scenario 1: Regional Intelligence Test**
Test the same question from different locations to see different responses:

```bash
# Delhi (110001)
{"prompt":"What crops should I grow in winter?","location":"110001","language":"en"}

# Mumbai (400001) 
{"prompt":"What crops should I grow in winter?","location":"400001","language":"en"}

# Bangalore (560001)
{"prompt":"What crops should I grow in winter?","location":"560001","language":"en"}
```

**Expected**: Different crop recommendations based on region.

### **Scenario 2: Multilingual Support Test**
Same question in different languages:

```bash
# Hindi
{"prompt":"सरकारी योजनाओं के बारे में बताएं","location":"110001","language":"hi"}

# English
{"prompt":"Tell me about government schemes","location":"110001","language":"en"}

# Marathi
{"prompt":"सरकारी योजनांबद्दल सांगा","location":"400001","language":"mr"}
```

### **Scenario 3: User Type Awareness Test**
```bash
# Farmer
{"prompt":"Help me with farming advice","userType":"farmer","location":"110001"}

# Citizen
{"prompt":"Help me with farming advice","userType":"citizen","location":"110001"}
```

### **Scenario 4: Government Schemes Test**
```bash
# Test scheme lookup by state
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/schemes?location=Gujarat"
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/schemes?location=Kerala"
```

## 🚀 Advanced Testing

### **Load Testing**
```bash
# Run multiple requests to test performance
for i in {1..10}; do
  curl https://bharatgpt-server.officialchiragp1605.workers.dev/health &
done
```

### **Error Handling Test**
```bash
# Test with invalid data
curl -X POST https://bharatgpt-server.officialchiragp1605.workers.dev/ask \
  -H "Content-Type: application/json" \
  -d '{"invalid":"data"}'

# Test invalid pin code
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/location?pincode=000000"
```

## 📊 What to Look For

### **✅ Success Indicators:**
- **Health endpoint** returns 200 status
- **AI responses** are contextual and in correct language
- **Regional data** shows correct crops/schemes for location
- **Fast response times** (< 3 seconds for text)
- **Proper error handling** for invalid requests

### **🔍 Testing Checklist:**
- [ ] Service health check works
- [ ] Regional knowledge returns correct data
- [ ] Government schemes API works
- [ ] AI responds in requested language
- [ ] Different locations give different advice
- [ ] Error handling works properly
- [ ] CORS headers present for frontend use

## 🎨 Frontend Testing (Future)
For a web interface, you could create:

```html
<!DOCTYPE html>
<html>
<head>
    <title>BharatGPT Test</title>
</head>
<body>
    <div id="test-container">
        <h1>BharatGPT Testing Interface</h1>
        <input type="text" id="question" placeholder="Ask a question...">
        <select id="language">
            <option value="hi">Hindi</option>
            <option value="en">English</option>
            <option value="mr">Marathi</option>
        </select>
        <input type="text" id="location" placeholder="Pin code or location">
        <button onclick="askBharatGPT()">Ask BharatGPT</button>
        <div id="response"></div>
    </div>

    <script>
        async function askBharatGPT() {
            const response = await fetch('https://bharatgpt-server.officialchiragp1605.workers.dev/ask', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    prompt: document.getElementById('question').value,
                    language: document.getElementById('language').value,
                    location: document.getElementById('location').value,
                    userType: 'farmer'
                })
            });
            const data = await response.json();
            document.getElementById('response').innerHTML = data.response;
        }
    </script>
</body>
</html>
```

## 🏆 Demo Script for Hackathon

```bash
echo "🌟 BharatGPT Demo - Hyper-local AI for Rural India"
echo "1. Health Check..."
curl https://bharatgpt-server.officialchiragp1605.workers.dev/health

echo -e "\n2. Regional Intelligence - Delhi Pin Code..."
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/location?pincode=110001"

echo -e "\n3. Hindi Farming Question..."
# Show AI response in Hindi for Delhi winter crops

echo -e "\n4. Government Schemes for Maharashtra..."
curl "https://bharatgpt-server.officialchiragp1605.workers.dev/schemes?location=Maharashtra"

echo -e "\n5. Multilingual Support..."
# Demo same question in different languages

echo "🇮🇳 BharatGPT - Ready to serve India's 600M+ rural population!"
```

Ready to test? Let me know which method you'd like to try first!