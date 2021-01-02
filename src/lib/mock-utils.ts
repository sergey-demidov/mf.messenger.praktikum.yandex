import { jest } from '@jest/globals';

const mocks = {
  apiUserResponse: {
    id: 777,
    first_name: 'first_name',
    second_name: 'second_name',
    display_name: 'display_name',
    login: 'login',
    email: 'email',
    phone: 'phone',
    avatar: 'avatar',
  },

  fetchXmlHttp: (status: number, data?: { [key: string]: string | number }): void => {
    const xhrMockObj = {
      open: jest.fn(),
      send: jest.fn(),
      onload: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status,
      response: JSON.stringify(data),
    };

    const xhrMockClass = () => xhrMockObj;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

    setTimeout(() => {
      xhrMockObj.onload();
    }, 0);
  },
};
export default mocks;
