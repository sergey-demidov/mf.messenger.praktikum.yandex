/* eslint-disable @typescript-eslint/ban-types */
import EventBus from './event-bus.js';

export interface sApp {
  EventBus: EventBus;
  methods: Record<string, Function>;
  mounted(): void;
}

export interface sInit {
  name: string;
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
  constructor: CustomElementConstructor,
}

export interface sHTMLElement extends HTMLElement {
  show: Function;
  hide: Function;
}
