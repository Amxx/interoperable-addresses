import { keccak256 } from 'ethereum-cryptography/keccak';
import { TypedRegEx } from 'typed-regex';

import { CAIP350, chainTypeCoder, isChainType, isChainTypeCode } from './CAIP350';
import { BytesLike, Bytes, toBytes, toHex } from './utils/bytes';
import { validateArgument } from './utils/errors';

export type InteroperableAddress =
  | {
      chainType: 'eip155' | '0x0000';
      reference?: BytesLike | bigint;
      address?: BytesLike;
      checksum?: BytesLike;
    }
  | {
      chainType: 'solana' | '0x0002';
      reference?: BytesLike;
      address?: BytesLike;
      checksum?: BytesLike;
    };

export function computeChecksum(self: InteroperableAddress): string {
  return toHex(keccak256(toBytes(addressCoder.encode(self)).slice(2)))
    .slice(2, 10)
    .toUpperCase();
}

export const addressCoder /* : Coder<InteroperableAddress, BytesLike> */ = {
  decode: (self: BytesLike) => {
    const buffer = toBytes(self);
    const version = toHex(buffer.slice(0, 2));
    const type = toHex(buffer.slice(2, 4));
    const referenceLength = buffer[4] ?? 0;
    const addressLength = buffer[5 + referenceLength] ?? 0;

    validateArgument(version === '0x0001', `Unsuported version: ${version}`);
    validateArgument(isChainTypeCode(type), `Unsuported chain type: ${type}`);
    validateArgument(buffer.length === 6 + referenceLength + addressLength, 'Invalid address length');
    validateArgument(referenceLength > 0 || addressLength > 0, 'Reference and address should not both be empty');

    const chainType = chainTypeCoder.encode(type);
    const output: InteroperableAddress = { chainType };
    if (referenceLength > 0) {
      output.reference = CAIP350[chainType].reference.encode(buffer.slice(5, 5 + referenceLength));
    }
    if (addressLength > 0) {
      output.address = CAIP350[chainType].address.encode(
        buffer.slice(6 + referenceLength, 6 + referenceLength + addressLength),
      );
    }
    output.checksum = computeChecksum(output);
    return output;
  },
  encode: ({ chainType, reference, address }: InteroperableAddress) => {
    let chainTypeBytes: Bytes, referenceBytes: Bytes, addressBytes: Bytes;
    switch (chainType) {
      case 'eip155':
      case '0x0000': {
        chainTypeBytes = toBytes('0x0000');
        referenceBytes = CAIP350.eip155.reference.decode(reference ?? '');
        addressBytes = CAIP350.eip155.address.decode(address ?? '');
        break;
      }
      case 'solana':
      case '0x0002': {
        chainTypeBytes = toBytes('0x0002');
        referenceBytes = CAIP350.solana.reference.decode(reference ?? '');
        addressBytes = CAIP350.solana.address.decode(address ?? '');
        break;
      }
    }

    validateArgument(referenceBytes.length < 256, 'reference is too long');
    validateArgument(addressBytes.length < 256, 'address is too long');

    return toHex(
      Uint8Array.from([
        0,
        1, // version 1
        ...chainTypeBytes,
        referenceBytes.length,
        ...referenceBytes,
        addressBytes.length,
        ...addressBytes,
      ]),
    );
  },
};

export const nameCoder /* : Coder<InteroperableAddress, string> */ = {
  decode: (self: string, pedantic: boolean = false) => {
    const parsed = TypedRegEx(
      '^((?<address>[.-:_%a-zA-Z0-9]*)@)?(?<chain>[.-:_a-zA-Z0-9]*)#(?<checksum>[0-9A-F]{8})$',
    ).captures(self);

    validateArgument(parsed, `Invalid interoperable name: ${self}`);

    const { address, chain, checksum } = parsed;
    const [chainType, reference] = chain.split(/:(.*)/s);

    validateArgument(isChainType(chainType!), `Unsuported chain type: ${chainType}`);

    const output: InteroperableAddress = { chainType, checksum };
    if (reference !== undefined) {
      output.reference = CAIP350[chainType].reference.encode(reference);
    }
    if (address !== '') {
      output.address = CAIP350[chainType].address.encode(address);
    }
    output.checksum = checksum;

    if (pedantic) {
      const expectedChecksum = computeChecksum(output);
      validateArgument(
        checksum === expectedChecksum,
        `Wrong checksum. Got ${checksum} but expected ${expectedChecksum}`,
      );
    }

    return output;
  },
  encode: ({ chainType, reference, address }: InteroperableAddress) => {
    if (isChainTypeCode(chainType)) {
      chainType = chainTypeCoder.encode(chainType);
    }
    return [
      address && CAIP350[chainType].address.encode(address),
      '@',
      chainType,
      reference && `:${reference}`,
      '#',
      computeChecksum({ chainType, reference, address } as InteroperableAddress),
    ].join('');
  },
};
