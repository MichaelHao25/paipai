import React, { Component } from 'react';
import TitleBar from '../views/TitleBar';
import ListItem from '../views/ListItem';
import ListItemDivider from '../views/ListItemDivider';
import StorageUtil from '../utils/StorageUtil';
import CommonLoadingView from '../views/CommonLoadingView';
import CountEmitter from '../event/CountEmitter';
import Global from '../utils/Global';
import Utils from '../utils/Utils';
import Toast from '@remobile/react-native-toast';

import {
  Dimensions,
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import {
	SW,
	SH,
	FZ,
} from '../utils/ScreenUtil'

const { width } = Dimensions.get('window');

export default class MeScreen extends Component {
  static navigationOptions = {
    tabBarLabel: '我',
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image style={styles.tabBarIcon} source={require('../../images/ic_me_selected.png')} />
        );
      }
      return (
        <Image style={styles.tabBarIcon} source={require('../../images/ic_me_normal.png')} />
      );
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      loadingState: Global.loading,
      token: {}
    };
    this.loadUserInfo();

     const didBlurSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.loadUserInfo();
      }
    );
  }
  loadUserInfo() {
    StorageUtil.get('username', (error, object) => {
      if (!error && object != null) {
        let username = object.username;

        this.setState({ username: username });
        let userInfoKey = 'userInfo-' + username;

        console.log(1);
        
        StorageUtil.get(userInfoKey, (error, object) => {
          if (!error && object != null) {

            this.setState({ userInfo: object.info });
            this.setState({ loadingState: Global.loadSuccess });
          } else {
            this.setState({ loadingState: Global.loadError });
          }
        })
      } else {
        this.setState({ loadingState: Global.loadError });
      }
    });

    StorageUtil.get('tokeninfo', (error, object) => {
      if (!error && object != null) {
        this.setState({
          token: object,
          t: ''
        })
      }
    });
  }



  render() {

    switch (this.state.loadingState) {
      case Global.loading:
        return this.renderLoadingView();
      case Global.loadSuccess:
        return this.renderDetailView();
      case Global.loadError:
        return this.renderErrorView();
    }
  }
  componentWillMount() {

    
    this.setState({
      t: Math.random(),
    })

    CountEmitter.addListener('updateAvatar', () => {
      // 刷新头像
      this.loadUserInfo();
    });
    CountEmitter.addListener('updateUserInfo', () => {
      // 刷新用户数据
      this.loadUserInfo();
    });
  }

  componentWillUnmount() {
    CountEmitter.removeListener('updateAvatar', () => { });
    CountEmitter.removeListener('updateUserInfo', () => { });
  }
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <TitleBar nav={this.props.navigation} />
        <View style={styles.content}>
          <CommonLoadingView hintText={"正在获取联系人数据..."} />
        </View>
      </View>
    );
  }

  renderErrorView() {
    return (
      <View style={styles.container}>
        <TitleBar nav={this.props.navigation} />
        <TouchableOpacity style={styles.content} activeOpacity={0.6} onPress={() => this.loadUserInfo()}>
          <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 17, color: '#999999' }}>加载用户数据失败</Text>
            <Text style={{ fontSize: 17, color: '#999999', marginTop: 5 }}>点击屏幕重试</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderDetailView() {
    let avatar = require('../../images/avatar.png');
    const { headImg } = this.state.token



    if (!Utils.isEmpty(this.state.userInfo) && !Utils.isEmpty(this.state.userInfo.avatar)) {
      avatar = { uri: this.state.userInfo.avatar };
    }

    return (
      <View style={styles.container}>
        <TitleBar nav={this.props.navigation} />
        <View style={styles.divider}></View>
        <ScrollView style={styles.content}>
          <View style={{ width: width, height: 20 }} />
          <TouchableHighlight underlayColor={Global.touchableHighlightColor} onPress={() => {
            this.turnOnPage('PersonInfo', { userInfo: this.state.userInfo, uri: `http://app.daicui.net/${headImg}?t=${this.state.t}`, id: this.state.token.id })
          }}>
            <View style={styles.meInfoContainer}>
              <Image style={styles.meInfoAvatar} source={{ uri: `http://app.daicui.net/${headImg}?t=${this.state.t}` }} />
              <View style={styles.meInfoTextContainer}>
                <Text style={styles.meInfoNickName}>{this.state.username}</Text>
                <Text style={styles.meInfoWeChatId}>{"昵称：" + this.state.userInfo.nick}</Text>
              </View>
              <Image style={styles.meInfoQRCode} source={require('../../images/ic_qr_code.png')} />
            </View>
          </TouchableHighlight>
          <View />
          <View style={{ width: width, height: 20 }} />
          <ListItem icon={require('../../images/ic_wallet.png')} text={"钱包"} handleClick={() => {
            this.turnOnPage('Money')
          }} />
          <View style={{ width: width, height: 20 }} />
          <ListItem icon={require('../../images/ic_collect.png')} text={"我的推荐"} showDivider={true} handleClick={() => {
            this.turnOnPage('MyProxy', { userInfo: this.state.userInfo, uri: `http://app.daicui.net/${headImg}?t=${this.state.t}`, id: this.state.token.id })
          }} />
          <ListItemDivider />
          <ListItem icon={require('../../images/ic_gallery.png')} text={"游戏记录"} showDivider={true} handleClick={() => {
            this.turnOnPage('GameList')
          }} />
          <ListItemDivider />
          <ListItem icon={require('../../images/ic_kabao.png')} text={"推荐好友"} showDivider={true} handleClick={() => {
            this.turnOnPage('CardPackage')
          }} />
          <ListItemDivider />
          <ListItem icon={require('../../images/ic_emoji.png')} text={"转账"} handleClick={() => {
            // this.turnOnPage('Transfer')
            Toast.showShortCenter('该功能暂未开放..');
          }} />
          <View style={{ width: width, height: 20 }} />
          <ListItem icon={require('../../images/ic_settings.png')} text={"设置"} handleClick={() => {
            this.turnOnPage('Settings')
          }} />
          <View style={{ width: width, height: 20 }} />
        </ScrollView>
        <View style={styles.divider}></View>
      </View>
    );
  }

  turnOnPage(pageName, params) {
    if (Utils.isEmpty(params)) {
      this.props.navigation.navigate(pageName);
    } else {
      this.props.navigation.navigate(pageName, params);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    width: width,
    height: 1 / PixelRatio.get(),
    backgroundColor: '#D3D3D3'
  },
  content: {
    flex: 1,
    width: width,
    flexDirection: 'column',
    backgroundColor: Global.pageBackgroundColor,
  },
  tabBarIcon: {
    width: 24,
    height: 24,
  },
  meInfoContainer: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 10,
  },
  meInfoAvatar: {
    width: 60,
    height: 60,
  },
  meInfoTextContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  meInfoNickName: {
    color: '#000000',
    fontSize: Platform.OS=='ios'?FZ(20):16,
  },
  meInfoWeChatId: {
    color: '#999999',
    fontSize: Platform.OS=='ios'?FZ(18):14,
    marginTop: 5,
  },
  meInfoQRCode: {
    width: 25,
    height: 25,
  }
});
