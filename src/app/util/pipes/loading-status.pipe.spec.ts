import { LoadingStatusPipe } from './loading-status.pipe';

describe('LoadingStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new LoadingStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
