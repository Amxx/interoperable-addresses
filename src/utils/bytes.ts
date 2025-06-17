type Bytes = Uint8Array;
type BytesLike = readonly number[] | Uint8Array | string | bigint;

import { hex, base58, base64 } from '@scure/base';

function toBytes(input: BytesLike): Bytes {
  if (input instanceof Uint8Array) {
    return input;
  } else if (typeof input === 'bigint') {
    const hexInput = input.toString(16);
    return hex.decode(hexInput.length % 2 ? '0' + hexInput : hexInput);
  } else if (typeof input === 'string' && /^[0-9]+$/.test(input)) {
    return toBytes(BigInt(input));
  } else if (typeof input === 'string' && /^(0x)?([A-Fa-f0-9]{2})*$/.test(input)) {
    return hex.decode(input.replace(/^0x/, ''));
  } else if (typeof input === 'string' && /^[A-HJ-NP-Za-km-z1-9]*$/.test(input)) {
    return base58.decode(input);
  } else if (typeof input === 'string' && /^[-A-Za-z0-9+/]*={0,3}$/.test(input)) {
    return base64.decode(input);
  } else if (typeof input === 'string') {
    throw new Error(`Invalid BytesLike object: ${input}`)
  } else {
    return new Uint8Array(input);
  }
}

function toHex(input: BytesLike): string {
  return `0x${hex.encode(toBytes(input))}`;
}

function toBase58(input: BytesLike): string {
  return base58.encode(toBytes(input));
}

function toBase64(input: BytesLike): string {
  return base64.encode(toBytes(input));
}

export type { BytesLike, Bytes };
export { toBytes, toHex, toBase58, toBase64 };
