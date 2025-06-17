import test from 'ava';

import { toChecksumAddress } from './address';

test('toChecksumAddress', t => {
  t.is(toChecksumAddress('0xcccccccccccccccccccccccccccccccccccccccc'), '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC');
  t.is(toChecksumAddress('0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'), '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC');
  t.is(toChecksumAddress('0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'), '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC');
  t.is(toChecksumAddress('0x7859821024e633c5dc8a4fcf86fc52e7720ce525'), '0x7859821024E633C5dC8a4FcF86fC52e7720Ce525');
  t.is(toChecksumAddress('0x7859821024E633C5dC8a4FcF86fC52e7720Ce525'), '0x7859821024E633C5dC8a4FcF86fC52e7720Ce525');
  t.is(toChecksumAddress('0x7859821024E633C5DC8A4FCF86FC52E7720CE525'), '0x7859821024E633C5dC8a4FcF86fC52e7720Ce525');
});
