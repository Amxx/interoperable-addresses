import test from 'ava';

import * as bytes from './bytes';

test('toBytes', t => {
  // empty
  t.deepEqual(bytes.toBytes(Uint8Array.of()), Uint8Array.of());
  t.deepEqual(bytes.toBytes([]), Uint8Array.of());
  t.deepEqual(bytes.toBytes('0x'), Uint8Array.of());
  t.deepEqual(bytes.toBytes(''), Uint8Array.of());

  // not-empty [1,2,3]
  t.deepEqual(bytes.toBytes(Uint8Array.of(1, 2, 3)), Uint8Array.of(1, 2, 3));
  t.deepEqual(bytes.toBytes([1, 2, 3]), Uint8Array.of(1, 2, 3));
  t.deepEqual(bytes.toBytes('0x010203'), Uint8Array.of(1, 2, 3));
  t.deepEqual(bytes.toBytes('66051'), Uint8Array.of(1, 2, 3));
  t.deepEqual(bytes.toBytes('Ldp'), Uint8Array.of(1, 2, 3));
  t.deepEqual(bytes.toBytes('AQID'), Uint8Array.of(1, 2, 3));
});

test('toHex', t => {
  // empty
  t.is(bytes.toHex(Uint8Array.of()), '0x');
  t.is(bytes.toHex('0x'), '0x');
  t.is(bytes.toHex(''), '0x');
  t.is(bytes.toHex([]), '0x');

  // not-empty [1,2,3]
  t.is(bytes.toHex(Uint8Array.of(1, 2, 3)), '0x010203');
  t.is(bytes.toHex([1, 2, 3]), '0x010203');
  t.is(bytes.toHex('0x010203'), '0x010203');
  t.is(bytes.toHex('66051'), '0x010203');
  t.is(bytes.toHex('Ldp'), '0x010203');
  t.is(bytes.toHex('AQID'), '0x010203');

  // no 0x prefix, but also not a decimal value
  t.is(bytes.toHex('01ef'), '0x01ef');
});

test('toBase58', t => {
  // empty
  t.is(bytes.toBase58(Uint8Array.of()), '');
  t.is(bytes.toBase58('0x'), '');
  t.is(bytes.toBase58(''), '');
  t.is(bytes.toBase58([]), '');

  // not-empty [1,2,3]
  t.is(bytes.toBase58(Uint8Array.of(1, 2, 3)), 'Ldp');
  t.is(bytes.toBase58([1, 2, 3]), 'Ldp');
  t.is(bytes.toBase58('0x010203'), 'Ldp');
  t.is(bytes.toBase58('66051'), 'Ldp');
  t.is(bytes.toBase58('Ldp'), 'Ldp');
  t.is(bytes.toBase58('AQID'), 'Ldp');
});

test('toBase64', t => {
  // empty
  t.is(bytes.toBase64(Uint8Array.of()), '');
  t.is(bytes.toBase64('0x'), '');
  t.is(bytes.toBase64(''), '');
  t.is(bytes.toBase64([]), '');

  // not-empty [1,2,3]
  t.is(bytes.toBase64(Uint8Array.of(1, 2, 3)), 'AQID');
  t.is(bytes.toBase64([1, 2, 3]), 'AQID');
  t.is(bytes.toBase64('0x010203'), 'AQID');
  t.is(bytes.toBase64('66051'), 'AQID');
  t.is(bytes.toBase64('Ldp'), 'AQID');
  t.is(bytes.toBase64('AQID'), 'AQID');
});
