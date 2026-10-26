import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyBeat,
  extractDomain,
  formatTimeAgo,
  generateDynamicRoleImpact,
  FALLBACK_STORIES,
} from './hnApi';

test('classifyBeat identifies beats accurately', () => {
  assert.equal(classifyBeat('PostgreSQL 18 introduces native vector indexing'), 'Cloud & Infra');
  assert.equal(classifyBeat('Kubernetes GPU allocator release'), 'Cloud & Infra');
  assert.equal(classifyBeat('Product growth strategies for SaaS founders'), 'Product & Strategy');
  assert.equal(classifyBeat('Zero-blur UI and UX design trends'), 'Product & Strategy');
  assert.equal(classifyBeat('DeepMind Gemini 2.5 Agentic coordination'), 'Agentic AI');
});

test('extractDomain strips www and parses hostname correctly', () => {
  assert.equal(extractDomain('https://www.deepmind.google/technologies/gemini/'), 'deepmind.google');
  assert.equal(extractDomain('https://kubernetes.io/blog/'), 'kubernetes.io');
  assert.equal(extractDomain('invalid-url-string'), 'news.ycombinator.com');
});

test('formatTimeAgo calculates relative elapsed time', () => {
  const now = Math.floor(Date.now() / 1000);
  assert.equal(formatTimeAgo(now - 30), '1m ago');
  assert.equal(formatTimeAgo(now - 120), '2m ago');
  assert.equal(formatTimeAgo(now - 7200), '2h ago');
  assert.equal(formatTimeAgo(now - 86400 * 3), '3d ago');
});

test('generateDynamicRoleImpact returns perspectives for all three roles', () => {
  const impact = generateDynamicRoleImpact('New Distributed System', 'Cloud & Infra');
  assert.ok(impact['Software Engineer']);
  assert.ok(impact['Product Manager']);
  assert.ok(impact['Founder / Exec']);
});

test('FALLBACK_STORIES contains well-formed seed stories', () => {
  assert.ok(FALLBACK_STORIES.length >= 6);
  for (const story of FALLBACK_STORIES) {
    assert.ok(story.id);
    assert.ok(story.title);
    assert.ok(story.domain);
    assert.ok(story.beat);
    assert.ok(Array.isArray(story.tldrBullets));
    assert.equal(story.tldrBullets.length, 3);
    assert.ok(story.roleImpact['Software Engineer']);
    assert.ok(story.roleImpact['Product Manager']);
    assert.ok(story.roleImpact['Founder / Exec']);
  }
});
