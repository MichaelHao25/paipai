import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, TextInput, Button, Alert,PixelRatio,Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from '@remobile/react-native-toast';
import LoadingView from '../views/LoadingView';
import {
    SW,
    SH,
    FZ,
} from '../utils/ScreenUtil'
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
            selected: '',
            money: '',
            qrcodeIsUpload: false,
            showProgress: false,
            body: '',
            token: {},
            qrcodeName: '',
            fileName: '',
            path: '',
        }
        // 
    }
    render() {
        const { selected, body, money, path } = this.state;
        console.log(path);

        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"提现"} color={"#686f78"} />

                {
                    this.state.showProgress ? (
                        <LoadingView cancel={() => this.setState({ showProgress: false })} />
                    ) : (null)
                }
                <View style={[styles.item, styles.bgfff, styles.h50]}>
                    <Text style={styles.fz18}>
                        账户余额:{body != '' ? parseInt(body).toFixed(2) : parseInt(body) == 0 ? '0.00' : 'loading...'}
                    </Text>
                </View>
                <View style={[styles.item, styles.h35]}>
                    <Text style={styles.fz18}>
                        收款方式
                    </Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.handleSelect('wechat') }}>
                    <View style={[styles.item, styles.bgfff, styles.bdbe9, styles.imgc]}>
                        <Text style={styles.fz18}>
                            微信
                    </Text>
                        <Image source={selected == 'wechat' ? require('../../images/checkboxed.png') : require('../../images/checkbox.png')} style={styles.img} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.handleSelect('alipay') }}>
                    <View style={[styles.item, styles.bgfff, styles.bdbe9, styles.imgc]}>
                        <Text style={styles.fz18}>
                            支付宝
                    </Text>
                        <Image source={selected == 'alipay' ? require('../../images/checkboxed.png') : require('../../images/checkbox.png')} style={styles.img} />
                    </View>
                </TouchableOpacity>
                <View style={[styles.item, styles.bgfff]}>
                    <Text style={styles.fz18}>
                        申请金额:
                    </Text>
                    <TextInput style={styles.input} underlineColorAndroid="transparent" multiline={false} keyboardType={'numeric'} placeholder="提现金额不能低于50元!" value={money} onChangeText={(e) => { this.handleChange(e) }} />
                </View>
                <View style={styles.bge9h10}>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.hangleUploadQrcode() }}>
                    <View style={[styles.item, styles.bgfff, styles.upload]}>
                        {path == '' ? <Image source={require('../../images/upload.png')} style={styles.uploadicon} /> : <Image source={{ uri: path }} style={{ width: 100, height: 100, resizeMode: "contain" }} />}
                        <Text style={styles.fz18}>上传图片</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.hangleSubmit() }}>
                    <View style={[styles.item, styles.buttonContainer]}>
                        <Text style={[styles.button ,styles.fz18]}>确定提现</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    handleChange = (e) => {
        this.setState({
            money: e,
        })
    }
    hangleSubmit = () => {
        console.log(this.state.money);
        console.log(this.state.selected);
        console.log(this.state.qrcodeIsUpload);
        const {
            money,
            selected,
            qrcodeIsUpload,
            fileName
        } = this.state
        if (selected == '') {
            Toast.showShortCenter('请选择收款方式!');
            return;
        }
        if (!money.match(/^\d+?\.\d{1,2}$|^\d*$/)) {
            Toast.showShortCenter('请输入正确的金额!');
            return;
        }
        if (parseFloat(money) < 50 || money == '') {
            Toast.showShortCenter('请输入正确的金额!');
            return;
        }
        if (qrcodeIsUpload == false) {
            Toast.showShortCenter('请上传二维码!');
            return;
        }
        this.setState({ showProgress: true });
        const { accessToken, id } = this.state.token;
        const json = { "bankName": selected, "branch": selected, "ownerName": fileName, "account": "--", "mobile": "--", "money": money }

        fetch('http://app.daicui.net/user/withdraw', {
            headers: {
                "x-access-token": accessToken,
                "x-access-uid": id,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'POST',
            body: JSON.stringify(json),
        }).then(response => response.json())
            .then(json => {
                if (json.code == 200) {
                    Toast.showShortCenter(json.msg);
                    this.setState(preState => ({
                        showProgress: false,
                        body: preState.body - parseFloat(money)
                    }));
                }
            }).catch((error) => {
                console.log(error);
                Toast.showShortCenter('提现失败请重试!');
                this.setState({ showProgress: false });
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
                const { accessToken, id } = obj;
                fetch('http://app.daicui.net/user/balance', {
                    headers: {
                        "x-access-token": accessToken,
                        "x-access-uid": id,
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
    hangleUploadQrcode = () => {
        ImagePicker.openPicker({
            includeBase64:true,
            mediaType: 'photo',
        }).then(image => {
            const path = image.path;
            const { id } = this.state.token;
            const rand = parseInt((Math.random() * 1000000));
            const name = `${id}_${rand}`;
            const ext = path.substring(path.lastIndexOf('.'), path.length);
            const fileName = `${name}_${ext}`;


            this.setState({
                showProgress: true,
                fileName,
            });

            AliyunOSS.asyncUpload("010404040404", fileName, path).then((res) => {
                if (res == 'UploadSuccess') {
                    Toast.showShortCenter('收款码上传成功!');
                    this.setState({
                        qrcodeIsUpload: true,
                        showProgress: false,
                        path: `https://010404040404.oss-cn-beijing.aliyuncs.com/${fileName}`
                    })
                }
            })
        })
    }
    handleSelect = (selected) => {
        this.setState({
            selected
        })
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
        borderBottomWidth: 1/PixelRatio.get(),
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
    fz18:{
        fontSize:Platform.OS=='ios'?FZ(20):18
    }
})
