import { useEffect, useMemo, useRef, useState } from 'react';
import { offlineAnswer } from '../offline-knowledge.js';

const exampleProblems = [
  'I was caught riding a scooter without a helmet.',
  'My landlord is refusing to return my security deposit.',
  'My employer has not paid my salary for two months.',
  'I received an incorrect traffic challan and want to dispute it.',
  'I lost money in an online payment fraud.',
  'A defective product was delivered and the seller is refusing a refund.',
];

const optionLabels = ['Best Case', 'If That Does Not Work', 'Worst-Case Scenario / If Things Get Serious'];

function hasCompleteAnswer(payload) {
  return Boolean(
    payload && typeof payload === 'object' &&
    typeof payload.question === 'string' && typeof payload.category === 'string' &&
    Array.isArray(payload.recommendations) && payload.recommendations.length === 3 &&
    payload.recommendations.every((option) =>
      typeof option?.title === 'string' && typeof option?.description === 'string' && typeof option?.explanation === 'string' &&
      typeof option?.when_to_choose === 'string' && Array.isArray(option.steps) && option.steps.length > 0 &&
      Array.isArray(option.pros) && Array.isArray(option.limitations) && Array.isArray(option.documents) &&
      Array.isArray(option.sources) && option.sources.every((source) => typeof source.title === 'string' && /^https:\/\//i.test(source.url)),
    ) && Array.isArray(payload.next_steps) && Array.isArray(payload.legal_sources),
  );
}

function App() {
  const [problem, setProblem] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);

  const showExamples = useMemo(() => ({ title: 'Start with an example', items: exampleProblems }), []);

  useEffect(() => {
    if (!result) return;
    window.history.replaceState(null, '', '#results');
    requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [result]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const text = problem.trim();
    if (!text) {
      setError('Please describe your legal problem first.');
      return;
    }

    inFlight.current = true;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze-legal-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: text, state, city }),
      });

      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error('The analysis service returned an unreadable response.');
      }
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to generate legal guidance.');
      }
      if (!hasCompleteAnswer(payload)) throw new Error('The analysis service returned incomplete guidance.');
      const guidanceMode = payload.guidance_mode || (payload.status === 'offline' || payload.research_status === 'offline_knowledge_base' ? 'offline' : 'online');
      setResult({
        ...payload,
        guidance_mode: guidanceMode,
        recommended_next_action: payload.recommended_next_action || payload.recommendations[0].next_step || payload.next_steps[0],
        warnings: Array.isArray(payload.warnings) ? payload.warnings : [payload.research_note || 'Verify case-specific rules before acting.'],
      });
    } catch {
      const offline = offlineAnswer(text, state, city);
      setResult({
        ...offline,
        guidance_mode: 'offline',
        research_note: 'Offline guidance — the online analysis request failed. These saved official references were not checked live; verify current procedures and case-specific rules when possible.',
      });
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  const guidanceSources = result?.legal_sources || [];
  const urgentFinancialFraud = /(?:financial|cyber|online payment|upi).{0,35}(?:fraud|scam)|(?:fraud|scam).{0,35}(?:payment|upi|financial|online)/i.test(problem);
  const immediateDanger = /immediate(?:ly)?(?: physical)? danger|in danger right now|unsafe right now|being attacked|being followed|physical violence|threatening me in person|someone threatened to hurt me/i.test(problem);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">L</div>
          <div>
            <div className="brand-name">Legal Advice Knowledge Base</div>
            <div className="brand-subtitle">India legal guidance</div>
          </div>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#results">Results</a>
          <a href="#sources">Sources</a>
        </nav>
      </header>

      <main className="main-area" id="home">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">India-focused legal guidance</span>
            <h1>Understand Your Legal Options.</h1>
            <p>
              Describe your problem in plain language. Compare practical legal options, understand the next steps,
              and find trustworthy Indian legal sources.
            </p>
          </div>

          <form className="input-panel" onSubmit={handleSubmit} aria-busy={loading}>
            <label htmlFor="problem" className="field-label">What happened?</label>
            <p className="field-hint">Share the key details, dates, and what outcome you are seeking.</p>
            <textarea
              id="problem"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              placeholder="Example: My employer has not paid my salary for two months and I do not know what to do."
              rows={6}
              minLength={15}
              maxLength={4000}
              required
              aria-describedby="privacy-note problem-count"
            />
            <div className="field-footnote"><span id="privacy-note">Please do not include names, account numbers, or other unnecessary personal details.</span><span id="problem-count">{problem.length}/4000</span></div>
            {urgentFinancialFraud ? (
              <aside className="urgent-notice" role="note">
                <strong>Urgent: act now; don’t wait for this analysis.</strong>
                <span>For online financial fraud, call <a href="tel:1930">1930</a> promptly and report it at the <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">National Cyber Crime Reporting Portal</a>. Keep your transaction reference and contact your bank or payment provider.</span>
              </aside>
            ) : null}
            {immediateDanger ? (
              <aside className="urgent-notice" role="note">
                <strong>If you are in immediate danger, act now.</strong>
                <span>Move to a safer place if possible and contact local emergency services (112 in India). Do not wait for this analysis.</span>
              </aside>
            ) : null}

            <div className="location-row">
              <div className="field-wrap">
                <label htmlFor="state">State (optional)</label>
                <input id="state" value={state} onChange={(event) => setState(event.target.value)} placeholder="Karnataka" />
              </div>
              <div className="field-wrap">
                <label htmlFor="city">City (optional)</label>
                <input id="city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Bengaluru" />
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={loading || problem.trim().length < 15}>
              {loading ? <><span className="spinner" aria-hidden="true" /> Researching your options…</> : 'Analyse My Problem'}
            </button>

            {error ? <div className="error-box" role="alert">{error}</div> : null}

            <div className="example-box">
              <strong>{showExamples.title}</strong>
              <div className="example-list">
                {showExamples.items.map((item) => (
                  <button type="button" key={item} className="example-tag" onClick={() => setProblem(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="disclaimer"><strong>For your awareness</strong><span>This service provides general legal information, not professional legal advice. Verify important decisions with a qualified Indian lawyer.</span></div>
          </form>
        </section>

        {result ? (
          <section className="results-panel" id="results">
            <div className="result-header">
              <div>
                <span className="eyebrow small">Summary</span>
                <h2>{result.question || 'Your legal issue'}</h2>
              </div>
              <div className="result-badges">
                <span className={`guidance-mode-pill ${result.guidance_mode === 'offline' ? 'offline' : 'online'}`}>{result.guidance_mode === 'offline' ? 'Offline guidance' : 'Online research'}</span>
                <div className="pill">{result.category || 'General legal query'}</div>
              </div>
            </div>

            {result.needs_follow_up ? (
              <div className="follow-up-box">
                <strong>We need a couple of details:</strong>
                <ul>
                  {(result.follow_up_questions || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ) : null}

            {result.research_note ? <div className="research-note">{result.research_note}</div> : null}
            {result.urgency_notice ? <aside className="urgent-notice result-urgent" role="note">{result.urgency_notice}</aside> : null}
            {import.meta.env.DEV && result.timings_ms ? (
              <p className="timing-note" aria-label="Development response timings">
                Research {(result.timings_ms.research_ms / 1000).toFixed(1)}s · AI {(result.timings_ms.ai_ms / 1000).toFixed(1)}s · server total {(result.timings_ms.server_ms / 1000).toFixed(1)}s
              </p>
            ) : null}

            {result.recommended_next_action ? (
              <div className="recommended-action"><strong>Recommended next action</strong><span>{result.recommended_next_action}</span></div>
            ) : null}

            <h3 className="section-heading">Compare your options</h3>
            <div className="comparison-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Recommended action</th>
                    {result.recommendations.map((option, index) => (
                      <th key={option.title || index}><span className="option-level-label">Option {index + 1} — {optionLabels[index]}</span><span>{option.title}</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>When appropriate</td>
                    {result.recommendations.map((option, index) => (
                      <td key={`${option.title}-${index}`}>{option.when_to_choose}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>First step</td>
                    {result.recommendations.map((option, index) => (
                      <td key={`${option.title}-a-${index}`}>{option.steps?.[0] || 'Review the facts'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Advantages / limits</td>
                    {result.recommendations.map((option, index) => <td key={`tradeoffs-${index}`}><strong>Pros:</strong> {(option.pros || []).join('; ') || 'Not specified'}<br /><strong>Limits:</strong> {(option.limitations || []).join('; ') || 'Not specified'}</td>)}
                  </tr>
                  <tr>
                    <td>Applicable law</td>
                    {result.recommendations.map((option, index) => <td key={`law-${index}`}>{option.law || 'Needs verification'}</td>)}
                  </tr>
                  <tr>
                    <td>Documents</td>
                    {result.recommendations.map((option, index) => (
                      <td key={`${option.title}-b-${index}`}>{(option.documents || []).slice(0, 2).join(', ') || 'Documents vary'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Cost / penalty</td>
                    {result.recommendations.map((option, index) => (
                      <td key={`${option.title}-c-${index}`}>{option.cost_or_penalty || 'Not confirmed'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Sources</td>
                    {result.recommendations.map((option, index) => (
                      <td key={`${option.title}-d-${index}`}>
                        {option.sources?.map((src) => (
                          <a key={src.url || src.title} href={src.url} target="_blank" rel="noreferrer">{src.title}</a>
                        )).slice(0, 2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="option-stack">
              {(result.recommendations || []).map((option, index) => (
                <article key={option.title || index} className="option-card">
                  <div className="option-card-header">
                    <span className="option-number">Option {index + 1} — {optionLabels[index]}</span>
                    <h3>{option.title}</h3>
                  </div>
                  <p>{option.description || option.explanation}</p>
                  <div className="meta-grid">
                    <div><strong>When to choose it</strong><span>{option.when_to_choose}</span></div>
                    <div><strong>Advantages</strong><span>{option.pros?.join(' • ')}</span></div>
                    <div><strong>Limitations</strong><span>{option.limitations?.join(' • ')}</span></div>
                    <div><strong>Law / rule</strong><span>{option.law || 'General Indian legal guidance'}</span></div>
                    <div><strong>Cost</strong><span>{option.cost_or_penalty || 'Depends on the facts'}</span></div>
                    <div><strong>Next step</strong><span>{option.next_step || 'Proceed carefully with official channels'}</span></div>
                  </div>

                  <div className="steps-box">
                    <h4>Step-by-step instructions</h4>
                    <ol>
                      {(option.steps || []).map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </div>

                  <div className="doc-box">
                    <strong>Documents you may need</strong>
                    <ul>
                      {(option.documents || []).map((doc) => <li key={doc}>{doc}</li>)}
                    </ul>
                  </div>

                  <div className="source-box">
                    <h4>Official sources</h4>
                    <ul>
                      {(option.sources || []).map((source) => (
                        <li key={source.url || source.title}>
                          <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                          <span> — {source.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="next-steps-box">
              <h3>Your Next Steps</h3>
              <ol>
                {(result.next_steps || []).map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>

            <div className="disclaimer-box">{result.disclaimer || 'This is general information, not a lawyer’s guarantee or a court ruling.'}</div>
          </section>
        ) : null}

        <section className="source-panel" id="sources">
          <h3>Legal Sources and References</h3>
          {guidanceSources.length ? (
            <div className="source-list">
              {guidanceSources.map((source) => (
                <div key={source.url || source.title} className="source-item">
                  <div className="source-title-row">
                    <strong>{source.title}</strong>
                    <span className="status-pill">{source.verification_status}</span>
                  </div>
                  <p>{source.publisher}</p>
                  <p>{source.excerpt}</p>
                  {source.published_date ? <p>Published: {source.published_date}</p> : null}
                  <a href={source.url} target="_blank" rel="noreferrer">Open retrieved source</a>
                </div>
              ))}
            </div>
          ) : <p>Saved official source references are available with offline guidance after you submit a question.</p>}
        </section>
      </main>
    </div>
  );
}

export default App;
