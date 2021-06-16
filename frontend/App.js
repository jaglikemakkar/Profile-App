import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  useWindowDimensions
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { launchCamera, launchImageLibrary, launchImagePicker } from 'react-native-image-picker';
import fetch from 'node-fetch';
import Svg, { G, Path, src, ClipPath, Defs, Polygon } from 'react-native-svg';
import * as Progress from 'react-native-progress';
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { ApolloProvider, useQuery, useMutation } from 'react-apollo';
import PicComponent from "./components/PicComponent";
import BioComponent from "./components/BioComponent";

const client = new ApolloClient({
  fetch: fetch,
  uri: "http://localhost:3000/graphql",
});


function Screen1({ navigation }) {

  const CHANGE_PICS = gql`
  
  mutation CHANGE_PICS ( $idd: ID , $urii:String! ) {
    editPic(id:$idd uri:$urii)
    {
    uri 
    }
  }
`;

  const [setPicDATABASEE, { dataPic }] = useMutation(CHANGE_PICS,
    {
      client: client,
    });

  async function changeProfilePic() {
    const uriii = await selectProfilePic();
    setPicDATABASEE({ variables: { id: 1, urii: uriii.uri } });
    setreloadPicComponent(true);
    setreloadPicComponent(false);
  };

  const [profilePicPath, setProfilePicPath] = useState({ uri: "https://www.mavenmentors.in/static/base/images/jaglike.PNG" })
  const [reloadPicComponent, setreloadPicComponent] = useState(false);
  // TO SELECT PROFILE PIC FROM GALLERY
  async function selectProfilePic() {
    return new Promise(function (resolve, reject) {
      launchImageLibrary({}, (res) => {
        setProfilePicModal(false);
        console.log('Response = ', res);
        if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          let source = res;
          setProfilePicPath(source);
          resolve(res);
        }
      });
    })
  };

  // TO CLICK PROFILE PICTURE FROM CAMERA
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const clickProfilePic = async () => {
    let options = {
      mediaType: 'image',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      setProfilePicModal(false);
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setProfilePicPath(response);
      });
    }
  };


  // TO SELECT STORY

  const [storyPath, setStoryPath] = useState({ uri: "No story" });
  function addStory() {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option'
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, res => {
      console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setStoryPath(source);
        setIsStoryAdded(true);
      }
    });
  };

  const [progressBarProgress, setProgressBarProgress] = useState(0);
  const windowWidth = useWindowDimensions().width;
  var progress = 0;
  function updateProgressBar() {
    progress += 0.01;
    setProgressBarProgress(progress);
  }

  function showStory() {
    if (isStoryAdded) {
      setIsStoryViewed(true);
      setStoryModal(true);
      var aabs = setInterval(() => { updateProgressBar() }, 50);
      function closeStory() {
        setStoryModal(false);
        clearInterval(aabs);
        setProgressBarProgress(0);
      }
      setTimeout(() => closeStory(), 5000);
    }
  }

  function check(source) {
    alert(source.uri)
  }

  const [profilePicModal, setProfilePicModal] = useState(false);
  const [storyModal, setStoryModal] = useState(false);
  const [isStoryAdded, setIsStoryAdded] = useState(false);
  const [isStoryViewed, setIsStoryViewed] = useState(false);
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={storyModal}
          onRequestClose={() => {
            setStoryModal(false);
          }}
        >
          <Image style={styles.story} source={{ uri: storyPath.uri }}></Image>
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={progressBarProgress}
              width={windowWidth}
              color={'white'}
            />
          </View>
        </Modal>
        <View style={styles.imageContainer}>

          <TouchableOpacity
            onPress={showStory}
            onLongPress={() => {
              setProfilePicModal(true);
            }}
          >
            <Svg height="150" width="150">
              <Defs>
                <ClipPath id="clip">
                  <G scale="1" x="0">
                    <Polygon d="m11.80253,74.99963l12.06958,-37.49551l31.5984,-23.17378l39.05838,0l31.5986,23.17378l12.06939,37.49551l-12.06939,37.49551l-31.5986,23.17377l-39.05838,0l-31.5984,-23.17377l-12.06958,-37.49551z" />
                  </G>
                </ClipPath>
              </Defs>
              {isStoryAdded && (
                <Path
                  id="svg_5"
                  d="m2.16025,75.00039l13.91116,-43.21657l36.41968,-26.70963l45.0179,0l36.41991,26.70963l13.91093,43.21657l-13.91093,43.21657l-36.41991,26.70962l-45.0179,0l-36.41968,-26.70962l-13.91116,-43.21657z"
                  strokeWidth="2"
                  stroke={isStoryViewed ? 'gray' : 'orange'}
                />
              )}
              <PicComponent style={styles.piccomponent} reloadPicComponent={reloadPicComponent} />
            </Svg>
          </TouchableOpacity>

          {!isStoryAdded && <TouchableOpacity style={styles.imageIcon} onPress={addStory}>
            <View>
              <Text style={styles.imageIconText}>+</Text>
            </View>
          </TouchableOpacity>}

        </View>

        <BioComponent />


        <Modal
          animationType="slide"
          transparent={false}
          visible={profilePicModal}
          onRequestClose={() => {
            setProfilePicModal(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.modalHeading}>Add Profile Picture</Text>
              </View>
              <TouchableOpacity onPress={clickProfilePic} style={styles.modalBtn}  >
                <Text style={styles.modalBtnText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={changeProfilePic} style={styles.modalBtn}  >
                <Text style={styles.modalBtnText}>Open Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={() => { setProfilePicModal(false); }}>
                <Text style={styles.modalBtnText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ApolloProvider>
  );
};




const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5
  },

  progressBarContainer: {
    position: 'absolute',
    top: 10,
  },

  modalHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'grey',
  },

  modalBtn: {
    padding: 10,
  },

  modalBtnText: {
    fontSize: 20,
    color: 'grey',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },

  image: {
    borderRadius: 60,
  },


  imageIcon: {
    fontSize: 20,
    backgroundColor: '#ffae42',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: 24,
    height: 24,
    position: 'relative',
    top: -48,
    right: -50,
  },

  imageIconText: {
    fontSize: 30,
    marginBottom: 3,
    color: 'white',
  },

  story: {
    flex: 1,
  },
})

export default App;