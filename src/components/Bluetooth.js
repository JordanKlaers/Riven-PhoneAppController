import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  AsyncStorage,
  Dimensions,
  FlatList,
  TouchableHighlight,
  Picker,
  Switch,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';
import {
  deleteDeviceNameFromStorage,
  setSelectedDevice,
  saveDeviceNameTOStorage,
  saveConnectionData,
  scanInProgress,
  TestAction,
  clearConnectionData,
  increment
} from '../actions';
import BluetoothUtil from '../util/BluetoothUtil.js';

const backgroundImage = require('../../image/bluetooth.jpg');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


class Bluetooth extends Component {

  constructor(props) {

    super(props)
    this.setState = this.setState.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.state = {
      screenDIM: {
        isVerticle: true,
        height: 0,
        width: 0
      },                     //should be just the ones that i need to worry about changing
      deviceBluetoothstate: props.bluetooth.deviceBluetoothstate,
      connectedToDevice: props.bluetooth.connectedToDevice,
      textInput: "",
      allSavedDevices: [],
      defaultDevice: props.bluetooth.defaultDevice,
      toggelSelection: false,
      manager: props.bluetooth.manager,
      dispatch: props.dispatch,
      waitedForScan: false,
      deviceObject: props.bluetooth.deviceObject,
      myNav: props.myNav,
      currentView: props.myNav,  
      count: props.bluetooth.count 
    }
  }
  componentWillMount(){
    var temp = Object.assign({}, this.state)
    var result = Dimensions.get("screen")
    temp.screenDIM.height = result.height
    temp.screenDIM.width = result.width
    temp.screenDIM.isVerticle = (result.height > result.width) ? true : false;
    this.setState(temp)
    Dimensions.addEventListener("change", (object)=>{
      var tempState = Object.assign({}, this.state, {
        screenDIM: {
          height: object.screen.height,
          width: object.screen.width
        }
      })
      this.setState(tempState)
    })
  }

  	componentDidMount(state) {
		if(this.props.bluetooth.connectedToDevice == 'In Progress') {
			this.props.dispatch(scanInProgress('no connection'))
			// var temp = Object.assign({}, this.state, {
			// 	connectedToDevice: "no connection"
			// });
			// this.setState(temp, ()=>{
			// 	this.state.manager.stopDeviceScan();
			// })
		}
  	}
  componentWillReceiveProps(nextProps){
    this.connectionStatus(nextProps.bluetooth.connectedToDevice);
  }
  navigationOptions = {
    header: null
  }

  updateText = (input) => BluetoothUtil.updateText({input, setState: this.setState, state: this.state});

  saveNewDevice = () => BluetoothUtil.saveNewDevice({state: this.state, dispatch: this.props.dispatch, save: saveDeviceNameTOStorage});

  removeDevice = (name) => BluetoothUtil.removeDevice({name: name, state: this.state, setState: this.setState, dispatch: this.props.dispatch, delete: deleteDeviceNameFromStorage})

  selectDefaultDevice = (name) => BluetoothUtil.selectDefaultDevice({manager: this.props.bluetooth.manager, deviceObject: this.props.bluetooth.deviceObject, clearConnectionData: clearConnectionData, name: name, dispatch: this.props.dispatch, set: setSelectedDevice, tryToConnect: this.tryToConnect})

  connectionStatus = (connectedToDevice) =>  BluetoothUtil.connectionStatus(connectedToDevice)

  toggelDefaultDeviceSelection = () => {
    var temp = Object.assign({}, this.state, {
      toggelSelection: !this.state.toggelSelection
    })
    this.setState(temp)
  }

  
  tryToConnect = (name) => BluetoothUtil.tryToConnect({clearConnectionData: clearConnectionData, tookToLongToConnect: this.tookToLongToConnect, saveConnectionData: saveConnectionData, defaultDevice: this.props.bluetooth.defaultDevice, connectedToDevice: this.props.bluetooth.connectedToDevice, manager: this.props.bluetooth.manager, dispatch: this.props.dispatch, scan: scanInProgress, save: saveConnectionData}, name) 
  
  changeTab = () => {
  }


  stopScan = () => {
	this.props.bluetooth.manager.stopDeviceScan();
	this.props.dispatch(scanInProgress('no connection'))
	if (this.props.bluetooth.deviceObject && this.props.bluetooth.deviceObject.hasOwnProperty('id')) {
		this.props.bluetooth.manager.cancelDeviceConnection(this.props.bluetooth.deviceObject.id)
		.then(() => {
		  // Success code
		  console.log('Disconnected');
		})
		.catch((error) => {
		  // Failure code
		  console.log('failed to disconnected');
		  console.log(error);
		});
	}
	this.state.dispatch(clearConnectionData());
    // this.setState(temp)
  }

  	tookToLongToConnect = () => {
        if(this.props.bluetooth.connectedToDevice == 'In Progress') {
        	// var temp = Object.assign({}, this.state, {
            // 	connectedToDevice: "no connection"
          	// });
          	// this.setState(temp, ()=>{

				this.props.dispatch(scanInProgress('no connection'))
            	this.props.bluetooth.manager.stopDeviceScan();
          	// })
        }
  	}


  render(){



    const dimensions = {
      height: this.state.screenDIM.height,
      width: this.state.screenDIM.width
    }
    const style = {
		listNameContainer: {
			display: 'flex',
			flexDirection: 'row'
		},
		listName: {
			height: 30,
			flex: 1
		},
		listX: {
			width: 20,
			height: 30
		},
      upRight: {
        overlay: {
          position: 'absolute',
          height: dimensions.height,
          width: dimensions.width,
        },
        bluetoothContainer: {
          width: dimensions.width - 40,
          margin: 20,
          height: 200,
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
          backgroundColor: "#bababa",
          // display: 'flex',
        },
        row: {
          display: 'flex',
          flexDirection: 'row',
          flex: 1
        },
        left: {
          flex:1,
          height: 50,
        },
        right: {
          alignItems: 'flex-end',
          flex:1,
          height: 50
        },
        bluetoothText: {
          margin: 15
        },
        deviceNameTouchable: {
          alignItems: 'flex-end',
          width: '100%',
          height: 50
        },
        deviceNameInput: {
          height: 40,
          width: dimensions.width - 60,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
        },
        deviceList: {
          width: dimensions.width - 40,
          margin: 20,
          height: 150,
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
          backgroundColor: "#bababa",
        },
        saveButton: {
          height: 40,
          width: dimensions.width - 60,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
        }
      }
    }
    var uniqueID = 0;
    const resizeMode = "center";

    if (this.state.toggelSelection) {
      return(
        <View>

          <Image
            style={{
              height: dimensions.height,
              width: dimensions.width,
              position: "relative"
            }}
            source={backgroundImage}
          />
          <View style={style.upRight.overlay}>
            <View style={style.upRight.bluetoothContainer}>
                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Bluetooth
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <Text style={style.upRight.bluetoothText}>
                      {this.props.bluetooth.deviceBluetoothstate ? "On" : "Off"}
                    </Text>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Connection
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.stopScan()}}>
                      <Text style={style.upRight.bluetoothText}>
					  	{this.props.bluetooth.connectedToDevice}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                     Device
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.toggelDefaultDeviceSelection()}}>
                      <Text style={style.upRight.bluetoothText}>
                        {this.props.bluetooth.defaultDevice} top
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
            </View>

            <View style={style.upRight.deviceList} >
            {this.props.bluetooth.allSavedDevices.map((name, indx) =>(
              <View key={indx} style={style.listNameContainer}>
                 <TouchableHighlight style={style.listName} onPress={()=>{this.selectDefaultDevice(name)}}>
                   <Text style={style.listName}>
                     {name}
                   </Text>
                 </TouchableHighlight>
				 <TouchableHighlight style={style.listX} onPress={()=>{this.removeDevice(name)}}>
                   <Text style={style.listX}>
                     X
                   </Text>
                 </TouchableHighlight>
               </View>
            ))}
            </View>


            <TouchableHighlight onPress={()=>{this.tryToConnect(this.props.bluetooth.defaultDevice, this.props.bluetooth.connectedToDevice, this.props.bluetooth.manager)}} style={style.upRight.saveButton}>
              <Text>
                Try to Connect
              </Text>
            </TouchableHighlight>



            <TextInput
             style={style.upRight.deviceNameInput}
             onChangeText={(input)=>{this.updateText(input, this.setState)}}
            />
            <TouchableHighlight onPress={()=>{this.saveNewDevice()}} style={style.upRight.saveButton}>
              <Text>
                Save
              </Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=>{this.props.dispatch(increment())}} style={style.upRight.saveButton}>
              <Text>
                {this.props.bluetooth.rerenderCount}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
    else {
      return (
        <View>

          <Image
            style={{
              height: dimensions.height,
              width: dimensions.width

            }}
            source={backgroundImage}
          />
          <View style={style.upRight.overlay}>
            <View style={style.upRight.bluetoothContainer}>
                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Bluetooth
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <Text style={style.upRight.bluetoothText}>
                      {this.props.bluetooth.deviceBluetoothstate ? "On" : "Off"}
                    </Text>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Connection
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.stopScan()}}>
                      <Text style={style.upRight.bluetoothText}>
						{this.props.bluetooth.connectedToDevice}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                     Device
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.toggelDefaultDeviceSelection()}}>
                      <Text style={style.upRight.bluetoothText}>
                        {this.props.bluetooth.defaultDevice}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
            </View>

            <TouchableHighlight onPress={()=>{this.tryToConnect(this.props.bluetooth.defaultDevice, this.state.connectedToDevice, this.state.manager)}} style={style.upRight.saveButton}>
              <Text>
                Try to Connect
              </Text>
            </TouchableHighlight>


            <TextInput
             style={style.upRight.deviceNameInput}
             onChangeText={(input)=>{this.updateText(input)}}
            />
            <TouchableHighlight onPress={()=>{this.saveNewDevice()}} style={style.upRight.saveButton}>
              <Text>
                Save
              </Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=>{this.props.dispatch(increment())}} style={style.upRight.saveButton}>
              <Text>
                {this.props.bluetooth.rerenderCount}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }
}

Bluetooth.navigationOptions = {
  title: 'Bluetooth',
  header: null
};

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Bluetooth);
