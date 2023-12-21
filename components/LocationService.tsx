import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";

const LOCATION_UPDATE_INTERVAL = 5000;
const DATA_FILE_PATH = `${FileSystem.documentDirectory}location_data.json`;

let locationSubscription: any;

export const startLocationTracking = async () => {
  try {
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();

    locationSubscription = Location.watchPositionAsync(
      { timeInterval: LOCATION_UPDATE_INTERVAL, distanceInterval: 0 },
      handleLocationUpdate
    );
  } catch (error) {
    console.error("Error starting location tracking:", error);
  }
};

const handleLocationUpdate = async (location: any) => {
  try {
    const timestamp = new Date().toISOString();
    const data = { timestamp, ...location.coords };

    const existingData = await readDataFromFile();
    const newData = [...existingData, data];

    await FileSystem.writeAsStringAsync(
      DATA_FILE_PATH,
      JSON.stringify(newData),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
  } catch (error) {
    console.error("Error handling location update:", error);
  }
};

export const stopLocationTracking = () => {
  if (locationSubscription) {
    locationSubscription.remove();
  }
};

export const readDataFromFile = async () => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(DATA_FILE_PATH);
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    console.error("Error reading data from file:", error);
    return [];
  }
};
