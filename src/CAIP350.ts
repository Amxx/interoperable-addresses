import { Coder } from '@scure/base';

import { toChecksumAddress } from './utils/address';
import { BytesLike, toHex, toBase58 } from './utils/bytes';

export const CAIP350 = {
    eip155: {
        type: '0x0000',
        reference: (input: BytesLike) => BigInt(toHex(input)),
        address: toChecksumAddress,
    },
    solana: {
        type: '0x0002',
        reference: toBase58,
        address: toBase58,
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

export function isChainType(input: string): input is ChainTypes {
    return ['eip155', 'solana'].includes(input);
}

export function isChainTypeCode(input: string): input is ChainTypesCode {
    return ['0x0000', '0x0002'].includes(input);
}