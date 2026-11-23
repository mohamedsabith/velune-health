/**
 * Crawler access policy.
 *
 * Decision (owner-approved): allow classic search, AI search/answer engines,
 * user-triggered AI fetchers AND model-training crawlers on public content.
 * Each group is listed explicitly so the decision is auditable and can be
 * changed per group without touching the rest. API routes are never crawlable.
 *
 * Sources (checked Nov 2026): OpenAI developers.openai.com/api/docs/bots,
 * Anthropic support.claude.com/en/articles/8896518, Perplexity docs.perplexity.ai,
 * Google developers.google.com/crawling (common crawlers), Apple, Meta, DuckDuckGo,
 * Mistral, Common Crawl, Amazon published crawler pages.
 */

export type CrawlerPurpose = 'search' | 'ai-search' | 'ai-user' | 'ai-training';

export interface CrawlerGroup {
  purpose: CrawlerPurpose;
  label: string;
  allow: boolean;
  agents: { token: string; operator: string; note?: string }[];
}

export const crawlerPolicy: CrawlerGroup[] = [
  {
    purpose: 'search',
    label: 'Search engine indexing',
    allow: true,
    agents: [
      { token: 'Googlebot', operator: 'Google', note: 'Also feeds AI Overviews / AI Mode' },
      { token: 'Bingbot', operator: 'Microsoft', note: 'Also grounds Microsoft Copilot answers' },
      { token: 'Applebot', operator: 'Apple' },
      { token: 'DuckDuckBot', operator: 'DuckDuckGo' },
    ],
  },
  {
    purpose: 'ai-search',
    label: 'AI search and answer engines',
    allow: true,
    agents: [
      { token: 'OAI-SearchBot', operator: 'OpenAI', note: 'ChatGPT search results' },
      { token: 'Claude-SearchBot', operator: 'Anthropic', note: 'Claude search index' },
      { token: 'PerplexityBot', operator: 'Perplexity', note: 'Perplexity search index' },
      { token: 'DuckAssistBot', operator: 'DuckDuckGo', note: 'DuckAssist answers' },
      { token: 'meta-webindexer', operator: 'Meta', note: 'Meta AI search' },
      { token: 'xAI-SearchBot', operator: 'xAI', note: 'Unverified token; xAI publishes no official list' },
    ],
  },
  {
    purpose: 'ai-user',
    label: 'User-triggered AI fetchers (a person asked an assistant to read a page)',
    allow: true,
    agents: [
      { token: 'ChatGPT-User', operator: 'OpenAI', note: 'May not apply robots.txt (user-initiated)' },
      { token: 'Claude-User', operator: 'Anthropic' },
      {
        token: 'Perplexity-User',
        operator: 'Perplexity',
        note: 'Generally ignores robots.txt (user-initiated)',
      },
      { token: 'MistralAI-User', operator: 'Mistral' },
      { token: 'meta-externalfetcher', operator: 'Meta', note: 'May bypass robots.txt (user-initiated)' },
    ],
  },
  {
    purpose: 'ai-training',
    label: 'AI model training',
    allow: true,
    agents: [
      { token: 'GPTBot', operator: 'OpenAI' },
      { token: 'ClaudeBot', operator: 'Anthropic' },
      { token: 'Google-Extended', operator: 'Google', note: 'Control token only; no separate crawler' },
      { token: 'Applebot-Extended', operator: 'Apple', note: 'Control token only; no separate crawler' },
      { token: 'meta-externalagent', operator: 'Meta' },
      { token: 'CCBot', operator: 'Common Crawl' },
      { token: 'Amazonbot', operator: 'Amazon' },
      { token: 'GrokBot', operator: 'xAI', note: 'Unverified token' },
    ],
  },
];

/** Paths that must never be crawled regardless of the group decision. */
export const privatePaths = ['/api/'];
