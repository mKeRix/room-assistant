const mockContext = {
  rotate: jest.fn(),
  translate: jest.fn(),
  fillRect: jest.fn(),
  fillText: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  fillStyle: '',
  fontStyle: '',
};

const mockCanvas = {
  getContext: jest.fn().mockReturnValue(mockContext),
  toBuffer: jest.fn(),
  width: 150,
  height: 150,
};

export = {
  createCanvas: jest.fn().mockReturnValue(mockCanvas),
};
