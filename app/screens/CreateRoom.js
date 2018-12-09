import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, FlatList, RefreshControl, ActivityIndicator, PixelRatio, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Toast from '@remobile/react-native-toast';
import qs from 'qs';
const { width } = Dimensions.get('window');
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            detail: '',
            unDead: '',
            lastPacketUser: '',
            feeAdd: '',
            modal_show: false
        }
    }
    render() {

        var selectOption = []
        for (let index = 5; index < 21; index++) {
            selectOption.push(
                <TouchableHighlight underlayColor={'#ccc'} activeOpacity={0.6} onPress={() => { this.selectRate(index) }} key={index}>
                    <View style={{ height: 40, borderBottomColor: '#ccc', borderBottomWidth: 1, }}>
                        <Text style={{ textAlign: 'center', lineHeight: 30 }}>{index + '%'}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"创建房间"} color={"#686f78"} />
                <View style={{ padding: 15, }}>
                    <View style={[styles.fdr]}>
                        <View style={styles.w100}>
                            <Text style={styles.fz16}>房间ID</Text>
                        </View>
                        <TextInput
                            onChangeText={(text) => {
                                this.setState({
                                    id: text
                                })
                            }}
                            style={[styles.flex_1, styles.textInput]}
                            underlineColorAndroid="transparent"
                            keyboardType={'numeric'}
                            placeholder='请输入六位数ID'></TextInput>
                    </View>
                    <View style={[styles.fdr]}>
                        <View style={styles.w100}>
                            <Text style={styles.fz16}>房间名称</Text>
                        </View>
                        <TextInput onChangeText={(text) => {
                            this.setState({
                                name: text
                            })
                        }}
                            style={[styles.flex_1, styles.textInput]}
                            underlineColorAndroid="transparent"></TextInput>
                    </View>
                    <View style={[styles.fdr]}>
                        <View style={styles.w100}>
                            <Text style={styles.fz16}>房间简介</Text>
                        </View>
                        <TextInput onChangeText={(text) => {
                            this.setState({
                                detail: text
                            })
                        }}
                            style={[styles.flex_1, styles.textInput, { height: 80, textAlignVertical: 'top', paddingTop: 10, paddingBottom: 10, }]}
                            underlineColorAndroid="transparent"
                            multiline={true}></TextInput>
                    </View>
                    <View style={[styles.fdr]}>
                        <View style={styles.w100}>
                            <Text style={styles.fz16}>手续费</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                this.setState({
                                    modal_show: true
                                })
                            }}
                            style={[styles.flex_1, styles.textInput, { justifyContent: "center", height: 30 }]}
                        >
                            <View>
                                <Text style={{ textAlign: 'right', color: '#000' }}>
                                    {this.state.feeAdd + '%'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        transparent={true}
                        visible={this.state.modal_show}
                        animationType={'slide'}
                        onRequestClose={this.selectRate}>
                        <ScrollView style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, backgroundColor: '#fff' }}>
                            {selectOption}
                        </ScrollView>

                    </Modal>
                    {/* <View style={[styles.fdr]}>
                        <View style={styles.w100}>
                            <Text style={styles.fz16}>免死账号</Text>
                        </View>
                        <TextInput onChangeText={(text) => {
                            this.setState({
                                unDead: text
                            })
                        }}
                            style={[styles.flex_1, styles.textInput]}
                            underlineColorAndroid="transparent"
                            keyboardType={'numeric'}></TextInput>
                    </View>
                    <View style={[styles.fdr]}>
                        <View style={styles.w100}>
                            <Text style={styles.fz16}>扫尾账号</Text>
                        </View>
                        <TextInput onChangeText={(text) => {
                            this.setState({
                                lastPacketUser: text
                            })
                        }}
                            style={[styles.flex_1, styles.textInput]}
                            underlineColorAndroid="transparent"
                            keyboardType={'numeric'}></TextInput>
                    </View> */}
                    <View style={{ paddingTop: 15, paddingBottom: 30, }}>
                        <Text>开房须知：请设置以上参数创建房间。创建房间成功后，会从您的账户扣除200金币。</Text>
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={this.fetchData}>
                            <View style={{ width: 200, backgroundColor: '#62c54e', borderRadius: 5, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>创建房间</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    selectRate(index) {
        this.setState({
            feeAdd: index,
            modal_show: false
        })
    }
    componentDidMount() {
    }
    fetchData = () => {
        StorageUtil.get('tokeninfo', (err, obj) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    token: obj
                })
                const { accessToken } = obj;
                const owner = obj.id
                const { id, name, detail, feeAdd } = this.state
                //房间id冲突现在修改
                var argList = {
                    action: 'createroom',
                    id,
                    name,
                    catalog: 'C01',
                    type: 'G04',
                    owner,
                    limitNum: 200,
                    hot: 121,
                    status: 0,
                    feeAdd: parseInt(feeAdd) / 100,
                    sumFee: 0,
                    detail,
                    sumpack: 0,
                    unDead: '',
                    lastPacketUser: '',
                    conf_min_money: 10,
                    conf_max_money: 500,
                    conf_rate: 1.5,
                    conf_min_size: 7,
                    conf_max_size: 7,
                    conf_expired: 180,
                    varify_aToken: accessToken
                }
                console.log(qs.stringify(argList));
                // var str = 
                fetch(`http://118.123.22.134:8081/CreateRoom/api.php?${qs.stringify(argList)}`, {
                    method: 'get',
                    // body:qs.stringify(argList)
                }).then(response => response.json())
                    .then(json => {
                        Toast.showShortCenter(json.msg)
                    }).catch((error) => {
                        console.log(error);
                    })

            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed'
    },
    fdr: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        paddingBottom: 10,
    },
    flex_1: {
        flex: 1,
        maxWidth: 200,
    },
    textInput: {
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#fff",
        height: 30
    },
    fz16: {
        fontSize: 18,
        color: '#000'
    },
    w100: {
        width: 100
    }
})
