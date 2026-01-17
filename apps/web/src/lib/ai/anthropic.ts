/**
 * Anthropic Claude API Client
 * Story 9.2: AI-Powered Personalized Interpretations
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/lib/config';
import { AIInterpretationRequest, AIInterpretationResponse } from './types';
import { TAROT_SYSTEM_PROMPT, SAFETY_GUIDELINES, buildInterpretationPrompt } from './prompts';

// Initialize Anthropic client lazily to avoid issues during build
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!config.ai.anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    anthropicClient = new Anthropic({
      apiKey: config.ai.anthropicApiKey,
    });
  }
  return anthropicClient;
}

// Estimated cost per 1K tokens for Claude 3.5 Sonnet (as of late 2024)
const COST_PER_1K_INPUT_TOKENS = 0.003; // $0.003 per 1K input tokens
const COST_PER_1K_OUTPUT_TOKENS = 0.015; // $0.015 per 1K output tokens

/**
 * Generate AI interpretation for tarot reading
 */
export async function generateAIInterpretation(
  request: AIInterpretationRequest
): Promise<AIInterpretationResponse> {
  try {
    const client = getAnthropicClient();
    
    // Build the prompt
    const userPrompt = buildInterpretationPrompt(
      request.cards,
      request.readingType,
      request.question,
      undefined // readingHistory - can be added later
    );

    // Create the message
    const message = await client.messages.create({
      model: config.ai.model,
      max_tokens: config.ai.maxTokens,
      system: `${TAROT_SYSTEM_PROMPT}\n\n${SAFETY_GUIDELINES}`,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text content from response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in AI response');
    }

    // Calculate tokens used and cost estimate
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    
    const costEstimate = 
      (inputTokens / 1000) * COST_PER_1K_INPUT_TOKENS +
      (outputTokens / 1000) * COST_PER_1K_OUTPUT_TOKENS;

    return {
      success: true,
      interpretation: textContent.text,
      tokensUsed: totalTokens,
      costEstimate,
      cached: false,
    };
  } catch (error) {
    console.error('AI interpretation error:', error);
    
    // Handle specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return {
          success: false,
          error: 'ระบบ AI กำลังยุ่ง กรุณาลองใหม่ในอีกสักครู่',
        };
      }
      if (error.status === 401) {
        return {
          success: false,
          error: 'ข้อผิดพลาดในการเชื่อมต่อกับ AI',
        };
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
    };
  }
}

/**
 * Check if AI service is available
 */
export function isAIServiceAvailable(): boolean {
  return Boolean(config.ai.anthropicApiKey);
}
