interface IPConfiguration {
    subnet: string;          // CIDR notation e.g. "192.168.1.0/24"
    gateway: string;         // e.g. "192.168.1.1"
    dnsServers: string[];    // e.g. ["8.8.8.8", "1.1.1.1"]
    dhcpEnabled: boolean;    // Whether DHCP is available
}

interface WiFiInstance {
    // Core identification
    ssid: string | null;      // Network name (null if hidden)
    bssid: string;            // MAC address ("00:1A:2B:3C:4D:5E")

    // Signal characteristics
    signal_dbm: number;       // Signal strength in dBm (-30 to -100)
    frequency: number;        // Frequency in MHz
    channel: number;          // Derived channel number

    // Network capabilities
    security: SecurityProtocol[];
    encryption: EncryptionType;
    is_hidden: boolean;
    bandwidth_mhz: number;    // Channel bandwidth (20, 40, 80, 160)

    // Authentication & Connectivity
    correctPassword?: string | null; // null = open network
    ipConfiguration: IPConfiguration;
    hasInternet: boolean;     // If internet connection is working  
}

type SecurityProtocol =
    | 'OPEN'
    | 'WEP'
    | 'WPA'
    | 'WPA2'
    | 'WPA3'
    | 'WPA_ENTERPRISE'
    | 'WPA2_ENTERPRISE'
    | 'WPA3_ENTERPRISE';

type EncryptionType =
    | 'NONE'
    | 'TKIP'
    | 'AES'
    | 'GCMP';

const homeNetwork: WiFiInstance = {
    ssid: "HomeNet",
    bssid: "a4:23:05:1b:8e:40",
    signal_dbm: -55,
    frequency: 5220,
    channel: 44,
    security: ["WPA2"],
    encryption: "AES",
    is_hidden: false,
    bandwidth_mhz: 80,
    correctPassword: "securePassword123",
    ipConfiguration: {
        subnet: "192.168.1.0/24",
        gateway: "192.168.1.1",
        dnsServers: ["192.168.1.1", "8.8.8.8"],
        dhcpEnabled: true
    },
    hasInternet: true
};

const secondNetwork: WiFiInstance = {
    ssid: "Second-Network",
    bssid: "a4:23:05:1b:8e:40",
    signal_dbm: -55,
    frequency: 5220,
    channel: 44,
    security: ["WPA2"],
    encryption: "AES",
    is_hidden: false,
    bandwidth_mhz: 80,
    correctPassword: "securePassword222",
    ipConfiguration: {
        subnet: "192.168.1.0/24",
        gateway: "192.168.1.1",
        dnsServers: ["192.168.1.1", "8.8.8.8"],
        dhcpEnabled: true
    },
    hasInternet: true
};

// Open network without password
const cafeNetwork: WiFiInstance = {
    ssid: "Free_Cafe_WiFi",
    bssid: "b0:be:83:aa:cc:dd",
    signal_dbm: -75,
    frequency: 2412,
    channel: 1,
    security: ["OPEN"],
    encryption: "NONE",
    is_hidden: false,
    bandwidth_mhz: 20,
    correctPassword: null, // Open network
    ipConfiguration: {
        subnet: "10.0.0.0/24",
        gateway: "10.0.0.1",
        dnsServers: ["10.0.0.1"],
        dhcpEnabled: true
    },
    hasInternet: false, // Portal-based login required
};

// Enterprise network (no password, special auth)
const officeNetwork: WiFiInstance = {
    ssid: "Company_WiFi",
    bssid: "d4:ca:6d:aa:bb:cc",
    signal_dbm: -65,
    frequency: 5955,
    channel: 161,
    security: ["WPA2_ENTERPRISE"],
    encryption: "AES",
    is_hidden: false,
    bandwidth_mhz: 160,
    // No password field - enterprise uses 802.1X auth
    ipConfiguration: {
        subnet: "172.16.0.0/22",
        gateway: "172.16.0.1",
        dnsServers: ["172.16.0.5", "172.16.0.6"],
        dhcpEnabled: true
    },
    hasInternet: true
};

export const WiFiNetworks: WiFiInstance[] = [
    homeNetwork,
    secondNetwork,
    cafeNetwork,
    officeNetwork
];