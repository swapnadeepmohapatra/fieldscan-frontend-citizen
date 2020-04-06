import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getFirebase } from "./firebase";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const createNewVisit = (data) => {
    const placeId = "5e8b080abc09a25d8019ec64";
    var placeData;

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
    // Getting Place Data
    getFirebase()
      .database()
      .ref("/places")
      .child(placeId)
      .on("value", (dataSnapshot) => {
        console.log(dataSnapshot.val());
        placeData = dataSnapshot.val();
      });

    // Add time to the datas
    placeData["visitTime"] = dateTime;
    data["visitTime"] = dateTime;

    // Put User Data
    getFirebase()
      .database()
      .ref("/visits")
      .child("5e8b080abc09a25d8019ec64")
      .push(data);

    // Put place Data
    getFirebase().database().ref("/visits").child(data._id).push(placeData);
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
        <Button title={"Tap to Scan"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
