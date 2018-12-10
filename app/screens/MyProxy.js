import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, ScrollView, TouchableOpacity, FlatList, PixelRatio, Clipboard, CameraRoll, Platform, PermissionsAndroid, ActivityIndicator, Modal, WebView } from 'react-native';
import Toast from '@remobile/react-native-toast';
import RNFS from 'react-native-fs';
import Base64 from '../utils/Base64'
import {
    SW,
    SH,
    FZ,
} from '../utils/ScreenUtil'

const { width } = Dimensions.get('window')
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'xx',
            // xx
            // xj
            //fh
            //tj
            userInfo: '',
            uri: '',
            id: '',
            getMessage: [],
            getDetails: [],
            getProxy: [],
            getProxyConfirm: [],
            isload: false,
            url: '',
            url2: '',
            clipboard: [],
            shareVisible: false,
            currentUri: '',
        }
    }
    componentDidMount() {
        let userInfo = this.props.navigation.state.params.userInfo;
        let uri = this.props.navigation.state.params.uri;
        let id = this.props.navigation.state.params.id;
        // let text = Base64.encoder(['推荐码：'+id]);
        let text = Base64.encoder('推荐码：' + id);
        text = text.replace(/\+/g, '-').replace(/\//g, '_')
        let text2 = Base64.encoder('推荐码：' + id);
        text2 = text2.replace(/\+/g, '-').replace(/\//g, '_')
        // .replace(/+/g,'-').replace(/\//g,'_')
        this.setState({
            userInfo,
            uri,
            id,
            // url: `https://010404040404.oss-cn-beijing.aliyuncs.com/ppsj/pp02.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk=,size_35,color_f6f3c3,text_${text},x_140,y_138`,
            // url2: `http://010404040404.oss-cn-beijing.aliyuncs.com/ppsj/pp01.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk=,size_70,color_000000,text_${text2},x_280,y_140`
            url: `http://app.daicui.net:10000/qrcode/r/${id}`,
            url2: `http://app.daicui.net:10000/qrcode/f/${id}`
        })

        this.fetchData('getMessage', id)
        this.fetchData('getDetails', id)
        this.fetchData('getProxy', id)
        this.fetchData('getProxyConfirm', id)

        fetch('http://118.123.22.134:8081/CreateRoom/api.php?action=tjmsg')
            .then(json => json.json())
            .then(data => {
                // clipboard

                var resuit = data.msg[0], arry = [];
                for (const key in resuit) {
                    if (resuit.hasOwnProperty(key)) {
                        if ('Id' == key) {
                            //这里判断是否是最后一行
                            continue;
                        } else {
                            let element = resuit[key];
                            // 这里判断内容是否包含id字符串有则替换
                            element = element.replace('${id}', id)
                            arry.push(element)
                        }
                    }
                }
                this.setState({
                    clipboard: arry
                })

            })
            .catch(() => {
                Toast.showShortCenter('剪切板信息获取失败！')
            })


    }
    render() {
        const { selectedTab, userInfo, uri, id, getProxy, getDetails, url, shareVisible, currentUri } = this.state;

        var total = 0;
        if (getDetails.length != 0) {
            for (let index = 0; index < getDetails.length; index++) {
                const element = getDetails[index];
                total += element.earnmoney
            }
        }
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"我的推荐"} color={"#686f78"} />
                <ScrollView style={{ flex: 1, }}>
                    <View style={styles.userProfile}>
                        <View style={styles.base}>
                            <Image style={styles.userPic} source={uri == '' ? require('../../images/avatar.png') : { uri: uri }} />
                            <View style={styles.gap}>
                                <View>
                                    <Text style={styles.name}>
                                        {userInfo.nick}
                                        <Text style={styles.smallName}>ID：{id}</Text>
                                    </Text>
                                </View>
                                <View style={styles.children}>
                                    <Text style={styles.fz18}>分润：90% 18级分销</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.handleTabControl('tj')
                        }}>
                            <View>
                                <Text style={styles.btn}>推广码</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.proxy}>
                        <View style={styles.item}>
                            <Text style={styles.name}>{total.toFixed(2)}元</Text>
                            <Text style={styles.fz20}>昨日佣金</Text>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}>
                            <Text style={styles.name}>{getProxy.length}人</Text>
                            <Text style={styles.fz20}>我的下级</Text>
                        </View>
                    </View>
                    <View>
                        <Image source={require('../../images/box-shadow.png')} style={{ height: 10, resizeMode: 'cover' }}></Image>
                    </View>
                    <View style={styles.tabControl}>
                        <TouchableOpacity style={styles.tabControlItem} onPress={() => { this.handleTabControl('xx') }}>
                            <View style={styles.tabControlItemF}>
                                <Text style={styles.tabControlItemText}>系统消息</Text>
                                {selectedTab == 'xx' && <View style={styles.tabControlItemBar}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabControlItem} onPress={() => { this.handleTabControl('xj') }}>
                            <View style={styles.tabControlItemF}>
                                <Text style={styles.tabControlItemText}>我的代理</Text>
                                {selectedTab == 'xj' && <View style={styles.tabControlItemBar}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabControlItem} onPress={() => { this.handleTabControl('fh') }}>
                            <View style={styles.tabControlItemF}>
                                <Text style={styles.tabControlItemText}>分润明细</Text>
                                {selectedTab == 'fh' && <View style={styles.tabControlItemBar}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabControlItem} onPress={() => { this.handleTabControl('tj') }}>
                            <View style={styles.tabControlItemF}>
                                <Text style={styles.tabControlItemText}>推荐海报</Text>
                                {selectedTab == 'tj' && <View style={styles.tabControlItemBar}></View>}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {
                            selectedTab == 'tj' ? this.selectedTabTarget_tj() : selectedTab == 'xx' ? this.selectedTabTarget_xx() : selectedTab == 'xj' ? this.selectedTabTarget_xj() : this.selectedTabTarget_fh()
                        }
                    </View>
                    <Modal
                        visible={shareVisible}
                        animationType={'fade'}
                        onRequestClose={() => {
                            this.setState({
                                shareVisible: false,
                            })
                        }}
                    >
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                shareVisible: false,
                            })
                        }}
                            style={{ flex: 1,height:100}}
                        >
                            <WebView
                                source={{ uri: currentUri }}
                                style={{ flex: 1}}
                                startInLoadingState={true}
                            >
                            </WebView>
                        </TouchableOpacity>
                    </Modal>
                </ScrollView>
            </View >
        )
    }
    handleTabControl = (selectedTab) => {
        this.setState({
            selectedTab
        })
    }
    selectedTabTarget_xx = () => {
        const { getMessage, isload } = this.state
        return (
            <View>
                {isload == false ? (<View style={[styles.listContainer, { marginTop: 10 }]}><ActivityIndicator color={'#ccc'} /><View style={{ marginTop: 10 }}><Text>正在加载中...</Text></View></View>) : <FlatList
                    data={getMessage}
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this.setState({
                            loadMoreStatus: 1
                        })
                        this.fetchData('getMessage');
                    }}
                    renderItem={({ item, index }) => (
                        <View style={styles.selectedTabTarget_xx}>
                            <Image source={require('../../images/list-icon.png')} style={styles.selectedTabTarget_xx_img} />
                            <View style={styles.selectedTabTarget_xx_text_gap}>
                                <Text style={styles.selectedTabTarget_xx_text}>{item.msg}</Text>
                            </View>
                        </View>
                    )}

                    ListFooterComponent={() => {
                        return (
                            this.state.loadMoreStatus ? (
                                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <ActivityIndicator color={'#ccc'} />
                                    <View style={{ marginLeft: 5, }}>
                                        <Text>正在加载更多数据...</Text>
                                    </View>
                                </View>
                            ) : (
                                    <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5, }}>没有更多数据了</Text>
                                    </View>
                                )
                        )
                    }}
                />
                }
            </View>
        )
    }
    fetchData = (key, id) => {
        // getMessage
        // getDetails
        // getProxy
        // getProxyConfirm

        fetch(`http://118.123.22.134:10000/${key}/${id}`, {
            method: 'GET',
        }).then(response => response.json())
            .then(json => {
                console.log(json);

                if (json.status) {
                    if (json.msg.length != 0) {
                        this.setState({
                            [key]: json.msg,
                            isload: true,
                        })
                    } else {
                        this.setState(({
                            isload: true
                        }))
                    }
                }
                this.setState({
                    loadMoreStatus: 0
                })
            }).catch((error) => {

                console.log(error);
            })
    }
    selectedTabTarget_xj = () => {
        const { getProxy, isload } = this.state
        return (
            <View>
                {isload == false ? (<View style={[styles.listContainer, { marginTop: 10 }]}><ActivityIndicator color={'#ccc'} /><View style={{ marginTop: 10 }}><Text>正在加载中...</Text></View></View>) : <FlatList
                    data={getProxy}
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this.setState({
                            loadMoreStatus: 1
                        })
                        this.fetchData('getProxy');
                    }}
                    renderItem={({ item, index }) => (
                        <View style={styles.selectedTabTarget_xj}>
                            <View style={styles.selectedTabTarget_xj_l}>
                                {/* <Image source={require('../../images/ic.png')} style={styles.selectedTabTarget_xj_img} /> */}

                                <Image source={{ uri: `http://app.aigcom.com/img/user/${item.id}.jpg` }} style={styles.selectedTabTarget_xj_img} />
                                {/* <Image source={{uri:`http://app.aigcom.com/img/user/654.jpg`}} style={styles.selectedTabTarget_xj_img} /> */}

                                <View style={styles.selectedTabTarget_xj_text_gap}>
                                    <Text style={[styles.selectedTabTarget_xj_text, { paddingLeft: 5 }]} > {item.nickname}</Text>
                                    {/* <Text style={styles.selectedTabTarget_xj_text_small}>今日佣金:{item.data.money}</Text> */}
                                </View>
                            </View>
                            <View>
                                <Text>{item.registDate}</Text>
                            </View>
                        </View>
                    )}

                    ListFooterComponent={() => {
                        return (
                            this.state.loadMoreStatus ? (
                                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <ActivityIndicator color={'#ccc'} />
                                    <View style={{ marginLeft: 5, }}>
                                        <Text>正在加载更多数据...</Text>
                                    </View>
                                </View>
                            ) : (
                                    <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5, }}>没有更多数据了</Text>
                                    </View>
                                )
                        )
                    }}
                />
                }
                {/* <FlatList
                        data={[
                            { key: 1, data: { name: '花好月圆', money: '16.5元', date: '18-10-31' }, },
                            { key: 2, data: { name: '专修哈士奇', money: '16.5元', date: '18-10-31' }, },
                            { key: 3, data: { name: '德邦商城', money: '16.5元', date: '18-10-31' }, },
                        ]}
                        renderItem={({ item, index }) => (
                            <View style={styles.selectedTabTarget_xj}>
                                <View style={styles.selectedTabTarget_xj_l}>
                                    <Image source={require('../../images/ic.png')} style={styles.selectedTabTarget_xj_img} />
                                    <View style={styles.selectedTabTarget_xj_text_gap}>
                                        <Text style={[styles.selectedTabTarget_xj_text, { paddingLeft: 5 }]} > {item.data.name}</Text> */}
                {/* <Text style={styles.selectedTabTarget_xj_text_small}>今日佣金:{item.data.money}</Text> */}
                {/* </View>
                                </View>
                                <View>
                                    <Text>{item.data.date}</Text>
                                </View>
                            </View>
                        )} */}
                {/* /> */}
            </View>
        )
    }
    selectedTabTarget_fh = () => {
        const { getDetails, isload } = this.state
        return (

            <View>

                {isload == false ? (<View style={[styles.listContainer, { marginTop: 10 }]}><ActivityIndicator color={'#ccc'} /><View style={{ marginTop: 10 }}><Text>正在加载中...</Text></View></View>) : <FlatList
                    data={getDetails}
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this.setState({
                            loadMoreStatus: 1
                        })
                        this.fetchData('getDetails');
                    }}
                    renderItem={({ item, index }) => (
                        <View style={styles.selectedTabTarget_xx}>
                            <Image source={require('../../images/list-icon.png')} style={styles.selectedTabTarget_xx_img} />
                            <View style={[styles.selectedTabTarget_xx_text_gap, styles.selectedTabTarget_fh]}>
                                <Text style={styles.selectedTabTarget_xx_text}>获得{item.fromparentcls}级分润：{item.earnmoney} 元，来自用户:{item.fromparentid}.</Text>
                                <Text style={styles.selectedTabTarget_xx_text}>
                                    {item.adddate}
                                </Text>
                            </View>
                        </View>
                    )}

                    ListFooterComponent={() => {
                        return (
                            this.state.loadMoreStatus ? (
                                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <ActivityIndicator color={'#ccc'} />
                                    <View style={{ marginLeft: 5, }}>
                                        <Text>正在加载更多数据...</Text>
                                    </View>
                                </View>
                            ) : (
                                    <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5, }}>没有更多数据了</Text>
                                    </View>
                                )
                        )
                    }}
                />
                }
            </View>
            //      <FlatList
            //      data={[
            //          { key: 1, data: { levelOne: '1级流水,39921.78', levelTwo: '分润:399金币', date: '18-10-31' } },
            //          { key: 2, data: { levelOne: '1级流水,39921.78', levelTwo: '分润:399金币', date: '18-10-31' } },
            //          { key: 3, data: { levelOne: '1级流水,39921.78', levelTwo: '分润:399金币', date: '18-10-31' } },
            //      ]}
            //      renderItem={({ item, index }) => (
            //          <View style={styles.selectedTabTarget_xx}>
            //              <Image source={require('../../images/list-icon.png')} style={styles.selectedTabTarget_xx_img} />
            //              <View style={[styles.selectedTabTarget_xx_text_gap, styles.selectedTabTarget_fh]}>
            //                  <Text style={styles.selectedTabTarget_xx_text}>{item.data.levelOne + item.data.levelTwo}</Text>
            //                  <Text style={styles.selectedTabTarget_xx_text}>
            //                      {item.data.date}
            //                  </Text>
            //              </View>
            //          </View>
            //      )}
            //  />
        )
    }
    selectedTabTarget_tj = () => {
        const { url, url2, id, clipboard } = this.state;

        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1, padding: 10 }} onPress={() => {
                        this.setState({
                            shareVisible: true,
                            currentUri: url
                        })
                    }}>

                        <WebView source={{ uri: url }} style={[{ flex: 1, height: 220 }]}></WebView>

                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, padding: 10 }} onPress={() => {
                        this.setState({
                            shareVisible: true,
                            currentUri: url2
                        })
                    }}>
                        <WebView source={{ uri: url2 }} style={[{ flex: 1, height: 220 }]}></WebView>

                    </TouchableOpacity>
                </View>

                <View style={styles.selectedTabTarget_tj_text_container}>
                    <View style={styles.selectedTabTarget_tj_text_m}>
                        {/* <Text style={styles.selectedTabTarget_tj_text_c}>2018最火爆、最好玩、最刺激的【派派社交 红包神器】，几千人在线玩，每天随便撸几百块！</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>扫雷福利嗨翻天</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>无押金 无免死 无外挂</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>还在做众发，九州，棋牌？</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>棋牌流水一万返佣金70元,还排线</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>派派社交推荐下级充值立送现金！</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>平台让利70%给代理们</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>佣金可游戏可提现</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>提现秒到账，努力推广日赚几千上万元不是梦</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>派派社交APP下载地址：地址：https://en39.com/paip</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>推荐码:{id}(一定要填哦)</Text>
                        <Text style={styles.selectedTabTarget_tj_text_c}>火爆推广月赚十万元就这么简单</Text> */}
                        {
                            clipboard.map((value, index) => <Text style={styles.selectedTabTarget_tj_text_c} key={index}>{value}</Text>)
                        }
                    </View>


                    <TouchableOpacity onPress={() => {
                        Clipboard.setString(clipboard.toString().replace(/,/g, '\n'));
                        Toast.showShortCenter('复制成功!')
                    }}>
                        <View style={styles.selectedTabTarget_tj_pic_btn}>
                            <Text style={styles.selectedTabTarget_tj_pic_btn_text}>复制文字</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    requestExternalStoragePermission = async (url) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                _Download(url)
            } else {
                Toast.showShortCenter('请打开应用程序的读写手机存储的权限,保存失败!')
            }
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };
}

function _Download(uri) {
    if (!uri) return null;
    return new Promise((resolve, reject) => {
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
        const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
        const formUrl = uri;
        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            // begin: (res) => {
            //     // console.log('begin', res);
            //     // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');

            // },
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('success', res);
                console.log('file://' + downloadDest)
                var promise = CameraRoll.saveToCameraRoll(downloadDest);
                promise.then(function (result) {
                    Toast.showShortCenter('保存成功！');
                }).catch(function (error) {
                    console.log('error', error);
                    Toast.showShortCenter('保存失败！');
                });
                resolve(res);
            }).catch(err => {
                reject(new Error(err))
            });
        } catch (e) {
            reject(new Error(e))
        }

    })

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },

    listContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width
    },
    userProfile: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userPic: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    base: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gap: {
        paddingLeft: 5,
    },
    name: {
        fontSize: Platform.OS == 'ios' ? FZ(25) : 18,
        color: '#000'
    },
    smallName: {
        fontSize: Platform.OS == 'ios' ? FZ(18) : 14,
    },
    children: {
        paddingTop: 5,
    },
    btn: {
        color: '#c6a46f',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#c6a46f',
        borderWidth: 1 / PixelRatio.get(),
        borderRadius: 10
    },
    fz20: {
        fontSize: Platform.OS == 'ios' ? FZ(20) : 16
    },
    proxy: {
        flexDirection: "row",
        borderTopColor: '#eee',
        borderBottomColor: '#eee',
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        justifyContent: "space-around",
        height: 60,
        alignItems: 'center',
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        height: 40,
        width: 1 / PixelRatio.get(),
        backgroundColor: '#eee'
    },
    tabControl: {
        marginTop: 20,
        flexDirection: 'row',
        borderTopColor: '#eee',
        borderBottomColor: '#eee',
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        height: 50
    },
    tabControlItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabControlItemF: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabControlItemText: {
        color: '#000',
        fontSize: Platform.OS == 'ios' ? FZ(20) : 16,
    },
    tabControlItemBar: {
        position: 'absolute',
        bottom: 0,
        left: 10,
        right: 10,
        height: 2,
        borderRadius: 2,
        backgroundColor: '#c6a46f'
    },
    selectedTabTarget_xx: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectedTabTarget_xx_img: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    selectedTabTarget_xx_text_gap: {
        paddingLeft: 5,
        flex: 1,
    },
    selectedTabTarget_xx_text: {
        textAlignVertical: "center",
        textAlign: 'justify',
        lineHeight: 20,
        includeFontPadding: false,
    },
    selectedTabTarget_xj: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedTabTarget_xj_l: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedTabTarget_xj_img: {
        width: 40,
        height: 40,
        borderRadius: 40,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    selectedTabTarget_xj_text_gap: {
        paddingLeft: 5,
    },
    selectedTabTarget_xj_text: {
        fontSize: Platform.OS == 'ios' ? FZ(20) : 16,
        color: '#000',
    },
    selectedTabTarget_xj_text_small: {
        fontSize: Platform.OS == 'ios' ? FZ(18) : 14,
    },
    selectedTabTarget_fh: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    selectedTabTarget_tj_pic: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    selectedTabTarget_tj_pic_item: {
        padding: 15,
        width: (width - 30) / 2,
        paddingBottom: 0,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedTabTarget_tj_pic_item_image: {
        width: (width - 30) / 2,
        height: 210,
    },
    selectedTabTarget_tj_pic_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 20,
        width: (width - 60) / 2,
        height: 40,
        backgroundColor: '#dadada',
    },
    selectedTabTarget_tj_pic_btn_text: {
        color: '#000',
        fontSize: Platform.OS == 'ios' ? FZ(20) : 20
    },
    selectedTabTarget_tj_text_container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTabTarget_tj_text_m: {
        width: (width - 40),
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    selectedTabTarget_tj_text_c: {
        fontSize: Platform.OS == 'ios' ? FZ(20) : 16,
        color: '#000',
    },
    fz18: {
        fontSize: Platform.OS == 'ios' ? FZ(18) : 16,
    }
})
