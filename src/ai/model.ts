import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const provider = createOpenAICompatible({
  name: 'moonshot',
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: 'https://api.moonshot.ai/v1',
  includeUsage: true, // Include usage information in streaming responses
});

export const moonshot = provider('kimi-k2-thinking');