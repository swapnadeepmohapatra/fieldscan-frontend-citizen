import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getFirebase } from "./firebase";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);

  var placeData = {
    _id: "5e8b080abc09a25d8019ec64",
    address: "Viman Nagar",
    category: "restaurants",
    name: "Chai Break",
  };

  // var placeData = {
  //   _id: "5e8b080abc09a25d8016fd56",
  //   address: "Colaba, Mumbai",
  //   category: "mall",
  //   name: "H&M",
  // };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const createNewVisit = (data) => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    // Add time to the datas
    placeData["visitTime"] = dateTime;
    data["visitTime"] = dateTime;

    // Put User Data
    getFirebase()
      .database()
      .ref("/places")
      .child(placeData._id)
      .child("visits")
      .push(data);

    getFirebase()
      .database()
      .ref("/users")
      .child(data._id)
      .child("visits")
      .push(placeData);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (type == 256) {
      setScanned(true);
      let mdata = JSON.parse(data);

      createNewVisit(mdata);
      alert(`${JSON.parse(data).name}'s visit added`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {scanned && (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>ID: {placeData._id}</Text>
          <Text style={{ fontSize: 24 }}>Place Name: {placeData.name}</Text>
          <Text style={{ fontSize: 24 }}>Address: {placeData.address}</Text>
          <Text style={{ fontSize: 24, marginBottom: 50 }}>
            Category: {placeData.category}
          </Text>

          <Button
            color="green"
            title={"Tap to Scan"}
            onPress={() => setScanned(false)}
          />
        </View>
      )}
    </View>
  );
}
