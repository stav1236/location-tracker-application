import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LocationTracker from "./components/LocationTracker";
import {
  startLocationTracking,
  stopLocationTracking,
  readDataFromFile,
} from "./components/LocationService";
import { useEffect, useState } from "react";

export default function App() {
  const [locationData, setLocationData] = useState([]);

  const fetchData = async () => {
    const data = await readDataFromFile();
    setLocationData(data);
  };

  const clearData = () => {
    setLocationData([]);
  };

  useEffect(() => {
    startLocationTracking();

    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <LocationTracker /> */}
      <StatusBar style="auto" />
      <Text>Location Tracker App</Text>

      <Button title="Show Data" onPress={fetchData} />

      {locationData.length > 0 && (
        <ScrollView>
          <Button title="Clear Data" onPress={clearData} />

          {[...locationData].map((item: any, index) => (
            <View key={index.toString()}>
              <Text>{`Timestamp: ${item?.timestamp}`}</Text>
              <Text>{`Latitude: ${item?.latitude}`}</Text>
              <Text>{`Longitude: ${item?.longitude}`}</Text>
              <Text>{`Altitude: ${item?.altitude}`}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
