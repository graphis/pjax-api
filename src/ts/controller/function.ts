/// <reference path="../define.ts"/>
/// <reference path="../model/main.ts"/>

/* CONTROLLER */

module MODULE {
  // Allow access:
  //  M, V, C

  // Deny access

  export class ControllerFunction implements FunctionInterface {

    enable(): any {
      M.enable();
      return this;
    }

    disable(): any {
      M.disable();
      return this;
    }

    click(url: string, attr: { href?: string; }): any
    click(url: HTMLAnchorElement, attr: { href?: string; }): any
    click(url: JQuery, attr: { href?: string; }): any
    click(url: any, attr: { href?: string; }): any {
      var common: CommonSettingInterface = M.getActiveSetting(),
          $anchor: JQuery;

      switch (typeof url) {
        case 'object':
          $anchor = jQuery(url).clone();
          break;

        case 'string':
          attr = attr || {};
          attr.href = url;
          $anchor = jQuery('<a/>', attr);
          break;

        default:
          return this;
      }
      return $anchor.first().one(common.nss.click, (event) => V.HANDLERS.CLICK(event)).click();
    }
    
    submit(url: string, attr: { action?: string; method?: string; }, data: any): any
    submit(url: HTMLFormElement, attr?: { action?: string; method?: string; }, data?: any): any
    submit(url: JQuery, attr?: { action?: string; method?: string; }, data?: any): any
    submit(url: any, attr?: { action?: string; method?: string; }, data?: any): any {
      var common: CommonSettingInterface = M.getActiveSetting(),
          $form: JQuery,
          df: DocumentFragment = document.createDocumentFragment(),
          type: any,
          $element: JQuery;

      switch (true) {
        case typeof url === 'object':
          $form = jQuery(url).clone();
          break;

        case !!data:
          attr = attr || {};
          attr.action = url;
          type = data instanceof Array && Array || data instanceof Object && Object || undefined;
          for (var i in data) {
            switch (type) {
              case Object:
                $element = jQuery('<textarea/>', { name: i }).val(data[i]);
                break;
              case Array:
                data[i].attr = data[i].attr || {};
                data[i].attr.name = data[i].name;
                $element = jQuery(!data[i].tag.indexOf('<') ? data[i].tag : '<' + data[i].tag + '/>', data[i].attr || {}).val(data[i].value);
                break;
              default:
                continue;
            }
            df.appendChild($element[0]);
          }
          $form = jQuery('<form/>', <Object>attr).append(<HTMLElement>df);
          break;

        default:
          return this;
      }
      return $form.first().one(common.nss.submit, (event) => V.HANDLERS.SUBMIT(event)).submit();
    }
    
    getCache()
    getCache(url: string)
    getCache(url: string = window.location.href): PjaxCache {
      var cache: PjaxCache = <PjaxCache>M.getCache(url);
      if (cache) {
        cache = {
          data: cache.data,
          textStatus: cache.textStatus,
          jqXHR: cache.jqXHR,
          expires: cache.expires
        }
      }
      return cache;
    }
    
    setCache(): any
    setCache(url: string): any
    setCache(url: string, data: string): any
    setCache(url: string, data: string, textStatus: string, jqXHR: JQueryXHR): any
    setCache(url: string = window.location.href, data?: string, textStatus?: string, jqXHR?: JQueryXHR): any {
      switch (arguments.length) {
        case 0:
          return this.setCache(url, document.documentElement.outerHTML);
        case 1:
          return this.setCache(url, null);
        case 2:
        case 3:
        case 4:
        default:
          M.setCache(url, data, textStatus, jqXHR);
      }
      return this;
    }
    
    removeCache(): any
    removeCache(url: string): any
    removeCache(url: string = window.location.href): any {
      M.removeCache(url);
      return this;
    }

    clearCache(): any {
      M.clearCache();
      return this;
    }

    follow(event: JQueryEventObject, $XHR: JQueryXHR, timeStamp?: number): boolean {
      if (!M.isDeferrable) { return false; }
      var anchor = <HTMLAnchorElement>event.currentTarget;
      $XHR.follow = true;
      if (isFinite(event.timeStamp)) { $XHR.timeStamp = timeStamp || event.timeStamp; }
      M.setActiveXHR($XHR);
      jQuery.when($XHR)
      .done(function () {
        !M.getCache(anchor.href) && M.isImmediateLoadable(event) && M.setCache(anchor.href, undefined, undefined, $XHR);
      });
      jQuery[M.NAME].click(anchor.href);
      return true;
    }

  }
}
