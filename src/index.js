/**
 * BharatGPT - Hyper-local multilingual AI assistant for India
 * Cloudflare Worker implementation for Puch.ai Hackathon
 * 
 * Features:
 * - Multilingual support (10+ Indian languages)
 * - Location-based personalization
 * - Government schemes and local information
 * - Agricultural and weather data integration
 */

// CORS headers for cross-origin requests (React Native frontend)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Response helper function
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Regional knowledge base for location-specific context
const regionalKnowledge = {
  // Major cities and regions
  "110001": { region: "Delhi", state: "Delhi", schemes: ["PM-KISAN", "Delhi Solar Policy"], crops: ["wheat", "mustard"], weather: "arid", languages: ["hi", "en", "pa"] },
  "400001": { region: "Mumbai", state: "Maharashtra", schemes: ["Baliraja Solar", "PM-KISAN"], crops: ["rice", "sugarcane"], weather: "tropical", languages: ["mr", "hi", "en"] },
  "560001": { region: "Bangalore", state: "Karnataka", schemes: ["Krishi Sinchai", "PM-KISAN"], crops: ["ragi", "maize"], weather: "moderate", languages: ["kn", "hi", "en"] },
  "500001": { region: "Hyderabad", state: "Telangana", schemes: ["Rythu Bandhu", "PM-KISAN"], crops: ["rice", "cotton"], weather: "semi-arid", languages: ["te", "hi", "en"] },
  "600001": { region: "Chennai", state: "Tamil Nadu", schemes: ["Uzhavar Sandhai", "PM-KISAN"], crops: ["rice", "sugarcane"], weather: "tropical", languages: ["ta", "hi", "en"] },
  "700001": { region: "Kolkata", state: "West Bengal", schemes: ["Krishak Bandhu", "PM-KISAN"], crops: ["rice", "jute"], weather: "humid subtropical", languages: ["bn", "hi", "en"] },
  "380001": { region: "Ahmedabad", state: "Gujarat", schemes: ["Mukhyamantri Solar Pump", "PM-KISAN"], crops: ["cotton", "groundnut"], weather: "arid", languages: ["gu", "hi", "en"] },
  "302001": { region: "Jaipur", state: "Rajasthan", schemes: ["Rajasthan Solar Policy", "PM-KISAN"], crops: ["bajra", "mustard"], weather: "arid", languages: ["hi", "en"] },
  "682001": { region: "Kochi", state: "Kerala", schemes: ["Kerala Karshaka Sangham", "PM-KISAN"], crops: ["coconut", "spices"], weather: "tropical", languages: ["ml", "hi", "en"] },
  "751001": { region: "Bhubaneswar", state: "Odisha", schemes: ["KALIA", "PM-KISAN"], crops: ["rice", "vegetables"], weather: "tropical", languages: ["or", "hi", "en"] }
};

// Language configuration
const supportedLanguages = {
  'hi': 'Hindi',
  'mr': 'Marathi', 
  'bn': 'Bengali',
  'ta': 'Tamil',
  'te': 'Telugu',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'or': 'Odia',
  'pa': 'Punjabi',
  'as': 'Assamese',
  'ml': 'Malayalam',
  'en': 'English'
};

// Enhanced prompt template with regional context
function createBharatGPTPrompt(query, location = 'India', language = 'English', userType = 'citizen') {
  // Try to get regional context from pin code or location name
  let regionalContext = null;
  
  // Check if location is a pin code
  if (location.match(/^\d{6}$/)) {
    regionalContext = regionalKnowledge[location];
  } else {
    // Try to find by region name
    regionalContext = Object.values(regionalKnowledge).find(region => 
      region.region.toLowerCase().includes(location.toLowerCase()) ||
      region.state.toLowerCase().includes(location.toLowerCase())
    );
  }

  const currentSeason = getCurrentSeason();
  const languageName = supportedLanguages[language] || language;
  
  let contextInfo = `स्थान: ${location}`;
  if (regionalContext) {
    contextInfo += ` (${regionalContext.region}, ${regionalContext.state})
मुख्य फसलें: ${regionalContext.crops.join(', ')}
मुख्य योजनाएं: ${regionalContext.schemes.join(', ')}
मौसम प्रकार: ${regionalContext.weather}`;
  }

  return `आप BharatGPT हैं - भारत के ग्रामीण और अर्ध-शहरी क्षेत्रों के लिए एक विशेष AI सहायक।

संदर्भ जानकारी:
${contextInfo}
उपयोगकर्ता प्रकार: ${userType}
भाषा: ${languageName}
मौसम: ${currentSeason}

आपके दिशा-निर्देश:
1. ${languageName} भाषा में प्राकृतिक रूप से उत्तर दें
2. ${location} के लिए स्थानीय और व्यावहारिक जानकारी प्रदान करें
3. कृषि प्रश्नों के लिए: मंडी भाव, मौसम की जानकारी, और फसल की सलाह दें
4. सरकारी योजनाओं के लिए: आवेदन की पूरी प्रक्रिया, आवश्यक दस्तावेज, और पात्रता बताएं
5. सरल, स्पष्ट भाषा का उपयोग करें जो ग्रामीण लोग समझ सकें
6. व्यावहारिक, क्रियान्वित करने योग्य सलाह दें
7. जब संभव हो तो हेल्पलाइन नंबर और वेबसाइट की जानकारी दें
8. भारतीय संस्कृति और परंपराओं का सम्मान करें

उपयोगकर्ता का प्रश्न: ${query}

उत्तर (${languageName} में, यदि आवश्यक हो तो अंग्रेजी अनुवाद के साथ):`;
}

// Helper function to get current season
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'गर्मी (Summer)';
  if (month >= 6 && month <= 9) return 'मानसून (Monsoon)';
  if (month >= 10 && month <= 11) return 'शरद ऋतु (Post-Monsoon)';
  return 'सर्दी (Winter)';
}

// Groq API integration for text (Free tier with fast inference)
async function callGroq(prompt, apiKey) {
  try {
    console.log('Calling Groq API...');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Fast Llama 3 model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Groq API response received');
    
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

// OpenAI Speech-to-Text integration
async function callOpenAISTT(audioFile, language, apiKey) {
  try {
    console.log('Calling OpenAI Whisper API...');
    
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    if (language && language !== 'auto') {
      formData.append('language', language);
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI STT API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI STT response received');
    
    return data.text || 'Could not transcribe audio.';
  } catch (error) {
    console.error('Error calling OpenAI STT API:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

// OpenAI Text-to-Speech integration
async function callOpenAITTS(text, language, voice, apiKey) {
  try {
    console.log('Calling OpenAI TTS API...');
    
    // Map language codes to voice preferences
    const voiceMapping = {
      'hi': 'alloy', // Hindi
      'mr': 'echo',  // Marathi  
      'ta': 'fable', // Tamil
      'te': 'onyx',  // Telugu
      'gu': 'nova',  // Gujarati
      'bn': 'shimmer', // Bengali
      'en': voice || 'alloy'
    };

    const selectedVoice = voiceMapping[language] || voice || 'alloy';

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: selectedVoice,
        response_format: 'mp3'
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText}`);
    }

    console.log('OpenAI TTS response received');
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error calling OpenAI TTS API:', error);
    throw new Error(`Failed to generate speech: ${error.message}`);
  }
}

// Main request handler
async function handleRequest(request, env) {
  const url = new URL(request.url);
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Main API info endpoint
  if (url.pathname === '/' && request.method === 'GET') {
    return jsonResponse({
      server_id: 'bharatgpt-server',
      service: 'BharatGPT API',
      version: '2.0.0',
      status: 'active',
      description: 'Hyper-local multilingual AI assistant for India\'s rural regions',
      author: 'ChiragPatankar',
      github: 'https://github.com/ChiragPatankar/bharatgpt-server',
      hackathon: 'Puch.ai x OpenAI Hackathon',
      team: 'Hackoholics',
      features: [
        'Hindi-first AI responses',
        'Multilingual support (12+ Indian languages)',
        'Regional knowledge base (10+ states)',
        'Government schemes integration',
        'Location-based personalization (PIN code aware)',
        'Season-aware agricultural responses',
        'Voice processing (STT/TTS)',
        'WhatsApp integration ready'
      ],
      endpoints: {
        '/ask': 'POST - Ask BharatGPT a question with enhanced context',
        '/voice/stt': 'POST - Speech-to-Text conversion',
        '/voice/tts': 'POST - Text-to-Speech conversion', 
        '/voice/chat': 'POST - Complete voice conversation (STT + Chat + TTS)',
        '/location': 'GET - Get regional information by pin code',
        '/schemes': 'GET - Get government schemes by location',
        '/languages': 'GET - Get supported languages and regions',
        '/health': 'GET - Health check',
        '/server-info': 'GET - Detailed server information',
        '/ping': 'GET - Quick status check'
      },
      stats: {
        supportedLanguages: Object.keys(supportedLanguages).length,
        supportedRegions: Object.keys(regionalKnowledge).length,
        totalSchemes: Object.values(regionalKnowledge).reduce((acc, region) => acc + region.schemes.length, 0)
      },
      powered_by: 'Groq (llama3-8b-8192)',
      deployment: 'Cloudflare Workers',
      timestamp: new Date().toISOString()
    });
  }

  // Health check endpoint
  if (url.pathname === '/health' && request.method === 'GET') {
    return jsonResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: 'Cloudflare Worker'
    });
  }

  // Main /ask endpoint (enhanced with context)
  if (url.pathname === '/ask' && request.method === 'POST') {
    try {
      // Parse request body
      const requestBody = await request.json();
      const { prompt, location, language, userType, context } = requestBody;

      // Validate input
      if (!prompt || typeof prompt !== 'string') {
        return jsonResponse({
          error: 'Invalid request',
          message: 'Prompt is required and must be a string'
        }, 400);
      }

      // Check for API key
      if (!env.GROQ_API_KEY) {
        console.error('GROQ_API_KEY not configured - using demo mode');
        // Demo mode response
        return jsonResponse({
          success: true,
          response: `Demo Response: आपका प्रश्न "${prompt}" बहुत अच्छा है। BharatGPT ${location} के लिए ${language} में उत्तर देने के लिए तैयार है। कृपया Groq API key सेट करें।`,
          metadata: {
            location: location || 'India',
            language: language || 'English',
            userType: userType || 'citizen',
            timestamp: new Date().toISOString(),
            service: 'BharatGPT-Demo',
            mode: 'demo'
          }
        });
      }

      // Log request for debugging
      console.log('BharatGPT request:', {
        prompt: prompt.substring(0, 100) + '...',
        location: location || 'Not specified',
        language: language || 'English',
        userType: userType || 'citizen'
      });

      // Create BharatGPT prompt with enhanced context
      const bharatGPTPrompt = createBharatGPTPrompt(
        prompt,
        location || 'India',
        language || 'English',
        userType || 'citizen'
      );

      // Call Groq API
      const aiResponse = await callGroq(bharatGPTPrompt, env.GROQ_API_KEY);

      // Get regional context for response metadata
      let regionalContext = null;
      if (location && location.match(/^\d{6}$/)) {
        regionalContext = regionalKnowledge[location];
      }

      // Return successful response
      return jsonResponse({
        success: true,
        response: aiResponse,
        metadata: {
          location: location || 'India',
          language: language || 'English',
          userType: userType || 'citizen',
          regionalContext: regionalContext,
          timestamp: new Date().toISOString(),
          service: 'BharatGPT',
          season: getCurrentSeason()
        }
      });

    } catch (error) {
      console.error('Error processing /ask request:', error);
      
      return jsonResponse({
        error: 'Internal server error',
        message: error.message || 'Failed to process request'
      }, 500);
    }
  }

  // Regional information endpoint
  if (url.pathname === '/location' && request.method === 'GET') {
    const pincode = url.searchParams.get('pincode');
    
    if (pincode && regionalKnowledge[pincode]) {
      return jsonResponse({
        success: true,
        data: regionalKnowledge[pincode],
        pincode: pincode
      });
    }
    
    return jsonResponse({
      success: false,
      message: 'Pin code not found in our database',
      supportedPincodes: Object.keys(regionalKnowledge)
    }, 404);
  }

  // Government schemes endpoint
  if (url.pathname === '/schemes' && request.method === 'GET') {
    const location = url.searchParams.get('location');
    let schemes = [];
    
    if (location) {
      // Find schemes for specific location
      const regionalData = Object.values(regionalKnowledge).find(region => 
        region.region.toLowerCase().includes(location.toLowerCase()) ||
        region.state.toLowerCase().includes(location.toLowerCase())
      );
      
      if (regionalData) {
        schemes = regionalData.schemes;
      }
    } else {
      // Return all unique schemes
      const allSchemes = new Set();
      Object.values(regionalKnowledge).forEach(region => {
        region.schemes.forEach(scheme => allSchemes.add(scheme));
      });
      schemes = Array.from(allSchemes);
    }

    return jsonResponse({
      success: true,
      schemes: schemes,
      location: location || 'all',
      schemeDetails: {
        'PM-KISAN': {
          name: 'Pradhan Mantri Kisan Samman Nidhi',
          benefit: '₹6000 per year',
          helpline: '155261'
        },
        'Rythu Bandhu': {
          name: 'Telangana Rythu Bandhu Scheme',
          benefit: 'Land investment support',
          helpline: '1800-425-0028'
        }
        // Add more scheme details as needed
      }
    });
  }

  // Languages endpoint
  if (url.pathname === '/languages' && request.method === 'GET') {
    return jsonResponse({
      success: true,
      supportedLanguages: supportedLanguages,
      totalLanguages: Object.keys(supportedLanguages).length,
      regions: Object.values(regionalKnowledge).reduce((acc, region) => {
        region.languages.forEach(lang => {
          if (!acc[lang]) acc[lang] = [];
          acc[lang].push(region.region);
        });
        return acc;
      }, {})
    });
  }

  // Speech-to-Text endpoint
  if (url.pathname === '/voice/stt' && request.method === 'POST') {
    try {
      // Check for API key
      if (!env.PUCH_API_KEY) {
        return jsonResponse({
          error: 'Server configuration error',
          message: 'API key not configured'
        }, 500);
      }

      // Parse multipart form data
      const formData = await request.formData();
      const audioFile = formData.get('audio');
      const language = formData.get('language') || 'auto';
      const location = formData.get('location');
      const userType = formData.get('userType') || 'citizen';

      if (!audioFile) {
        return jsonResponse({
          error: 'Invalid request',
          message: 'Audio file is required'
        }, 400);
      }

      console.log('STT request:', {
        fileName: audioFile.name,
        size: audioFile.size,
        type: audioFile.type,
        language: language,
        location: location
      });

      // Call OpenAI STT API (Whisper)
      const transcription = await callOpenAISTT(audioFile, language, env.OPENAI_API_KEY || env.GROQ_API_KEY);

      // If we have transcription, we can optionally process it through BharatGPT
      let aiResponse = null;
      if (transcription && formData.get('processResponse') === 'true') {
        const bharatGPTPrompt = createBharatGPTPrompt(
          transcription,
          location || 'India',
          language === 'auto' ? 'en' : language,
          userType
        );
        aiResponse = await callGroq(bharatGPTPrompt, env.GROQ_API_KEY);
      }

      return jsonResponse({
        success: true,
        transcription: transcription,
        detectedLanguage: language,
        response: aiResponse,
        metadata: {
          audioSize: audioFile.size,
          audioType: audioFile.type,
          language: language,
          location: location,
          userType: userType,
          timestamp: new Date().toISOString(),
          service: 'BharatGPT-STT'
        }
      });

    } catch (error) {
      console.error('Error processing STT request:', error);
      
      return jsonResponse({
        error: 'STT processing failed',
        message: error.message || 'Failed to transcribe audio'
      }, 500);
    }
  }

  // Text-to-Speech endpoint
  if (url.pathname === '/voice/tts' && request.method === 'POST') {
    try {
      // Check for API key
      if (!env.PUCH_API_KEY) {
        return jsonResponse({
          error: 'Server configuration error',
          message: 'API key not configured'
        }, 500);
      }

      // Parse request body
      const requestBody = await request.json();
      const { text, language, voice, format } = requestBody;

      // Validate input
      if (!text || typeof text !== 'string') {
        return jsonResponse({
          error: 'Invalid request',
          message: 'Text is required and must be a string'
        }, 400);
      }

      console.log('TTS request:', {
        textLength: text.length,
        language: language || 'en',
        voice: voice || 'auto',
        format: format || 'mp3'
      });

      // Call OpenAI TTS API
      const audioBuffer = await callOpenAITTS(
        text,
        language || 'en',
        voice,
        env.OPENAI_API_KEY || env.GROQ_API_KEY
      );

      // Return audio response
      return new Response(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename="bharatgpt-response.mp3"',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Error processing TTS request:', error);
      
      return jsonResponse({
        error: 'TTS processing failed',
        message: error.message || 'Failed to generate speech'
      }, 500);
    }
  }

  // Combined Voice Chat endpoint (STT + Chat + TTS)
  if (url.pathname === '/voice/chat' && request.method === 'POST') {
    try {
      // Check for API key
      if (!env.PUCH_API_KEY) {
        return jsonResponse({
          error: 'Server configuration error',
          message: 'API key not configured'
        }, 500);
      }

      // Parse multipart form data
      const formData = await request.formData();
      const audioFile = formData.get('audio');
      const language = formData.get('language') || 'auto';
      const location = formData.get('location') || 'India';
      const userType = formData.get('userType') || 'citizen';
      const responseFormat = formData.get('responseFormat') || 'both'; // text, audio, both

      if (!audioFile) {
        return jsonResponse({
          error: 'Invalid request',
          message: 'Audio file is required'
        }, 400);
      }

      console.log('Voice Chat request:', {
        fileName: audioFile.name,
        language: language,
        location: location,
        userType: userType,
        responseFormat: responseFormat
      });

      // Step 1: Speech to Text
      const transcription = await callOpenAISTT(audioFile, language, env.OPENAI_API_KEY || env.GROQ_API_KEY);

      // Step 2: Process through BharatGPT
      const bharatGPTPrompt = createBharatGPTPrompt(
        transcription,
        location,
        language === 'auto' ? 'en' : language,
        userType
      );
      const textResponse = await callGroq(bharatGPTPrompt, env.GROQ_API_KEY);

      // Step 3: Text to Speech (if requested)
      let audioResponse = null;
      if (responseFormat === 'audio' || responseFormat === 'both') {
        audioResponse = await callOpenAITTS(
          textResponse,
          language === 'auto' ? 'en' : language,
          null,
          env.OPENAI_API_KEY || env.GROQ_API_KEY
        );
      }

      // Return based on requested format
      if (responseFormat === 'audio' && audioResponse) {
        return new Response(audioResponse, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'X-Transcription': encodeURIComponent(transcription),
            'X-Text-Response': encodeURIComponent(textResponse),
            ...corsHeaders,
          },
        });
      }

      // Return JSON response with metadata
      return jsonResponse({
        success: true,
        transcription: transcription,
        response: textResponse,
        hasAudio: !!audioResponse,
        metadata: {
          language: language,
          location: location,
          userType: userType,
          responseFormat: responseFormat,
          timestamp: new Date().toISOString(),
          service: 'BharatGPT-VoiceChat'
        }
      });

    } catch (error) {
      console.error('Error processing voice chat request:', error);
      
      return jsonResponse({
        error: 'Voice chat processing failed',
        message: error.message || 'Failed to process voice request'
      }, 500);
    }
  }

  // Hackathon server info endpoint
  if (url.pathname === '/server-info' || url.pathname === '/info') {
    return jsonResponse({
      server: {
        id: 'bharatgpt-server',
        name: 'BharatGPT - Hyper-Local AI for Rural India',
        version: '2.0.0',
        status: 'active',
        description: 'Multilingual AI assistant for India\'s rural regions',
        author: 'ChiragPatankar',
        github: 'https://github.com/ChiragPatankar/bharatgpt-server',
        deployedUrl: 'https://bharatgpt-server.officialchiragp1605.workers.dev',
        hackathon: 'Puch.ai x OpenAI',
        capabilities: [
          'Hindi and 10+ Indian languages',
          'Location-based personalization',
          'Government schemes integration',
          'Agricultural intelligence',
          'Voice processing (STT/TTS)',
          'WhatsApp compatible'
        ]
      },
      endpoints: {
        health: '/health',
        chat: '/ask',
        location: '/location',
        schemes: '/schemes', 
        languages: '/languages',
        voiceChat: '/voice/chat',
        speechToText: '/voice/stt',
        textToSpeech: '/voice/tts',
        serverInfo: '/server-info'
      },
      metadata: {
        powered_by: 'Groq (llama3-8b-8192)',
        deployment: 'Cloudflare Workers',
        regions_supported: Object.keys(regionalKnowledge).length,
        languages_supported: Object.keys(supportedLanguages).length,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Hackathon ping endpoint
  if (url.pathname === '/ping' || url.pathname === '/status') {
    return jsonResponse({
      server_id: 'bharatgpt-server',
      status: 'online',
      message: 'BharatGPT server is running',
      timestamp: new Date().toISOString(),
      hackathon: 'Puch.ai x OpenAI'
    });
  }

  // Webhook endpoint for Puch.ai integration
  if (url.pathname === '/webhook' && request.method === 'POST') {
    try {
      const webhookData = await request.json();
      
      return jsonResponse({
        success: true,
        server_id: 'bharatgpt-server',
        received: webhookData,
        message: 'Webhook received successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return jsonResponse({
        error: 'Webhook processing failed',
        message: error.message
      }, 400);
    }
  }

  // MCP (Model Context Protocol) endpoint 
  if (url.pathname === '/mcp' && request.method === 'POST') {
    try {
      const mcpRequest = await request.json();
      
      // Basic MCP response format
      return jsonResponse({
        jsonrpc: "2.0",
        id: mcpRequest.id || 1,
        result: {
          server: {
            name: "BharatGPT",
            version: "2.0.0",
            server_id: "bharatgpt-server"
          },
          capabilities: {
            tools: true,
            resources: true,
            prompts: true
          }
        }
      });
    } catch (error) {
      return jsonResponse({
        jsonrpc: "2.0",
        error: {
          code: -32600,
          message: "Invalid Request"
        }
      }, 400);
    }
  }

  // Puch.ai hackathon discovery endpoint
  if (url.pathname === '/discover' || url.pathname === '/api/discover') {
    return jsonResponse({
      id: 'bharatgpt-server',
      name: 'BharatGPT',
      description: 'Hyper-local multilingual AI assistant for India',
      version: '2.0.0',
      status: 'active',
      endpoint: 'https://bharatgpt-server.officialchiragp1605.workers.dev',
      github: 'https://github.com/ChiragPatankar/bharatgpt-server',
      team: 'Hackoholics',
      author: 'ChiragPatankar',
      hackathon: 'Puch.ai x OpenAI',
      capabilities: [
        'Hindi-first AI responses',
        'Regional knowledge (10+ Indian states)',
        'Government schemes integration',
        'Voice processing',
        'WhatsApp integration ready'
      ],
      api_endpoints: {
        chat: '/ask',
        health: '/health',
        info: '/server-info'
      },
      powered_by: 'Groq',
      deployment: 'Cloudflare Workers',
      timestamp: new Date().toISOString()
    });
  }

  // Alternative server registration format
  if (url.pathname === '/register' || url.pathname === '/api/register') {
    return jsonResponse({
      server: {
        id: 'bharatgpt-server',
        name: 'BharatGPT',
        url: 'https://bharatgpt-server.officialchiragp1605.workers.dev',
        status: 'registered',
        hackathon: 'Puch.ai x OpenAI'
      },
      registration: {
        success: true,
        timestamp: new Date().toISOString(),
        team: 'Hackoholics'
      }
    });
  }

  // 404 for unknown routes
  return jsonResponse({
    error: 'Not found',
    message: 'Endpoint not found',
    availableEndpoints: ['/', '/health', '/ask', '/voice/stt', '/voice/tts', '/voice/chat', '/location', '/schemes', '/languages', '/server-info', '/ping', '/discover', '/register', '/webhook', '/mcp']
  }, 404);
}

// Cloudflare Worker export
export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error('Unhandled error:', error);
      
      return jsonResponse({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }, 500);
    }
  },
};