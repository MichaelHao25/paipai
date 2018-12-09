import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'
import CommonTitleBar from '../views/CommonTitleBar'
import StorageUtil from '../utils/StorageUtil';
import Toast from '@remobile/react-native-toast';
import CountEmitter from '../event/CountEmitter';

export default class RoomMoreInfoModify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            action: '',
            roomId: ''
        }
    }
    render() {
        const { value } = this.state
        const {
            action,
        } = this.props.navigation.state.params
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
                <CommonTitleBar nav={this.props.navigation} title={`修改信息`} rightBtnText={'保存'} handleRightBtnClick={this.handleRightBtnClick} />
                <View style={{ flex: 1 }}>
                    <TextInput
                        value={value}
                        onChangeText={value => this.setState({ value })}
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        keyboardType={action == 'changefee' ? 'numeric' : 'default'}
                        style={{
                            padding: 10,
                            textAlignVertical: 'top',
                            flex: 1,
                            fontSize: 16,
                        }}
                    ></TextInput>
                </View>
            </View>
        )
    }

    componentDidMount() {
        const {
            value,
            action,
            roomId
        } = this.props.navigation.state.params
        this.setState({
            value,
            action,
            roomId
        })

        if ('changefee' == action) {
            Toast.showShortCenter('房间抽税设置,最小值为0,最大值为0.2!')
        }
    }
    handleRightBtnClick = () => {
        StorageUtil.get('tokeninfo', (error, object) => {
            if (!error && object) {
                const { accessToken, id, userId } = object;
                const {
                    value,
                    action,
                    roomId
                } = this.state;
                if ('changefee' == action) {
                    if (isNaN(parseFloat(value))) {
                        Toast.showShortCenter('请输入正确的税点!')
                        return;
                    }
                    if (value == '') {
                        Toast.showShortCenter('不能为空!')
                        return;
                    }
                    if (parseFloat(value) < 0 || parseFloat(value) > 0.2) {
                        Toast.showShortCenter('请输入正确的税点!')
                        return;
                    }
                }
                fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=${action}&id=${id}&roomId=${roomId}&newthis=${value}&varify_aToken=${accessToken}`)
                    .then(json => json.json())
                    .then(
                        data => {
                            if (data.code == -6 || data.code == -7) {
                                Toast.showShortCenter('鉴权失败,请确定您是该房间的管理人员.')
                                return;
                            }
                            if (data.code == 0) {
                                Toast.showShortCenter('修改成功!')
                                if (action == 'changename') {
                                    CountEmitter.emit('modifyName', value)
                                    //如果是修改名称的话则发射事件触发webview来更新房间名称
                                }

                                //触发index.js的事件 
                                this.props.navigation.goBack();
                            }
                        }
                        // 
                    ).catch(err => {
                        this.props.navigation.goBack();
                        Toast.showShortCenter('服务器出错请稍后重试!')
                    })
            }
        })
    }
}

