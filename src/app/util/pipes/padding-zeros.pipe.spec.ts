import { PaddingZerosPipe } from './padding-zeros.pipe';

describe('PaddingZerosPipe', () => {
  it('create an instance', () => {
    const pipe = new PaddingZerosPipe();
    expect(pipe).toBeTruthy();
  });
});
