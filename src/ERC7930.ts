import { Coder } from '@scure/base';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { TypedRegEx } from 'typed-regex';

import { ChainTypes, ChainTypesCode, CAIP350, chainTypeCoder, isChainType, isChainTypeCode } from './CAIP350';
import { BytesLike, toBytes, toHex } from './utils/bytes'
import { validateArgument } from './utils/errors';

export type InteroperableAddress = {
    chainType: ChainTypes | ChainTypesCode,
    reference?: BytesLike,
    address?: BytesLike,
    checksum?: BytesLike,
}

export function computeChecksum(input: InteroperableAddress) : string {
    return toHex(keccak256(toBytes(addressCoder.encode(input)).slice(2))).slice(2,10).toUpperCase();
}

export const addressCoder: Coder<InteroperableAddress, BytesLike> = {
    decode: (input: BytesLike) => {
        const buffer = toBytes(input)
        const version = toHex(buffer.slice(0, 2));
        const type = toHex(buffer.slice(2, 4));
        const referenceLength = buffer[4] ?? 0;
        const addressLength = buffer[5 + referenceLength] ?? 0;

        validateArgument(version === '0x0001', `Unsuported version: ${version}`);
        validateArgument(isChainTypeCode(type), `Unsuported chain type: ${type}`);
        validateArgument(buffer.length === 6 + referenceLength + addressLength, 'Invalid input length');
        validateArgument(referenceLength > 0 ||addressLength > 0, 'reference and address should not both be empty');

        const chainType = chainTypeCoder.decode(type);

        const output: InteroperableAddress = { chainType };
        if (referenceLength > 0) output.reference = CAIP350[chainType].reference(buffer.slice(5, 5 + referenceLength));
        if (addressLength > 0) output.address = CAIP350[chainType].address(buffer.slice(6 + referenceLength, 6 + referenceLength + addressLength));
        output.checksum = computeChecksum(output);
        return output;
    },
    encode: ({ chainType, reference, address }: InteroperableAddress) => {
        if (isChainTypeCode(chainType)) chainType = chainTypeCoder.decode(chainType);

        const version = toBytes('0x0001');
        const chainTypeBytes = toBytes(chainTypeCoder.encode(chainType));
        const referenceBytes = toBytes(reference ?? '');
        const addressBytes = toBytes(address ?? '');

        validateArgument(referenceBytes.length < 256, 'reference is too long');
        validateArgument(addressBytes.length < 256, 'address is too long');

        return toHex(Uint8Array.from([
            ...version,
            ...chainTypeBytes,
            referenceBytes.length,
            ...referenceBytes,
            addressBytes.length,
            ...addressBytes
        ]));
    },
}

export const nameCoder: Coder<InteroperableAddress, string> = {
    decode: (input: string, pedantic: boolean = false) => {
        const parsed = TypedRegEx('^((?<address>[.-:_%a-zA-Z0-9]*)@)?(?<chain>[.-:_a-zA-Z0-9]*)#(?<checksum>[0-9A-F]{8})$').captures(input);
        validateArgument(parsed, `Invalid interoperable name: ${input}`);
        const { address, chain, checksum } = parsed;
        const [chainType, reference] = chain.split(/:(.*)/s);

        validateArgument(isChainType(chainType!), `Unsuported chain type: ${chainType}`);

        const output: InteroperableAddress = { chainType, checksum };
        if (reference !== undefined) output.reference = CAIP350[chainType].reference(reference);
        if (address !== '') output.address = CAIP350[chainType].address(address);
        output.checksum = checksum;

        if (pedantic) {
            const expectedChecksum = computeChecksum(output);
            validateArgument(checksum === expectedChecksum, `Wrong checksum. Got ${checksum} but expected ${expectedChecksum}`);
        }

        return output;
    },
    encode: ({ chainType, reference, address }: InteroperableAddress) => {
        if (isChainTypeCode(chainType)) chainType = chainTypeCoder.decode(chainType);
        return [
            address && CAIP350[chainType].address(address),
            '@',
            chainType,
            reference && `:${reference}`,
            '#',
            computeChecksum({ chainType, reference, address }),
        ].join('');
    },
}