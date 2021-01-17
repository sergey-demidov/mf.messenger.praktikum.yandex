export const CONST = Object.freeze({
  undefined: 'undefined',
  string: 'string',
  object: 'object',
  none: 'none',
  auto: 'auto',
  visible: 'visible',
  hidden: 'hidden',
  block: 'block',
  update: 'update',
  div: 'div',
  click: 'click',
  flex: 'flex',
  disabled: 'disabled',
  class: 'class',
  error: 'error',
  warn: 'warn',
  info: 'info',
  hashchange: 'hashchange',
  function: 'function',
  userDataChange: 'userDataChange',
  validate: 'validate',
  chatChange: 'chatChange',
  pass: 'pass',
  validateFinished: 'validateFinished',
  true: 'true',
  false: 'false',
  received: 'received',
  messageReceived: 'messageReceived',
  messagesBulkReceived: 'messagesBulkReceived',
  websocketDisconnected: 'websocketDisconnected',
  enterPressed: 'enterPressed',
  userConnected: 'userConnected',
});

export const backendUrl = 'https://ya-praktikum.tech';

export const ApiBaseUrl = `${backendUrl}/api/v2`;

export const WsBaseUrl = 'wss://ya-praktikum.tech/ws/chats';
