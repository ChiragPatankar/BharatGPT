# 🚀 How to Get Your Groq API Key for BharatGPT

## Why Groq?

✅ **FREE TIER**: Generous free usage  
✅ **SUPER FAST**: 10x faster than OpenAI  
✅ **HIGH QUALITY**: Llama 3 models  
✅ **NO WAITLIST**: Instant access  

## 🔑 Getting Your Groq API Key

### Step 1: Sign Up
1. Go to **[https://console.groq.com](https://console.groq.com)**
2. Click "Sign Up" (it's completely free!)
3. Sign up with Google/GitHub or email

### Step 2: Get API Key
1. Once logged in, go to **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name like "BharatGPT"
4. **Copy the API key** (starts with `gsk_...`)

### Step 3: Set in BharatGPT
```bash
wrangler secret put GROQ_API_KEY
# Paste your API key when prompted
```

### Step 4: Deploy
```bash
npm run deploy
```

## 🎯 What You Get with Groq

### **Free Tier Limits:**
- **6,000 tokens/minute** 
- **30 requests/minute**
- **14,400 tokens/day**

### **Available Models:**
- `llama3-8b-8192` (Fast, efficient)
- `llama3-70b-8192` (More powerful)
- `mixtral-8x7b-32768` (Great for multilingual)
- `gemma-7b-it` (Alternative option)

## 🌟 Why This Works Perfectly for BharatGPT

✅ **Multilingual**: Llama 3 handles Hindi, Marathi, Tamil excellently  
✅ **Speed**: Rural users get instant responses  
✅ **Cost**: Free tier covers thousands of questions  
✅ **Quality**: Better than GPT-3.5 for many tasks  

## 🔧 Optional: Add OpenAI for Voice

For voice processing (STT/TTS), you can optionally add OpenAI:

```bash
wrangler secret put OPENAI_API_KEY
```

Get OpenAI key at: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 🚀 Ready to Go!

Once you set the Groq API key, BharatGPT will have:
- **Real AI responses** instead of demo mode
- **Lightning-fast inference** 
- **Multilingual conversations**
- **Regional intelligence**
- **Cultural context**

**Your rural users will love the speed!** 🇮🇳