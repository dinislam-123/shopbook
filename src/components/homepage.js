import React, { Component } from 'react';
import { SafeAreaView, Switch, ImageBackground, Image, AsyncStorage, ScrollView, TextInput, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Text, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TimePicker from "react-native-24h-timepicker";
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import uuid from 'uuid/v4';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const ImageRow = ({ image, windowWidth, popImage }) => (
  <View>
    <ImageBackground
      source={{ uri: image }}
      style={[styles.img, { width: windowWidth / 2 - 15 }]}
      onError={popImage}
    />
  </View>
);

export default class homepage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      shopName: '',
      category: '',
      switchValue: false,
      comments: '',
      shopTitle: 'Shop Close',
      closeTime: '',
      openTime: '',
      selectedHours: 0,
      selectedMinutes: 0,
      imgSource: '',
      uploading: false,
      progress: 0,
      images: []
    };

  }

  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('You cancelled image picker 😟');
      }
      else if (response.error) {
        alert('And error occured: ', response.error);
      }
      else {
        const source = { uri: response.uri };
        this.setState({
          imgSource: source,
          imageUri: response.uri
        });
      }
    });
  }

  uploadImage = () => {
    const ext = this.state.imageUri.split('.').pop(); // Extract image extension
    const filename = `${uuid()}.${ext}`; // Generate unique name
    this.setState({ uploading: true });

    // firebase.storage().ref(`images/${filename}`).putFile(this.state.imageUri)
    // .on( firebase.storage.TaskEvent.STATE_CHANGED,
    //   snapshot => {
    //     let state = {};
    //     state = {
    //       ...state,
    //       progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
    //     };
    //     if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
    //       const allImages = this.state.images;
    //       allImages.push(snapshot.downloadURL);
    //       state = {
    //         ...state,
    //         uploading: false,
    //         imgSource: '',
    //         imageUri: '',
    //         progress: 0,
    //         images: allImages
    //       };
    //       AsyncStorage.setItem('images', JSON.stringify(allImages));
    //     }
    //     this.setState(state);
    //   },
    //   error => {
    //     unsubscribe();
    //     alert('Sorry, Try again.');
    //   }
    // );
}

onCancel =()=> {
    this.TimePicker.close();
  }

  _onConfirmOpen(hour, minute) {
    this.setState({ openTime: `${hour}:${minute}` });
    this.TimePicker.close();
  }
  _onConfirmClose(hour, minute) {
    this.setState({ closeTime: `${hour}:${minute}` });
    this.TimePicker.close();
  }
  _toggleSwitch = (value) => {
    this.setState({ switchValue: value })
    if (value == false) {
      this.setState({ shopTitle: "Shop Close" });
    }
    else {
      this.setState({ shopTitle: "Shop Open" });
    }
  }

  render() {
    console.disableYellowBox = true

    const showButton = <TouchableHighlight onPress={() => this._inputHandler()}
      style={{ backgroundColor: 'blue', height: 45, width: '100%' }} >
      <Text style={styles.text}>Save</Text>
    </TouchableHighlight>
    shownone = <View></View>

    const { uploading, imgSource, progress, images } = this.state;
    const windowWidth = Dimensions.get('window').width;
    const disabledStyle = uploading ? styles.disabledBtn : {};
    const actionBtnStyles = [styles.btn, disabledStyle];

    return (
      <SafeAreaView style={styles.fullarea}>
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAwareScrollView>
            <View style={styles.buttonContainer}>
              {(this.state.shopName !== '') ? showButton : shownone}
            </View>
            <View style={{ width: '100%' }}>

              {this.state.imgSource == '' && (
                <View>
                  <ImageBackground source={require('../image/wall-1.jpeg')} resizeMode='cover' style={styles.image}> 
                    <TouchableOpacity onPress={this.pickImage}>
                      <Image style={styles.closeIcon} source={require('../image/camera.png')}></Image>
                    </TouchableOpacity>
                  </ImageBackground>
              </View>
              )}

              {imgSource !== '' && (
                <View style={{ height: 300, width: '100%' }}>
                  <ImageBackground source={imgSource} style={styles.image}>
                    <TouchableOpacity onPress={this.pickImage}>
                      <Image style={styles.closeIcon} source={require('../image/camera.png')}></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                  {uploading && (
                    <View
                      style={[styles.progressBar, { width: `${progress}%` }]}
                    />
                  )}
                  {/* <TouchableOpacity
                    style={actionBtnStyles}
                    onPress={() => { this.uploadImage() }}
                    disabled={uploading}
                  >
                    <View>
                    {uploading ? (
                      <Text style={styles.btnTxt}>Uploading ...</Text>
                    ) : (
                      <Text style={styles.btnTxt}>Upload image</Text>
                    )}
                  </View>
                  </TouchableOpacity> */}
                </View>
              )}

              {/* <View>
              <Text
                style={{
                  fontWeight: '600',
                  paddingTop: 20,
                  alignSelf: 'center'
                }}
              >
                {images.length > 0
                  ? 'Your uploaded images'
                  : ''}
              </Text>
                </View> */}
            </View>

            <View style={styles.bodyStyle}>

              <TextInput
                style={styles.input}
                placeholder="Shop Name"
                autoCapitalize='none'
                onChangeText={(text) => this.setState({ shopName: text })}
                value={this.state.shopName}
              />

              <TextInput
                style={styles.input}
                placeholder="Category"
                onChangeText={(text) => this.setState({ category: text })}
                value={this.state.category}
              />

              {/* TimePicker for Open shop */}

              <View style={{width: '90%', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                <TouchableOpacity
                  onPress={() => this.TimePicker.open()}><Text style={styles.textTime}>Opening Time</Text>
                </TouchableOpacity>
                <TimePicker
                  ref={ref => { this.TimePicker = ref; }}
                  onCancel={() => this.onCancel()}
                  onConfirm={(hour, minute) => { this._onConfirmOpen(hour, minute) }} />
                <TextInput style={styles.inputTime} value={this.state.openTime}></TextInput>
              </View>

              <View style={{ width: '90%', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => this.TimePicker1.open()}><Text style={styles.textTime}>Closing Time</Text>
                </TouchableOpacity>
                <TimePicker
                  ref={ref => { this.TimePicker1 = ref; }}
                  onCancel={() => this.onCancel()}
                  onConfirm={(hour, minute) => { this._onConfirmClose(hour, minute) }} />
                <TextInput style={styles.inputTime} value={this.state.closeTime}></TextInput>
              </View>


              {/* close */}


              <View style={styles.switchContainer}>
                <Text style={{ fontSize: 25 }}>{this.state.shopTitle}</Text>
                <Switch
                  onValueChange={this._toggleSwitch}
                  value={this.state.switchValue} />
              </View>

              <View style={styles.textAreaContainer} >
                <TextInput
                  style={styles.textArea}
                  placeholder="Type something"
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>

        </ScrollView>

      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({

  fullarea: {
    marginTop: 40,
    backgroundColor: '#f5f1bf',
    height: '90%',
    borderWidth: 1
  },

  bodyStyle: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center'
  },
  image: {
    height: 300,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 250
  },

  closeIcon: {
    width: 70,
    height: 50

  },

  textAreaContainer: {
    marginTop: 10,
    width: '90%',
    height: 200,
    borderWidth: 1
  },
  textArea: {
    fontSize: 20,
    paddingLeft: 5,
    color: 'blue',
    width: '100%',
    height: 200,
    justifyContent: "flex-start",
    backgroundColor: 'white'
  },

  textTime: {
    width: 150,
    padding: 5,
    height: 40,
    fontSize: 20,
    marginTop: 10,
    backgroundColor: 'blue',
    color: 'white',
    fontWeight: 'bold',
  },

  text: {
    padding: 6,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: "center"
  },

  switchContainer: {
    marginTop: 10,
    width: '90%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'

  },

  input: {
    marginTop: 10,
    padding: 10,
    width: '90%',
    height: 40,
    fontSize: 20,
    borderColor: 'blue',
    borderWidth: .5,
    backgroundColor: 'white',
  },

  inputTime: {
    marginTop: 10,
    padding: 10,
    width: '50%',
    height: 40,
    fontSize: 20,
    borderColor: 'blue',
    color: 'blue',
    borderWidth: .5,
    backgroundColor: 'white',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

})

