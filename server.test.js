import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp, resetOnlineCooldownForTests } from './server.js';
import { findOfflineTopic, offlineAnswer } from './offline-knowledge.js';

const envKeys = [
  'GEMINI_API_KEY', 'GEMINI_MODEL', 'OPENROUTER_API_KEY', 'OPENROUTER_MODEL',
  'OPENROUTER_FALLBACK_MODELS', 'TAVILY_API_KEY', 'BRAVE_SEARCH_API_KEY',
];

function setTestEnv(overrides = {}) {
  const previous = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  for (const key of envKeys) delete process.env[key];
  Object.assign(process.env, overrides);
  return () => {
    for (const key of envKeys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

const evidence = {
  results: [
    { title: 'Official helmet and traffic challan legal source', url: 'https://www.indiacode.nic.in/example', content: 'Retrieved evidence excerpt about helmet, traffic challan and section 129.', published_date: null },
    { title: 'Non-production source', url: 'https://staging.parivahan.gov.in/example', content: 'Must not be treated as an official production source.', published_date: null },
  ],
};

function answerFor(prompt) {
  const url = 'https://www.indiacode.nic.in/example';
  return {
    question: prompt.includes('User problem:') ? 'Fictional legal issue' : 'Issue',
    category: 'Consumer issue', needs_follow_up: false, follow_up_questions: [],
    recommendations: [1, 2, 3].map((index) => ({
      title: `Option ${index}`, explanation: 'Provisional practical information.', when_to_choose: 'When appropriate.',
      pros: ['Clear next step'], limitations: ['Check applicability'], steps: ['Keep records'], law: 'Needs verification',
      cost_or_penalty: 'Not verified', documents: ['Relevant records'], sources: [{ url, note: 'Source supports checking the procedure.' }],
    })),
    next_steps: ['Keep relevant records'], disclaimer: 'General information only.',
  };
}

function catalog(models) {
  return { data: models.map((id) => ({
    id, architecture: { input_modalities: ['text'], output_modalities: ['text'] },
    supported_parameters: ['response_format'],
  })) };
}

async function requestApp(fetchImpl, path = '/api/analyze-legal-problem', problem = 'This is a fictional helmet traffic challan test issue for provider fallback.') {
  const app = createApp({ fetchImpl });
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, path.endsWith('/health')
      ? {} : {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('Gemini success returns three options without calling OpenRouter', async (t) => {
  const restore = setTestEnv({ GEMINI_API_KEY: 'test-gemini-secret', GEMINI_MODEL: 'mock-gemini', OPENROUTER_API_KEY: 'test-openrouter-secret', OPENROUTER_MODEL: 'mock/preferred', TAVILY_API_KEY: 'test-tavily-secret' });
  t.after(restore);
  let geminiCalls = 0;
  const result = await requestApp(async (url) => {
    if (String(url).includes('tavily.com')) return jsonResponse(evidence);
    if (String(url).includes('generativelanguage.googleapis.com')) {
      geminiCalls += 1;
      return jsonResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify(answerFor('')) }] } }] });
    }
    throw new Error('OpenRouter should not be called');
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.selected_provider, 'Gemini');
  assert.equal(result.body.recommendations.length, 3);
  assert.equal(result.body.guidance_mode, 'online');
  assert.equal(typeof result.body.recommended_next_action, 'string');
  assert.equal(Array.isArray(result.body.warnings), true);
  assert.equal(typeof result.body.recommendations[0].description, 'string');
  assert.equal(result.body.legal_sources.length, 1);
  assert.equal(Number.isInteger(result.body.timings_ms.server_ms), true);
  assert.equal(Number.isInteger(result.body.timings_ms.research_ms), true);
  assert.equal(Number.isInteger(result.body.timings_ms.ai_ms), true);
  assert.doesNotMatch(JSON.stringify(result.body), /test-(?:gemini|openrouter|tavily)-secret/);
  assert.equal(geminiCalls, 1);
});

test('Gemini failure falls back to OpenRouter and rotates away from a failed preferred model', async (t) => {
  const restore = setTestEnv({ GEMINI_API_KEY: 'test-gemini-secret', GEMINI_MODEL: 'mock-gemini', OPENROUTER_API_KEY: 'test-openrouter-secret', OPENROUTER_MODEL: 'mock/preferred', TAVILY_API_KEY: 'test-tavily-secret' });
  t.after(restore);
  const attempted = [];
  const result = await requestApp(async (url, options = {}) => {
    const address = String(url);
    if (address.includes('tavily.com')) return jsonResponse(evidence);
    if (address.includes('generativelanguage.googleapis.com')) return jsonResponse({}, 503);
    if (address.includes('/api/v1/models')) return jsonResponse(catalog(['mock/preferred', 'mock/backup']));
    if (address.includes('/chat/completions')) {
      const model = JSON.parse(options.body).model;
      attempted.push(model);
      if (model === 'mock/preferred') return jsonResponse({ error: { message: 'model unavailable' } }, 404);
      return jsonResponse({ choices: [{ message: { content: JSON.stringify(answerFor('')) } }] });
    }
    throw new Error(`Unexpected request ${address}`);
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.selected_provider, 'OpenRouter');
  assert.deepEqual(attempted, ['mock/preferred', 'mock/backup']);
  assert.equal(result.body.recommendations.length, 3);
});

test('Tavily failure falls back to configured Brave research before analysis', async (t) => {
  const restore = setTestEnv({ GEMINI_API_KEY: 'test-gemini-secret', GEMINI_MODEL: 'mock-gemini', TAVILY_API_KEY: 'test-tavily-secret', BRAVE_SEARCH_API_KEY: 'test-brave-secret' });
  t.after(restore);
  let braveCalled = false;
  const result = await requestApp(async (url) => {
    const address = String(url);
    if (address.includes('tavily.com')) return jsonResponse({}, 503);
    if (address.includes('search.brave.com')) {
      braveCalled = true;
      return jsonResponse({ web: { results: [{ title: 'Official traffic challan law', url: 'https://www.indiacode.nic.in/example', description: 'Retrieved helmet and traffic challan evidence excerpt.' }] } });
    }
    if (address.includes('generativelanguage.googleapis.com')) return jsonResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify(answerFor('')) }] } }] });
    throw new Error(`Unexpected request ${address}`);
  });
  assert.equal(result.status, 200);
  assert.equal(braveCalled, true);
  assert.equal(result.body.legal_sources[0].publisher, 'www.indiacode.nic.in');
});

test('all AI providers failing returns three offline options after successful research', async (t) => {
  const restore = setTestEnv({ GEMINI_API_KEY: 'test-gemini-secret', GEMINI_MODEL: 'mock-gemini', OPENROUTER_API_KEY: 'test-openrouter-secret', OPENROUTER_MODEL: 'mock/preferred', TAVILY_API_KEY: 'test-tavily-secret' });
  t.after(restore);
  const result = await requestApp(async (url) => {
    const address = String(url);
    if (address.includes('tavily.com')) return jsonResponse(evidence);
    if (address.includes('generativelanguage.googleapis.com')) return jsonResponse({}, 503);
    if (address.includes('/api/v1/models')) return jsonResponse(catalog([]));
    if (address.includes('/chat/completions')) return jsonResponse({}, 503);
    throw new Error(`Unexpected request ${address}`);
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, 'offline');
  assert.equal(result.body.recommendations.length, 3);
  assert.equal(result.body.guidance_mode, 'offline');
  assert.equal(typeof result.body.recommended_next_action, 'string');
  assert.equal(Array.isArray(result.body.warnings), true);
  assert.equal(typeof result.body.recommendations[0].description, 'string');
  assert.match(result.body.research_note, /Offline guidance/i);
  assert.match(result.body.legal_sources[0].verification_status, /not checked live/i);
  assert.doesNotMatch(JSON.stringify(result.body), /test-(?:gemini|openrouter|tavily)-secret/);
});

test('network failure falls back offline quickly and cooldown prevents repeated calls', async (t) => {
  resetOnlineCooldownForTests();
  const restore = setTestEnv({ GEMINI_API_KEY: 'test-gemini-secret', GEMINI_MODEL: 'mock-gemini', OPENROUTER_API_KEY: 'test-openrouter-secret', TAVILY_API_KEY: 'test-tavily-secret', BRAVE_SEARCH_API_KEY: 'test-brave-secret' });
  t.after(restore);
  let calls = 0;
  const failedNetwork = async () => { calls += 1; throw new Error('simulated unavailable network'); };
  const first = await requestApp(failedNetwork, '/api/analyze-legal-problem', 'I was caught riding a scooter without a helmet in Karnataka. What can I legally do?');
  assert.equal(first.status, 200);
  assert.equal(first.body.status, 'offline');
  assert.equal(first.body.recommendations.length, 3);
  assert.equal(first.body.category, 'Helmet or traffic challan');
  assert.equal(first.body.timings_ms.server_ms < 2000, true);
  assert.equal(calls, 1);

  const beforeSecond = calls;
  const second = await requestApp(failedNetwork, '/api/analyze-legal-problem', 'My landlord won\'t return my deposit after I moved out.');
  assert.equal(second.status, 200);
  assert.equal(second.body.category, 'Rental deposit or landlord dispute');
  assert.equal(calls, beforeSecond);
});

test('offline classifier recognises variations and safely handles unfamiliar questions', async () => {
  assert.equal(findOfflineTopic('Owner is keeping my rental advance.').id, 'landlord');
  assert.equal(findOfflineTopic('I vacated the flat but owner isnt refunding my money.').id, 'landlord');
  assert.equal(findOfflineTopic('My employer has not paid my wages.').id, 'salary');
  assert.equal(findOfflineTopic('My employer has withheld my salary for two months.').id, 'salary');
  assert.equal(findOfflineTopic('A seller sent a defective product and refuses to replace it.').id, 'consumer');
  assert.equal(findOfflineTopic('I lost ₹5,000 in a UPI scam.').id, 'fraud');
  const unfamiliar = await requestApp(async () => { throw new Error('No online call expected'); }, '/api/analyze-legal-problem', 'I have a complex property boundary dispute with my neighbour.');
  assert.equal(unfamiliar.status, 200);
  assert.equal(unfamiliar.body.needs_follow_up, true);
  assert.equal(unfamiliar.body.recommendations.length, 3);
  assert.match(unfamiliar.body.research_note, /Offline guidance/i);
});

test('offline entries cover each requested topic with three relevant options', () => {
  const examples = [
    ['A traffic challan says I rode without a helmet.', 'traffic_helmet'],
    ['The camera challan is wrong and it was not my vehicle.', 'traffic_incorrect'],
    ['Owner is keeping my rental advance after I vacated the flat.', 'landlord'],
    ['Employer withheld my wages and salary.', 'salary'],
    ['The seller sent a faulty product and refuses a refund.', 'consumer'],
    ['I lost money in an online UPI scam.', 'fraud'],
    ['Someone is sending threats and harassing me online.', 'harassment'],
    ['I received a legal demand notice and need to reply.', 'notice'],
    ['A contractor breached our written agreement.', 'contract'],
  ];
  for (const [problem, expectedId] of examples) {
    assert.equal(findOfflineTopic(problem)?.id, expectedId, problem);
    const answer = offlineAnswer(problem, 'Karnataka', 'Bengaluru');
    assert.equal(answer.recommendations.length, 3, problem);
    assert.ok(answer.recommendations.every((option) => option.steps.length >= 2), problem);
    assert.ok(answer.legal_sources.length > 0, problem);
    assert.match(answer.legal_sources[0].verification_status, /not checked live/i);
  }
});

test('missing credentials return safely and health diagnostics never expose secrets', async (t) => {
  const restore = setTestEnv({});
  t.after(restore);
  const health = await requestApp(async () => { throw new Error('No upstream request expected'); }, '/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.body.providers.Gemini, 'not_configured');
  assert.equal(health.body.providers.OpenRouter, 'not_configured');
  assert.equal(health.body.onlineResearch.Tavily, 'not_configured');
  assert.doesNotMatch(JSON.stringify(health.body), /secret|key/i);

  const missing = await requestApp(async () => { throw new Error('No upstream request expected'); });
  assert.equal(missing.status, 200);
  assert.equal(missing.body.status, 'offline');
  assert.equal(missing.body.recommendations.length, 3);
});

test('invalid user input is rejected before any provider request', async (t) => {
  const restore = setTestEnv({ GEMINI_API_KEY: 'test-secret', TAVILY_API_KEY: 'test-tavily-secret' });
  t.after(restore);
  const app = createApp({ fetchImpl: async () => { throw new Error('Provider must not be called'); } });
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/analyze-legal-problem`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ problem: 'short' }),
    });
    assert.equal(response.status, 400);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
