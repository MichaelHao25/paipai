import React, { Component } from 'react';
import Global from '../utils/Global';
import {
	SW,
	SH,
	FZ,
} from '../utils/ScreenUtil'
import { Image, StyleSheet, Text, TouchableHighlight, View,Platform } from 'react-native';

export default class ListItem extends Component {
  render() {
    return (
      <View>
        <TouchableHighlight underlayColor={Global.touchableHighlightColor} onPress={this.props.handleClick}>
          <View>
            <View style={listItemStyles.container}>
              <Image style={listItemStyles.icon} source={this.props.icon} />
              <View style={listItemStyles.menuContainer}>
                <Text style={listItemStyles.menuText}>{this.props.text}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const listItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  menuContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  menuText: {
    color: '#000000',
    fontSize: Platform.OS=='ios'?FZ(20):16,
  }
});
