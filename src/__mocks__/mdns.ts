export = {
  udp: jest.fn().mockImplementation((name: string) => {
    return { name };
  }),
  createBrowser: jest.fn().mockReturnValue({
    on: jest.fn(),
    start: jest.fn(),
  }),
  createAdvertisement: jest.fn().mockReturnValue({
    start: jest.fn(),
  }),
  rst: {
    DNSServiceResolve: jest.fn(),
    DNSServiceGetAddrInfo: jest.fn(),
    getaddrinfo: jest.fn(),
    makeAddressesUnique: jest.fn(),
  },
  dns_sd: [],
};
