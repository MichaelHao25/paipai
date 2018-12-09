import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, TextInput, Alert, PixelRatio } from 'react-native';
import Toast from '@remobile/react-native-toast';

export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            money: '',
            token: '',
        }
    }
    render() {
        const { userId, money } = this.state;
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"转账"} color={"#686f78"} />
                <View style={{ margin: 10, backgroundColor: '#fff', padding: 15, borderRadius: 5,}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Text style={{ width: 30, textAlign: "center" }}>ID:</Text><TextInput placeholder='请输入转入用户的id' keyboardType="numeric" value={userId} onChange={(e) => { this.handleChangeValue(e, 'userId') }} underlineColorAndroid="transparent" style={styles.input} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Text style={{ width: 30, textAlign: "center" }}>¥:</Text><TextInput placeholder='请输入金额' keyboardType="numeric" onChange={(e) => { this.handleChangeValue(e, 'money') }} value={money} underlineColorAndroid="transparent" style={styles.input} />
                    </View>
                    <TouchableOpacity onPress={() => { this.handleConfirm() }} activeOpacity={0.8}>
                        <View style={{ height: 50, backgroundColor: '#51aa38',marginLeft: 20,marginRight: 20,marginTop:20,justifyContent:'center',alignItems:'center',borderRadius: 5, }}>
                            <Text style={{color:'#fff'}}>确认</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    handleChangeValue = (e, name) => {
        this.setState({
            [name]: e.nativeEvent.text
        })

    }
    handlgCancel = () => {
        // console.log('取消了');
        return false;
    }
    handleSubmit = () => {
        const { accessToken, id } = this.state.token;

        const { userId, money } = this.state

        fetch('http://app.daicui.net/user/transfer', {
            headers: {
                "x-access-token": accessToken,
                "x-access-uid": id,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'POST',
            body: JSON.stringify({
                userId: parseInt(userId),
                money: parseInt(money)
            })
        }).then(response => response.json())
            .then(json => {
                console.log(json);
                if (json.code == 200) {
                    Toast.showShortCenter(`${json.msg}`);
                    this.props.navigation.goBack();
                }
            }).catch((error) => {
                console.log(error);
            })
    }
    handleConfirm = () => {

        const { accessToken, id } = this.state.token;
        const { userId, money } = this.state


        if (userId == '' || money == '') {
            Toast.showShortCenter('用户ID和金额不能为空！');
            return;
        }
        if (!money.match(/^\d+?\.\d{1,2}$|^\d*$/)) {
            Toast.showShortCenter('请输入正确的金额!');
            return;
        }

        fetch('http://app.daicui.net/user/getNickName', {
            headers: {
                "x-access-token": accessToken,
                "x-access-uid": id,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'POST',
            body: JSON.stringify({
                uid: parseInt(userId)
            })
        }).then(response => response.json())
            .then(json => {
                console.log(json);
                if (json.code == 200) {
                    Alert.alert('转账确认', `昵称:${json.nickName}\n金额:${money}元`, [
                        { text: '取消', onPress: this.handlgCancel },
                        { text: '确认', onPress: this.handleSubmit },
                    ])
                } else {
                    Toast.showShortCenter(json.msg);
                }
            }).catch((error) => {
                console.log(error);
            })
    }
    componentDidMount() {
        StorageUtil.get('tokeninfo', (err, obj) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    token: obj
                })
                // const { accessToken, id } = obj;
                // fetch('http://app.daicui.net/user/rechargeRecords?pageNo=1&pageSize=20', {
                //     headers: {
                //         "x-access-token": accessToken,
                //         "x-access-uid": id
                //     },
                //     method: 'GET',
                // }).then(response => response.json())
                //     .then(json => {
                //         if (json.code == 200) {
                //             console.log(json);
                //             if (json.body.length == 0) {
                //                 this.setState({
                //                     list: ['没有记录']
                //                 })
                //             } else {
                //                 this.setState({
                //                     list: json.body
                //                 })
                //             }
                //         }
                //     }).catch((error) => {
                //         console.log(error);
                //     })

            }
        })
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    button: {
        textAlign: 'center',
        height: 30,
    },
    input: {
        padding: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#000',
        height: 50,
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5,
    }
})
