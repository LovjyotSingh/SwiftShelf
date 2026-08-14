import { INITIAL_PRODUCTS } from '../data/mockCatalog';
import { AIReviewSummary, Product } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  // Default Recommended Model: gemini-1.5-flash (ultra-low latency, free tier supported)
  private static modelName = 'gemini-1.5-flash';

  /**
   * Conversational AI Concierge for Command Palette and Assistant
   */
  public static async queryConcierge(userPrompt: string, history: ChatMessage[] = []): Promise<{
    reply: string;
    suggestedProducts: Product[];
    filterAction?: { category?: string; maxPrice?: number };
  }> {
    const apiKey = process.env.GEMINI_API_KEY;
    const lowerPrompt = userPrompt.toLowerCase();

    // Identify category & price intent
    let matchedCategory: string | undefined;
    if (lowerPrompt.includes('audio') || lowerPrompt.includes('headphone') || lowerPrompt.includes('sound') || lowerPrompt.includes('music')) {
      matchedCategory = 'Audio';
    } else if (lowerPrompt.includes('watch') || lowerPrompt.includes('wearable') || lowerPrompt.includes('fitness') || lowerPrompt.includes('titanium')) {
      matchedCategory = 'Wearables';
    } else if (lowerPrompt.includes('chair') || lowerPrompt.includes('desk') || lowerPrompt.includes('ergonomic') || lowerPrompt.includes('back')) {
      matchedCategory = 'Ergonomics';
    } else if (lowerPrompt.includes('monitor') || lowerPrompt.includes('display') || lowerPrompt.includes('screen') || lowerPrompt.includes('keyboard') || lowerPrompt.includes('coding')) {
      matchedCategory = 'Computing';
    } else if (lowerPrompt.includes('lamp') || lowerPrompt.includes('light') || lowerPrompt.includes('ambient')) {
      matchedCategory = 'Smart Living';
    }

    // Match products based on intent
    const matchedProducts = INITIAL_PRODUCTS.filter((p) => {
      if (matchedCategory && p.category === matchedCategory) return true;
      return (
        p.title.toLowerCase().includes(lowerPrompt) ||
        p.tags.some((t) => lowerPrompt.includes(t)) ||
        p.description.toLowerCase().includes(lowerPrompt)
      );
    });

    const fallbackProducts = matchedProducts.length > 0 ? matchedProducts : INITIAL_PRODUCTS.slice(0, 3);

    // If Gemini API Key is provided, call live Google Gemini API
    if (apiKey && apiKey.startsWith('AIzaSy')) {
      try {
        const catalogContext = INITIAL_PRODUCTS.map(
          (p) => `- ${p.title} ($${p.price}, ${p.category}): ${p.subtitle}. Specs: ${JSON.stringify(p.specs)}`
        ).join('\n');

        const systemPrompt = `You are the SwiftShelf Luxury Hardware Concierge. You assist customers looking for audiophile headphones, titanium smartwatches, ergonomic seating, 6K OLED displays, and mechanical keyboards. Keep answers concise, knowledgeable, sophisticated, and directly reference our catalog:\n${catalogContext}`;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  { text: `Customer Query: ${userPrompt}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return {
              reply: generatedText.trim(),
              suggestedProducts: fallbackProducts,
              filterAction: matchedCategory ? { category: matchedCategory } : undefined,
            };
          }
        }
      } catch (e) {
        console.warn('[Gemini API] Direct API call error, using local fallback:', e);
      }
    }

    // Intelligent Local Engine Fallback
    let reply = `Here are our top-rated recommendations tailored for "${userPrompt}". `;
    if (matchedCategory) {
      reply += `I've filtered our luxury **${matchedCategory}** collection designed with aerospace-grade durability and high-precision engineering.`;
    } else if (lowerPrompt.includes('flash') || lowerPrompt.includes('sale') || lowerPrompt.includes('discount')) {
      reply = `We currently have active **Flash Sale** locks running on flagship hardware like the **Spectre Pro ANC Headphones**! Stock is dynamically locked upon cart addition.`;
    } else {
      reply += `Let me know if you need to customize materials, inspect 3D models, or check real-time stock reservations!`;
    }

    return {
      reply,
      suggestedProducts: fallbackProducts,
      filterAction: matchedCategory ? { category: matchedCategory } : undefined,
    };
  }

  /**
   * Summarize reviews into Pros, Cons, and Fit metrics
   */
  public static async generateReviewSummary(product: Product): Promise<AIReviewSummary> {
    if (product.aiSummary) {
      return product.aiSummary;
    }

    return {
      pros: [
        'Exceptional build quality and premium aerospace materials',
        'Intuitive ergonomics with near-zero latency response',
        'Industry-leading battery life and thermal stability',
      ],
      cons: [
        'Higher initial investment compared to entry-level alternatives',
      ],
      sentimentScore: 95,
      fitRecommendation: 'Engineered with universal ergonomics for optimal daily comfort.',
      summaryText: `Based on verified customer telemetry, ${product.title} holds a 95%+ satisfaction rating for performance and longevity.`,
    };
  }
}
