import React, { Component } from 'react'
import StorageUtil from '../utils/StorageUtil';
import CommonTitleBar from '../views/CommonTitleBar';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, FlatList, RefreshControl, ActivityIndicator, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');
export default class GameList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            page: 1,
            loadMoreStatus: 1,
            isload: false,
        }
    }
    render() {

        const { list, isload } = this.state
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"提现记录"} color={"#686f78"} />
                {list.length == 0 && isload == false ? (<View style={styles.listContainer}><ActivityIndicator color={'#ccc'} /><View style={{ marginTop: 10 }}><Text>正在加载中...</Text></View></View>) :
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={list}
                            renderItem={this._renderItem}
                            refreshing={true}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReachedThreshold={0.1}
                            // ListEmptyComponent={() => (
                            //     <View>
                            //         <Text>没有资料...</Text>
                            //     </View>
                            // )}
                            onEndReached={() => {
                                this.setState({
                                    loadMoreStatus: 1
                                })
                                this.fetchData();
                            }}
                            // ItemSeparatorComponent={() => {
                            //     return <View style={{ backgroundColor: '#ccc', height: 1 }}></View>;
                            // }}
                            ListFooterComponent={() => {
                                return (
                                    this.state.loadMoreStatus ? (
                                        <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                            <ActivityIndicator color={'#ccc'} />
                                            <View style={{ marginLeft: 5, }}>
                                                <Text>正在加载更多数据...</Text>
                                            </View>
                                        </View>
                                    ) : (
                                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5, }}>没有更多数据了</Text>
                                            </View>
                                        )
                                )
                            }}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={this.state.isRefreshing}
                        //         onRefresh={this.onHeaderRefresh}
                        //         tintColor='gray'
                        //     />
                        // }
                        />
                    </View>
                }
            </View>
        )
    }
    _renderItem = (obj) => {
        const { branch, fee, statusText, tradetime } = obj.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, paddingTop: 10, paddingBottom: 10, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 1 / PixelRatio.get() }}>
                <View>
                    <Text style={{ color: '#353535', fontSize: 16, paddingBottom: 10 }}>{branch}</Text>
                    <Text style={{ color: 'red' }}>{`￥${fee}`}</Text>
                </View>
                <View>
                    <Text style={{ color: '#a1a1a1' }}>{statusText}</Text>
                </View>
            </View>
        )
    }
    componentDidMount() {
        this.fetchData()
    }
    fetchData = () => {
        StorageUtil.get('tokeninfo', (err, obj) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    token: obj
                })
                const { accessToken, id } = obj;
                const { page } = this.state
                fetch(`http://app.daicui.net/user/withdrawRecords?pageNo=${page}&pageSize=20`, {
                    headers: {
                        "x-access-token": accessToken,
                        "x-access-uid": id
                    },
                    method: 'GET',
                }).then(response => response.json())
                    .then(json => {
                        console.log(json);

                        if (json.code == 200) {
                            if (json.body.length != 0) {
                                this.setState(preState => ({
                                    list: preState.list.concat(json.body),
                                    page: preState.page + 1,
                                }))
                            } else {
                                this.setState(({
                                    isload: true
                                }))
                            }
                        }
                        this.setState({
                            loadMoreStatus: 0
                        })
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
        backgroundColor: '#fff'
    },
    listContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width
    }
})
