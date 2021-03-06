import { RouterEventMethod, RouterEventRequest, RouterEventLocation } from './router';
import { standardizeUrl } from '../../data/model/domain/url';
import DOM from 'typed-dom';

describe('Unit: layer/domain/event/router', () => {
  describe('RouterEventRequest', () => {
    it('click', () => {
      const req = new RouterEventRequest(DOM.a({ href: location.href }, []).element);
      assert(req.url === standardizeUrl(''));
      assert(req.method === RouterEventMethod.GET);
      assert(req.data === null);
    });

    it('submit get', () => {
      const req = new RouterEventRequest(DOM.form({ method: 'GET', action: './search' }, [
        DOM.input({ name: 'test', type: 'text', value: 'abc' }, [])
      ]).element);
      assert(req.url === standardizeUrl('./search?test=abc'));
      assert(req.method === RouterEventMethod.GET);
      assert(req.data === null);
    });

    it('submit post', () => {
      const req = new RouterEventRequest(DOM.form({ method: 'POST', action: './send' }, [
        DOM.input({ name: 'test', type: 'text', value: 'abc' }, [])
      ]).element);
      assert(req.url === standardizeUrl('./send'));
      assert(req.method === RouterEventMethod.POST);
      assert(req.data instanceof FormData);
    });

    it('popstate', () => {
      const req = new RouterEventRequest(window);
      assert(req.url === standardizeUrl(''));
      assert(req.method === RouterEventMethod.GET);
      assert(req.data === null);
    });

  });

  describe('RouterEventLocation', () => {
    it('instance', () => {
      const loc = new RouterEventLocation(standardizeUrl('#'));
      assert(loc.orig.href === standardizeUrl(location.href));
      assert(loc.dest.href === standardizeUrl(location.href + '#'));
    });

  });

});
