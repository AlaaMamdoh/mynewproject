import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
//import { Camera } from 'expo-camera';
import * as firebase from 'firebase';
import uuid from 'uuid';

console.disableYellowBox = true;

var firebaseConfig = {
  apiKey: "AIzaSyABjDdiaYm83rEkUsEG-u5aeegZrhNDSKs",
  authDomain: "family-social-communicat-b54bb.firebaseapp.com",
  databaseURL: "https://family-social-communicat-b54bb.firebaseio.com",
  projectId: "family-social-communicat-b54bb",
  storageBucket: "family-social-communicat-b54bb.appspot.com",
  messagingSenderId: "954697433619",
  appId: "1:954697433619:web:24ed30743d12f703e835e6"
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();


export async function _launchCameraRoll() {
  let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
  if (status !== 'granted') {
    console.error("Camera roll permission denied")
    return
  }
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 0.5
  })
  if (!result.cancelled) {
    return uploadImage(result.uri)
  }
}

export async function _takePhoto() {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  if (status !== 'granted') {
    console.error("Camera permission denied")
    return
  }
  let result = await ImagePicker.launchCameraAsync({
    quality: 0
  })
  if (!result.cancelled) {
    return uploadImage(result.uri)
  }
}


async function uploadImage(uri) {
  const response = await fetch(uri)
  const blob = await response.blob()
  var ref = firebase.storage().ref().child("chatImages/" + uuid.v4())
  const snap = await ref.put(blob)
  return await snap.ref.getDownloadURL()
}
