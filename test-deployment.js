/**
 * BharatGPT Deployment Test Script
 * Run this after deployment to verify all endpoints work correctly
 */

const BASE_URL = process.argv[2] || 'https://bharatgpt-server.your-subdomain.workers.dev';

console.log('🧪 Testing BharatGPT deployment at:', BASE_URL);

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`\n🔄 Testing ${name}...`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name} - Success`);
      console.log('Response:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    } else {
      console.log(`❌ ${name} - Failed:`, response.status);
      console.log('Error:', data);
    }
  } catch (error) {
    console.log(`❌ ${name} - Error:`, error.message);
  }
}

async function runTests() {
  // Test 1: Service Info
  await testEndpoint('Service Info', BASE_URL);
  
  // Test 2: Health Check
  await testEndpoint('Health Check', `${BASE_URL}/health`);
  
  // Test 3: Languages
  await testEndpoint('Languages', `${BASE_URL}/languages`);
  
  // Test 4: Regional Info
  await testEndpoint('Regional Info (Delhi)', `${BASE_URL}/location?pincode=110001`);
  
  // Test 5: Government Schemes
  await testEndpoint('Government Schemes', `${BASE_URL}/schemes?location=Maharashtra`);
  
  // Test 6: Basic Chat (English)
  await testEndpoint('Basic Chat (English)', `${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'What are the best crops for farming in India?',
      location: 'India',
      language: 'en',
      userType: 'farmer'
    })
  });
  
  // Test 7: Regional Chat (Hindi)
  await testEndpoint('Regional Chat (Hindi)', `${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'सर्दी में कौन सी फसल बोनी चाहिए?',
      location: '110001',
      language: 'hi',
      userType: 'farmer'
    })
  });
  
  // Test 8: Government Scheme Query
  await testEndpoint('Government Scheme Query', `${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'How can I apply for PM-Kisan scheme?',
      location: '400001',
      language: 'en',
      userType: 'farmer'
    })
  });
  
  // Test 9: Voice TTS (Text-to-Speech)
  await testEndpoint('Voice TTS (Text-to-Speech)', `${BASE_URL}/voice/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'नमस्कार, मैं BharatGPT हूं। आपकी खेती में कैसे मदद कर सकता हूं?',
      language: 'hi',
      voice: 'alloy'
    })
  });
  
  console.log('\n🏁 Testing completed!');
  console.log('\n🎤 Voice Features Added:');
  console.log('✅ Speech-to-Text (STT) - /voice/stt');
  console.log('✅ Text-to-Speech (TTS) - /voice/tts');
  console.log('✅ Complete Voice Chat - /voice/chat');
  console.log('\n📋 Hackathon Submission Command:');
  console.log('/hackathon submission add bharatgpt-server https://github.com/<yourusername>/bharatgpt');
  console.log('\n🌟 BharatGPT is now a COMPLETE Voice + Text AI Assistant!');
  console.log('🇮🇳 Ready to help India\'s rural population in their native languages!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  console.log('Alternative: Use the curl commands in example-requests.json');
  process.exit(1);
}

runTests().catch(console.error);