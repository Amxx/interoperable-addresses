import { Coder } from '@scure/base';

import { toChecksumAddress } from './utils/address';
import { BytesLike, Bytes, toBytes, toHex, toBase58 } from './utils/bytes';

export const CAIP350 = {
    eip155: {
        type: '0x0000',
        reference: {
            encode: (data: BytesLike | bigint): bigint => {
                if (typeof data === 'bigint') {
                    return data;
                } else if (typeof data === 'string' && /^[0-9]+$/.test(data)) {
                    return BigInt(data);
                } else {
                    return BigInt(toHex(data));
                }
            },
            decode: (data: BytesLike | bigint): Bytes => {
                if (typeof data === 'bigint') {
                    const hex = data.toString(16); // no 0x prefix
                    return toBytes(hex.length % 2 ? '0' + hex : hex);
                } else if (typeof data === 'string' && /^[0-9]+$/.test(data)) {
                    const hex = BigInt(data).toString(16); // no 0x prefix
                    return toBytes(hex.length % 2 ? '0' + hex : hex);
                } else {
                    return toBytes(data);
                }
            },
        },
        address: { encode: toChecksumAddress, decode: toBytes },
    },
    solana: {
        type: '0x0002',
        reference: { encode: toBase58, decode: toBytes },
        address: { encode: toBase58, decode: toBytes },
    },
} as const;

export type ChainTypes = keyof typeof CAIP350;
export type ChainTypesCode = typeof CAIP350[ChainTypes]['type'];
export const chainTypeCoder : Coder<ChainTypes, ChainTypesCode> = {
    encode: from => CAIP350[from].type,
    decode: to => {
        switch(to) {
            case '0x0000': return 'eip155';
            case '0x0002': return 'solana';
        }
    },
}

export function isChainType(self: string): self is ChainTypes {
    return ['eip155', 'solana'].includes(self);
}

export function isChainTypeCode(self: string): self is ChainTypesCode {
    return ['0x0000', '0x0002'].includes(self);
}
