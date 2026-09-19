import Groq from 'groq-sdk';

let groq = null;
let cachedActiveModels = null;
let lastCacheTime = 0;

const getActiveModelList = async () => {
  const now = Date.now();
  // Cache model list for 10 minutes to avoid hitting models endpoint repeatedly
  if (cachedActiveModels && (now - lastCacheTime < 10 * 60 * 1000)) {
    return cachedActiveModels;
  }

  try {
    const response = await groq.models.list();
    if (response && Array.isArray(response.data)) {
      const activeIds = response.data.map(m => m.id).filter(Boolean);
      if (activeIds.length > 0) {
        // Preferred ordering: fast/stable active Llama 3 models first
        const preferredOrder = [
          'llama-3.1-8b-instant',
          'llama-3.3-70b-versatile',
          'llama-3.1-70b-versatile',
          'llama-3.2-11b-vision-preview',
          'llama-3.2-3b-preview',
          'mixtral-8x7b-32768'
        ];

        const sorted = [];
        for (const pref of preferredOrder) {
          if (activeIds.includes(pref)) {
            sorted.push(pref);
          }
        }
        // Add any remaining active models not in preferredOrder
        for (const id of activeIds) {
          if (!sorted.includes(id) && !id.includes('whisper') && !id.includes('safetensors')) {
            sorted.push(id);
          }
        }

        if (sorted.length > 0) {
          cachedActiveModels = sorted;
          lastCacheTime = now;
          return sorted;
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch dynamic Groq models list:', err.message);
  }

  // Hardcoded fallback list of current active models
  return [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.2-3b-preview',
    'mixtral-8x7b-32768'
  ];
};

export const generateCompletion = async ({ systemPrompt, messages, temperature = 0.7 }) => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not configured correctly on the server (placeholder detected).');
  }

  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  const candidateModels = await getActiveModelList();
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      lastError = error;

      // Catch Groq rate limit responses (HTTP 429)
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
        console.warn('⚠️ Groq API Rate Limit (429) reached. Logging server-side only.', error.message);
        return "The AI mentor is temporarily busy — please try again in a moment.";
      }

      // If model failed (decommissioned / 404 / unavailable), invalidate cache & try next model
      cachedActiveModels = null;
      console.warn(`⚠️ Groq model '${modelName}' failed (${error.message || 'Model error'}). Trying fallback model...`);
      continue;
    }
  }

  // Extract human-readable error message if all models failed
  const friendlyMsg = lastError?.error?.message || lastError?.message || 'AI service unavailable right now.';
  throw new Error(friendlyMsg);
};
