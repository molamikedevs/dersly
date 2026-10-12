// No 'use client' here on purpose: the server pages build the key and pass
// it down, so this must stay a plain module both sides can call.

// One key per student, so two students sharing a phone never see each
// other's answers
export function progressKey(userId: string) {
  return `dersly:level-test:${userId}`;
}
