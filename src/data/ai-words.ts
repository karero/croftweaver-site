// The words /proof uses for one assistant's totals from the AI check. They live apart from proof.ts, which reads
// the CSV files through Vite, so that tests/a11y.spec.ts can call the same function with numbers of its own.

export const answers = (n: number) => `${n} ${n === 1 ? 'answer' : 'answers'}`;

// Assistants whose tracker "cited" count is how often the site was among the sources they returned, not how often
// it was cited. For them the check cannot tell which sources the answer quotes: through Perplexity's own API it
// reads the list of search results and nothing in the text, and through OpenRouter it reads the list of sources
// and not the [n] marks in the text. One wording covers both routes: the sources it returned. The count is
// independent of whether the answer names the site, so it can be higher than the "named" count. The toolkit's
// geo_check.py has the same list (RESULTS_ONLY). The page says "among the sources it returned" for them and never
// "cited". tests/a11y.spec.ts pins both.
export const RESULTS_ONLY = ['perplexity'];

// The totals of one assistant carry its id (undefined for rows of several assistants), so the words always follow
// the assistant whose rows were counted: there is no separate argument to get wrong.
export type Totals = { engine: string | undefined; answers: number; named: number; cited: number };

export const sentence = (t: Totals, start: 'Named' | 'named') => {
  const named = `${start} it in ${t.named} of ${answers(t.answers)}.`;
  if (t.cited === 0) return named;
  if (t.engine !== undefined && RESULTS_ONLY.includes(t.engine)) {
    return `${named} The site was among the sources it returned in ${t.cited} of ${answers(t.answers)}.`;
  }
  // "Named and cited" says that the same answers did both. Two totals prove it only when each is all of the
  // answers; equal totals short of that could come from different answers (one only named, one only cited, one
  // both also gives 2 and 2). Otherwise the two counts are stated apart. After "On <day> it" the second sentence
  // needs a subject of its own.
  if (t.named === t.answers && t.cited === t.answers) {
    return `${start} and cited the site in ${t.answers} of ${answers(t.answers)}.`;
  }
  return `${named} ${start === 'Named' ? 'Cited' : 'It cited'} the site in ${t.cited} of ${answers(t.answers)}.`;
};
