import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  ButtonProps,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const Button: React.FC<ButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const LocationTracker = () => {
  const [loadedData, setLoadedData] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [locationsData, setLocationsData] = useState<Location[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let locationInterval: NodeJS.Timeout;

    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        locationInterval = setInterval(async () => {
          const { coords, timestamp } = await Location.getCurrentPositionAsync(
            {}
          );
          const locationData = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp,
          };

          setLocationsData((prevLocationsData) => [
            ...prevLocationsData,
            locationData,
          ]);
        }, 5000);
        setErrorMsg("");
      } catch (error) {
        setErrorMsg("Error while tracking location");
        console.error("Error while tracking location:", error);
      }
    };

    const stopLocationTracking = () => {
      clearInterval(locationInterval);
    };

    if (isTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => clearInterval(locationInterval);
  }, [isTracking]);

  const toggleTracking = () => {
    setIsTracking((prevIsTracking) => !prevIsTracking);
  };

  const saveToJsonFile = async () => {
    try {
      const jsonContent = JSON.stringify(locationsData);
      const fileUri = `${FileSystem.documentDirectory}data.json`;

      await FileSystem.writeAsStringAsync(fileUri, jsonContent);
      console.log("File saved successfully:", fileUri);
    } catch (error) {
      setErrorMsg("Error saving file");
      console.error("Error saving file:", error);
    }
  };

  const loadFromJsonFile = async () => {
    if (loadedData.length === 0) {
      try {
        const fileUri = `${FileSystem.documentDirectory}data.json`;
        const jsonContent = await FileSystem.readAsStringAsync(fileUri);
        const loadedData1 = JSON.parse(jsonContent);
        console.log("File loaded successfully");
        setLoadedData(loadedData1);
      } catch (error) {
        setErrorMsg("Error loading file");
        console.error("Error loading file:", error);
      }
    } else {
      setLoadedData([]);
    }
  };

  useEffect(() => {
    saveToJsonFile();
  }, [locationsData]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.errorText}>{errorMsg}</Text>
      <Text style={styles.dataText}>
        Latitude: {locationsData[locationsData.length - 1]?.latitude}
      </Text>
      <Text style={styles.dataText}>
        Longitude: {locationsData[locationsData.length - 1]?.longitude}
      </Text>
      <Text style={styles.dataText}>
        Timestamp:{" "}
        {new Date(
          locationsData[locationsData.length - 1]?.timestamp
        ).toLocaleTimeString()}
      </Text>
      <Button
        title={isTracking ? "Stop Tracking" : "Start Tracking"}
        onPress={toggleTracking}
      />
      <Button title="Load from JSON" onPress={loadFromJsonFile} />
      {!!loadedData.length && (
        <ScrollView style={styles.loadedDataContainer}>
          {loadedData.map((data: any, index) => (
            <Text
              key={data.timestamp + "" + index}
              style={styles.loadedDataText}
            >
              Latitude: {data?.latitude}
              {"\n"}Longitude: {data?.longitude}
              {"\n"}Timestamp: {new Date(data?.timestamp).toLocaleTimeString()}
            </Text>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  dataText: {
    marginBottom: 10,
  },
  loadedDataContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  loadedDataText: {
    marginBottom: 10,
  },
  buttonContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: "#3498db",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LocationTracker;
