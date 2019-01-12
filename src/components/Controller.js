import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  AsyncStorage,
  Slider,
  TouchableHighlight,
  Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import { customAction, splashintervalCallBackAction } from '../actions';
import {
  atob,
  btoa
} from 'b2a';

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
			dataToSend: [0,1,2,3,4,5,6,7,8]
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

  	
	sendBatchValues = (deviceObject, writeService, writeChar) => {
		for (let i = 0; i < 100; i++) {
			this.dataToSend.push(45);
		}
		this.theInterval = setInterval(this.intervalCallBack, 20);
	}
	intervalCallBack = (value) => {
		let currentSliderValueToSend = this.dataToSend.shift();
		this.sendDataThroughService(currentSliderValueToSend.value, currentSliderValueToSend.command, this.props.bluetooth.deviceObject, this.props.bluetooth.connectionData.writeServiceUUID, this.props.bluetooth.connectionData.writeCharacteristicUUID)
		if (this.dataToSend.length == 0) {
			clearInterval(this.theInterval);
		}
	}
	sendDataThroughService = async (value, command, deviceObject, writeService, writeChar) => {
		value = Math.floor(value);
		// console.log('value', value);
		let hsaValue = this.hslToRgb(value/360);
		let fullCommandRGB = "<" + command + "," + this.format(hsaValue[0]) + "," + this.format(hsaValue[1]) + "," + this.format(hsaValue[2]) + ">";
		console.log(fullCommandRGB);
		let encodedString = btoa(fullCommandRGB);
		if(Object.keys(deviceObject).length > 0) {
			deviceObject.writeCharacteristicWithoutResponseForService(writeService, writeChar, encodedString);
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

	navigationOptions = {
		header: null
	}
  	render(){
    	return (
      		<View style={styles.container}>
        		<Text style={styles.welcome}>
          			Controller Screen
        		</Text>
				<Text style={styles.textBlock}>
                	Blade
              	</Text>
        		<Slider maximumValue={360} minimumValue={0} style={{height: 40, width: this.state.screenDIM.width * 0.8}} onValueChange={(value)=>{this.throttle(value, 'B')}}>
        		</Slider>
				<Text style={styles.textBlock}>
                	Center
              	</Text>
        		<Slider maximumValue={360} minimumValue={0} style={{height: 40, width: this.state.screenDIM.width * 0.8}} onValueChange={(value)=>{this.throttle(value, 'C')}}>
        		</Slider>
				<Text style={styles.textBlock}>
                	Side
              	</Text>
        		<Slider maximumValue={360} minimumValue={0} style={{height: 40, width: this.state.screenDIM.width * 0.8}} onValueChange={(value)=>{this.throttle(value, 'S')}}>
        		</Slider>
				<Text style={styles.textBlock}>
                	Hilt
              	</Text>
        		<Slider maximumValue={360} minimumValue={0} style={{height: 40, width: this.state.screenDIM.width * 0.8}} onValueChange={(value)=>{this.throttle(value, 'H')}}>
        		</Slider>
				<TouchableHighlight onPress={()=>{this.throttle(0, 'U')}} style={{height: 40, width: 260, marginLeft: 20, marginRight: 20, backgroundColor: 'white', borderRadius: 10, borderWidth: 5, borderColor: 'black'}}>
              		<Text>
                		Ult
              		</Text>
            	</TouchableHighlight>
				<TouchableHighlight onPress={()=>{this.sendBatchValues(this.props.bluetooth.deviceObject, this.props.bluetooth.connectionData.writeServiceUUID, this.props.bluetooth.connectionData.writeCharacteristicUUID)}} style={{height: 40, width: 260, marginLeft: 20, marginRight: 20, backgroundColor: 'white', borderRadius: 10, borderWidth: 5, borderColor: 'black'}}>
              		<Text>
                		Send sendBatchValues
              		</Text>
            	</TouchableHighlight>
      		</View>
    	)
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




