import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import Global from '../utils/Global';
import CommonTitleBar from '../views/CommonTitleBar';
import Toast from '@remobile/react-native-toast';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, WebView, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, AppState, Modal, PixelRatio } from 'react-native';
import GroupChatBottomBar from '../views/GroupChatBottomBar';
import GroupMoreView from '../views/GroupMoreView';
import GroupEmojiView from '../views/GroupEmojiView'
import CountEmitter from '../event/CountEmitter';

const { width } = Dimensions.get('window')
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRoomMenberListOpen: false,
            b_appState: AppState.currentState,
            showEmojiView: '',
            showMoreView: '',
            isRed: false,
            roomType: '',
            red_conf_max_size: 0,
            b_switch_room_url: false,
            s_currentRoomUrl: '',
            name: '',
            isMain: true,
        }
    }
    render() {
        const {
            towebUrl,
        } = this.props.navigation.state.params
        const { isRoomMenberListOpen, isRed, roomType, red_conf_max_size, b_switch_room_url, s_currentRoomUrl, name } = this.state;

        var moreView = [];
        if (this.state.showEmojiView) {
            moreView.push(
                <View key={"emoji-view-key"}>
                    <View style={{ width: width, height: 1 / PixelRatio.get(), backgroundColor: Global.dividerColor }} />
                    <View style={{ height: Global.emojiViewHeight }}>
                        <GroupEmojiView />
                    </View>
                </View>
            );
        }
        if (this.state.showMoreView) {
            moreView.push(
                <View key={"more-view-key"}>
                    <View style={{ width: width, height: 1 / PixelRatio.get(), backgroundColor: Global.dividerColor }} />
                    <View style={{ height: Global.emojiViewHeight }}>
                        <GroupMoreView
                            // sendImageMessage={this.sendImageMessage.bind(this)}
                            sendImageMessage={() => { console.log(1) }}
                            toWeburl={s_currentRoomUrl}
                            handleOpenModal={this.handleOpenModal}
                            roomType={roomType}
                            red_conf_max_size={red_conf_max_size}
                            handleSendRedBao={this.handleSendRedBao}
                            handleJielong={this.handleJielong}
                        />
                    </View>
                </View>
            );
        }
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <CommonTitleBar nav={this.props.navigation} title={name} />
                {/* color={'#f1f1f1'} */}
                <WebView
                    //source={{uri: 'http://118.123.22.134'}}
                    source={{ uri: s_currentRoomUrl }}
                    // source={{ uri:'http://app.daicui.net/index2.html' }}
                    onMessage={function (e) {
                        console.log(e);
                    }}
                    style={{ width, flex: 1 }}
                    useWebKit={true}
                    onLoad={this.setWebLocalStorge}
                    domStorageEnabled={true}
                    ref={webview => { this.webview = webview; }}
                    mediaPlaybackRequiresUserAction={false}
                // startInLoadingState={false}
                // renderLoading={() => {
                //     if (loadWebView == true) {
                //         return (<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                //             <ActivityIndicator color={'#ccc'} size={'large'} />
                //             <View style={{ marginTop: 20, }}>
                //                 <Text>Loading...</Text>
                //             </View>
                //         </View>)
                //     }else{
                //         return <View></View>;
                //     }
                // }}
                />
                {/* <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.handleRoomMenberList()}}> */}
                {
                    towebUrl.indexOf('rooms') != -1 &&
                    <TouchableWithoutFeedback onPress={() => { this.goRoomMoreInfo() }}>
                        <View style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                isRoomMenberListOpen ? <Text style={{ fontSize: 16, color: '#fff' }}>关闭</Text> : <Image source={require('../../images/more-read.png')} style={{ width: 50, height: 50, resizeMode: 'center' }}></Image>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                }
                {
                    (towebUrl.indexOf('rooms') != -1 && isRed == false) &&
                    <View style={{ height: 50 }}>
                        <GroupChatBottomBar updateView={this.updateView} handleSendBtnClick={this.handleSendBtnClick} />
                    </View>
                }
                {moreView}

                {
                    towebUrl.indexOf('rooms') != -1 &&
                    <View style={{ position: 'absolute', right: 0, top: 150, borderBottomLeftRadius: 20, borderTopLeftRadius: 20, borderColor: '#ccc', borderWidth: 1, backgroundColor: '#ebebeb' }}>
                        <TouchableOpacity onPress={() => {
                            this.setState(prevState => ({
                                b_switch_room_url: !prevState.b_switch_room_url
                            }))
                        }}>
                            <View style={{ width: 80, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 30, }}>
                                <Image source={require('../../images/switch.png')} style={{ width: 15, resizeMode: 'center' }}></Image>
                                <Text style={{ fontSize: 12 }}>切换房间</Text>
                            </View>
                        </TouchableOpacity>
                        {b_switch_room_url == true && (
                            <View>

                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        s_currentRoomUrl: towebUrl,
                                        b_switch_room_url: false,
                                        isMain: true
                                    }, () => {
                                        this.getRoomInfo();
                                    })
                                }}>
                                    <View style={{ borderTopColor: '#ccc', borderTopWidth: 1, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 12 }}>扫雷房间</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        s_currentRoomUrl: towebUrl + 'a',
                                        b_switch_room_url: false,
                                        isMain: false
                                    }, () => {
                                        this.getRoomInfo();
                                    })
                                }}>
                                    <View style={{ borderTopColor: '#ccc', borderTopWidth: 1, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 12 }}>接龙房间</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        s_currentRoomUrl: towebUrl + 'b',
                                        b_switch_room_url: false,
                                        isMain: false
                                    }, () => {
                                        this.getRoomInfo();
                                    })
                                }}>
                                    <View style={{ borderTopColor: '#ccc', borderTopWidth: 1, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 12 }}>牛牛房间</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        }
                    </View>
                }
                {/* </TouchableOpacity> */}
                {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={false}
                    hardwareAccelerated={true}

                >

                </Modal> */}
            </View >
        )
    }
    handleJielong = () => {
        this.webview.injectJavaScript(`var hfidsfhiadaskdha = document.querySelector('.jielong-11-26'); var dsajldwioyeqhiuda = angular.element(hfidsfhiadaskdha);dsajldwioyeqhiuda.triggerHandler('click')`)
    }
    handleSendRedBao = (data) => {

        console.log(`localStorage.setItem('red_config','${JSON.stringify(data)}')`);
        this.webview.injectJavaScript(`var hfidsfhiadaskdha = document.querySelector('.rn-data-11-22-openModal'); var dsajldwioyeqhiuda = angular.element(hfidsfhiadaskdha);dsajldwioyeqhiuda.triggerHandler('click')`)
        this.webview.injectJavaScript(`localStorage.setItem('red_config','${JSON.stringify(data)}')`);
        this.webview.injectJavaScript(`var hfidsfhiadaskdha = document.querySelector('.red-config-send-11-26'); var dsajldwioyeqhiuda = angular.element(hfidsfhiadaskdha);dsajldwioyeqhiuda.triggerHandler('click')`)
        this.updateView(false, false)

    }
    handleSendBtnClick = (inputMsg) => {
        //还有那个扫雷红包,让他弹出发展黑鬼那个包的  这个我知道 先把这个敲定

        this.webview.injectJavaScript(`localStorage.setItem('rn_msg','${inputMsg}')`);
        this.webview.injectJavaScript(`var hfidsfhiadaskdha = document.querySelector('.rn-data-11-22'); var dsajldwioyeqhiuda = angular.element(hfidsfhiadaskdha);dsajldwioyeqhiuda.triggerHandler('click')`)
    }
    handleOpenModal = () => {
        this.updateView(false, false)
        // this.setState({
        //     isRed: true,
        // })
        this.webview.injectJavaScript(`var hfidsfhiadaskdha = document.querySelector('.rn-data-11-22-openModal'); var dsajldwioyeqhiuda = angular.element(hfidsfhiadaskdha);dsajldwioyeqhiuda.triggerHandler('click')`)
    }
    updateView = (emoji, more) => {
        this.setState({
            showEmojiView: emoji,
            showMoreView: more,
        })
    }
    componentDidMount() {
        AppState.addEventListener('change', this.webViewMute)

        this.setState({
            s_currentRoomUrl: this.props.navigation.state.params.towebUrl,
            name: this.props.navigation.state.params.name
        }, () => {
            this.getRoomInfo();
        })
        CountEmitter.addListener('modifyName', (name) => {
            this.changeStateTargetRerender(name);
        });
        //注册事件

        // s_currentRoomUrl
    }
    componentWillUnmount() {
        CountEmitter.removeListener('modifyName', () => { });
    }
    //删除事件
    //避免重复注册
    changeStateTargetRerender = (name) => {
        const { isMain } = this.state;
        if (isMain) {
            this.setState({
                name
            })
        }
        //确定是不是主房间，如果是的话则更新数据反之则不更新数据。

    }
    getRoomInfo() {
        //判断当前页面是扫雷还是接龙
        const roomId = this.state.s_currentRoomUrl.replace('http://app.daicui.net/#/tab/rooms/', '');
        StorageUtil.get('tokeninfo', (err, obj) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    token: obj
                })
                const { accessToken, id } = obj;
                fetch(`http://app.daicui.net/room/${roomId}`, {
                    headers: {
                        "x-access-token": accessToken,
                        "x-access-uid": id
                    },
                    method: 'GET',
                }).then(response => response.json())
                    .then(json => {
                        // console.log(json);
                        if (json.body.type == "G04") {
                            // console.log('"G04"');
                            // console.log('扫雷');
                            this.setState({
                                roomType: 'saolei',
                                red_conf_max_size: json.body.properties.conf_max_size
                            })
                            return;
                        }
                        if (json.body.type == "G011") {
                            // console.log('"G011"');
                            // console.log('接龙');

                            this.setState({
                                roomType: 'jielong'
                            })
                            return;
                        }
                    }).catch((error) => {
                        console.log(error);
                    })

            }
        })
    }
    webViewMute() {
        const { b_appState } = this.state;
        if (b_appState == 'active') {
            this.webview.injectJavaScript(`document.getElementById('message_receive').volume = 1`)
        } else {
            this.webview.injectJavaScript(`document.getElementById('message_receive').volume = 0`)
        }
    }
    goRoomMoreInfo() {
        //跳转到房间详细信息咯
        const { s_currentRoomUrl } = this.state;
        this.props.navigation.navigate('RoomMoreInfo', {
            towebUrl: s_currentRoomUrl,
        });
    }
    handleRoomMenberList() {

        const { isRoomMenberListOpen } = this.state;

        this.setState({
            isRoomMenberListOpen: !isRoomMenberListOpen,
        })
        if (isRoomMenberListOpen) {
            this.webview.injectJavaScript(`var hfidsfhiadaskdha_2 = document.querySelector('.bar-dark .button.button-clear'); var dsajldwioyeqhiuda_2 = angular.element(hfidsfhiadaskdha_2);dsajldwioyeqhiuda_2.triggerHandler('click')`)
        } else {
            this.webview.injectJavaScript(`var hfidsfhiadaskdha = document.querySelector('.room-menber-list-18-11-13'); var dsajldwioyeqhiuda = angular.element(hfidsfhiadaskdha);dsajldwioyeqhiuda.triggerHandler('click')`)
        }
    }
    setWebLocalStorge = () => {
        this.webview.injectJavaScript(`document.getElementById('message_receive').load()`)
        //加载音频
        this.setState({
            loadWebView: false,
        })
        StorageUtil.get('tokeninfo', (error, object) => {
            if (!error && object) {
                this.setState({ tokeninfo: object });
                //设置本地存储
                const { accessToken, id, userId } = object;
                this.webview.injectJavaScript(`localStorage.setItem('accessToken','${accessToken}')`)
                this.webview.injectJavaScript(`localStorage.setItem('uid','${id}')`)
                this.webview.injectJavaScript(`localStorage.setItem('username','${userId}')`)
                this.webview.injectJavaScript(`localStorage.setItem('autoLogin','undefined')`)
            }
        });

        StorageUtil.get('password', (error, object) => {
            if (!error && object && object.password) {
                this.setState({ password: object.password });

                // this.loadConversations(object.password);
                //此处使用了password来生成了一个回话故障...
                //设置本地存储

                this.webview.injectJavaScript(`localStorage.setItem('password','${object.password}')`)
            }
        });
    }
}
