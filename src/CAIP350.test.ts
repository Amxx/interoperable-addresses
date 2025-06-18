import test from 'ava';

import { toBytes } from './utils/bytes';
import { CAIP350 } from './CAIP350';

test('eip155 - type', t => {
  t.is(CAIP350.eip155.type, '0x0000');
});

test('eip155 - encode reference', t => {
  t.is(CAIP350.eip155.reference.encode(1n), 1n);
  t.is(CAIP350.eip155.reference.encode('1'), 1n);
  t.is(CAIP350.eip155.reference.encode('0x01'), 1n);
  t.is(CAIP350.eip155.reference.encode([1]), 1n);

  t.is(CAIP350.eip155.reference.encode(42161n), 42161n);
  t.is(CAIP350.eip155.reference.encode('42161'), 42161n);
  t.is(CAIP350.eip155.reference.encode('0xa4b1'), 42161n);
  t.is(CAIP350.eip155.reference.encode(toBytes('0xa4b1')), 42161n);
});

test('eip155 - decode reference', t => {
  t.deepEqual(CAIP350.eip155.reference.decode(1n), Uint8Array.from([1]));
  t.deepEqual(CAIP350.eip155.reference.decode('1'), Uint8Array.from([1]));
  t.deepEqual(CAIP350.eip155.reference.decode('0x01'), Uint8Array.from([1]));
  t.deepEqual(CAIP350.eip155.reference.decode([1]), Uint8Array.from([1]));

  t.deepEqual(CAIP350.eip155.reference.decode(42161n), Uint8Array.from([0xa4, 0xb1]));
  t.deepEqual(CAIP350.eip155.reference.decode('42161'), Uint8Array.from([0xa4, 0xb1]));
  t.deepEqual(CAIP350.eip155.reference.decode('0xa4b1'), Uint8Array.from([0xa4, 0xb1]));
  t.deepEqual(CAIP350.eip155.reference.decode(toBytes('0xa4b1')), Uint8Array.from([0xa4, 0xb1]));
});

test('eip155 - encode address', t => {
  const address = '0x7859821024E633C5dC8a4FcF86fC52e7720Ce525';
  t.is(CAIP350.eip155.address.encode('0x7859821024E633C5dC8a4FcF86fC52e7720Ce525'), address);
  t.is(CAIP350.eip155.address.encode('0x7859821024e633c5dc8a4fcf86fc52e7720ce525'), address);
  t.is(CAIP350.eip155.address.encode('0x7859821024E633C5DC8A4FCF86FC52E7720CE525'), address);
  t.is(CAIP350.eip155.address.encode(toBytes(address)), address);
});

test('eip155 - decode address', t => {
  const address = '0x7859821024E633C5dC8a4FcF86fC52e7720Ce525';
  t.deepEqual(CAIP350.eip155.address.decode('0x7859821024E633C5dC8a4FcF86fC52e7720Ce525'), toBytes(address));
  t.deepEqual(CAIP350.eip155.address.decode('0x7859821024e633c5dc8a4fcf86fc52e7720ce525'), toBytes(address));
  t.deepEqual(CAIP350.eip155.address.decode('0x7859821024E633C5DC8A4FCF86FC52E7720CE525'), toBytes(address));
  t.deepEqual(CAIP350.eip155.address.decode(toBytes(address)), toBytes(address));
});

test('solana - type', t => {
  t.is(CAIP350.solana.type, '0x0002');
});

test('solana - encode reference', t => {
  const reference = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
  t.is(CAIP350.solana.reference.encode(reference), reference);
  t.is(CAIP350.solana.reference.encode(toBytes(reference)), reference);
});

test('solana - decode reference', t => {
  const reference = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
  t.deepEqual(CAIP350.solana.reference.decode(reference), toBytes(reference));
  t.deepEqual(CAIP350.solana.reference.decode(toBytes(reference)), toBytes(reference));
});

test('solana - encode address', t => {
  const address = 'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2';
  t.is(CAIP350.solana.address.encode(address), address);
  t.is(CAIP350.solana.address.encode(toBytes(address)), address);
});

test('solana - decode address', t => {
  const address = 'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2';
  t.deepEqual(CAIP350.solana.address.decode(address), toBytes(address));
  t.deepEqual(CAIP350.solana.address.decode(toBytes(address)), toBytes(address));
});
