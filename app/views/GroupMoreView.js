import React, { Component } from 'react';
import Global from '../utils/Global';
import StorageUtil from '../utils/StorageUtil';
import Utils from '../utils/Utils';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from '@remobile/react-native-toast';
import { withNavigation } from 'react-navigation';
import RedMoney from './RedMoney';

import { Dimensions, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';

const { width } = Dimensions.get('window');

const icons = [
	require('../../images/group1.png'),
	require('../../images/group2.png'),
	require('../../images/group3.png'),
	require('../../images/group4.png'),
	require('../../images/group5.png'),
	require('../../images/group6.png'),
	// require('../../images/group1.png'),
	// require('../../images/group1.png'),
];

const iconTexts = [
	"扫雷红包", "发送喇叭", "接龙红包", "福利红包",
	"充值", "提现",
	// "名片", "我的收藏"
];

class MoreView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			all_sms_show: false,
			all_sms_show_content: '',
			b_redMoneyShow: false,
			b_fuliRedMoney: false
		}
	}
	render() {
		const { all_sms_show, b_redMoneyShow, b_fuliRedMoney } = this.state;

		var page = [];
		for (var i = 0; i < 2; i++) {
			var row = [];
			for (var j = 0; j < 4; j++) {
				if (i == 1 && j >= 2) {
					// break;
					row.push(
						<View key={"row" + i + "col" + j} style={styles.cellContainer}></View>
					)
					continue;
				}
				row.push(
					<Cell
						key={"row" + i + "col" + j}
						icon={icons[i * 4 + j]}
						text={iconTexts[i * 4 + j]}
						index={i * 4 + j}
						sendImageMessage={this.props.sendImageMessage}
						handleOpenModal={this.props.handleOpenModal}
						navigation={this.props.navigation}
						all_sms={this.all_sms}
						sendRedMoney={this.sendRedMoney}
						roomType={this.props.roomType}
						b_fuliRedMoney={b_fuliRedMoney}
						handleJielong={this.props.handleJielong}
					/>
				);
			}
			page.push(
				<View key={"page" + i} style={styles.rowContainer}>{row}</View>
			);
		}
		return (
			<View style={styles.moreViewContainer}>
				{page}
				<Modal
					transparent={true}
					visible={b_redMoneyShow}
					animationType={'slide'}
					onRequestClose={() => {
						this.closeRedMoney();
					}}
				>
					<View style={{ flex: 1 }}>
						<RedMoney
							closeRedMoney={this.closeRedMoney}
							roomType={this.props.roomType}
							red_conf_max_size={this.props.red_conf_max_size}
							b_fuliRedMoney={b_fuliRedMoney}
							handleSendRedBao={this.props.handleSendRedBao}
						></RedMoney>
					</View>
				</Modal>
				<Modal
					transparent={true}
					visible={all_sms_show}
					animationType={'slide'}
					onRequestClose={() => {
						this.setState({
							all_sms_show: false,
						})
					}}
				>
					{/* <TouchableOpacity activeOpacity={0.6} onPress={() => {
						this.setState({
							all_sms_show: false,
						})
					}}> */}
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.8)' }}>
						<View style={{ width: width * 0.8, alignItems: 'center', }}>

							<View style={{ marginBottom: 20, width: width * 0.8 }}>
								<Text style={{ color: '#999', textAlign: 'left' }}>提示:每次使用小喇叭道具需要花费10金币</Text>
							</View>
							<TextInput
								style={{ color: '#999', backgroundColor: 'rgba(255,255,255,0.1)', height: 80, padding: 10, width: width * 0.8, textAlignVertical: 'top', textAlign: 'justify' }}
								multiline={true}
								underlineColorAndroid='transparent'
								onChangeText={(all_sms_show_content) => {
									this.setState({
										all_sms_show_content
									})
								}}
							/>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => {
									this.setState({
										all_sms_show: false,
									})
								}}>
									<View style={{ height: 40, width: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: '#b9b9b9', margin: 15, borderRadius: 5, }}>
										<Text style={{ color: '#fff', textAlign: 'center' }}>关闭</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => { this.handleSendMsg() }}>
									<View style={{ height: 40, width: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: '#09bb07', margin: 15, borderRadius: 5, }}>
										<Text style={{ color: '#fff', textAlign: 'center' }}>发送</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					{/* </TouchableOpacity> */}
				</Modal>
			</View>
		);
	}


	all_sms = () => {
		this.setState({
			all_sms_show: true,
		})
	}
	sendRedMoney = (isFuli) => {
		isFuli ?
			this.setState({
				b_redMoneyShow: true,
				b_fuliRedMoney: true
			}) :
			this.setState({
				b_redMoneyShow: true,
				b_fuliRedMoney: false
			})
	}
	closeRedMoney = () => {
		this.setState({
			b_redMoneyShow: false,
		})
	}

	handleSendMsg = () => {

		StorageUtil.get('tokeninfo', (error, object) => {
			if (!error && object) {
				const { accessToken, id } = object;
				var roomId = this.props.toWeburl.replace('http://app.daicui.net/#/tab/rooms/', '');
				const { all_sms_show_content } = this.state;
				if (all_sms_show_content == '') {
					Toast.showShortCenter('内容不能为空！')
					return;
				}
				fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=sendmsg&id=${id}&roomId=${roomId}&varify_aToken=${accessToken}&thismsg=${all_sms_show_content}`)
					.then(json => json.json())
					.then(data => {
						Toast.showShortCenter(data.msg)
						this.setState({
							all_sms_show: false,
						})
						const ws = new WebSocket('ws://118.123.22.134:9300');

						ws.onopen = function (e) {
							console.log('服务器连接成功');
							ws.send(all_sms_show_content);
							ws.close();
						}
						ws.onclose = function (e) {
							console.log("服务器关闭");
						}
						ws.onerror = function (e) {
							console.log("连接出错");
						}
					}).catch(err => {
						console.log(err);
					})



			}
		});
	}
}
export default withNavigation(MoreView)
class Cell extends Component {
	render() {
		return (
			<TouchableOpacity style={styles.cellContainer} activeOpacity={0.6} onPress={() => this.handleClick()}>
				{/* <TouchableOpacity style={styles.cellContainer} activeOpacity={0.6}> */}
				{/* 去掉他们的点击事件 */}
				<View style={styles.cellContainer}>
					<View style={styles.cellImgContainer}>
						<Image style={styles.cellImage} source={this.props.icon} />
					</View>
					<Text numberOfLines={1} style={styles.cellText}>{this.props.text}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	handleClick() {
		let index = this.props.index;
		switch (index) {
			case 0:
				if (this.props.roomType == 'saolei') {
					this.props.sendRedMoney()
				} else {
					Toast.showShortCenter('这个为扫雷红包！请切换到扫雷房间')
				}
				break;
			case 1:
				this.props.all_sms()
				break;
			case 2:

				if (this.props.roomType == 'jielong') {
					this.props.handleJielong();
				} else {
					Toast.showShortCenter('这个为接龙红包！请切换到接龙房间')
				}

				break;
			case 3:
				if (this.props.roomType == 'jielong') {
					this.props.sendRedMoney(true)
				} else {
					Toast.showShortCenter('这个为扫雷红包！请切换到扫雷房间')
				}
				break;
			case 4:
				this.props.navigation.navigate('WebviewScreen', {
					'towebUrl': 'http://app.daicui.net/#/tab/account/recharge',
					'name': '充值',
				})
				break;
			case 5:
				this.props.navigation.navigate('Withdraw')
				break;
			default:
		}
	}
	chooseImage() { // 从相册中选择图片发送
		ImagePicker.openPicker({
			cropping: false
		}).then(image => {
			if (this.props.sendImageMessage) {
				let path = image.path;
				if (!Utils.isEmpty(path)) {
					let name = path.substring(path.lastIndexOf('/') + 1, path.length);
					this.props.sendImageMessage(image);
				}
			}
		});
	}
}

const styles = StyleSheet.create({
	moreViewContainer: {
		width: width,
		height: Global.emojiViewHeight,
		flexDirection: 'column',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#F4F4F4'
	},
	rowContainer: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: Global.emojiViewHeight / 2 - 20,
	},
	cellContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10,
		marginRight: 10,
	},
	cellImgContainer: {
		width: 55,
		height: 55,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FBFBFB',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: '#DFDFDF',
		borderRadius: 10,
	},
	cellImage: {
		width: 35,
		height: 35,
	},
	cellText: {
		fontSize: 12,
		width: 55,
		textAlign: 'center'
	},
	red_5a5a5a: {
		color: '#5a5a5a',
	},
	red_5a5a5a: {
		color: '#5a5a5a',
	},
	red_5a5a5a: {
		color: '#5a5a5a',
	},
	red_5a5a5a: {
		color: '#5a5a5a',
	}
});
