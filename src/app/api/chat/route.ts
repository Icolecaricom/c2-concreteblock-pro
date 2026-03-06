import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

const SYSTEM_PROMPT = `You are a helpful assistant for C2 ConcreteBlock Pro, a concrete block manufacturing and sales business in Guyana, South America. 

Business Information:
- Address: Lot 6 De Buff Canal #2 Polder, West Bank Demerara, Region 3, Guyana, South America
- Phone: +592 XXX-XXXX
- WhatsApp: +592 XXX-XXXX
- Email: info@c2concreteblockpro.com
- Business Hours: Mon-Fri 8:00 AM - 5:00 PM, Sat 8:00 AM - 12:00 PM

Products:
1. 4-Inch Hollow Blocks (16" × 8" × 4") - $180-$220 GYD per block (tiered by quantity)
2. 6-Inch Hollow Blocks (16" × 8" × 6") - $220-$240 GYD per block (tiered by quantity)
3. Paving Blocks - Various sizes, Request Quote for pricing

Services:
- Delivery to Region 3 and Region 4, Guyana
- FREE delivery within 10 miles radius
- Customer pickup available
- Free consultations on material usage and construction tips
- Free downloadable PDF guides on block laying

Certifications:
- GNBS (Guyana National Bureau of Standards) Certified

Block Calculator:
- 1.125 blocks per square foot
- Recommend adding 5% extra for cutting requirements

Help customers with:
- Product information and pricing
- Block calculations for their projects
- Scheduling callbacks or consultations
- General construction advice
- Quote requests

Be friendly, professional, and helpful. Always offer to connect customers with a representative for detailed quotes.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create or get chat session
    let chatSession;
    if (sessionId) {
      chatSession = await db.chatSession.findUnique({
        where: { sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
    }

    if (!chatSession) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      chatSession = await db.chatSession.create({
        data: { sessionId: newSessionId },
        include: { messages: true }
      });
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        sessionId: chatSession.sessionId,
        role: 'user',
        content: message
      }
    });

    // Prepare messages for AI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call AI
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, I am unable to respond at the moment. Please try again or contact us directly.';

    // Save AI response
    await db.chatMessage.create({
      data: {
        sessionId: chatSession.sessionId,
        role: 'assistant',
        content: aiResponse
      }
    });

    return NextResponse.json({
      response: aiResponse,
      sessionId: chatSession.sessionId
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
