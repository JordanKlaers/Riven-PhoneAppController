import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  AsyncStorage,
  Slider,
  TouchableHighlight,
  Image,
  Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import { customAction, splashintervalCallBackAction } from '../actions';
import {
  atob,
  btoa
} from 'b2a';

const backgroundImage = require('../../image/rivenSword.jpg');

const styles = StyleSheet.create({
  	container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
   		backgroundColor: 'white',
  	},
  	welcome: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	},
	textBlock: {
		textAlign: 'center',
		height: 40, 
		width: 260, 
		marginLeft: 20, 
		marginRight: 20, 
		backgroundColor: 'white', 
		borderRadius: 10, 
		borderWidth: 5, 
		borderColor: 'black'
	}
});




class Controller extends Component {

    constructor(props) {
    	super(props)
      	this.setState = this.setState.bind(this);
      	this.forceUpdate = this.forceUpdate.bind(this);
      	this.state = {
	        screenDIM: {
          		isVerticle: true,
          		height: 0,
          		width: 0
        	},                  //should be just the ones that i need to worry about changing
			deviceObject: props.bluetooth.deviceObject,
			connectionData: props.bluetooth.connectionData,
        	nav: props.myNav,
        	dispatch: props.navigation.dispatch,
			count: props.bluetooth.count,
			wait: false,
			dataToSend: [0,1,2,3,4,5,6,7,8],
			isSliderModalOpen: false,
			command: '',
			modalText: ''
      	}
    }



  	componentDidMount() {
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

  	objectComparison = (a, b) => {
    	var result = "match";
    	for (let key in a) {
      		if (a.hasOwnProperty(key) && !b.hasOwnProperty(key)) {
        		result = "no match";
      		}
    	}
    	return result;
  	}


  	componentWillReceiveProps(nextProps) {
		if (nextProps.myNav != this.state.nav)  {
			let temp = Object.assign({}, this.state, {nav: nextProps.myNav})
			this.setState(temp)
		}
		if (nextProps.bluetooth.count != this.state.count)  {
			let temp = Object.assign({}, this.state, {count: nextProps.bluetooth.count})
			this.setState(temp)
		}
		if (nextProps.bluetooth.deviceObject == null) {
			var temp = Object.assign({}, this.state, {
				deviceObject: null
			})
			this.setState(temp, () => this.forceUpdate())
		}
		else if (Object.keys(nextProps.bluetooth.deviceObject).length > 0) {
			var temp = Object.assign({}, this.state, {
				deviceObject: nextProps.bluetooth.deviceObject
			})
			this.setState(temp, () => this.forceUpdate())
		}
		if (nextProps.bluetooth.connectionData == null) {
			var temp = Object.assign({}, this.state, {
				connectionData: null
			});
			this.setState(temp, () => {
				this.forceUpdate()
			})
		}
		else if (nextProps.bluetooth.connectionData != this.state.connectionData){
			var temp = Object.assign({}, this.state, {
				connectionData: nextProps.bluetooth.connectionData
			});
			this.setState(temp, () => {
				this.forceUpdate()
			})
		}
  	}

  	componentDidUpdate(prevProp, prevState) {
    	if (this.props.bluetooth.deviceObject && this.state.deviceObject == null) {
		let connectionData = this.props.bluetooth.connectionData;
		let deviceObject = this.props.bluetooth.deviceObject
			this.state.dispatch({
				type: 'Save Connection Data', 
				connectionData, 
				deviceObject
			})
    	}
  	}

  	Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	busy = false;
	values = [];
	last = null; 
	all = [];
	hslToRgb = (h) => {
		var s = 1;
		var l = 0.5;
		var r, g, b;
	
		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			var hue2rgb = function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}
	
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
	
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	intervalCallBack = (value) => {
		let currentSliderValueToSend = this.dataToSend.shift();
		let colorValue = currentSliderValueToSend && currentSliderValueToSend.value;
		let command = currentSliderValueToSend && currentSliderValueToSend.command;

		let charUUID = this.props.bluetooth && this.props.bluetooth.connectionData && this.props.bluetooth.connectionData.writeCharacteristicUUID
		let deviceObj = this.props.bluetooth && this.props.bluetooth.deviceObject || {};
		let writeUUID = this.props.bluetooth && this.props.bluetooth.connectionData && this.props.bluetooth.connectionData.writeServiceUUID;
		if (colorValue && command && charUUID && writeUUID && deviceObj) {
			this.sendDataThroughService(colorValue, command, deviceObj, writeUUID, charUUID);
		}
		if (this.dataToSend.length == 0) {
			clearInterval(this.theInterval);
		}
	}
	sendDataThroughService = async (value, command, deviceObject, writeService, writeChar) => {
		
		value = Math.floor(value);
		
		let fullCommandRGB = '';
		if (command === 'P') {
			fullCommandRGB = "<P," + this.format(value) + ",000,000>";	
		} else {
			let hsaValue = this.hslToRgb(value/360);
			fullCommandRGB = "<" + command + "," + this.format(hsaValue[0]) + "," + this.format(hsaValue[1]) + "," + this.format(hsaValue[2]) + ">";
		}
		
		let encodedString = btoa(fullCommandRGB);
		if(Object.keys(deviceObject).length > 0) {
			deviceObject.writeCharacteristicWithoutResponseForService(writeService, writeChar, encodedString);
		}
	}

	sendRivenUltCommand = async () => {
		let charUUID = this.props.bluetooth && this.props.bluetooth.connectionData && this.props.bluetooth.connectionData.writeCharacteristicUUID
		let deviceObject = this.props.bluetooth && this.props.bluetooth.deviceObject || {};
		let writeUUID = this.props.bluetooth && this.props.bluetooth.connectionData && this.props.bluetooth.connectionData.writeServiceUUID;
		let encodedString = btoa("<U,000,000,000>");
		if(Object.keys(deviceObject).length > 0 && charUUID && writeUUID) {
			deviceObject.writeCharacteristicWithoutResponseForService(writeUUID, charUUID, encodedString);
		}

	}
	
	shouldSendData = true;

	format = (value) => {
		value = value.toString();
		let length = value.split("").length
		while (length < 3) {
			value = "0" + value;
			length = value.split("").length;
		}
		return value
	}

	dataToSend = [];
	theInterval = null;
	throttle = (value, command) => {
		let data = {
			value,
			command
		}
		if (this.dataToSend.length == 0) {
			this.dataToSend.push(data);
			this.theInterval = setInterval(this.intervalCallBack, 1);
		} else {
			this.dataToSend.push(data);
		}
	}

	setModalState = (command, text) => {
		tempState = Object.assign({}, this.state, {
			isSliderModalOpen: this.state.command === command ? !this.state.isSliderModalOpen : true,
			command,
			modalText: text
		})
		this.setState(tempState);
	}

	navigationOptions = {
		header: null
	}
  	render(){
		const dimensions = {
			height: this.state.screenDIM.height,
			width: this.state.screenDIM.width
		}
		const style = {
			ultButton: {
				position: 'absolute',
				left: '50%',
				transform: [{translateX: -100}, {translateY: -90}],
				marginTop: 15,
				width: 200,
				height: 70,
				borderRadius: 10,
				borderWidth: 5,
				borderColor: 'black',
				backgroundColor: 'white',
				zIndex: 10
			},
			bladeTouchable: {
				position: 'absolute',
				left: '50%',
				marginLeft: -80,
				marginTop: 10,
				height: 300,
				width: 150,
				backgroundColor: 'rgba(0, 0, 0, 0)'
			},
			centerTouchable: {
				position: 'absolute',
				left: '50%',
				marginLeft: -60,
				marginTop: 315,
				height: 110,
				width: 110,
				backgroundColor: 'rgba(0, 0, 0, 0)'
			},
			rightTouchable: {
				position: 'absolute',
				left: '50%',
				marginLeft: -170,
				marginTop: 315,
				height: 110,
				width: 110,
				backgroundColor: 'rgba(0, 0, 0, 0)'
			},
			leftTouchable: {
				position: 'absolute',
				left: '50%',
				marginLeft: 50,
				marginTop: 315,
				height: 110,
				width: 110,
				backgroundColor: 'rgba(0, 0, 0, 0)'
			},
			hiltTouchable: {
				position: 'absolute',
				left: '50%',
				marginLeft: -60,
				marginTop: 445,
				height: 80,
				width: 110,
				backgroundColor: 'rgba(0, 0, 0, 0)'
			},
			sliderModal: {
				position: 'absolute',
				left: '50%',
				marginLeft: -155,
				marginTop: 100,
				height: 100,
				width: 240,
				borderRadius: 10,
				borderWidth: 5,
				borderColor: 'black',
				backgroundColor: 'white',
				zIndex: 10
			},
			brightnessModal: {
				position: 'absolute',
				left: '70%',
				marginLeft: -60,
				marginTop: 100,
				height: 50,
				width: 250,
				borderRadius: 10,
				borderWidth: 5,
				borderColor: 'black',
				backgroundColor: 'white',
				zIndex: 11,
				transform: [{rotateZ: '90deg'}]
			},
			sliderModalText: {
				fontFamily: 'monospace',
				fontWeight: 'bold',
				color: 'black',
				marginLeft: 15,
				marginBottom: 15,
				marginTop: 15
			},
			ultModalText: {
				fontFamily: 'monospace',
				fontWeight: 'bold',
				color: 'black',
				marginLeft: 50,
				marginTop: 15
			},
			slider: {
				width: '100%',
			},
			verticalSlider: {
				width: '100%',
				height: '100%'
			}
		}
		if (this.state.isSliderModalOpen)  {
			return (
				<View style={styles.container}>
					<Image style={{height: dimensions.height - 100, width: dimensions.width, position: "relative", top: 40}} resizeMode='contain' source={backgroundImage}>
					  <View style={style.sliderModal}>
						  <Text style={style.sliderModalText}>
							  {this.state.modalText}
						  </Text>
						  <Slider maximumValue={360} minimumValue={0} style={style.slider} onValueChange={(value)=>{this.throttle(value, this.state.command)}}></Slider> 
					  </View>
					  <TouchableHighlight style={style.ultButton} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.sendRivenUltCommand()}}>
						  <View style={styles.sliderModal}>
							<Text style={style.ultModalText}>
								Rivens Ult
							</Text>
						  </View>
					  </TouchableHighlight>
					  <View style={style.brightnessModal}>
						  <Slider maximumValue={0} minimumValue={255} style={style.verticalSlider} onValueChange={(value)=>{this.throttle(value, "P")}}></Slider> 
					  </View>
					  <TouchableHighlight style={style.bladeTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('B', 'Blade')}}>
						  <View style={styles.bladeTouchable}></View>
					  </TouchableHighlight>
					  <TouchableHighlight style={style.centerTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('C', 'Center Triangle')}}>
						  <View style={styles.centerTouchable}></View>
					  </TouchableHighlight>
					  <TouchableHighlight style={style.rightTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('S', 'Side Triangles')}}>
						  <View style={styles.rightTouchable}></View>
					  </TouchableHighlight>
					  <TouchableHighlight style={style.leftTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('S', 'Side Triangles')}}>
						  <View style={styles.leftTouchable}></View>
					  </TouchableHighlight>
					  <TouchableHighlight style={style.hiltTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('H', 'Hilt')}}>
						  <View style={styles.hiltTouchable}></View>
					  </TouchableHighlight>
				  </Image>
				</View>
		  )
		} else {
			return (
				<View style={styles.container}>
					<Image style={{height: dimensions.height - 100, width: dimensions.width, position: "relative", top: 40}} resizeMode='contain' source={backgroundImage}>
						<TouchableHighlight style={style.ultButton} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.sendRivenUltCommand()}}>
							<View style={styles.sliderModal}>
								<Text style={style.ultModalText}>
									Rivens Ult
								</Text>
							</View>
						</TouchableHighlight>
						<View style={style.brightnessModal}>
							<Slider maximumValue={0} minimumValue={255} style={style.verticalSlider} onValueChange={(value)=>{this.throttle(value, "P")}}></Slider> 
					  	</View>
						<TouchableHighlight style={style.bladeTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('B', 'Blade')}}>
							<View style={styles.bladeTouchable}></View>
						</TouchableHighlight>
						<TouchableHighlight style={style.centerTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('C', 'Center Triangle')}}>
							<View style={styles.centerTouchable}></View>
						</TouchableHighlight>
						<TouchableHighlight style={style.rightTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('S', 'Side Triangles')}}>
							<View style={styles.rightTouchable}></View>
						</TouchableHighlight>
						<TouchableHighlight style={style.leftTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('S', 'Side Triangles')}}>
							<View style={styles.leftTouchable}></View>
						</TouchableHighlight>
						<TouchableHighlight style={style.hiltTouchable} activeOpacity={0} underlayColor={'rgba(0,0,0,0)'} onPress={()=>{this.setModalState('H', 'Hilt')}}>
							<View style={styles.hiltTouchable}></View>
						</TouchableHighlight>
					</Image>
				</View>
		  	)
		}
    	
  	}
};

Controller.navigationOptions = {
	title: 'Controller',
	header: null
};

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Controller);




