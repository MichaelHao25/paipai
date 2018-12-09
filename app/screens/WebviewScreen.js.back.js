import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import Toast from '@remobile/react-native-toast';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, WebView, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';


const { width, height } = Dimensions.get('window')
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadWebView: true,
            isRoomMenberListOpen: false,
            animation_opacity: new Animated.Value(width),
            all_sms: [
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗1',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗2',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗3',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗4',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗5',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗6',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗7',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗8',
                '微信:292 09旺分微信292 09 秒冲微信29 209 花呗9',
            ],
            user_sms: [
                '100元8包接龙,超多人超高福利.房间密码1111111',
                '100元8包接龙,超多人超高福利.房间密码1111111'
            ],

        }
    }
    render() {
        const {
            towebUrl,
            name,
        } = this.props.navigation.state.params
        const { isRoomMenberListOpen, loadWebView, animation_opacity, all_sms } = this.state;


        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <CommonTitleBar nav={this.props.navigation} title={name} />

                <View style={[styles.poa]}>
                    <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                    <ScrollView>
                        <View>
                            <View style={{ width: 270 }}>
                                <Text>{all_sms[0]}</Text>
                            </View>
                            <View style={{ width: 270 }}>
                                <Text>{all_sms[0]}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <View style={[styles.poa, { display: 'none' }]}>
                    <Animated.View style={[{ flexDirection: 'row', translateX: animation_opacity }]}>

                        {
                            all_sms[0] != '' && <View style={[styles.item, { width: width - 40 }]}>
                                <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                                <ScrollView>
                                    <Text
                                        style={styles.text}
                                        onLayout={
                                            e => alert(e.nativeEvent.layout.width)
                                        }
                                    >{all_sms[0] + 'dsadasdasdadadas'}</Text>
                                </ScrollView>
                            </View>
                        }
                        {
                            // all_sms.map((value, index) => {
                            //     if (index < 3) {
                            //         return (
                            //             <View style={[styles.item, { width: width - 40 }]}>
                            //                 <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                            //                 <Text style={styles.text}>{value}</Text>
                            //             </View>
                            //         )
                            //     }
                            // })
                        }
                        {/* <View style={[styles.item, { width: width - 40 }]}>
                            <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                            <Text style={styles.text}>微信:292 09旺分微信292 09 秒冲微信29 209 花呗</Text>
                        </View>
                        <View style={[styles.item, { width: width - 40 }]}>
                            <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                            <Text style={styles.text}>微信:292 09旺分微信292 09 秒冲微信29 209 花呗</Text>
                        </View>
                        <View style={[styles.item, { width: width - 40 }]}>
                            <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                            <Text style={styles.text}>微信:292 09旺分微信292 09 秒冲微信29 209 花呗</Text>
                        </View> */}
                    </Animated.View>
                    {/* <View style={[styles.item, { marginTop: 20 }]}>
                        <Image source={require('../../images/lb.png')} style={styles.image}></Image>
                        <Text style={styles.text}></Text>
                    </View> */}
                </View>

                <WebView
                    //source={{uri: 'http://118.123.22.134'}}
                    source={{ uri: towebUrl }}
                    style={{ width, flex: 1 }}
                    useWebKit={true}
                    onLoad={this.setWebLocalStorge}
                    domStorageEnabled={true}
                    ref={webview => { this.webview = webview; }}
                // startInLoadingState={false}
                // renderLoading={() => {
                //     alert(loadWebView)
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
                    <TouchableWithoutFeedback onPress={() => { this.handleRoomMenberList() }}>
                        <View style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                isRoomMenberListOpen ? <Text style={{ fontSize: 16, color: '#fff' }}>关闭</Text> : <Image source={require('../../images/more-read.png')} style={{ width: 50, height: 50, resizeMode: 'center' }}></Image>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                }
                {/* </TouchableOpacity> */}
            </View >
        )
    }
    animationStart() {
        var animation_handle = Animated.timing(
            this.state.animation_opacity, {
                toValue: 0,
                duration: 1000
            }
        )
        animation_handle.start(() => {
            console.log('动画执行完毕');
            setTimeout(() => {
                Animated.timing(
                    this.state.animation_opacity, {
                        toValue: -width,
                        duration: 1000
                    }
                ).start(() => {
                    console.log('动画执行完毕');

                    this.setState(preState => ({
                        animation_opacity: new Animated.Value(width),
                        all_sms: preState.all_sms.filter((value, index) => (index != 0))
                    }), () => {
                        // animation_handle.stop();
                        if (this.state.all_sms.length != 0) {
                            this.animationStart();
                        }
                        // this.animationStart()
                    })

                })
            }, 2000);
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
        this.setState({
            loadWebView: false,
        })
        // setTimeout(() => {
        //     Toast.showShortCenter('公告系统连接成功!');
        //     Toast.showShortCenter('喇叭系统连接成功!')
        //     this.animationStart()
        // }, 1000);

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
const styles = StyleSheet.create({
    poa: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        zIndex: 2
    },
    item: {
        backgroundColor: '#999',
        borderRadius: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        textAlignVertical: 'center',
        includeFontPadding: false,
    }
})
