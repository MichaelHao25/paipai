import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, Linking } from 'react-native';



const { width, height } = Dimensions.get('window')
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recharge: 0,
            layoutShow: false,
        }
    }
    render() {
        const { recharge, layoutShow } = this.state
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"充值"} color={"#686f78"} />
                <TouchableOpacity activeOpacity={0.99} onPress={() => { this.handleSetRecharge(10) }}>
                    <View style={recharge == 10 ? styles.itemSelect : styles.item}><Text style={recharge == 10 ? styles.itemSelectText : ''}>￥10</Text></View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.99} onPress={() => { this.handleSetRecharge(50) }}>
                    <View style={recharge == 50 ? styles.itemSelect : styles.item}><Text style={recharge == 50 ? styles.itemSelectText : ''}>￥50</Text></View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.99} onPress={() => { this.handleSetRecharge(100) }}>
                    <View style={recharge == 100 ? styles.itemSelect : styles.item}><Text style={recharge == 100 ? styles.itemSelectText : ''}>￥100</Text></View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.99} onPress={() => { this.handleSetRecharge(500) }}>
                    <View style={recharge == 500 ? styles.itemSelect : styles.item}><Text style={recharge == 500 ? styles.itemSelectText : ''}>￥500</Text></View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.99} onPress={() => { this.handleEnterRechargeNumber() }}>
                    <View><Text style={styles.button}>submit</Text></View>
                </TouchableOpacity>
                <View style={layoutShow ? styles.pay : styles.payHidden}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this.handleSubmit() }}>
                        <View style={styles.payButton}>
                            <Text style={styles.payButtonText}>支付宝(扫码)</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this.handleSubmit() }}>
                        <View style={styles.payButton}>
                            <Text style={styles.payButtonText}>微信</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this.handleSubmit() }}>
                        <View style={styles.payButton}>
                            <Text style={styles.payButtonText}>支付宝</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    handleSetRecharge = (recharge) => {
        this.setState({
            recharge,
        })
    }
    handleEnterRechargeNumber = () => {
        // Linking.openURL(url).catch(err => console.error('An error occurred', err));

        this.setState({
            layoutShow: true,
        })

    }
    handleSubmit=()=>{
        
    }
    // componentDidMount() {
    //     StorageUtil.get('tokeninfo', (err, obj) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             this.setState({
    //                 token: obj
    //             })
    //             const { accessToken, id } = obj;
    //             fetch('http://app.daicui.net/user/rechargeRecords?pageNo=1&pageSize=20', {
    //                 headers: {
    //                     "x-access-token": accessToken,
    //                     "x-access-uid": id
    //                 },
    //                 method: 'GET',
    //             }).then(response => response.json())
    //                 .then(json => {
    //                     if (json.code == 200) {
    //                         console.log(json);
    //                         if (json.body.length == 0) {
    //                             this.setState({
    //                                 list: ['没有记录']
    //                             })
    //                         } else {
    //                             this.setState({
    //                                 list: json.body
    //                             })
    //                         }
    //                     }
    //                 }).catch((error) => {
    //                     console.log(error);
    //                 })

    //         }
    //     })
    // }

}
var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        borderBottomWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        height: 30,
    },
    itemSelect: {
        borderBottomWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        height: 30,
        backgroundColor: '#666',
    },
    itemSelectText: {
        color: '#fff'
    },
    button: {
        textAlign: 'center',
        height: 30,
        lineHeight: 30
    },
    payHidden: {
        display: 'none'
    },
    pay: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: 'center',
        paddingBottom: 30,
    },
    payButton: {
        width: width * 0.8,
        height: 40,
        backgroundColor: '#eee',
        marginTop: 10,
        justifyContent: "center"
    },
    payButtonText: {
        textAlign: "center",
    }

})
