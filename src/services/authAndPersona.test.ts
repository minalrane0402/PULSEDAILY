import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidGmailAddress,
  formatInitials,
  formatWhyThisMattersTitle,
  createDefaultBreakingStory,
  PERSONA_DEFINITIONS,
} from './authAndPersona';

test('isValidGmailAddress correctly validates Gmail and Google-hosted addresses', () => {
  assert.equal(isValidGmailAddress('rminal0402@gmail.com'), true);
  assert.equal(isValidGmailAddress('user@google.com'), true);
  assert.equal(isValidGmailAddress('john.doe@gmail.com'), true);
  assert.equal(isValidGmailAddress('not-an-email'), false);
  assert.equal(isValidGmailAddress('test@yahoo.com'), false);
  assert.equal(isValidGmailAddress(''), false);
});

test('formatInitials computes clean 2-letter uppercase initials', () => {
  assert.equal(formatInitials('Alex Rivera'), 'AR');
  assert.equal(formatInitials('Sundar Pichai'), 'SP');
  assert.equal(formatInitials('Demis'), 'DE');
  assert.equal(formatInitials(''), 'U');
});

test('formatWhyThisMattersTitle personalizes with first name and persona', () => {
  assert.equal(
    formatWhyThisMattersTitle('Alex Rivera', 'Software Engineer'),
    '✨ Why this matters for Alex (Software Engineer)'
  );
  assert.equal(
    formatWhyThisMattersTitle('Minal', 'Founder / Exec'),
    '✨ Why this matters for Minal (Founder / Exec)'
  );
});

test('createDefaultBreakingStory generates valid high-velocity story', () => {
  const story = createDefaultBreakingStory('Anthropic releases Claude 3.7 hybrid model', 'Founder / Exec', 'Minal');
  assert.equal(story.isBreaking, true);
  assert.equal(story.velocityScore, 99);
  assert.ok(story.title.includes('Anthropic releases Claude 3.7'));
  assert.ok(story.roleImpact['Founder / Exec'].includes('Minal'));
  assert.equal(story.tldrBullets.length, 3);
});

test('PERSONA_DEFINITIONS covers all three distinct roles', () => {
  const roles = ['Founder / Exec', 'Software Engineer', 'Product Manager'] as const;
  for (const r of roles) {
    const p = PERSONA_DEFINITIONS[r];
    assert.ok(p);
    assert.equal(p.role, r);
    assert.ok(p.tagline);
    assert.ok(p.focusAreas.length >= 3);
  }
});
