import React, { Component } from 'react';
import TitleBar from '../views/TitleBar';
import SideBar from '../views/SideBar';
import CommonLoadingView from '../views/CommonLoadingView';
import Global from '../utils/Global';
import Utils from '../utils/Utils';
import UserInfoUtil from '../utils/UserInfoUtil';
import Toast from '@remobile/react-native-toast';
import {
  SW,
  SH,
  FZ,
} from '../utils/ScreenUtil'
import {
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

export default class ContactsScreen extends Component {
  static navigationOptions = {
    tabBarLabel: '联系人',
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image style={styles.tabBarIcon} source={require('../../images/ic_contacts_selected.png')} />
        );
      }
      return (
        <Image style={styles.tabBarIcon} source={require('../../images/ic_contacts_normal.png')} />
      );
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      loadingState: Global.loading,
      contactData: [],
      friends: []
    }
  }

  getContacts() {
    // const json = [
    //   {
    //     'avatar': "http://app.daicui.net/css/gma.png",
    //     'name': "gm",
    //     'nick': "小陌官方客服",
    //     'pinyin': "gm"
    //   },
    //   {
    //     'avatar': "http://app.daicui.net/css/gma.png",
    //     'name': "malilian",
    //     'nick': "	999",
    //     'pinyin': "malilian"
    //   },
    //   {
    //     'avatar': "http://app.daicui.net/css/gmb.png",
    //     'name': "service",
    //     'nick': "官方充值客服",
    //     'pinyin': "service"
    //   }
    // ]
    const { friends } = this.state;

    this.setState({
      loadingState: Global.loadSuccess,
      contactData: friends
    })
    UserInfoUtil.setUserInfo(friends);
    // var url = "http://app.yubo725.top/friends"; // 新接口
    // fetch(url).then((res) => res.json())
    //   .then((json) => {
    //     console.log(json);

    //     // UserInfoUtil.setUserInfo(json);
    //     // this.setState({
    //     //   loadingState: Global.loadSuccess,
    //     //   contactData: json
    //     // })
    //   })
  }
  // componentDidMount() {
  //   var _this = this;
  //   const { friends } = _this.state;
  //   WebIM.conn.getRoster({
  //     success: function (roster) {
  //       //获取好友列表，并进行好友列表渲染，roster格式为：
  //       /** [
  //             {
  //               jid:'asemoemo#chatdemoui_test1@easemob.com',
  //               name:'test1',
  //               subscription: 'both'
  //             }
  //           ]
  //       */

  //       if (roster.length == 0) {
  //         _this.setState({
  //           friends: [],
  //         }, () => {
  //           //联系人设置完毕开始渲染联系人
  //           _this.getContacts();
  //         })
  //       }
  //       for (var i = 0, l = roster.length; i < l; i++) {
  //         var ros = roster[i];
  //         //ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
  //         if (ros.subscription === 'both' || ros.subscription === 'to') {
  //           var get_more_info = (name) => {
  //             fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=searchfriend&searchaccount=${name}`, {
  //               method: 'GET',
  //             })
  //               .then(json => json.json())
  //               .then(data => {
  //                 console.log(data);
  //                 if (data.code == 0) {
  //                   friends.push({
  //                     name: name,
  //                     avatar: `http://app.daicui.net/img/user/${data.msg[0].id}.jpg`,
  //                     nick: data.msg[0].nickName,
  //                     pinyin: name
  //                   })
  //                   _this.setState({
  //                     friends
  //                   }, () => {
  //                     //联系人设置完毕开始渲染联系人
  //                     _this.getContacts();
  //                   })
  //                 } else {
  //                   console.log(111);

  //                   Toast.showShortCenter('好友列表获取失败...')
  //                 }
  //               })
  //               .catch(err => console.log(err))
  //           }
  //           get_more_info(ros.name);
  //           // friends.push({
  //           //   name: ros.name
  //           // })
  //           // _this.setState({
  //           //   friends
  //           // })

  //         }
  //       }
  //     },
  //   })
  // }
  render() {
    // switch (this.state.loadingState) {
    //   case Global.loading:
    //     // this.getContacts();
    //     return this.renderLoadingView();
    //   case Global.loadSuccess:
    // return this.renderSuccessView();
    // case Global.loadError:
    //   return this.renderErrorView();
    // default:
    // }
    return this.renderSuccessView();
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
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column' }}>
        <Text style={{ fontSize: 16, color: '#000000' }}>加载数据出错！</Text>
      </View>
    );
  }

  renderSuccessView() {
    var listData = [];
    var headerListData = [];
    var headerImages = [require('../../images/ic_new_friends.png'), require('../../images/ic_group_chat.png'),
    require('../../images/ic_tag.png'), require('../../images/ic_common.png')];
    var headerTitles = ['新的朋友', '群聊', '标签', '公众号'];
    var index = 0;
    for (var i = 0; i < headerTitles.length; i++) {
      headerListData.push({
        key: index++,
        title: headerTitles[i],
        nick: '',
        icon: headerImages[i],
        sectionStart: false,
      });
    }
    var contacts = this.state.contactData;
    for (var i = 0; i < contacts.length; i++) {
      // var pinyin = PinyinUtil.getFullChars(contacts[i].name);
      var pinyin = contacts[i].pinyin.toUpperCase();
      var firstLetter = pinyin.substring(0, 1);
      if (firstLetter < 'A' || firstLetter > 'Z') {
        firstLetter = '#';
      }
      let icon = require('../../images/avatar.png');
      if (!Utils.isEmpty(contacts[i].avatar)) {
        icon = { uri: contacts[i].avatar };
      }
      listData.push({
        key: index++,
        icon: icon,
        title: contacts[i].name,
        nick: contacts[i].nick,
        pinyin: pinyin,
        firstLetter: firstLetter,
        sectionStart: false,
      })
    }
    // 按拼音排序
    listData.sort(function (a, b) {
      if (a.pinyin === undefined || b.pinyin === undefined) {
        return 1;
      }
      if (a.pinyin > b.pinyin) {
        return 1;
      }
      if (a.pinyin < b.pinyin) {
        return -1;
      }
      return 0;
    });
    listData = headerListData.concat(listData);
    // 根据首字母分区
    for (var i = 0; i < listData.length; i++) {
      var obj = listData[i];
      if (obj.pinyin === undefined) {
        continue;
      }
      if (i > 0 && i < listData.length) {
        var preObj = listData[i - 1];
        if (preObj.pinyin === undefined && obj.pinyin !== undefined) {
          obj.sectionStart = true;
        } else if (preObj.pinyin !== undefined && obj.pinyin !== undefined && preObj.firstLetter !== obj.firstLetter) {
          obj.sectionStart = true;
        }
      }
    }
    this.listData = listData;
    return (
      <View style={styles.container}>
        <TitleBar nav={this.props.navigation} />
        <View style={styles.divider}></View>
        <View style={styles.content}>
          <FlatList
            ref={'list'}
            data={listData}
            renderItem={this._renderItem}
            getItemLayout={this._getItemLayout}
          />
          <SideBar onLetterSelectedListener={this.onSideBarSelected.bind(this)} />
        </View>
        <View style={styles.divider}></View>
      </View>
    );
  }

  _getItemLayout = (data, index) => {
    let len = data.sectionStart ? (58) : (51);
    let dividerHeight = 1 / PixelRatio.get();
    return {
      length: len,
      offset: (len + dividerHeight) * index,
      index
    };
  }

  onSideBarSelected(letter) {
    if (this.listData) {
      for (let i = 0; i < this.listData.length; i++) {
        let item = this.listData[i];
        if (item.firstLetter == letter && item.sectionStart) {
          Toast.showShortCenter(letter);
          this.refs.list.scrollToIndex({ viewPosition: 0, index: i });
          break;
        }
      }
    }
  }

  onListItemClick(item) {
    let index = item.item.key;
    if (index == 0) {
      // 新的朋友
      this.props.navigation.navigate('NewFriend', { title: '新的朋友', data: item.item })
    } else if (index >= 1 && index <= 3) {
      Toast.showShortCenter('功能未实现');
    } else {
      this.props.navigation.navigate('ContactDetail', { title: '详细资料', data: item.item });
    }
  }

  _renderItem = (item) => {
    var section = [];
    if (item.item.sectionStart) {
      section.push(<Text key={"section" + item.item.key}
        style={listItemStyle.sectionView}>{item.item.firstLetter}</Text>);
    }
    return (
      <View>
        {section}
        <TouchableHighlight underlayColor={Global.touchableHighlightColor} onPress={() => {
          this.onListItemClick(item)
        }}>
          <View style={listItemStyle.container} key={item.item.key}>
            <Image style={listItemStyle.image} source={item.item.icon} />
            <Text style={listItemStyle.itemText}>{item.item.title}</Text>
            <Text style={listItemStyle.subText}>{Utils.isEmpty(item.item.nick) ? "" : "(" + item.item.nick + ")"}</Text>
          </View>
        </TouchableHighlight>
        <View style={{ width: width, height: 1 / PixelRatio.get(), backgroundColor: Global.dividerColor }} />
      </View>
    );
  }
}

const listItemStyle = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  image: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 8,
    marginBottom: 8,
    width: 35,
    height: 35,
  },
  itemText: {
    fontSize: Platform.OS == 'ios' ? FZ(22) : 15,
    color: '#000000'
  },
  subText: {
    fontSize: Platform.OS == 'ios' ? FZ(20) : 15,
    color: '#999999'
  },
  sectionView: {
    width: width,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    color: '#999999'
  }
});

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
    flexDirection: 'row',
    backgroundColor: Global.pageBackgroundColor
  },
  tabBarIcon: {
    width: 24,
    height: 24,
  },
});
