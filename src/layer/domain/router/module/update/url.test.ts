import { _isRegisterable as isRegisterable, _isReplaceable as isReplaceable } from './url';
import { RouterEventLocation, RouterEventType } from '../../../event/router';
import { standardizeUrl } from '../../../../data/model/domain/url';
import DOM from 'typed-dom';

describe('Unit: layer/domain/router/module/update/url', () => {
  describe('isRegisterable', () => {
    it('same location', () => {
      assert(!isRegisterable(RouterEventType.click, new RouterEventLocation(standardizeUrl(location.href))));
      assert(!isRegisterable(RouterEventType.submit, new RouterEventLocation(standardizeUrl(location.href))));
      assert(!isRegisterable(RouterEventType.popstate, new RouterEventLocation(standardizeUrl(location.href))));
    });

    it('click', () => {
      assert(isRegisterable(RouterEventType.click, new RouterEventLocation(standardizeUrl(`#${Math.random()}`))));
    });

    it('submit', () => {
      assert(isRegisterable(RouterEventType.submit, new RouterEventLocation(standardizeUrl(`#${Math.random()}`))));
    });

    it('popstate', () => {
      assert(!isRegisterable(RouterEventType.popstate, new RouterEventLocation(standardizeUrl(`#${Math.random()}`))));
    });

  });

  describe('isReplaceable', () => {
    it('click', () => {
      assert(!isReplaceable(RouterEventType.click, DOM.a([]).element, '.replace'));
      assert(isReplaceable(RouterEventType.click, DOM.a({ class: 'replace' }, []).element, '.replace'));
    });

    it('submit', () => {
      assert(!isReplaceable(RouterEventType.submit, DOM.form([]).element, '.replace'));
      assert(isReplaceable(RouterEventType.submit, DOM.form({ class: 'replace' }, []).element, '.replace'));
    });

    it('popstate', () => {
      assert(!isReplaceable(RouterEventType.popstate, window, '.replace'));
    });

  });

});
