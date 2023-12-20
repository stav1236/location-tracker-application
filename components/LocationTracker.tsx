import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";

const LocationTracker = () => {
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  });

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        const locationInterval = setInterval(async () => {
          const { coords, timestamp } = await Location.getCurrentPositionAsync(
            {}
          );
          setLocationData({
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp,
          });
          console.log(
            `Sampled at: ${new Date(timestamp).toLocaleTimeString()}`
          );
          console.log(
            `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`
          );
        }, 2000);

        return () => clearInterval(locationInterval);
      } catch (error) {
        console.error("Error while tracking location:", error);
      }
    };

    startLocationTracking();
  }, []);

  return (
    <View>
      <Text>Latitude: {locationData.latitude}</Text>
      <Text>Longitude: {locationData.longitude}</Text>
      <Text>
        Timestamp: {new Date(locationData.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export default LocationTracker;
