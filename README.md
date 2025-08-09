# BharatGPT - Hyper-local Multilingual AI Assistant

[![Puch.ai Hackathon](https://img.shields.io/badge/Puch.ai-Hackathon-blue)](https://puch.ai)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)

BharatGPT is a hyper-local multilingual AI assistant designed specifically for India's tier 2, tier 3, and rural regions. Built for the Puch.ai Hackathon, it provides contextual, location-based personalized responses in 10+ Indian languages.

## 🚀 Enhanced Features (v2.0 + Voice)

- **🎤 Complete Voice Integration**: Speech-to-Text, Text-to-Speech, and full voice conversations
- **🌍 Multilingual Voice Support**: Voice processing in 12+ Indian languages
- **🗣️ Regional Voice Selection**: Language-specific voice models for authentic experience
- **📍 Pin Code Intelligence**: Precise location-based content with 10+ major regions
- **🎯 Regional Knowledge Base**: State-specific crops, schemes, weather patterns, and languages
- **🌾 Agricultural Intelligence**: Season-aware crop recommendations and regional farming advice
- **🏛️ Government Schemes API**: Real-time scheme information with application guidance
- **👤 User Type Awareness**: Farmer, citizen, student-specific responses
- **📅 Season-Aware Responses**: Current season context in agricultural advice
- **🔗 Government Integration Ready**: Prepared for DigiLocker, PM-Kisan, UPI APIs
- **📱 Voice + Text Complete**: Full voice conversation capabilities for rural users
- **⚡ Enhanced Performance**: Cloudflare Workers for global low-latency

## 📡 API Endpoints

### POST `/ask` - Enhanced Chat Endpoint
Main endpoint for asking questions to BharatGPT with advanced regional context.

**Request Body:**
```json
{
  "prompt": "सर्दी में कौन सी फसल बोनी चाहिए?",
  "location": "110001", // Pin code (6 digits) or region name
  "language": "hi", // ISO language code (hi, en, mr, ta, etc.)
  "userType": "farmer" // User type for context (farmer, citizen, student, etc.)
}
```

**Enhanced Response:**
```json
{
  "success": true,
  "response": "दिल्ली की जलवायु और मौसम को देखते हुए, सर्दी में गेहूं, सरसों और मटर की खेती सबसे अच्छी होती है...",
  "metadata": {
    "location": "110001",
    "language": "hi",
    "userType": "farmer",
    "regionalContext": {
      "region": "Delhi",
      "state": "Delhi", 
      "crops": ["wheat", "mustard"],
      "schemes": ["PM-KISAN", "Delhi Solar Policy"],
      "weather": "arid"
    },
    "season": "सर्दी (Winter)",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "service": "BharatGPT"
  }
}
```

### GET `/location?pincode={pincode}` - Regional Information
Get detailed regional information for a specific pin code.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "region": "Mumbai",
    "state": "Maharashtra",
    "schemes": ["Baliraja Solar", "PM-KISAN"],
    "crops": ["rice", "sugarcane"],
    "weather": "tropical",
    "languages": ["mr", "hi", "en"]
  },
  "pincode": "400001"
}
```

### GET `/schemes?location={location}` - Government Schemes
Get government schemes available for a specific location or all schemes.

**Example Response:**
```json
{
  "success": true,
  "schemes": ["PM-KISAN", "Rythu Bandhu"],
  "location": "Telangana",
  "schemeDetails": {
    "PM-KISAN": {
      "name": "Pradhan Mantri Kisan Samman Nidhi",
      "benefit": "₹6000 per year",
      "helpline": "155261"
    }
  }
}
```

### GET `/languages` - Supported Languages
Get all supported languages and their regional availability.

**Example Response:**
```json
{
  "success": true,
  "supportedLanguages": {
    "hi": "Hindi",
    "mr": "Marathi",
    "ta": "Tamil",
    "te": "Telugu"
  },
  "totalLanguages": 12,
  "regions": {
    "hi": ["Delhi", "Mumbai", "Bangalore"],
    "mr": ["Mumbai"]
  }
}
```

### GET `/` - Service Information
Enhanced service information with feature overview.

### POST `/voice/stt` - Speech-to-Text
Convert audio to text with language detection and optional BharatGPT processing.

**Request (multipart/form-data):**
```
audio: [audio file] (required) - MP3, WAV, M4A supported
language: "hi" (optional) - Target language or "auto" for detection
location: "110001" (optional) - Pin code for context
userType: "farmer" (optional) - User type for context
processResponse: "true" (optional) - Process transcription through BharatGPT
```

**Response:**
```json
{
  "success": true,
  "transcription": "सर्दी में कौन सी फसल बोनी चाहिए?",
  "detectedLanguage": "hi",
  "response": "BharatGPT response if processResponse=true",
  "metadata": {
    "audioSize": 45678,
    "audioType": "audio/mpeg",
    "service": "BharatGPT-STT"
  }
}
```

### POST `/voice/tts` - Text-to-Speech
Convert text to speech with regional voice selection.

**Request Body:**
```json
{
  "text": "दिल्ली में सर्दी में गेहूं और सरसों बोना अच्छा होता है",
  "language": "hi",
  "voice": "alloy",
  "format": "mp3"
}
```

**Response:** Audio file (MP3) with appropriate Content-Type headers.

### POST `/voice/chat` - Complete Voice Conversation
End-to-end voice interaction: Speech → Text → BharatGPT → Speech

**Request (multipart/form-data):**
```
audio: [audio file] (required)
language: "hi" (optional)
location: "110001" (optional)
userType: "farmer" (optional)
responseFormat: "both" (optional) - "text", "audio", or "both"
```

**Response (if responseFormat="both"):**
```json
{
  "success": true,
  "transcription": "User's spoken question",
  "response": "BharatGPT's text response",
  "hasAudio": true,
  "metadata": {
    "language": "hi",
    "location": "110001",
    "service": "BharatGPT-VoiceChat"
  }
}
```

**Response (if responseFormat="audio"):** Audio file with transcription in headers.

### GET `/health` - Health Check
Health check endpoint for monitoring.

## 🛠️ Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`
- Puch.ai API key

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd BharatGPT
npm install
```

### 2. Configure Secrets
```bash
# Login to Cloudflare (if not already done)
wrangler auth login

# Set your Groq API key as a secret
wrangler secret put GROQ_API_KEY
# Enter your Groq API key when prompted

# Optional: Set OpenAI API key for voice processing
wrangler secret put OPENAI_API_KEY
```

### 3. Deploy to Cloudflare Workers
```bash
# Deploy to production
npm run deploy

# Or for development with hot reload
npm run dev
```

### 4. Test Your Deployment
```bash
# Test the health endpoint
curl https://bharatgpt-server.<your-subdomain>.workers.dev/health

# Test the main /ask endpoint
curl -X POST https://bharatgpt-server.<your-subdomain>.workers.dev/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What are the best crops to grow in Punjab during winter?",
    "location": "Punjab",
    "language": "English"
  }'
```

## 📋 Hackathon Submission

After successful deployment, submit to the Puch.ai Hackathon leaderboard:

```bash
/hackathon submission add bharatgpt-server https://github.com/<yourusername>/bharatgpt
```

**Server ID:** `bharatgpt-server`

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for fast AI inference (stored as Wrangler secret) | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key for voice processing (Whisper STT/TTS) | Optional |
| `ENVIRONMENT` | Deployment environment (set in wrangler.toml) | No |

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │───▶│  Cloudflare      │───▶│   Puch.ai       │
│   Frontend      │    │  Worker          │    │   API           │
│   (Future)      │    │  (BharatGPT)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Government APIs │
                       │  • DigiLocker    │
                       │  • PM-Kisan      │
                       │  • Mandi Prices  │
                       │  • Weather API   │
                       └──────────────────┘
```

## 📱 Example Use Cases

### 1. Agricultural Queries
```json
{
  "prompt": "When should I plant wheat in Haryana?",
  "location": "Haryana",
  "language": "Hindi"
}
```

### 2. Government Schemes
```json
{
  "prompt": "How to apply for PM-Kisan scheme?",
  "location": "123456",
  "language": "English"
}
```

### 3. Local Information
```json
{
  "prompt": "Weather forecast for next week",
  "location": "Mumbai",
  "language": "Marathi"
}
```

## 🌟 Future Enhancements

- **React Native Frontend**: Voice input, offline mode, beautiful UI
- **Government API Integration**: Real-time scheme data, document verification
- **Advanced Personalization**: User profiles, farming calendars, local events
- **Regional Content**: News, market prices, weather alerts
- **Offline Capabilities**: Cached responses for common queries

## 🤝 Contributing

This project was built for the Puch.ai Hackathon. Contributions, suggestions, and feedback are welcome!

## 📜 License

MIT License - see LICENSE file for details.

## 🏆 Hackathon Details

- **Event**: Puch.ai Hackathon 2024
- **Category**: Multilingual AI Assistant
- **Target Audience**: Indian rural and semi-urban populations
- **Technology Stack**: Cloudflare Workers, Puch.ai API, Node.js

---

**Built with ❤️ for India's digital transformation**