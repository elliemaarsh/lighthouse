import { articleBodies } from '@/data/articleBodies';

export type Article = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  readTime: string;
  body: string;
  relevantFor: {
    roles?: ('carrying' | 'non-carrying' | 'both')[];
    goals?: string[];
    journeyTypes?: string[];
    fertilityHistory?: string[];
    relationshipStructures?: string[];
    biologicalSex?: string[];
  };
};

type ArticleMeta = Omit<Article, 'body'>;

const catalog: ArticleMeta[] = [
  {
    id: 'cycle-decoded',
    title: 'Your Cycle, Decoded',
    subtitle:
      'A plain-language guide to the four phases of your cycle and what each one means for fertility',
    category: 'Understanding Your Body',
    tags: ['cycle', 'carrying', 'basics'],
    readTime: '4 min',
    relevantFor: {
      roles: ['carrying'],
      goals: ['Tracking my cycle', 'Conceiving naturally'],
    },
  },
  {
    id: 'bbt-guide',
    title: 'What Basal Body Temperature Actually Tells You',
    subtitle: 'How to read your BBT chart and spot patterns over time',
    category: 'Understanding Your Body',
    tags: ['cycle', 'carrying', 'basics'],
    readTime: '5 min',
    relevantFor: {
      roles: ['carrying'],
      goals: ['Tracking my cycle', 'Conceiving naturally', 'Natural family planning'],
    },
  },
  {
    id: 'luteal-phase',
    title: 'The Luteal Phase Nobody Talks About',
    subtitle: 'Why the second half of your cycle matters more than most apps let on',
    category: 'Understanding Your Body',
    tags: ['cycle', 'carrying', 'basics'],
    readTime: '4 min',
    relevantFor: {
      roles: ['carrying'],
      goals: ['Tracking my cycle', 'Improving fertility'],
    },
  },
  {
    id: 'role-not-small',
    title: 'Your Role Is Not Small',
    subtitle: 'What the research says about partner support and fertility outcomes',
    category: 'For the Supporting Partner',
    tags: ['non-carrying', 'support', 'relationship'],
    readTime: '4 min',
    relevantFor: { roles: ['non-carrying'], goals: ['Supporting my partner'] },
  },
  {
    id: 'show-up',
    title: "How to Show Up When You Don't Know What to Say",
    subtitle: 'Practical emotional presence for the non-carrying partner',
    category: 'For the Supporting Partner',
    tags: ['non-carrying', 'support', 'relationship'],
    readTime: '5 min',
    relevantFor: {
      roles: ['non-carrying'],
      goals: ['Supporting my partner', 'Staying connected as a couple'],
    },
  },
  {
    id: 'sperm-health',
    title: 'What Sperm Health Actually Depends On',
    subtitle: 'The lifestyle factors that matter most, and the timeline for change',
    category: 'For the Supporting Partner',
    tags: ['non-carrying', 'support', 'relationship'],
    readTime: '6 min',
    relevantFor: {
      roles: ['non-carrying'],
      biologicalSex: ['male'],
      goals: ['Improving fertility', 'Conceiving naturally'],
    },
  },
  {
    id: 'timing-not-everything',
    title: "Timing Isn't Everything — But It Helps",
    subtitle: 'The fertile window explained without the pressure',
    category: 'Conceiving Naturally',
    tags: ['natural', 'conception', 'timing'],
    readTime: '4 min',
    relevantFor: { goals: ['Conceiving naturally', 'Tracking my cycle'] },
  },
  {
    id: 'six-months-in',
    title: "Six Months In: What's Normal and What's Worth Mentioning to a Doctor",
    subtitle: 'A grounded guide to when to seek help',
    category: 'Conceiving Naturally',
    tags: ['natural', 'conception', 'timing'],
    readTime: '5 min',
    relevantFor: { goals: ['Conceiving naturally', 'Improving fertility'] },
  },
  {
    id: 'stress-fertility-loop',
    title: 'The Stress-Fertility Loop',
    subtitle: 'What the science says and how to gently interrupt it',
    category: 'Conceiving Naturally',
    tags: ['natural', 'conception', 'timing'],
    readTime: '5 min',
    relevantFor: {
      goals: ['Conceiving naturally', 'Improving fertility', 'Reducing miscarriage risk'],
    },
  },
  {
    id: 'fertility-diet',
    title: "The Fertility Diet: What's Actually Evidence-Based",
    subtitle: 'Cutting through the noise on food and reproductive health',
    category: 'Improving Fertility',
    tags: ['lifestyle', 'fertility', 'wellness'],
    readTime: '6 min',
    relevantFor: { goals: ['Improving fertility', 'Conceiving naturally'] },
  },
  {
    id: 'sleep-fertility',
    title: 'Sleep and Fertility: The Connection Most People Miss',
    subtitle: 'Why 7–9 hours matters more than any supplement',
    category: 'Improving Fertility',
    tags: ['lifestyle', 'fertility', 'wellness'],
    readTime: '4 min',
    relevantFor: { goals: ['Improving fertility'] },
  },
  {
    id: 'lifestyle-changes',
    title: 'Five Lifestyle Changes With Real Research Behind Them',
    subtitle: 'For both partners, ranked by impact',
    category: 'Improving Fertility',
    tags: ['lifestyle', 'fertility', 'wellness'],
    readTime: '5 min',
    relevantFor: {
      roles: ['carrying', 'non-carrying'],
      goals: ['Improving fertility', 'Conceiving naturally'],
    },
  },
  {
    id: 'ivf-stimulation',
    title: 'What to Expect During Stimulation',
    subtitle: 'A week-by-week emotional and physical guide',
    category: 'IVF & Treatment',
    tags: ['ivf', 'treatment', 'medical'],
    readTime: '7 min',
    relevantFor: {
      journeyTypes: ['Going through IVF or IUI'],
      goals: ['Managing IVF'],
    },
  },
  {
    id: 'two-week-wait',
    title: 'The Two-Week Wait: Surviving It Together',
    subtitle: 'Strategies for both partners during the hardest stretch',
    category: 'IVF & Treatment',
    tags: ['ivf', 'treatment', 'medical'],
    readTime: '5 min',
    relevantFor: {
      journeyTypes: ['Going through IVF or IUI'],
      goals: ['Managing IVF'],
    },
  },
  {
    id: 'failed-transfer',
    title: "When a Transfer Doesn't Work",
    subtitle: 'A compassionate guide to processing and moving forward',
    category: 'IVF & Treatment',
    tags: ['ivf', 'treatment', 'medical'],
    readTime: '6 min',
    relevantFor: {
      journeyTypes: ['Going through IVF or IUI', 'Between treatments'],
      goals: ['Managing IVF'],
    },
  },
  {
    id: 'clinic-questions',
    title: 'Questions to Ask Your Clinic Before Each Stage',
    subtitle: 'A printable list for appointments',
    category: 'IVF & Treatment',
    tags: ['ivf', 'treatment', 'medical'],
    readTime: '4 min',
    relevantFor: {
      journeyTypes: ['Going through IVF or IUI'],
      goals: ['Managing IVF'],
    },
  },
  {
    id: 'after-miscarriage-body',
    title: 'After a Miscarriage: What Your Body Is Going Through',
    subtitle: 'Physical recovery explained gently',
    category: 'Pregnancy Loss',
    tags: ['loss', 'grief', 'miscarriage'],
    readTime: '5 min',
    relevantFor: {
      journeyTypes: ['Navigating pregnancy loss'],
      goals: ['Navigating pregnancy loss'],
    },
  },
  {
    id: 'grief-no-timeline',
    title: 'Grief Has No Timeline',
    subtitle: 'On the non-linear emotional reality of pregnancy loss',
    category: 'Pregnancy Loss',
    tags: ['loss', 'grief', 'miscarriage'],
    readTime: '4 min',
    relevantFor: {
      journeyTypes: ['Navigating pregnancy loss'],
      goals: ['Navigating pregnancy loss'],
    },
  },
  {
    id: 'partner-grief',
    title: 'For the Partner Who Lost Too',
    subtitle: "The non-carrying partner's grief is real and often invisible",
    category: 'Pregnancy Loss',
    tags: ['loss', 'grief', 'miscarriage'],
    readTime: '4 min',
    relevantFor: {
      roles: ['non-carrying'],
      journeyTypes: ['Navigating pregnancy loss'],
    },
  },
  {
    id: 'trying-again',
    title: 'Trying Again After Loss: When and How to Know',
    subtitle: 'What doctors say and what only you can decide',
    category: 'Pregnancy Loss',
    tags: ['loss', 'grief', 'miscarriage'],
    readTime: '5 min',
    relevantFor: { journeyTypes: ['Navigating pregnancy loss'] },
  },
  {
    id: 'miscarriage-prevention',
    title: "What We Know (and Don't Know) About Miscarriage Prevention",
    subtitle: 'Honest, evidence-based, not fear-mongering',
    category: 'Miscarriage Prevention',
    tags: ['prevention', 'risk', 'early-pregnancy'],
    readTime: '6 min',
    relevantFor: { goals: ['Reducing miscarriage risk'] },
  },
  {
    id: 'progesterone-folate',
    title: 'Progesterone, Folic Acid, and Other Early Pregnancy Supports',
    subtitle: 'What the research actually supports',
    category: 'Miscarriage Prevention',
    tags: ['prevention', 'risk', 'early-pregnancy'],
    readTime: '5 min',
    relevantFor: { goals: ['Reducing miscarriage risk'], roles: ['carrying'] },
  },
  {
    id: 'recurrent-loss',
    title: 'Recurrent Loss: When to Seek a Specialist',
    subtitle: "Signs it's time for deeper investigation",
    category: 'Miscarriage Prevention',
    tags: ['prevention', 'risk', 'early-pregnancy'],
    readTime: '5 min',
    relevantFor: {
      goals: ['Reducing miscarriage risk'],
      journeyTypes: ['Navigating pregnancy loss'],
    },
  },
  {
    id: 'cervical-mucus',
    title: 'Beyond the Period Tracker: What Cervical Mucus Can Tell You',
    subtitle: 'The overlooked fertility sign',
    category: 'Cycle Tracking',
    tags: ['tracking', 'cycle', 'fertility-signs'],
    readTime: '5 min',
    relevantFor: { roles: ['carrying'], goals: ['Tracking my cycle'] },
  },
  {
    id: 'ovulation-tests',
    title: 'Ovulation Tests Explained',
    subtitle: 'LH strips, digital monitors, and what the results mean',
    category: 'Cycle Tracking',
    tags: ['tracking', 'cycle', 'fertility-signs'],
    readTime: '4 min',
    relevantFor: {
      roles: ['carrying'],
      goals: ['Tracking my cycle', 'Conceiving naturally'],
    },
  },
  {
    id: 'irregular-cycles',
    title: "When Your Cycle Doesn't Follow the Rules",
    subtitle: 'Irregular cycles, PCOS, and what to track differently',
    category: 'Cycle Tracking',
    tags: ['tracking', 'cycle', 'fertility-signs'],
    readTime: '5 min',
    relevantFor: {
      roles: ['carrying'],
      fertilityHistory: ['PCOS', 'Irregular cycles'],
      goals: ['Tracking my cycle'],
    },
  },
  {
    id: 'four-things-partners-need',
    title: "The Four Things Most Carrying Partners Need (But Won't Always Ask For)",
    subtitle: 'From the research on fertility-related relationship strain',
    category: 'Relationship & Connection',
    tags: ['relationship', 'couple', 'intimacy'],
    readTime: '5 min',
    relevantFor: {
      roles: ['non-carrying'],
      goals: ['Supporting my partner', 'Staying connected as a couple'],
    },
  },
  {
    id: 'how-are-you',
    title: "How to Ask 'How Are You?' and Actually Mean It",
    subtitle: 'Being present without projecting',
    category: 'Relationship & Connection',
    tags: ['relationship', 'couple', 'intimacy'],
    readTime: '3 min',
    relevantFor: {
      goals: ['Staying connected as a couple', 'Supporting my partner'],
    },
  },
  {
    id: 'manage-your-anxiety',
    title: 'Managing Your Own Anxiety So You Can Be There for Theirs',
    subtitle: "The non-carrying partner's emotional work",
    category: 'Relationship & Connection',
    tags: ['relationship', 'couple', 'intimacy'],
    readTime: '5 min',
    relevantFor: { roles: ['non-carrying'], goals: ['Supporting my partner'] },
  },
  {
    id: 'fertility-not-define',
    title: "Fertility Doesn't Have to Define Your Relationship",
    subtitle: 'Protecting your connection during a hard season',
    category: 'Relationship & Connection',
    tags: ['relationship', 'couple', 'intimacy'],
    readTime: '4 min',
    relevantFor: { goals: ['Staying connected as a couple'] },
  },
  {
    id: 'intimacy-as-task',
    title: 'When Intimacy Feels Like a Task',
    subtitle: 'Navigating scheduled sex and keeping closeness alive',
    category: 'Relationship & Connection',
    tags: ['relationship', 'couple', 'intimacy'],
    readTime: '5 min',
    relevantFor: {
      goals: ['Staying connected as a couple', 'Conceiving naturally'],
    },
  },
  {
    id: 'monthly-checkpoints',
    title: 'Checkpoints: Monthly Questions to Ask Each Other',
    subtitle: 'A conversation guide for couples in treatment',
    category: 'Relationship & Connection',
    tags: ['relationship', 'couple', 'intimacy'],
    readTime: '4 min',
    relevantFor: { goals: ['Staying connected as a couple'] },
  },
  {
    id: 'fertility-glossary',
    title: 'Fertility 101: A Jargon-Free Glossary',
    subtitle: 'AMH, FSH, LH, and everything else explained',
    category: 'Fertility Basics',
    tags: ['education', 'basics', 'science'],
    readTime: '6 min',
    relevantFor: { goals: ['Learning about fertility'] },
  },
  {
    id: 'age-and-fertility',
    title: 'How Age Affects Fertility — For Both Partners',
    subtitle: 'The honest numbers without the panic',
    category: 'Fertility Basics',
    tags: ['education', 'basics', 'science'],
    readTime: '5 min',
    relevantFor: { goals: ['Learning about fertility', 'Improving fertility'] },
  },
  {
    id: 'see-a-specialist',
    title: 'The Reproductive Endocrinologist: Who They Are and When to See One',
    subtitle: 'What to expect at your first appointment',
    category: 'Fertility Basics',
    tags: ['education', 'basics', 'science'],
    readTime: '4 min',
    relevantFor: { goals: ['Learning about fertility', 'Managing IVF'] },
  },
  {
    id: 'youre-not-alone',
    title: "You're Not Alone: The Real Numbers on Infertility",
    subtitle: "Why this feels isolating even though it's common",
    category: 'Community & Disclosure',
    tags: ['community', 'social', 'sharing'],
    readTime: '3 min',
    relevantFor: { goals: ['Finding community'] },
  },
  {
    id: 'talking-about-infertility',
    title: 'How to Talk About Infertility (If and When You Want To)',
    subtitle: 'Navigating disclosure with family and friends',
    category: 'Community & Disclosure',
    tags: ['community', 'social', 'sharing'],
    readTime: '5 min',
    relevantFor: { goals: ['Finding community'] },
  },
  {
    id: 'online-communities',
    title: 'Online Communities That Actually Help',
    subtitle: 'What to look for and what to avoid',
    category: 'Community & Disclosure',
    tags: ['community', 'social', 'sharing'],
    readTime: '3 min',
    relevantFor: { goals: ['Finding community'] },
  },
  {
    id: 'same-sex-options',
    title: 'Family Building Options for Same-Sex Couples: An Overview',
    subtitle: 'Donor conception, IVF, surrogacy, adoption — a clear starting point',
    category: 'Same-Sex Couples',
    tags: ['same-sex', 'lgbtq', 'family-building'],
    readTime: '7 min',
    relevantFor: { relationshipStructures: ['Same-sex couple'] },
  },
  {
    id: 'same-sex-medical',
    title: 'Navigating the Medical System as a Same-Sex Couple',
    subtitle: 'What to expect, what to ask, what to push back on',
    category: 'Same-Sex Couples',
    tags: ['same-sex', 'lgbtq', 'family-building'],
    readTime: '5 min',
    relevantFor: { relationshipStructures: ['Same-sex couple'] },
  },
  {
    id: 'same-sex-stories',
    title: 'Two Moms, Two Dads, One Journey: Community Stories',
    subtitle: 'Real experiences from same-sex couples building families',
    category: 'Same-Sex Couples',
    tags: ['same-sex', 'lgbtq', 'family-building'],
    readTime: '6 min',
    relevantFor: { relationshipStructures: ['Same-sex couple'] },
  },
  {
    id: 'solo-first-steps',
    title: 'Choosing Single Parenthood: What the First Steps Look Like',
    subtitle: 'A practical and emotional guide',
    category: 'Solo Journey',
    tags: ['solo', 'single', 'independence'],
    readTime: '6 min',
    relevantFor: { relationshipStructures: ['Solo journey'] },
  },
  {
    id: 'solo-ivf',
    title: "Solo IVF: What's Different and What to Expect",
    subtitle: 'The medical and emotional specifics of going it alone',
    category: 'Solo Journey',
    tags: ['solo', 'single', 'independence'],
    readTime: '6 min',
    relevantFor: {
      relationshipStructures: ['Solo journey'],
      goals: ['Managing IVF'],
    },
  },
  {
    id: 'solo-support-system',
    title: "Building Your Support System When You're Doing This Solo",
    subtitle: "Because you still don't have to carry it entirely alone",
    category: 'Solo Journey',
    tags: ['solo', 'single', 'independence'],
    readTime: '4 min',
    relevantFor: { relationshipStructures: ['Solo journey'] },
  },
  {
    id: 'co-parenting-early',
    title: 'Co-Parenting Before Conception: What to Establish Early',
    subtitle: 'Legal, emotional, and logistical considerations',
    category: 'Non-Traditional Paths',
    tags: ['donor', 'surrogacy', 'co-parenting'],
    readTime: '6 min',
    relevantFor: { relationshipStructures: ['Non-traditional structure'] },
  },
  {
    id: 'donor-conception',
    title: 'Donor Conception: Talking to Your Child (and Yourself) About Origins',
    subtitle: 'A thoughtful guide for any stage',
    category: 'Non-Traditional Paths',
    tags: ['donor', 'surrogacy', 'co-parenting'],
    readTime: '5 min',
    relevantFor: {
      relationshipStructures: ['Non-traditional structure', 'Same-sex couple'],
    },
  },
  {
    id: 'surrogacy-2025',
    title: "Surrogacy in 2025: What's Changed and What to Know",
    subtitle: 'Updated guidance for intended parents',
    category: 'Non-Traditional Paths',
    tags: ['donor', 'surrogacy', 'co-parenting'],
    readTime: '7 min',
    relevantFor: {
      relationshipStructures: ['Non-traditional structure', 'Same-sex couple'],
    },
  },
  {
    id: 'pcos-fertility',
    title: 'PCOS and Fertility: What Actually Helps',
    subtitle: 'Lifestyle, medication, and realistic expectations',
    category: 'PCOS',
    tags: ['pcos', 'hormones', 'irregular'],
    readTime: '6 min',
    relevantFor: { fertilityHistory: ['PCOS'], roles: ['carrying'] },
  },
  {
    id: 'pcos-tracking',
    title: 'Tracking Your Cycle With PCOS',
    subtitle: "Why standard methods don't always work and what to do instead",
    category: 'PCOS',
    tags: ['pcos', 'hormones', 'irregular'],
    readTime: '5 min',
    relevantFor: { fertilityHistory: ['PCOS'], roles: ['carrying'] },
  },
  {
    id: 'endo-fertility',
    title: 'Endometriosis and Fertility: Having the Right Conversation With Your Doctor',
    subtitle: 'What to ask, what to push for, what the research says',
    category: 'Endometriosis',
    tags: ['endometriosis', 'pain', 'treatment'],
    readTime: '7 min',
    relevantFor: { fertilityHistory: ['Endometriosis'], roles: ['carrying'] },
  },
];

function withBodies(meta: ArticleMeta): Article {
  const body = articleBodies[meta.id];
  if (!body) {
    throw new Error(`Missing article body for id: ${meta.id}`);
  }
  return { ...meta, body };
}

export const articles: Article[] = catalog.map(withBodies);

export const articleCategories = [
  ...new Set(articles.map((a) => a.category)),
].sort();

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}
