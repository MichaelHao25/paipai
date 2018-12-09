import React, { Component } from 'react';
import Toast from '@remobile/react-native-toast';
import CommonTitleBar from '../views/CommonTitleBar';
import ListItemDivider from '../views/ListItemDivider';
import ImagePicker from 'react-native-image-crop-picker';
import StorageUtil from '../utils/StorageUtil';
import CountEmitter from '../event/CountEmitter';
import LoadingView from '../views/LoadingView';
import ReplyPopWin from '../views/ReplyPopWin';
import Global from '../utils/Global';
import Utils from '../utils/Utils';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, TextInput, Platform } from 'react-native';
import {
  SW,
  SH,
  FZ,
} from '../utils/ScreenUtil'



const { width } = Dimensions.get('window');

export default class PersonInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProgress: false,
      username: '',
      token: {}
    };
    StorageUtil.get('username', (error, object) => {
      if (!error && object != null) {
        let username = object.username;
        this.setState({ username: username });
      }
    });

    StorageUtil.get('tokeninfo', (error, object) => {
      if (!error && object != null) {
        this.setState({
          token: object
        })
      }
    });
    let userInfo = this.props.navigation.state.params.userInfo;
    let uri = this.props.navigation.state.params.uri;
    let id = this.props.navigation.state.params.id;
    this.userInfo = userInfo;
    this.uri = uri;
    this.id = id
  }

  componentWillMount() {
    this.setState({ nick: this.userInfo.nick, avatar: this.uri, id: this.id });
  }

  render() {
    return (
      <View style={styles.container}>
        <CommonTitleBar nav={this.props.navigation} title={"个人信息"} />
        {
          this.state.showProgress ? (
            <LoadingView cancel={() => this.setState({ showProgress: false })} />
          ) : (null)
        }
        <View style={styles.list}>
          <TouchableHighlight underlayColor={Global.touchableHighlightColor} onPress={() => {
            this.modifyAvatar()
          }}>
            <View style={styles.listItem}>
              <Text style={styles.listItemLeftText}>头像</Text>
              <View style={styles.rightContainer}>
                <Image style={[styles.listItemRight, styles.avatarImg]}
                  source={Utils.isEmpty(this.state.avatar) ? require('../../images/avatar.png') : { uri: this.state.avatar }} />
              </View>
            </View>
          </TouchableHighlight>
          <ListItemDivider />
          <TouchableHighlight underlayColor={Global.touchableHighlightColor} onPress={() => {
            this.modifyUserNick()
          }}>
            <View style={styles.listItem} activeOpacity={0.6}>
              <Text style={styles.listItemLeftText}>昵称</Text>
              <View style={styles.rightContainer}>
                <Text style={styles.rightContainerText}>{this.state.nick || ''}</Text>
                {/* <TextInput onChange={e=>this.handleChangeName(e)} value={this.state.nick}></TextInput> */}
              </View>
              <Image source={require('../../images/ic_right_arrow.png')} style={styles.rightArrow} />
            </View>
          </TouchableHighlight>
          <ListItemDivider />
          <View style={styles.listItem}>
            <Text style={styles.listItemLeftText}>ID号</Text>
            <View style={styles.rightContainer}>
              <Text style={styles.rightContainerText}>{this.state.id || ''}</Text>
            </View>
          </View>
          <ListItemDivider />
          <View style={styles.listItem}>
            <Text style={styles.listItemLeftText}>二维码名片</Text>
            <View style={styles.rightContainer}>
              <Image style={[styles.listItemRight, styles.qrcodeImg]} source={require('../../images/ic_qr_code.png')} />
            </View>
          </View>
          <ListItemDivider />
          <View style={styles.listItem}>
            <Text style={styles.listItemLeftText}>绑定手机</Text>
          </View>
          <View style={{ height: 20, width: width }} />
          <TouchableHighlight underlayColor={Global.touchableHighlightColor} onPress={() => {
            this.props.navigation.navigate('ChangePassword', {
              token: this.state.token
            });
          }}>
            <View style={styles.listItem}>
              <Text style={styles.listItemLeftText}>修改密码</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{ backgroundColor: 'transparent', position: 'absolute', left: 0, top: 0, width: width }}>
          <ReplyPopWin ref="replyPopWin" />
        </View>
      </View>
    );
  }

  modifyUserNick() {
    this.refs.replyPopWin.showModalWhenUpdateInfo(this.state.username, (contactId, nickName) => {
      // 请求服务器，修改昵称
      this.setState({ showProgress: true });

      const { accessToken, id, userId } = this.state.token;


      fetch('http://app.daicui.net/user/update', {
        headers: {
          "x-access-token": accessToken,
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-uid": id
        },
        body: JSON.stringify({
          id,
          nickName
        }),
        method: 'POST',
      }).then(response => response.json())
        .then(json => {
          const { code } = json;
          if (code == 200) {
            this.setState(preState => ({
              nick: nickName,
              token: { ...preState.token, nickName: nickName }
            }), () => {
              StorageUtil.set('tokeninfo', this.state.token);
            })
            Toast.showShortCenter('修改成功');
            this.setState({ showProgress: false });

            let userInfo = {
              username: userId,
              nick: nickName,
              avatar: `http://app.daicui.net/${userId}.jpg`
            };


            let key = 'userInfo-' + userId;
            StorageUtil.set(key, { 'info': userInfo });


          }
        }).catch((error) => {
          console.log(error);
          this.setState({ showProgress: false });
          Toast.showShortCenter('修改失败');
        })

      // let url = "http://app.yubo725.top/updateNick";
      // let formData = new FormData();
      // formData.append('contactId', contactId);
      // formData.append('nick', nickName);
      // fetch(url, {method: 'POST', body: formData}).then((res) => res.json())
      //   .then((json) => {
      //     this.setState({showProgress: false});
      //     if (json != null && json.code == 1) {
      //       this.setState({nick: nickName});
      //       this.userInfo.nick = nickName;
      //       StorageUtil.set('userInfo-' + this.state.username, {'info': this.userInfo}, () => {
      //         CountEmitter.emit('updateUserInfo');
      //       });
      //       Toast.showShortCenter('修改成功');
      //     } else {
      //       Toast.showShortCenter('修改失败');
      //     }
      //   }).catch((e) => {
      //   this.setState({showProgress: false});
      //   Toast.showShortCenter('修改失败' + e.toString());
      // })
    });
  }

  modifyAvatar() {
    // 修改头像
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then(image => {
      // image: Object {size: 34451, mime: "image/jpeg", height: 300, width: 300, path: "file:///data/user/0/com.testreactnavigation/cache/…p-picker/01b5d49d-3805-45d3-bdd7-4f49939706d0.jpg"}



      this.setState({ showProgress: true });
      let path = image.path;
      let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
      let username = this.state.username;
      if (Utils.isEmpty(username)) {
        Toast.showShortCenter('用户未登录');
      } else {
        let formData = new FormData();
        // formData.append('username', username);
        let file = { uri: image.path, type: 'multipart/form-data', name: filename };
        const { accessToken, id } = this.state.token;

        formData.append('file', file);
        let url = 'http://app.daicui.net/user/upload';
        fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            "x-access-token": accessToken,
            // "Content-Type": "multipart/form-data",
            "x-access-uid": id
          }
        })
          .then((res) => res.json())
          .then((json) => {
            this.setState({ showProgress: false });
            if (!Utils.isEmpty(json)) {
              if (json.code == 200) {
                Toast.showShortCenter('修改头像成功');
                console.log(json.body.headImage);


                this.setState(preState =>
                  ({
                    token: {
                      ...preState.token,
                      headImg: json.body.headImage
                    },
                    avatar: `http://app.daicui.net/${json.body.headImage}`
                  }), () => {
                    console.log(this.state.token);

                    StorageUtil.set('tokeninfo', this.state.token, () => {
                      CountEmitter.emit('updateAvatar');
                    });
                  });
                // StorageUtil.set('userInfo-' + this.state.username, { 'info': this.userInfo }, () => {
                //   // 发送消息通知其他界面更新头像
                //   CountEmitter.emit('updateAvatar');
                // });
              } else {
                console.warn(JSON.stringify(json))
                this.setState({ showProgress: false });
                Toast.showShortCenter(json.msg);
                // console.warn('json.msg: ' + json.msg)
              }
            }
          }).catch((e) => {
            this.setState({ showProgress: false });
            Toast.showShortCenter('' + e.toString());
            console.warn('exception: ' + e.toString())
          })
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  listItemLeftText: {
    alignItems: 'flex-start',
    color: '#000000',
    fontSize: Platform.OS == 'ios' ? FZ(20) : 16,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightContainerText: {
    fontSize: Platform.OS == 'ios' ? FZ(20) : 16,
  },
  listItemRight: {
    alignItems: 'flex-end'
  },
  avatarImg: {
    width: 60,
    height: 60,
  },
  qrcodeImg: {
    width: 25,
    height: 25,
  },
  rightArrow: {
    width: 8,
    height: 14,
    marginLeft: 10
  }
})
