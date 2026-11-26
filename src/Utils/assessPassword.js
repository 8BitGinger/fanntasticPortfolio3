/* Strength estimate for a password a person typed themselves.

   length × log2(character pool) only holds for random passwords: it would call
   "Password123!" strong. So we look for the shortcuts a cracker tries first
   (common words, look-alike swaps, sequences, keyboard walks, repeats, years),
   price each of those cheaply, and charge full price only for what's left.

   This is a lightweight estimate with a small built-in word list. It does not
   check breach databases, so it can still rate a password too highly. */

// Roughly most-common first: earlier entries are guessed sooner.
const COMMON_WORDS = (
  'password 123456 qwerty letmein welcome admin iloveyou monkey dragon sunshine princess football ' +
  'baseball master shadow superman batman trustno1 abc123 login passw0rd starwars whatever freedom ' +
  'ninja mustang michael jordan harley ranger hunter buster soccer hockey tigger charlie andrew ' +
  'jessica jennifer ashley nicole daniel joshua matthew robert thomas pepper ginger summer winter ' +
  'spring autumn cookie cheese coffee banana orange apple flower purple yellow silver golden diamond ' +
  'love angel baby lovely sweet honey friend family happy lucky magic secret killer hello computer ' +
  'internet access system server network changeme default guest test user root pass word money ' +
  'music rock jazz metal guitar piano country lofi gamer game player pokemon zelda mario sonic ' +
  'minecraft fortnite wizard knight sword fire water earth wind storm thunder lightning dark light ' +
  'night moon star sun sky blue red green black white tiger lion wolf bear eagle horse dog cat fish ' +
  'bird snake shark phoenix cowboy yankee dallas texas boston chicago london paris america january ' +
  'february march april june july august september october november december monday friday sunday ' +
  'blink heart soul king queen prince boss hero legend super power energy cyber pixel retro bit'
).split(' ');

const WORD_RANK = new Map(COMMON_WORDS.map((word, i) => [word, i + 1]));

const KEYBOARD_ROWS = ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const SEQUENCES = ['abcdefghijklmnopqrstuvwxyz', '01234567890', ...KEYBOARD_ROWS];

const LEET = { '@': 'a', 4: 'a', 8: 'b', 3: 'e', 6: 'g', 1: 'i', '!': 'i', 0: 'o', $: 's', 5: 's', 7: 't', '+': 't' };

function poolSizeOf(password) {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 33; // printable symbols + space
  return size;
}

function findWords(password) {
  const lower = password.toLowerCase();
  const unleet = lower.replace(/[@!$+0134-8]/g, (c) => LEET[c] || c);
  const matches = [];

  for (let start = 0; start < password.length; start += 1) {
    for (let end = start + 3; end <= password.length; end += 1) {
      const plain = lower.slice(start, end);
      const swapped = unleet.slice(start, end);
      const isPlain = WORD_RANK.has(plain);
      if (!isPlain && !WORD_RANK.has(swapped)) continue;

      const typed = password.slice(start, end);
      let bits = Math.log2(WORD_RANK.get(isPlain ? plain : swapped) + 1);
      // Capitals and swaps like a → @ add very little.
      if (typed !== typed.toLowerCase()) bits += /^[A-Z][^A-Z]*$/.test(typed) ? 1 : 2;
      if (!isPlain) bits += 2;
      matches.push({ start, end, bits, type: isPlain ? 'word' : 'leet' });
    }
  }
  return matches;
}

function findSequences(password) {
  const lower = password.toLowerCase();
  const matches = [];

  for (let start = 0; start < lower.length; start += 1) {
    for (let end = lower.length; end >= start + 3; end -= 1) {
      const chunk = lower.slice(start, end);
      const reversed = [...chunk].reverse().join('');
      if (SEQUENCES.some((seq) => seq.includes(chunk) || seq.includes(reversed))) {
        matches.push({ start, end, bits: 5 + Math.log2(chunk.length), type: 'sequence' });
        break; // longest run from this position is enough
      }
    }
  }
  return matches;
}

// "aaaa", "abababab", "hunter2hunter2": pay for the block once, plus the count.
// Only the shortest repeating block at each position is used, and each block is
// priced once (cache). Without both limits, long repeats freeze the page.
function findRepeats(password, cache) {
  const matches = [];
  for (let start = 0; start < password.length; start += 1) {
    for (let size = 1; start + size * 2 <= password.length; size += 1) {
      const block = password.slice(start, start + size);
      let count = 1;
      while (password.startsWith(block, start + size * count)) count += 1;
      if (count < 2 || size * count < 3) continue;

      const blockBits = estimateBits(block, cache).bits;
      // Every shorter run of the repeat is a candidate too.
      for (let n = 2; n <= count; n += 1) {
        if (size * n < 3) continue;
        matches.push({ start, end: start + size * n, bits: blockBits + Math.log2(n), type: 'repeat' });
      }
      break;
    }
  }
  return matches;
}

function findYears(password) {
  return [...password.matchAll(/(?=((?:19|20)\d\d))/g)].map((m) => ({
    start: m.index,
    end: m.index + 4,
    bits: Math.log2(200),
    type: 'year',
  }));
}

/* Cheapest way to build the password out of patterns and random characters. */
function estimateBits(password, cache = new Map()) {
  if (cache.has(password)) return cache.get(password);

  const charBits = Math.log2(poolSizeOf(password) || 1);
  const matches = [
    ...findWords(password),
    ...findSequences(password),
    ...findRepeats(password, cache),
    ...findYears(password),
  ];

  const best = [{ bits: 0, used: [] }];
  for (let end = 1; end <= password.length; end += 1) {
    let choice = { bits: best[end - 1].bits + charBits, used: best[end - 1].used };
    for (const match of matches) {
      if (match.end !== end) continue;
      // +1 bit for the attacker having to guess where the pattern goes.
      const bits = best[match.start].bits + match.bits + 1;
      if (bits < choice.bits) choice = { bits, used: [...best[match.start].used, match.type] };
    }
    best[end] = choice;
  }
  cache.set(password, best[password.length]);
  return best[password.length];
}

const PATTERN_WARNINGS = {
  word: 'Contains a common word or password. Crackers try those first.',
  leet: 'Swaps like @ for a or 0 for o are well known and add very little.',
  sequence: 'Has a predictable run, such as abc, 123 or qwerty.',
  repeat: 'Repeats the same characters or chunk.',
  year: 'Includes what looks like a year, which is easy to guess.',
};

export function assessPassword(password) {
  if (!password) return { bits: 0, tips: [] };

  const { bits, used } = estimateBits(password);
  const warnings = [...new Set(used)].map((type) => ({ kind: 'warn', text: PATTERN_WARNINGS[type] }));

  const tips = [];
  if (password.length < 12) tips.push('Make it longer. Aim for at least 12 characters, ideally 16 or more.');
  else if (bits < 65) tips.push('Add more length with unrelated words or random characters.');
  const kinds = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((re) => re.test(password)).length;
  if (kinds < 3 && bits < 90) tips.push('Mix in other character types, placed somewhere unpredictable.');

  return { bits, tips: [...warnings, ...tips.map((text) => ({ kind: 'tip', text }))] };
}
