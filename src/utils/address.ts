import { keccak256 } from 'ethereum-cryptography/keccak';
import { validateArgument } from './errors';
import { BytesLike, toHex } from './bytes';

export function toChecksumAddress(address: BytesLike) {
  address = toHex(address);

  validateArgument(
    /^(0x)?[0-9a-fA-F]{40}$/i.test(address),
    `Given address "${address}" is not a valid Ethereum address`,
  );

  const chars = address.replace(/^0x/, '').toLocaleLowerCase().split('');
  const hash = keccak256(Uint8Array.from(chars.map(c => c.charCodeAt(0))));

  for (let i = 0; i < 40; i += 2) {
    chars[i] = hash[i >> 1]! >> 4 < 8 ? chars[i]!.toLowerCase() : chars[i]!.toUpperCase();
    chars[i + 1] = (hash[i >> 1]! & 0x0f) < 8 ? chars[i + 1]!.toLowerCase() : chars[i + 1]!.toUpperCase();
  }

  return '0x' + chars.join('');
}
