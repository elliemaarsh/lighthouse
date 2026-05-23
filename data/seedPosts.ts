import type { SupabaseClient } from '@supabase/supabase-js';

export const SEED_COMMUNITY_USER_ID = '00000000-0000-4000-8000-000000000001';

type SeedPostInput = {
  username: string;
  title: string;
  body: string;
  tags: string[];
  helpful_count: number;
  reply_count: number;
  daysAgo: number;
  hoursAgo?: number;
};

function createdAtFromSeed(seed: SeedPostInput): string {
  const ms =
    Date.now() -
    seed.daysAgo * 24 * 60 * 60 * 1000 -
    (seed.hoursAgo ?? 0) * 60 * 60 * 1000;
  return new Date(ms).toISOString();
}

const SEED_DEFINITIONS: SeedPostInput[] = [
  {
    username: 'hopeful_hana',
    title: 'Just finished our first IVF cycle — feeling everything at once',
    body: "We got 4 eggs retrieved yesterday and I genuinely don't know how to feel. Grateful, terrified, exhausted. My partner has been amazing but I can tell he doesn't know what to say either. Is it normal to feel so emotionally numb after retrieval?",
    tags: ['IVF', 'egg retrieval', 'emotions'],
    helpful_count: 14,
    reply_count: 6,
    daysAgo: 2,
  },
  {
    username: 'quiet_anchor',
    title: 'To the supporting partners — you matter too',
    body: "I'm the non-carrying partner and I've been struggling to find spaces that feel like they're for me too. My wife is going through so much and I want to be strong for her but honestly I'm scared and sad too. Just wanted to say if you're in the same boat — you're not alone and your feelings are valid.",
    tags: ['supporting partner', 'male fertility', 'emotions'],
    helpful_count: 31,
    reply_count: 9,
    daysAgo: 5,
  },
  {
    username: 'two_mamas_trying',
    title: 'Same-sex couple navigating donor IVF — anyone else?',
    body: "We're two women going through reciprocal IVF and it's been such a wild ride. The logistics are complex but honestly the emotional part of deciding who carries first was harder than we expected. Would love to connect with others on a similar path.",
    tags: ['same-sex couple', 'IVF', 'donor'],
    helpful_count: 22,
    reply_count: 11,
    daysAgo: 7,
  },
  {
    username: 'stillstanding_s',
    title: "Third miscarriage. I don't have words but I needed to say it somewhere.",
    body: "We found out on Tuesday. I'm not ready to talk about it really but I also couldn't keep it completely inside. If you've been here — how did you find your way back to trying again? Or did you?",
    tags: ['miscarriage', 'pregnancy loss', 'grief'],
    helpful_count: 47,
    reply_count: 18,
    daysAgo: 3,
  },
  {
    username: 'patient_p',
    title: 'Month 11 of trying naturally — when did you decide to see a doctor?',
    body: "We've been trying for almost a year with no luck. I'm 29 and my cycles are regular so I keep telling myself it'll happen. But my partner thinks we should get checked out. How did you all make that call?",
    tags: ['trying to conceive', 'natural', 'seeking advice'],
    helpful_count: 19,
    reply_count: 14,
    daysAgo: 8,
  },
  {
    username: 'cycle_tracker_c',
    title: "BBT charting changed everything for me — here's what I wish I knew earlier",
    body: 'I spent 8 months just guessing at ovulation before a friend told me about basal body temperature charting. Within two cycles I understood my body so much better. Happy to answer questions if anyone is just starting out.',
    tags: ['BBT', 'cycle tracking', 'tips'],
    helpful_count: 38,
    reply_count: 12,
    daysAgo: 12,
  },
  {
    username: 'ember_and_oak',
    title: 'Our relationship has never been stronger — and also never more strained',
    body: "Does anyone else feel like fertility treatments have somehow brought you closer AND pushed you further apart at the same time? We're more honest than we've ever been but also snapping at each other in ways we never used to. Is this just... what this does to couples?",
    tags: ['relationships', 'IVF', 'communication'],
    helpful_count: 52,
    reply_count: 21,
    daysAgo: 1,
  },
  {
    username: 'solo_and_sure',
    title: 'Doing this alone — not lonely, just different',
    body: "I'm a single woman doing IUI on my own and I want to push back a little on the assumption that solo journeys are sad. Mine has been one of the most empowering decisions of my life. That said, it IS different and I'd love to find others walking a similar path.",
    tags: ['solo journey', 'IUI', 'empowerment'],
    helpful_count: 29,
    reply_count: 7,
    daysAgo: 4,
  },
  {
    username: 'lowcount_leo',
    title: 'Just found out I have low sperm motility. Really struggling with this.',
    body: "Got the results back yesterday. The doctor was clinical about it but it hit me really hard emotionally. I know it's not my fault but it's hard not to feel like I've let my partner down. Has anyone worked through this — did things improve?",
    tags: ['male fertility', 'sperm', 'emotions'],
    helpful_count: 41,
    reply_count: 16,
    daysAgo: 6,
  },
  {
    username: 'transfer_tmrw',
    title: 'Transfer is tomorrow. Just need to say that out loud.',
    body: "After 14 months, two retrievals, and one chemical pregnancy — tomorrow is our frozen transfer day. I'm trying to stay calm but my whole body is buzzing. Sending love to everyone in a waiting room, a clinic, or a two-week wait right now.",
    tags: ['IVF', 'transfer', 'two-week wait'],
    helpful_count: 67,
    reply_count: 24,
    daysAgo: 0,
    hoursAgo: 18,
  },
  {
    username: 'pcos_and_possible',
    title: 'PCOS diagnosis at 31 — scared but finding my footing',
    body: "Just got diagnosed after years of irregular cycles. My doctor was helpful but I left feeling overwhelmed. I've been reading everything I can. If you have PCOS and have conceived — I'd really love to hear your story.",
    tags: ['PCOS', 'diagnosis', 'fertility'],
    helpful_count: 33,
    reply_count: 19,
    daysAgo: 9,
  },
  {
    username: 'gentle_dad',
    title: 'Watching my wife go through this has changed me completely',
    body: "I came into this thinking my job was to be practical — research doctors, track appointments, stay logical. Two years in I realize that's maybe 10% of what she needed. Learning to just be present has been the hardest and most important thing I've ever done.",
    tags: ['supporting partner', 'relationships', 'growth'],
    helpful_count: 58,
    reply_count: 13,
    daysAgo: 11,
  },
  {
    username: 'endo_warrior_e',
    title: 'Endometriosis and fertility — my honest experience so far',
    body: "Stage 3 endo here. It took 4 years to get diagnosed and another year to find a doctor who took my fertility concerns seriously. Currently between IVF cycles. Happy to share what I've learned navigating the medical system if it helps anyone else.",
    tags: ['endometriosis', 'IVF', 'advocacy'],
    helpful_count: 44,
    reply_count: 17,
    daysAgo: 14,
  },
  {
    username: 'morning_temp',
    title: 'Has anyone else found that tracking helped their relationship, not just their fertility?',
    body: "Something unexpected happened when I started sharing my cycle data with my husband. He started actually understanding why some weeks I'm more tired, more emotional, more tender. It created this whole new language between us. Curious if others have had this.",
    tags: ['cycle tracking', 'relationships', 'connection'],
    helpful_count: 36,
    reply_count: 8,
    daysAgo: 16,
  },
  {
    username: 'betweenrounds_b',
    title: 'Taking a break from treatment — this is what that actually looks like',
    body: "After three rounds of IVF we decided to pause for six months. Everyone around us seemed confused by this decision. But we needed to remember who we were outside of fertility treatment. If you're considering a break — it's allowed. You're allowed.",
    tags: ['IVF', 'break', 'mental health'],
    helpful_count: 71,
    reply_count: 27,
    daysAgo: 20,
  },
  {
    username: 'recurrent_r',
    title: 'Recurrent loss — when does it get investigated properly?',
    body: 'Three losses and my OB keeps saying it\'s "just bad luck." I know that\'s sometimes true but I also feel like I\'m not being heard. At what point did you push for a specialist? What tests actually helped?',
    tags: ['miscarriage', 'recurrent loss', 'medical'],
    helpful_count: 39,
    reply_count: 22,
    daysAgo: 13,
  },
  {
    username: 'first_cycle_f',
    title: 'We just started trying — any advice for month one?',
    body: "Everything is new and honestly a little overwhelming. We're trying naturally for now. I've downloaded every app. I know I need to calm down and just let it be but that's easier said than done. Any words of wisdom from people further along?",
    tags: ['trying to conceive', 'beginners', 'advice'],
    helpful_count: 25,
    reply_count: 31,
    daysAgo: 2,
  },
  {
    username: 'science_and_soul',
    title: 'The thing nobody tells you about the two-week wait',
    body: "Everyone talks about the anxiety. What nobody warned me about was the strange peace that sometimes settles in around day 9. Like your body just decides to let go of the outcome for a moment. Has anyone else experienced this? I'm calling it the two-week surrender.",
    tags: ['two-week wait', 'IVF', 'mindset'],
    helpful_count: 83,
    reply_count: 35,
    daysAgo: 17,
  },
  {
    username: 'donor_dreams',
    title: 'Using donor eggs — working through the feelings before the process',
    body: "Our doctor recommended donor eggs after two failed cycles with my own. I'm at peace with the decision but getting there took real work. Therapy helped enormously. If you're facing this conversation — you don't have to rush past the feelings to get to the logistics.",
    tags: ['donor', 'IVF', 'emotions', 'acceptance'],
    helpful_count: 46,
    reply_count: 14,
    daysAgo: 22,
  },
  {
    username: 'light_at_end',
    title: "We're pregnant. After four years. I don't know how to hold this.",
    body: "I almost didn't post this because I know how hard it is to read these when you're still waiting. But I also remember how much it meant to me when people shared their good news in a way that didn't feel like gloating. Four years. Two miscarriages. Three IVF cycles. We got there. If you're still in it — I see you. Keep going.",
    tags: ['success story', 'IVF', 'hope'],
    helpful_count: 124,
    reply_count: 48,
    daysAgo: 25,
  },
];

export const seedPosts = SEED_DEFINITIONS.map((seed) => ({
  user_id: SEED_COMMUNITY_USER_ID,
  username: seed.username,
  title: seed.title,
  body: seed.body,
  tags: seed.tags,
  helpful_count: seed.helpful_count,
  reply_count: seed.reply_count,
  created_at: createdAtFromSeed(seed),
}));

export async function seedCommunityIfEmpty(client: SupabaseClient): Promise<void> {
  const { count, error: countError } = await client
    .from('community_posts')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.warn('[Lighthouse] community seed count:', countError.message);
    return;
  }

  if ((count ?? 0) > 0) return;

  const { error } = await client.from('community_posts').insert(seedPosts);

  if (error) {
    console.warn('[Lighthouse] community seed insert:', error.message);
  }
}
