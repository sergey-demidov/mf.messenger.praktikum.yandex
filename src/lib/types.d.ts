/* eslint-disable @typescript-eslint/ban-types */
import eventBus from './event-bus';

export interface sApp {
  eventBus: typeof eventBus;
  methods: Record<string, Function>;
  data: Record<string, unknown>
  mounted(): void;
  isVisible(): boolean;
}

export interface sInit {
  name: string;
  authorisationRequired: boolean;
  template: string;
  data: () => Record<string, unknown>;
  methods: Record<string, Function>;
  created: () => void;
  mounted: () => void;
  destroyed: () => void;
  components: Record<string, CustomElementConstructor>;
}

export interface sParsed {
  not: boolean;
  func: string;
  params: string[];
}

export interface sCustomElementConstructor {
  name: string
  authorisationRequired: boolean;
  constructor: CustomElementConstructor,
}

export interface sHTMLElement extends HTMLElement {
  show: Function;
  hide: Function;
}

export interface sHTMLInputElement extends HTMLInputElement {
  reset: () => void;
}

export type sEvents =
  'onabort' | 'onblur' | 'oncancel' | 'oncanplay' | 'oncanplaythrough' | 'onchange' | 'onclick' | 'onclose'
  | 'oncontextmenu' | 'oncuechange' | 'ondblclick' | 'ondrag' | 'ondragend' | 'ondragenter' | 'ondragleave'
  | 'ondragover' | 'ondragstart' | 'ondrop' | 'ondurationchange' | 'onemptied' | 'onended' | 'onerror'
  | 'onfocus' | 'oninput' | 'oninvalid' | 'onkeydown' | 'onkeypress' | 'onkeyup' | 'onload' | 'onloadeddata'
  | 'onloadedmetadata' | 'onloadstart' | 'onmousedown' | 'onmouseenter' | 'onmouseleave' | 'onmousemove'
  | 'onmouseout' | 'onmouseover' | 'onmouseup' | 'onpause' | 'onplay' | 'onplaying' | 'onprogress'
  | 'onratechange' | 'onreset' | 'onresize' | 'onscroll' | 'onseeked' | 'onseeking' | 'onselect' | 'onstalled'
  | 'onsubmit' | 'onsuspend' | 'ontimeupdate' | 'ontoggle' | 'onvolumechange' | 'onwaiting' | 'onwheel'
  | 'onauxclick' | 'ongotpointercapture' | 'onlostpointercapture' | 'onpointerdown' | 'onpointermove'
  | 'onpointerup' | 'onpointercancel' | 'onpointerover' | 'onpointerout' | 'onpointerenter' | 'onpointerleave'
  | 'onselectstart' | 'onselectionchange' | 'onanimationend' | 'onanimationiteration' | 'onanimationstart'
  | 'ontransitionend' | 'oncopy' | 'oncut' | 'onpaste' | 'onfullscreenchange' | 'onfullscreenerror';
