import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, Dimensions, TouchableOpacity, ScrollView ,Platform,KeyboardAvoidingView} from 'react-native'
import Toast from '@remobile/react-native-toast'
import {
	FZ,
	SW,
	SH
} from '../utils/ScreenUtil'

const { width, height } = Dimensions.get('window')
export default class RedMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            b_redMoneyType: 'saolei',
            //saolei
            // jielong
            i_redNumber: '',
            i_redTotalMoney: '',
            i_description: '',
        }
    }
    componentDidMount() {
        this.setState({
            b_redMoneyType: this.props.b_fuliRedMoney ? this.props.b_fuliRedMoney : this.props.roomType,
            i_redNumber: (this.props.b_fuliRedMoney ? this.props.b_fuliRedMoney : this.props.roomType) == 'saolei' ? this.props.red_conf_max_size : ''
        })
    }
    render() {
        const { b_redMoneyType, i_redNumber, i_redTotalMoney, i_description } = this.state;
        const bg_active = (i_redTotalMoney != '' && i_redNumber != '') ? '#d96845' : '#e2c2b8';
        return (
            <ScrollView>
                <View style={{marginTop: Platform.OS=='ios'?30:0,height: height - 30, flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f1f1f1', paddingLeft: 15, paddingRight: 15 }}>
                    {/* //  backgroundColor: '#f1f1f1', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15, }} */}
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 60, alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => {
                                this.props.closeRedMoney();
                            }
                            }>
                                <View style={{flexDirection:'row',alignItems: 'center',}}>
                                    <Image source={require('../../images/back.png')} style={{width:20,resizeMode:'center'}}></Image>
                                    <Text style={[styles.red_303030, styles.fz18]}>发红包</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <View>
                                <Text style={[styles.red_303030, styles.fz18,]}></Text>
                            </View> */}
                            <TouchableOpacity>
                                <View style={{ alignItems: 'center', }}>
                                    <Image
                                        source={require('../../images/more_read_block.png')}
                                        style={{ width: 30, height: 30 }}
                                    ></Image>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 10, }}>
                            <View style={{ height:60,flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, paddingTop: 0, paddingBottom: 0, borderRadius: 5, alignItems: 'center', }}>
                                <View style={{ flexDirection: 'row' ,height:60,alignItems:'center'}}>
                                    <View style={{ height: 20, width: 20, backgroundColor: '#f4bd4c', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: 5, }}>
                                        <Text style={styles.red_fff}>拼</Text>
                                    </View>
                                    <Text style={[styles.red_000, styles.fz16]}>总金额</Text>
                                </View>
                                <TextInput
                                    placeholder="0.00"
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#c7c7cc'
                                    keyboardType={'numeric'}
                                    value={i_redTotalMoney}
                                    onChangeText={text => this.setState({
                                        i_redTotalMoney: text
                                    })}
                                    style={[styles.red_000, styles.fz16, { flex: 1, textAlign: 'right' }]}
                                ></TextInput>
                                <View>
                                    <Text style={[styles.red_000, styles.fz16]}>元</Text>
                                </View>
                            </View>
                            <View style={{ height: 20, paddingLeft: 10, }}></View>
                            <View style={{ height:60,flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, paddingTop: 0, paddingBottom: 0, borderRadius: 5, alignItems: 'center', }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.red_000, styles.fz16]}>红包个数</Text>
                                </View>
                                <TextInput
                                    placeholder="填写个数"
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#c7c7cc'
                                    keyboardType={'numeric'}
                                    style={[styles.red_000, styles.fz16, { flex: 1, textAlign: 'right' }]}
                                    editable={b_redMoneyType == 'saolei' ? false : true}
                                    value={i_redNumber}
                                    onChangeText={text => this.setState({
                                        i_redNumber: text
                                    })}
                                ></TextInput>
                                <View>
                                    <Text style={[styles.red_000, styles.fz16]}>个</Text>
                                </View>
                            </View>
                            <View style={{ height: 20, paddingLeft: 10, }}>
                                {/* <Text style={[styles.red_9f9f9f, styles.fz14]}>本群共9人</Text> */}
                            </View>
                            <View style={{ height:60,flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, paddingTop: 0, paddingBottom: 0, borderRadius: 5, alignItems: 'center', }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.red_000, styles.fz16]}>留言</Text>
                                </View>
                                <TextInput
                                    placeholder={b_redMoneyType == 'saolei' ? '请输入地雷点数(0-9)' : '恭喜发财大吉大利'}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#c7c7cc'
                                    keyboardType={b_redMoneyType == 'saolei' ? 'numeric' : 'default'}
                                    style={[styles.red_000, styles.fz16, { flex: 1, textAlign: 'right' }]}
                                    value={i_description}
                                    onChangeText={text => this.setState({
                                        i_description: text
                                    })}
                                ></TextInput>
                            </View>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 5, alignItems: 'center', }}>
                                <TextInput
                                    placeholder={b_redMoneyType == 'saolei' ? '请输入地雷点数(0-9)' : '恭喜发财大吉大利'}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#c7c7cc'
                                    multiline={true}
                                    keyboardType={b_redMoneyType == 'saolei' ? 'numeric' : 'default'}
                                    numberOfLines={3}
                                    style={[styles.red_000, styles.fz16, { flex: 1, textAlignVertical: 'top' }]}
                                    value={i_description}
                                    onChangeText={text => this.setState({
                                        i_description: text
                                    })}
                                ></TextInput>
                            </View> */}
                            <View style={{ paddingTop: SH(10), paddingBottom: SH(10) }}>
                                <Text style={[styles.red_303030, { textAlign: 'center', alignItems: 'flex-start', }]}>
                                    <Text style={{ fontSize: 30, textAlignVertical: 'top' }}>¥</Text>
                                    <Text style={{ fontSize: 50 }}>{isNaN((parseInt(i_redTotalMoney))) ? '0.00' : (parseInt(i_redTotalMoney)).toFixed(2)}</Text>
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={
                                    () => {
                                        const {
                                            i_redNumber,
                                            i_redTotalMoney,
                                            i_description,
                                            b_redMoneyType
                                        } = this.state;
                                        //description: ""
                                        //money: 100
                                        //moneyLed: "100.00"
                                        //number: 7
                                        console.log(1);


                                        if (b_redMoneyType == 'saolei') {
                                            if (parseInt(i_redTotalMoney) % 10 != 0) {
                                                Toast.showShortCenter('金额是10的倍数必须!')
                                                return;
                                            }
                                            if (parseInt(i_description) > 10 || i_description == '') {
                                                Toast.showShortCenter('地雷点数必须是0-9!')
                                                return;
                                            }

                                        }
                                        if (isNaN(parseInt(i_redNumber))) {
                                            Toast.showShortCenter('请正确输入红包的个数!')
                                            return;
                                        }
                                        if (isNaN(parseInt(i_redTotalMoney))) {
                                            Toast.showShortCenter('请正确输入红包的金额!')
                                            return;
                                        }
                                        this.props.closeRedMoney();
                                        this.props.handleSendRedBao({
                                            description: i_description,
                                            money: parseInt(i_redTotalMoney),
                                            moneyLed: parseInt(i_redTotalMoney).toFixed(2).toString(),
                                            number: parseInt(i_redNumber)
                                        })
                                    }
                                }>
                                    <View style={[styles.bg_e2c2b8, { width: width * 0.8, alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 5, }, { backgroundColor: bg_active }]}>
                                        <Text style={[styles.red_fff,styles.fz16]}>塞钱进红包</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                        <Text style={[styles.red_989898, styles.fz16,{ textAlign: 'center' }]}>未领取的红包,将于24H后发起退款</Text>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    red_303030: {
        color: '#303030',
    },
    red_989898: {
        color: '#989898',
    },
    red_9f9f9f: {
        color: '#9f9f9f',
    },
    red_000: {
        color: '#000',
    },
    red_fff: {
        color: '#fff',
    },
    red_5a5a5a: {
        color: '#5a5a5a',
    },
    bg_e2c2b8: {
        backgroundColor: '#e2c2b8',
    },
    fz18: {
        fontSize: Platform.OS=='ios'?FZ(22) :18
    },
    fz16: {
        fontSize: Platform.OS=='ios'?FZ(20) :16
    },
    fz24: {
        fontSize: Platform.OS=='ios'?FZ(28) :24
    },
    fz14: {
        fontSize: Platform.OS=='ios'?FZ(18) :14
    }


});
