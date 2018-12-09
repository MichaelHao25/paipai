import React from 'react'
import Global from '../utils/Global';
import Toast from '@remobile/react-native-toast';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View,Platform } from 'react-native'
import Utils from '../utils/Utils';
import { withNavigation } from 'react-navigation';
import {
	SW,
	SH,
	FZ,
} from '../utils/ScreenUtil'

const { width, height } = Dimensions.get('window');
let mwidth = 180;
let mheight = 220;
const bgColor = Global.titleBackgroundColor;
const top = 50;
let dataArray;

class MenuModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.show,
    }
    mwidth = this.props.width;
    mheight = this.props.height;
    dataArray = this.props.dataArray;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isVisible: nextProps.show });
  }

  closeModal() {
    this.setState({
      isVisible: false
    });
    this.props.closeModal(false);
  }

  render() {
    var menuItems = [];
    var icons = this.props.menuIcons;
    var texts = this.props.menuTexts;
    for (var i = 0; i < icons.length; i++) {
      //这里根据文字来判断开启的功能yes!
      if ('开设房间' == texts[i]) {

        //根据点击的目标不同跳转到指定页面
        menuItems.push(
          <TouchableOpacity key={i} activeOpacity={0.3} onPress={() => this.handleCreateRoom('CreateRoom')} style={styles.itemView}>
            <Image style={styles.imgStyle} source={icons[i]} />
            <Text style={styles.textStyle}>{texts[i]}</Text>
          </TouchableOpacity>
        );
        continue;
      }
      if ('加入房间' == texts[i]) {
        //根据点击的目标不同跳转到指定页面
        menuItems.push(
          <TouchableOpacity key={i} activeOpacity={0.3} onPress={() => this.handleCreateRoom('JoinRoom')} style={styles.itemView}>
            <Image style={styles.imgStyle} source={icons[i]} />
            <Text style={styles.textStyle}>{texts[i]}</Text>
          </TouchableOpacity>
        );
        continue;
      }
      menuItems.push(
        <TouchableOpacity key={i} activeOpacity={0.3} onPress={this.handlePopMenuItemClick} style={styles.itemView}>
          <Image style={styles.imgStyle} source={icons[i]} />
          <Text style={styles.textStyle}>{texts[i]}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.isVisible}
          animationType={'fade'}
          onRequestClose={() => this.closeModal()}>
          <TouchableOpacity style={styles.container} onPress={() => this.closeModal()}>
            <View style={styles.modal}>
              {menuItems}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
  handleCreateRoom = (router) => {
    this.turnOnPage(router);
    this.closeModal();
  }
  turnOnPage(pageName, params) {
    if (Utils.isEmpty(params)) {
      this.props.navigation.navigate(pageName);
    } else {
      this.props.navigation.navigate(pageName, params);
    }
  }
  handlePopMenuItemClick = () => {
    Toast.showShortCenter('Click menu item');
    this.closeModal();
  }
}

export default withNavigation(MenuModal)
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  modal: {
    backgroundColor: bgColor,
    width: mwidth,
    height: mheight,
    position: 'absolute',
    left: width - mwidth - 10,
    top: top,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: mwidth,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  textStyle: {
    color: '#fff',
    fontSize: Platform.OS=='ios'?FZ(18):16,
    marginLeft: 5,
  },
  imgStyle: {
    width: 32,
    height: 32,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  }
});
