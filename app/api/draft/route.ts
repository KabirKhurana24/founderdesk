import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const { title, owner, business, due_date, notes } = await request.json();
    if (!title || typeof title !== 'string') return NextResponse.json({ error: 'A commitment title is required.' }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ draft: `Hi ${owner || 'there'},\n\nI wanted to follow up on ${title}${due_date ? `, which is due on ${due_date}` : ''}${business ? ` for ${business}` : ''}. Could you please share a quick update when you get a chance?${notes ? `\n\nFor context: ${notes}` : ''}\n\nThanks!`, source: 'template' });
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.4, messages: [{ role: 'system', content: 'Write concise, polite professional follow-up messages. Do not invent facts or promise actions. Return only the draft message.' }, { role: 'user', content: JSON.stringify({ commitment: title, owner, business, due_date, notes }) }] }) });
    if (!response.ok) return NextResponse.json({ error: 'AI provider request failed. Try again or use the template.' }, { status: 502 });
    const data = await response.json(); return NextResponse.json({ draft: data.choices?.[0]?.message?.content || '', source: 'ai' });
  } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
}
