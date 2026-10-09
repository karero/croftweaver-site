// The words /proof uses for one assistant's totals from the AI check. They live apart from proof.ts, which reads
// the CSV files through Vite, so that tests/a11y.spec.ts can call the same function with numbers of its own.

export const answers = (n: number) => `${n} ${n === 1 ? 'answer' : 'answers'}`;

// Assistants whose tracker "cited" count is how often the site was among the search results they returned, not
// how often it was cited. For them the check cannot tell which results the answer quotes: through Perplexity's
// own API it reads the list of results and nothing in the text, and through OpenRouter it reads the list of
// sources and not the [n] marks in the text. The count is independent of whether the answer names the site, so it
// can be higher than the "named" count. The toolkit's geo_check.py says the same (RESULTS_ONLY). The page says
// "among its search results" for them and never "cited". tests/a11y.spec.ts pins both.
export const RESULTS_ONLY = ['perplexity'];

// The totals of one assistant carry its id (undefined for rows of several assistants), so the words always follow
// the assistant whose rows were counted: there is no separate argument to get wrong.
export type Totals = { engine: string | undefined; answers: number; named: number; cited: number };

export const sentence = (t: Totals, start: 'Named' | 'named') => {
  if (t.engine !== undefined && RESULTS_ONLY.includes(t.engine)) {
    const among = t.cited > 0 ? ` The site was among its search results in ${t.cited} of ${answers(t.answers)}.` : '';
    return `${start} it in ${t.named} of ${answers(t.answers)}.${among}`;
  }
  return t.named > 0 && t.cited === t.named
    ? `${start} and cited the site in ${t.named} of ${answers(t.answers)}.`
    : `${start} it in ${t.named} of ${answers(t.answers)}.`;
};
