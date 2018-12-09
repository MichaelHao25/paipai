import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
        }
    }
    render() {
        const {list} = this.state
        return (
            <View>
                <CommonTitleBar nav={this.props.navigation} title={"钱包"} color={"#686f78"} />
                <Text>{
                    list.length!=0?JSON.stringify(list[0]):"正在加载种..."
                }</Text>
            </View>
        )
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
                fetch('http://app.daicui.net/user/transferLogs?pageNo=1&pageSize=20', {
                    headers: {
                        "x-access-token": accessToken,
                        "x-access-uid": id
                    },
                    method: 'GET',
                }).then(response => response.json())
                    .then(json => {
                        console.log(json);
                        if (json.code == 200) {
                            console.log(json);
                            if (json.body.length == 0) {
                                this.setState({
                                    list: ['没有记录']
                                })
                            } else {
                                this.setState({
                                    list: json.body
                                })
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                    })

            }
        })
    }
}
