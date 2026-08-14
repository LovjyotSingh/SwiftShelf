import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/geminiClient';
import { z } from 'zod';

const ChatSchema = z.object({
  query: z.string().min(1),
  history: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });
    }

    const result = await AIService.queryConcierge(parsed.data.query, parsed.data.history || []);

    return NextResponse.json({
      success: true,
      reply: result.reply,
      suggestedProducts: result.suggestedProducts,
      filterAction: result.filterAction,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'AI Service Error' },
      { status: 500 }
    );
  }
}
