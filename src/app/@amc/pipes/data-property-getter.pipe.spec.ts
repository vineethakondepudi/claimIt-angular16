import { DataPropertyGetterPipe } from './data-property-getter.pipe';
describe('DataPropertyGetterPipe', () => {
  it('create an instance', () => {
    const pipe = new DataPropertyGetterPipe();
    const data =[{label: 'data'}]
    expect(pipe.transform(data,'data')).toBeUndefined();
    expect(pipe).toBeTruthy();
  });
});