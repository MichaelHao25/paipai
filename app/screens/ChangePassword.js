import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, TextInput, Button, Alert, PixelRatio } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from '@remobile/react-native-toast';
import LoadingView from '../views/LoadingView';

import AliyunOSS from 'aliyun-oss-react-native'

AliyunOSS.enableDevMode()

const configuration = {
    maxRetryCount: 3,
    timeoutIntervalForRequest: 30,
    timeoutIntervalForResource: 24 * 60 * 60
};

const endPoint = 'https://oss-cn-beijing.aliyuncs.com';

AliyunOSS.initWithPlainTextAccessKey('LTAIMRGbfXQ04Zfj', 'Bxe8ZhpI1k3TbNl9eTe24vnZgS7nTa', endPoint, configuration)



export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: {},
            s_oldPassword: '',
            s_newPassword: '',
            s_reNewPassword: '',
            showProgress: false
        }
        // 
    }
    render() {
        const { s_oldPassword,
            s_newPassword,
            s_reNewPassword, } = this.state
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"更改密码"} color={"#686f78"} />

                {
                    this.state.showProgress ? (
                        <LoadingView cancel={() => this.setState({ showProgress: false })} />
                    ) : (null)
                }
                <View style={[styles.item, styles.h35]}>
                </View>
                <View style={[styles.item, styles.bgfff, styles.bdbe9, styles.imgc]}>
                    <Text>
                        密码
                    </Text>
                    <TextInput
                        style={[styles.input, { textAlign: 'right' }]}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        placeholder="请输入原密码"
                        value={s_oldPassword}
                        onChangeText={s_oldPassword => this.setState({
                            s_oldPassword
                        })}
                    ></TextInput>
                </View>
                <View style={[styles.item, styles.bgfff, styles.bdbe9, styles.imgc]}>
                    <Text>
                        新密码
                    </Text>
                    <TextInput
                        style={[styles.input, { textAlign: 'right' }]}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        placeholder="请输入新密码"

                        value={s_newPassword}
                        onChangeText={s_newPassword => this.setState({
                            s_newPassword
                        })}
                    ></TextInput>
                </View>
                <View style={[styles.item, styles.bgfff, styles.bdbe9, styles.imgc]}>
                    <Text>
                        确认新密码
                    </Text>
                    <TextInput
                        style={[styles.input, { textAlign: 'right' }]}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        placeholder="再次输入新密码"
                        value={s_reNewPassword}
                        onChangeText={s_reNewPassword => this.setState({
                            s_reNewPassword
                        })}
                    ></TextInput>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.hangleSubmit() }}>
                    <View style={[styles.item, styles.buttonContainer]}>
                        <Text style={styles.button}>确定修改</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    componentDidMount() {
        this.setState({
            token: this.props.navigation.state.params.token,
        })
    }
    hangleSubmit = () => {
        const {
            s_oldPassword,
            s_newPassword,
            s_reNewPassword,
        } = this.state
        const { accessToken, id } = this.state.token;
        if (s_oldPassword == '' || s_newPassword == '' || s_reNewPassword == '') {
            Toast.showShortCenter('请完整填写!');
            return;
        }
        if (s_newPassword != s_reNewPassword) {
            Toast.showShortCenter('两次输入的密码不一致!');
            return;
        }

        console.log(s_oldPassword,
            s_newPassword,
            s_reNewPassword,
            accessToken,
            id);
        this.setState(preState => ({
            showProgress: true,
        }));
        fetch('http://app.daicui.net/user/updatePsw', {
            headers: {
                "x-access-token": accessToken,
                "x-access-uid": id,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'POST',
            body: JSON.stringify({
                confirmPwd: s_oldPassword,
                id: parseInt(id),
                newPwd: s_reNewPassword,
                oldPwd: s_newPassword
            }),
        }).then(response => response.json())
            .then(json => {
                Toast.showShortCenter(json.msg);
                this.setState(preState => ({
                    showProgress: false,
                }));
            }).catch((error) => {
                console.log(error);
                Toast.showShortCenter('修改失败!');
                this.setState({ showProgress: false });
            })
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    text: {

    },
    bgfff: {
        backgroundColor: '#fff'
    },
    h50: {
        height: 60
    },
    h35: {
        height: 40
    },
    bdbe9: {
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    bge9h10: {
        backgroundColor: '#e9e9e9',
        height: 20,
    },
    input: {
        flex: 1,
        height: 50,
        padding: 0,
        paddingLeft: 5,
        paddingRight: 5,
    },
    imgc: {
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'space-between'
    },
    img: {
        width: 20,
        resizeMode: 'center'
    },
    upload: {
        height: 150,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center"
    },
    uploadicon: {
        height: 100,
        resizeMode: "contain",
        marginBottom: 5,
    },
    buttonContainer: {
        margin: 15,
        backgroundColor: '#1aad16',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        textAlign: 'center',
        color: '#fff'
    },
})
