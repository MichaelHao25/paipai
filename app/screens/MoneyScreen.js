import React, { Component } from 'react';
import Toast from '@remobile/react-native-toast';
import Global from '../utils/Global';
import Utils from '../utils/Utils';
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity,PixelRatio,Platform } from 'react-native';
import {
	SW,
	SH,
	FZ,
} from '../utils/ScreenUtil'
const { width } = Dimensions.get('window');

class Money extends Component {
    constructor(props) {
        super(props)

        this.state = {
            token: {},
            body: 0,
        };
        const didBlurSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
              this.componentDidMountD();
              
            }
          );
    };
    render() {
        const { body } = this.state;

        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"钱包"} color={"#686f78"} />
                <View style={styles.list}>
                    <TouchableOpacity activeOpacity={0.99} onPress={() => { 
							this.props.navigation.navigate('WebviewScreen', {
								'towebUrl': 'http://app.daicui.net/#/tab/account/recharge',
								'name': '充值',
							}) }}>
                        <View style={styles.listItem}>
                            <Image style={styles.listItemImg} source={require('../../images/a1.png')}></Image>
                            <Text style={styles.listItemText}>充值</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.listItem}>
                        <Image style={styles.listItemImg} source={require('../../images/a2.png')}></Image>
                        <Text style={styles.listItemText}>余额</Text>
                        <Text style={styles.listItemText}>¥{body == 0 ? '0.0' : body.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.99} onPress={() => { this.turnOnPage('Withdraw') }}>
                        <View style={styles.listItem}>
                            <Image style={styles.listItemImg} source={require('../../images/a3.png')}></Image>
                            <Text style={styles.listItemText}>提现</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.mt}></View>
                <TouchableHighlight underlayColor='#ccc' onPress={() => { this.turnOnPage('RechargeRecords') }}>
                    <View style={[styles.nav,styles.bdb]}>
                        <Text style={styles.fz18}>充值记录</Text>
                        <Image style={styles.navImg} source={require('../../images/ic_right_arrow.png')}></Image>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='#ccc' onPress={() => { this.turnOnPage('WithdrawRecords') }}>
                    <View style={styles.nav}>
                        <Text style={styles.fz18}>提现记录</Text>
                        <Image style={styles.navImg} source={require('../../images/ic_right_arrow.png')}></Image>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    turnOnPage(pageName, params) {
        if (Utils.isEmpty(params)) {
            this.props.navigation.navigate(pageName);
        } else {
            this.props.navigation.navigate(pageName, params);
        }
    }
    componentDidMountD() {
        StorageUtil.get('tokeninfo', (err, obj) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    token: obj
                })
                const { accessToken, id } = obj;
                fetch('http://app.daicui.net/user/balance', {
                    headers: {
                        "x-access-token": accessToken,
                        "x-access-uid": id
                    },
                    method: 'GET',
                }).then(response => response.json())
                    .then(json => {
                        const { body,
                            code,
                            msg } = json;
                        if (code == 200) {
                            this.setState({
                                body
                            })
                        }
                    }).catch((error) => {
                        console.log(error);
                    })

            }
        })
    }
}

export default Money
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#f5f5f5'
    },
    list: {
        flexDirection: 'row',
    },
    listItem: {
        flex: 1,
        height: 140,
        alignItems: 'center',
        backgroundColor: '#686f78',
    },
    listItemText: {
        color: '#fff'
    },
    listItemImg: {
        marginTop: 20,
        marginBottom: 5,
        height: 40,
        resizeMode: "contain",
    },
    mt: {
        marginTop: 20,
    },
    nav: {
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomColor: '#ccc',
    },
    bdb:{
        borderBottomWidth: 1/PixelRatio.get(),
    },
    navImg: {
        width: 10,
        height: 10,
        resizeMode: "contain"
    },
    fz18:{
        fontSize:Platform.OS=='ios'?FZ(18):16,
    }
})
