import React, { Component } from 'react'
import { Text, View, ScrollView, Image, Dimensions, StyleSheet, PixelRatio, TouchableOpacity } from 'react-native'
import CommonTitleBar from '../views/CommonTitleBar'
import StorageUtil from '../utils/StorageUtil';
import CommonLoadingView from '../views/CommonLoadingView';
import Toast from '@remobile/react-native-toast'
import { withNavigation } from 'react-navigation'

const { width } = Dimensions.get('window')
class RoomMoreInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: '',
            gonggao: '',
            name: '',
            roomPeopleList: [],
            showMore: true,
            showPeople: 8,
            isload: true,
            b_isOwner: false,
            psw: '',
            feeAdd: '',
            //群密码
        }
        const didBlurSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.componentDidMount();
            }
        )
    }
    render() {
        const {
            detail,
            gonggao,
            name,
            roomPeopleList,
            showMore,
            showPeople,
            isload,
            b_isOwner,
            psw,
            feeAdd,
        } = this.state

        function renderItem() {
            if (roomPeopleList.length == 0) {
                return <View></View>;
            }
            let elements = []

            for (let index = 0; index < showPeople; index++) {
                const value = roomPeopleList[index];
                elements.push(
                    <View style={styles.pic_group_item} key={index}>
                        <Image style={styles.pic_group_item_iamge} source={value.headImg ? { uri: `http://app.daicui.net/${value.headImg}` } : require('../../images/ic.png')}></Image>
                        <Text
                            numberOfLines={1}
                            style={styles.pic_group_item_text}>{value.nickname}</Text>
                    </View>
                )
            }
            return elements;

        }
        function addNoneView() {
            let elements = []
            for (let index = 0; (showPeople + 2 + index) % 5 != 0; index++) {
                elements.push(
                    <View style={styles.pic_group_item} key={showPeople + 2 + index}></View>
                )
            }

            return elements;
        }

        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
                <CommonTitleBar nav={this.props.navigation} title={`聊天信息(${roomPeopleList.length})`} />
                {
                    isload ? <CommonLoadingView hintText='数据正在获取中...'></CommonLoadingView> : <ScrollView>
                        <View style={styles.pic_group}>
                            {
                                renderItem()
                            }
                            {/* <View style={styles.pic_group_item}>
                            <Image style={styles.pic_group_item_iamge} source={require('../../images/ic.png')}></Image>
                            <Text
                                numberOfLines={1}
                                style={styles.pic_group_item_text}>羞涩的老阿姨</Text>
                        </View> */}

                            <View style={[styles.pic_group_item, { alignItems: 'center', justifyContent: 'center', height: (width - 80) / 5, borderColor: '#bababa', borderWidth: 1 / PixelRatio.get(), paddingBottom: 0, }]}>
                                <Image style={[styles.pic_group_item_iamge, { width: width / 10, height: width / 10 }]} source={require('../../images/add.png')}></Image>
                            </View>
                            <View style={[styles.pic_group_item, { alignItems: 'center', justifyContent: 'center', height: (width - 80) / 5, borderColor: '#bababa', borderWidth: 1 / PixelRatio.get(), paddingBottom: 0, }]}>
                                <Image style={[styles.pic_group_item_iamge, { width: width / 10, height: width / 10 }]} source={require('../../images/min.png')}></Image>
                            </View>
                            {
                                addNoneView()
                            }
                        </View>
                        {
                            showMore ? <TouchableOpacity onPress={() => { this.handleChangeListShowPeople() }} activeOpacity={0.75}>
                                <View style={{ padding: 15, borderTopColor: '#ebebeb', borderTopWidth: 1 / PixelRatio.get() }}><Text style={{ textAlign: "center" }}>显示更多</Text></View>
                            </TouchableOpacity> : <View style={{ height: 15 }}></View>
                        }
                        <View style={{ height: 30, backgroundColor: '#ebebeb' }}></View>
                        <View style={[styles.pl15, styles.pr15]}>
                            <TouchableOpacity onPress={() => {
                                if (b_isOwner) {
                                    this.props.navigation.navigate('RoomMoreInfoModify', { value: name, action: 'changename', roomId: this.props.navigation.state.params.towebUrl.replace('http://app.daicui.net/#/tab/rooms/', '') });
                                    //over
                                }
                            }}>
                                <View style={[styles.bdbf2f2f2, styles.jcsb, styles.fdr]}>
                                    <Text style={[styles.c565656]}>群聊名称</Text>
                                    <Text style={[styles.cababab]}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                            {b_isOwner == true &&
                                (
                                    < TouchableOpacity onPress={() => {
                                        if (b_isOwner) {
                                            this.props.navigation.navigate('RoomMoreInfoModify', { value: psw, action: 'changepsw', roomId: this.props.navigation.state.params.towebUrl.replace('http://app.daicui.net/#/tab/rooms/', '') });
                                            //over
                                        }
                                    }}>
                                        <View style={[styles.bdbf2f2f2, styles.jcsb, styles.fdr, { justifyContent: 'flex-start' }]}>
                                            <Text style={[styles.c565656]}>群密码</Text>
                                            <Text style={[styles.cababab]}>{psw}<Text style={{ fontSize: 14 }}>(可显示给群成员看)</Text></Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity onPress={() => {

                                // http://118.123.22.134:8081/CreateRoom/api.php?action=changegg&id=640&roomId=xdd0001&newthis=lalalalalalala&varify_aToken=ed03c2888635475ab8a01cf26a59bf69
                                if (b_isOwner) {
                                    this.props.navigation.navigate('RoomMoreInfoModify', { value: gonggao, action: 'changegg', roomId: this.props.navigation.state.params.towebUrl.replace('http://app.daicui.net/#/tab/rooms/', '') });
                                    //over
                                }
                            }}>
                                <View style={[styles.bdbf2f2f2, styles.jcsb, styles.fdr, styles.fdc]}>
                                    <Text style={[styles.c565656]}>群公告</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.cababab]}>{gonggao}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (b_isOwner) {
                                    this.props.navigation.navigate('RoomMoreInfoModify', { value: detail, action: 'changedetail', roomId: this.props.navigation.state.params.towebUrl.replace('http://app.daicui.net/#/tab/rooms/', '') });
                                    //over
                                }
                            }}>
                                <View style={[styles.bdbf2f2f2, styles.jcsb, styles.fdr, styles.fdc]}>
                                    <Text style={[styles.c565656]}>群规则</Text>
                                    <Text style={[styles.cababab]}>{detail}</Text>
                                </View>
                            </TouchableOpacity>

                            {b_isOwner == true &&
                                (
                                    <TouchableOpacity onPress={() => {
                                        if (b_isOwner) {
                                            this.props.navigation.navigate('RoomMoreInfoModify', { value: feeAdd, action: 'changefee', roomId: this.props.navigation.state.params.towebUrl.replace('http://app.daicui.net/#/tab/rooms/', '') });
                                            //over
                                        }
                                    }}>
                                        <View style={[styles.bdbf2f2f2, styles.jcsb, styles.fdr]}>
                                            <Text style={[styles.c565656]}>房间抽税设置:</Text>
                                            <Text style={[styles.cababab]}>{parseFloat(feeAdd) * 100}% <Text style={{ fontSize: 14 }}>(群主抽税分润提成)</Text></Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            <TouchableOpacity>
                                <View style={[styles.bdbf2f2f2, styles.jcsb, styles.fdr, styles.fdc]}>
                                    <Text style={[styles.c565656]}>接龙规则</Text>
                                    <View>
                                        <Text style={[styles.cababab]}>抢到最大金额输</Text>
                                        <Text style={[styles.cababab]}>抢到最小金额输</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 15, backgroundColor: '#ebebeb' }}>
                            <View style={{ backgroundColor: '#e64240', height: 40, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>删除并退出</Text>
                            </View>
                        </View>
                    </ScrollView>
                }
            </View>
        )
    }
    handleChangeListShowPeople = () => {
        const { roomPeopleList } = this.state;
        console.log(roomPeopleList.length);

        this.setState({
            showPeople: roomPeopleList.length,
            showMore: false,
        })
    }
    componentDidMount() {
        StorageUtil.get('tokeninfo', (error, object) => {
            if (!error && object) {
                this.setState({ tokeninfo: object });
                //设置本地存储
                const { accessToken, id, userId } = object;

                const roomId = this.props.navigation.state.params.towebUrl.replace('http://app.daicui.net/#/tab/rooms/', '');

                fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=getroommem&id=${id}&roomId=${roomId}&varify_aToken=${accessToken}`)
                    .then(json => json.json())
                    .then(
                        data => {
                            this.setState({
                                roomPeopleList: data.msg,
                                showMore: data.msg.length > 8 ? true : false,
                                showPeople: data.msg.length > 8 ? 8 : data.msg.length,
                                isload: false,
                            })
                        }
                    ).catch(err => {
                        this.props.navigation.goBack();
                        Toast.showShortCenter('服务器出错请稍后重试!')
                    })
                fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=getroominfo&id=${id}&roomId=${roomId}&varify_aToken=${accessToken}`)
                    .then(json => json.json())
                    .then(
                        data => {
                            const {
                                detail,
                                gonggao,
                                name,
                                psw,
                                feeAdd
                            } = data.msg[0]
                            this.setState({
                                detail,
                                gonggao,
                                name,
                                psw,
                                feeAdd
                            })
                        }
                    ).catch(err => {
                        Toast.showShortCenter('服务器出错请稍后重试!')
                        this.props.navigation.goBack();
                    })
                //判断是否是管理员咯
                fetch(`http://app.daicui.net/room/${roomId}`, {
                    headers: {
                        "x-access-token": accessToken,
                        "x-access-uid": id
                    },
                    method: 'GET',
                }).then(response => response.json())
                    .then(json => {
                        if (json.body.owner == id) {
                            this.setState({
                                b_isOwner: true
                            })
                        }
                        // owner
                    }).catch((error) => {
                        console.log(error);
                        Toast.showShortCenter('管理员鉴定失败请重试!')
                    })

            }
        });
    }
}
export default withNavigation(RoomMoreInfo)

const styles = StyleSheet.create({
    pic_group: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 15,
        paddingBottom: 0,
    },
    pic_group_item: {
        width: (width - 80) / 5,
        paddingBottom: 15,
    },
    pic_group_item_iamge: {
        width: (width - 80) / 5,
        height: (width - 80) / 5
    },
    pic_group_item_text: {
        flex: 1,
        textAlign: "center",
    },
    c565656: {
        color: '#565656',
        lineHeight: 26,
        fontSize: 18,
        textAlignVertical: 'center',
        includeFontPadding: false,
        padding: 0,
    },
    cababab: {
        color: '#ababab',
        lineHeight: 26,
        fontSize: 16,
        textAlignVertical: 'center',
        includeFontPadding: false,
        padding: 0,
    },
    pl15: {
        paddingLeft: 15,
    },
    pr15: {
        paddingRight: 15,
    },
    bdbf2f2f2: {
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ebebeb',
        paddingTop: 10,
        paddingBottom: 10,
    },
    jcsb: {
        justifyContent: 'space-between'
    },
    fdr: {
        flexDirection: 'row'
    },
    fdc: {
        flexDirection: 'column'
    },
})
