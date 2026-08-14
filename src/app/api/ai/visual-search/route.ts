import { NextRequest, NextResponse } from 'next/server';
import { searchByImageAnalysis } from '@/lib/ai/vectorSearch';
import { z } from 'zod';

const VisualSearchSchema = z.object({
  label: z.string().optional(),
  inferredCategory: z.string().optional(),
  dominantColor: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VisualSearchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input payload' }, { status: 400 });
    }

    const matches = searchByImageAnalysis(parsed.data);

    return NextResponse.json({
      success: true,
      matches,
      vectorModel: 'pgvector-1536d-multimodal',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
