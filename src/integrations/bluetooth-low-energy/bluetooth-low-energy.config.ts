export class BluetoothLowEnergyConfig {
  hciDeviceId = 0;
  whitelist: Array<string | ListItem> = [];
  whitelistRegex = false;
  blacklist: Array<string | ListItem> = [];
  blacklistRegex = false;
  processIBeacon = true;
  onlyIBeacon = false;
  majorMask = 0xffff;
  minorMask = 0xffff;
  tagOverrides: { [key: string]: TagOverride } = {};

  timeout = 5;
  updateFrequency = 0;
  maxDistance?: number;
}

class TagOverride {
  name?: string;
  measuredPower?: number;
}

export class ListItem {
  type: ListItemType = ListItemType.ID;
  value: string;
}

export enum ListItemType {
  ID = 'id',
  NAME = 'name',
}

export function isListItem(item: string | ListItem): item is ListItem {
  return (item as ListItem).type != undefined;
}
