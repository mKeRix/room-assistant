import c from 'config';

process.env.NOBLE_HCI_DEVICE_ID = c.get('bluetoothLowEnergy.hciDeviceId');
process.env.BLENO_HCI_DEVICE_ID = c.get('bluetoothLowEnergy.hciDeviceId');
process.env.NOBLE_MULTI_ROLE = '1'
process.env.BLENO_DEVICE_NAME = c.get('global.instanceName')
