import { SpaDeviceSimulator } from './SpaDeviceSimulator';
import { MockBleManager } from 'react-native-ble-plx-mock';

export class SimulatedSpas {
  devices: SpaDeviceSimulator[] = [];
  bleManager: MockBleManager;
  globalTicks: number = 0;

  constructor() {
    this.bleManager = new MockBleManager();
    this.initializeDevices();
  }

  private initializeDevices(): void {
    // Create some sample devices
    const spa1 = new SpaDeviceSimulator('android', 'spa', 'Luxury Spa', 'AA:BB:CC:DD:EE:FF');
    const spa2 = new SpaDeviceSimulator('ios', 'spa', 'Premium Spa', '11:22:33:44:55:66');
    const cooler1 = new SpaDeviceSimulator('android', 'cooler', 'Arctic Cooler', '99:88:77:66:55:44');

    this.devices.push(spa1, spa2, cooler1);

    // Register all devices with BLE manager
    this.devices.forEach(device => {
      this.bleManager.addMockDevice(device.getBleConfig());
    });
  }

  public getAllDevices(): SpaDeviceSimulator[] {
    return this.devices;
  }

  public getDeviceById(id: string): SpaDeviceSimulator | undefined {
    return this.devices.find(d => d.getBleConfig().id === id);
  }

  public tickAll(): void {
    this.devices.forEach(device => device.tick());
    this.globalTicks++;
  }

  public dispose(): void {
    this.devices.forEach(device => device.dispose());
  }
}