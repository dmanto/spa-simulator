// GATT Services
export const SERVICE_UUID_OPERATION             = "c5a092a5-2202-4ac6-8734-2e8ff796094d"

// GATT Characteristics
export const CHARACTERISTIC_UUID_KEYBOARD       = "12ead13c-4d06-48b7-a3f9-cdf725acdd87"
export const CHARACTERISTIC_UUID_TEMPERATURE    = "0daecf8f-2352-4ae8-bdb8-4ae862f041e3"
export const CHARACTERISTIC_UUID_TIME           = "8cea517c-2d76-4190-ae05-2e222a3caacb"
export const CHARACTERISTIC_UUID_SESSION        = "c67c0b5f-0f50-44fc-a0f9-449ff1f476f1"
export const CHARACTERISTIC_UUID_DISPLAY        = "30105eb3-19dc-4621-a227-a917b43162a6"
export const CHARACTERISTIC_UUID_WIFICREDS      = "5eb76cac-ada4-43c2-9ed0-b80547542e9f"
export const CHARACTERISTIC_UUID_VERSION        = "207da212-c2fd-43b5-9664-ac15166364d2"
export const CHARACTERISTIC_UUID_WIFIMAC        = "aefc6b90-26f1-4842-b720-3d47f4a087cf"
export const CHARACTERISTIC_UUID_MMODE          = "984cdbfb-446b-43b2-a879-c857a9a0f638"
export const CHARACTERISTIC_UUID_MCODE          = "6436e996-e573-4ff7-83fd-d0ea0bd09458"
export const CHARACTERISTIC_UUID_BTNAME         = "f8733ee9-6e45-485a-a8a1-9e4e8bdb0536"
export const CHARACTERISTIC_UUID_CRAS           = "71d67ace-65d6-4d28-b08f-f54735e7d50c"

export const SpaServiceUUIDs = [
  SERVICE_UUID_OPERATION,
  CHARACTERISTIC_UUID_KEYBOARD,
  CHARACTERISTIC_UUID_TEMPERATURE,
  CHARACTERISTIC_UUID_TIME,
  CHARACTERISTIC_UUID_SESSION,
  CHARACTERISTIC_UUID_DISPLAY,
  CHARACTERISTIC_UUID_WIFICREDS,
  CHARACTERISTIC_UUID_VERSION,
  CHARACTERISTIC_UUID_WIFIMAC,
  CHARACTERISTIC_UUID_MMODE,
  CHARACTERISTIC_UUID_MCODE,
  CHARACTERISTIC_UUID_BTNAME,
  CHARACTERISTIC_UUID_CRAS,
];

type ProductType = 'spa' | 'cooler';
type DevicePlatform = 'ios' | 'android';

interface SPABleConfig {
  id: string;
  name: string;
  serviceUUIDs: string[];
  manufacturerData: string;
  isConnectable: boolean;
}

interface SPAPhysicalState {
  powerOn: boolean;
  ambientTemperature: number; // °C
  waterTemperature: number;  // °C
  heaterOn: boolean;
  coolerOn: boolean;
  jets: {
    speed1: boolean;
    speed2: boolean;
    speed3: boolean;
  };
  filteringMode: boolean;
  error: string | null;
  internalTime: number; // seconds
  ticksSincePowerOn: number;
}

export class SpaDeviceSimulator {
  private readonly id: string;
  private readonly name: string;
  private readonly productType: ProductType;
  private physicalState: SPAPhysicalState;
  private bleConfig: SPABleConfig;

  constructor(
    platform: DevicePlatform,
    productType: ProductType,
    name: string,
    macAddress: string
  ) {
    this.productType = productType;
    this.name = name;

    // Generate device ID based on platform
    this.id = platform === 'ios' 
      ? this.generateUUID() 
      : macAddress;

    // Initialize physical state
    this.physicalState = {
      powerOn: false,
      ambientTemperature: 20 + Math.random() * 5, // 20-25°C
      waterTemperature: 15 + Math.random() * 10,  // 15-25°C
      heaterOn: false,
      coolerOn: false,
      jets: {
        speed1: false,
        speed2: false,
        speed3: false,
      },
      filteringMode: false,
      error: null,
      internalTime: 0,
      ticksSincePowerOn: 0,
    };

    // Initialize BLE config
    this.bleConfig = {
      id: this.id,
      name: this.name,
      serviceUUIDs: [SERVICE_UUID_OPERATION],
      manufacturerData: btoa(String.fromCharCode(0x53, 0x50, 0x41)), // "SPA" in hex, base64 encoded
      isConnectable: true,
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public getBleConfig(): SPABleConfig {
    return this.bleConfig;
  }

  public getPhysicalState(): SPAPhysicalState {
    return this.physicalState;
  }

  public powerOn(): void {
    if (this.physicalState.powerOn) return;
    
    this.physicalState.powerOn = true;
    this.physicalState.ticksSincePowerOn = 0;
    this.physicalState.internalTime = Math.floor(Date.now() / 1000);
  }

  public powerOff(): void {
    if (!this.physicalState.powerOn) return;
    
    this.physicalState.powerOn = false;
    this.physicalState.heaterOn = false;
    this.physicalState.coolerOn = false;
  }


  public tick(): void {
    if (!this.physicalState.powerOn) return;
    // console.log(`Ticking device ${this.name} (${this.id})`);

    this.physicalState.ticksSincePowerOn++;
    this.physicalState.internalTime = Math.floor(Date.now() / 1000);

    // Simulate ambient temperature changes
    this.physicalState.ambientTemperature += (Math.random() - 0.5) * 0.1;
    
    // Handle water temperature based on device state
    if (this.physicalState.heaterOn) {
      this.physicalState.waterTemperature += 0.2;
    } else if (this.physicalState.coolerOn) {
      this.physicalState.waterTemperature -= 0.3;
    } else {
      // Natural cooling/heating towards ambient
      const delta = this.physicalState.ambientTemperature - this.physicalState.waterTemperature;
      this.physicalState.waterTemperature += delta * 0.01;
    }

    // Random error generation (1% chance per tick)
    if (Math.random() < 0.01) {
      const errors = [
        "Low water level",
        "Heater fault",
        "Sensor error",
        "Pump failure"
      ];
      this.physicalState.error = errors[Math.floor(Math.random() * errors.length)];
    } else if (Math.random() < 0.1) {
      // 10% chance to clear error
      this.physicalState.error = null;
    }

    // Automatic filtering mode (runs for 2 hours every 12 hours)
    const hoursOn = this.physicalState.ticksSincePowerOn / 3600;
    this.physicalState.filteringMode = (hoursOn % 12) < 2;
  }

  public setHeater(on: boolean): void {
    // console.log(`Setting heater ${on ? 'ON' : 'OFF'} for device ${this.name} (${this.id}) with powerOn: ${this.physicalState.powerOn}`);
    if (!this.physicalState.powerOn) return;
    this.physicalState.heaterOn = on;
    if (on) this.physicalState.coolerOn = false;
  }

  public setCooler(on: boolean): void {
    if (!this.physicalState.powerOn || this.productType !== 'cooler') return;
    this.physicalState.coolerOn = on;
    if (on) this.physicalState.heaterOn = false;
  }

  public setJets(speed: 0 | 1 | 2 | 3): void {
    if (!this.physicalState.powerOn) return;
    this.physicalState.jets = {
      speed1: speed >= 1,
      speed2: speed >= 2,
      speed3: speed >= 3,
    };
  }

  public dispose(): void {
    // Clean up any resources if needed
  }
}