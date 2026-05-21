import { PULSE_TRANSLATE_SYSTEM_PROMPT } from '@/constants/pulseCheck';

export type PulseTranslateInput = {
  connectionScore: number;
  capacityScore: number;
  currentNeed: string;
  rawNote: string;
  partnerName?: string | null;
};

function buildUserMessage(input: PulseTranslateInput): string {
  const note = input.rawNote.trim() || 'No note written';
  return `Partner's check-in data:
Connection score: ${input.connectionScore}/5
Capacity score: ${input.capacityScore}/5
Current need: ${input.currentNeed}
Raw note: ${note}

Please translate this into a gentle suggestion for their partner.`;
}

function fallbackTranslation(input: PulseTranslateInput): string {
  const name = input.partnerName?.trim() || 'your partner';
  const need = input.currentNeed.toLowerCase();
  if (input.rawNote.trim().length > 20) {
    return `Your partner shared something important this week. A gentle way to show up: ask how they're doing and listen without trying to fix it — they selected "${input.currentNeed}" as what they need most right now.`;
  }
  if (need.includes('space')) {
    return `This week, ${name} may need a little extra room to breathe. Small gestures of quiet support — a warm drink, a check-in text with no pressure to reply — can mean a lot.`;
  }
  if (need.includes('seen')) {
    return `Your partner is hoping to feel seen and heard. Try reflecting back what you hear before offering solutions — "That sounds really hard" goes further than advice right now.`;
  }
  if (need.includes('practical')) {
    return `Your partner could use practical help this week. Ask what one small task would lighten their load — and follow through on just that.`;
  }
  if (need.includes('closeness')) {
    return `Physical closeness may feel grounding for your partner right now — a hug, holding hands, or simply sitting close without an agenda.`;
  }
  if (need.includes('there')) {
    return `Your partner mainly needs to know you're there. Presence matters more than perfect words — check in, stay reachable, and let them lead the conversation.`;
  }
  return `Your partner checked in as okay this week. A simple "I'm here if you need me" keeps the door open without pressure.`;
}

export async function translatePulseNote(
  input: PulseTranslateInput,
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      '[Lighthouse] EXPO_PUBLIC_ANTHROPIC_API_KEY missing — using fallback translation',
    );
    return fallbackTranslation(input);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 280,
        system: PULSE_TRANSLATE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserMessage(input) }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('[Lighthouse] Anthropic API error:', response.status, errText);
      return fallbackTranslation(input);
    }

    const json = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = json.content
      ?.filter((block) => block.type === 'text')
      .map((block) => block.text ?? '')
      .join('')
      .trim();

    return text || fallbackTranslation(input);
  } catch (error) {
    console.warn('[Lighthouse] translatePulseNote failed:', error);
    return fallbackTranslation(input);
  }
}
