import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, FlatList, RefreshControl, ActivityIndicator, PixelRatio, TextInput, TouchableOpacity } from 'react-native';
import Toast from '@remobile/react-native-toast';

const { width } = Dimensions.get('window');
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomLocation: ''
        }
    }
    render() {
        const { roomLocation } = this.state;
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"加入房间"} color={"#686f78"} />
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <View style={{ width: width * 0.6 }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            onChangeText={(roomLocation) => {
                                this.setState({
                                    roomLocation
                                })
                            }}
                            value={roomLocation}
                            style={{
                                borderBottomColor: '#f0f0f0',
                                borderBottomWidth: 1,
                                backgroundColor:'#f0f0f0',
                                height: 40
                            }}
                        ></TextInput>
                        <View style={{ height: 30 }}></View>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this.handleGoToRoom() }}>
                            <View style={{ backgroundColor: '#62c54e', borderRadius: 5, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>加入房间</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    handleGoToRoom() {
        const { roomLocation } = this.state;
        fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=searchroomid&searchid=${roomLocation}`)
            .then(json => json.json())
            .then(json => {
                console.log(json)
                if (json.code == -1) {
                    Toast.showShortCenter('请输入正确的房间ID!')
                    return;
                }
                Toast.showShortCenter('正在打开中...')
                var name = json.msg[0].name;
                this.props.navigation.navigate('WebviewScreen', {
                    'towebUrl': `http://app.daicui.net/#/tab/rooms/${roomLocation}`,
                    'name': name,
                })
            })
            .catch(err => {
                console.log(err);
            })
        // -1不存在
        // 0 正常 

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    listContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width
    }
})
