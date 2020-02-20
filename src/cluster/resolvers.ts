import { Service } from 'mdns';
import * as util from 'util';
import { exec } from 'child_process';
import * as os from 'os';

const execPromise = util.promisify(exec);

export async function getAddrInfoDig(
  service: Service,
  next: (e?: Error) => void
): Promise<void> {
  try {
    const digOutput = await execPromise(
      `dig +short @224.0.0.251 -p 5353 -4 ${service.host}`
    );
    const addresses = digOutput.stdout.trim().split(os.EOL);
    service.addresses = (service.addresses || []).concat(addresses);
    next();
  } catch (e) {
    next(e);
  }
}
