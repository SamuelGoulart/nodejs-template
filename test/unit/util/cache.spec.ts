import { ALLOWED_CONTEXT } from '@/data/protocols/cache';
import { getCacheKeyByContext } from '@/util';

import { name } from '../../../package.json';

describe('getCacheKeyByContext Function', () => {
  const APP_NAME = name;

  it.skip('Should return a valid cache key without meta', () => {
    const context = ALLOWED_CONTEXT[0];
    const result = getCacheKeyByContext(context);

    const expected = `${APP_NAME.toUpperCase().replaceAll(
      '-',
      '_'
    )}.${context}`;
    expect(result).toBe(expected);
  });

  it('Should return a valid cache key with meta', () => {
    const context = ALLOWED_CONTEXT[0];
    const meta = 'someMeta';
    const result = getCacheKeyByContext(context, meta);

    const expected = `${APP_NAME.toUpperCase().replaceAll(
      '-',
      '_'
    )}.${context}.${meta}`;
    expect(result).toBe(expected);
  });

  it('Should throw an error for disallowed context', () => {
    const invalidContext: any = 'INVALID_CONTEXT';
    expect(() => getCacheKeyByContext(invalidContext)).toThrowError(
      'Context not allowed'
    );
  });

  it.skip('Should throw an error for context or meta containing dot (.) character', () => {
    const contextWithDot: any = `${ALLOWED_CONTEXT[0]}.`;
    const metaWithDot = 'some.Meta';

    expect(() => getCacheKeyByContext(contextWithDot)).toThrowError(
      'Dot (.) character are not allowed in context or meta'
    );
    expect(() =>
      getCacheKeyByContext(ALLOWED_CONTEXT[1], metaWithDot)
    ).toThrowError('Dot (.) character are not allowed in context or meta');
  });
});
