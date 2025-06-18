import test from 'ava';

import { InteroperableAddress, addressCoder, nameCoder } from './ERC7930';
import { InvalidArgumentError } from './utils/errors';

test('Example 1: Ethereum mainnet address', t => {
  const name = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155:1#4CA88C9C';
  const address = '0x00010000010114d8da6bf26964af9d7eed9e03e53415d37aa96045';
  const expected = {
    chainType: 'eip155',
    reference: 1n,
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    checksum: '4CA88C9C',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), name);
});

test('Example 2: Solana mainnet address', t => {
  const name =
    'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2@solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d#88835C11';
  const address =
    '0x000100022045296998a6f8e2a784db5d9f95e18fc23f70441a1039446801089879b08c7ef02005333498d5aea4ae009585c43f7b8c30df8e70187d4a713d134f977fc8dfe0b5';
  const expected = {
    chainType: 'solana',
    reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
    address: 'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2',
    checksum: '88835C11',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0002' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0002' } as InteroperableAddress), name);
});

test('Example 3: EVM address without chainid', t => {
  const name = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155#B26DB7CB';
  const address = '0x000100000014d8da6bf26964af9d7eed9e03e53415d37aa96045';
  const expected = {
    chainType: 'eip155',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    checksum: 'B26DB7CB',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), name);
});

test('Example 4: Solana mainnet network, no address', t => {
  const name = '@solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d#2EB18670';
  const address = '0x000100022045296998a6f8e2a784db5d9f95e18fc23f70441a1039446801089879b08c7ef000';
  const expected = {
    chainType: 'solana',
    reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
    checksum: '2EB18670',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0002' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0002' } as InteroperableAddress), name);
});

test('Example 5: Arbitrum One address', t => {
  const name = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155:42161#D2E02854';
  const address = '0x0001000002a4b114d8da6bf26964af9d7eed9e03e53415d37aa96045';
  const expected = {
    chainType: 'eip155',
    reference: 42161n, // 0xa4b1
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    checksum: 'D2E02854',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), name);
});

test('Example 6: EVM chain without address', t => {
  const name = '@eip155:1#F54D4FBF';
  const address = '0x00010000010100';
  const expected = {
    chainType: 'eip155',
    reference: 1n,
    checksum: 'F54D4FBF',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0000' } as InteroperableAddress), name);
});

test('Example 7: Solana address without a network', t => {
  const name = 'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2@solana#18D1CBB4';
  const address = '0x00010002002005333498d5aea4ae009585c43f7b8c30df8e70187d4a713d134f977fc8dfe0b5';
  const expected = {
    chainType: 'solana',
    address: 'MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2',
    checksum: '18D1CBB4',
  } as InteroperableAddress;

  t.deepEqual(addressCoder.decode(address), expected);
  t.deepEqual(nameCoder.decode(name), expected);
  t.is(addressCoder.encode(expected), address);
  t.is(nameCoder.encode(expected), name);

  // using chaintype code
  t.is(addressCoder.encode({ ...expected, chainType: '0x0002' } as InteroperableAddress), address);
  t.is(nameCoder.encode({ ...expected, chainType: '0x0002' } as InteroperableAddress), name);
});

test('parse name with invalid checksum', t => {
  // bad checksum
  t.notThrows(() => nameCoder.decode('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155#144A4B21', false));
  t.throws(() => nameCoder.decode('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155#144A4B21', true));

  // good checksum
  t.notThrows(() => nameCoder.decode('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155#B26DB7CB', false));
  t.notThrows(() => nameCoder.decode('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045@eip155#B26DB7CB', true));
});

test('invalid format', t => {
  t.throws(() => addressCoder.decode('0x0002'), new InvalidArgumentError('Unsuported version: 0x0002'));
  t.throws(() => addressCoder.decode('0x00010000'), new InvalidArgumentError('Invalid address length'));
  t.throws(() => addressCoder.decode('0x00010001'), new InvalidArgumentError('Unsuported chain type: 0x0001'));
  t.throws(
    () => addressCoder.decode('0x000100000000'),
    new InvalidArgumentError('Reference and address should not both be empty'),
  );
});
