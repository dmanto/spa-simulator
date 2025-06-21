import { useState, useEffect, useRef } from 'react';
import { SimulatedSpas } from './simulation/SimulatedSpas';

function App() {
  const [simulatedDevices, setSimulatedDevices] = useState (new SimulatedSpas());
  const [devices, setDevices] = useState(simulatedDevices.devices);

  useEffect(() => {

    // Update all devices every second
    const interval = setInterval(() => {
      simulatedDevices.tickAll();
      setDevices([...devices]); // Trigger re-render with updated devices
    }, 1000);

    return () => {
      clearInterval(interval);
      simulatedDevices.dispose();
    };
  }, [simulatedDevices.globalTicks]);

  return (
    <div>
      <h1>SPA Device Simulators</h1>
      <p>Simulated Devices Count: {simulatedDevices.devices.length}</p>
      <p>Global Ticks: {simulatedDevices.globalTicks}</p>
      {simulatedDevices.devices.map((device, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h2>{device.getBleConfig().name}</h2>
          <p>Power: {device.getPhysicalState().powerOn ? 'ON' : 'OFF'}</p>
          <p>Water Temp: {device.getPhysicalState().waterTemperature.toFixed(1)}°C</p>
          <p>Heater: {device.getPhysicalState().heaterOn ? 'ON' : 'OFF'}</p>
          {device.getPhysicalState().error && (
            <p style={{ color: 'red' }}>Error: {device.getPhysicalState().error}</p>
          )}
          <button onClick={() => device.powerOn()} disabled={device.getPhysicalState().powerOn}>
            Power On
          </button>
          <button onClick={() => device.powerOff()} disabled={!device.getPhysicalState().powerOn}>
            Power Off
          </button>
          <button onClick={() => device.setHeater(true)} disabled={!device.getPhysicalState().powerOn || device.getPhysicalState().heaterOn}>
            Heater On
          </button>
          <button onClick={() => device.setHeater(false)} disabled={!device.getPhysicalState().powerOn || !device.getPhysicalState().heaterOn}>
            Heater Off
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;