import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import TitleBar from './app/views/TitleBar';
import ContactsScreen from './app/screens/ContactsScreen';
import FindScreen from './app/screens/FindScreen';
import MeScreen from './app/screens/MeScreen';
import SearchScreen from './app/screens/SearchScreen';
import ContactDetailScreen from './app/screens/ContactDetailScreen';
import ChattingScreen from './app/screens/ChattingScreen';
import MomentScreen from './app/screens/MomentScreen';
import ScanScreen from './app/screens/ScanScreen';
import ScanResultScreen from './app/screens/ScanResultScreen';
import ShoppingScreen from './app/screens/ShoppingScreen';
import CardPackageScreen from './app/screens/CardPackageScreen';
import SplashScreen from './app/screens/SplashScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import NewFriendsScreen from './app/screens/NewFriendsScreen';
import PersonInfoScreen from './app/screens/PersonInfoScreen';
import PublishMomentScreen from './app/screens/PublishMomentScreen';
import ImageShowScreen from './app/screens/ImageShowScreen';
import ShakeScreen from './app/screens/ShakeScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import StorageUtil from './app/utils/StorageUtil';
import UpgradeModule from './app/utils/UpgradeModule';
import UpgradeDialog from './app/views/UpgradeDialog';
import ConversationUtil from './app/utils/ConversationUtil';
import TimeUtil from './app/utils/TimeUtil';
import CountEmitter from './app/event/CountEmitter';
import Global from './app/utils/Global';
import Utils from './app/utils/Utils';
import Toast from '@remobile/react-native-toast';
import UserInfoUtil from './app/utils/UserInfoUtil';
import MoneyScreen from './app/screens/MoneyScreen';
import GameList from './app/screens/GameList'
import RechargeRecords from './app/screens/RechargeRecords'
import WithdrawRecords from './app/screens/WithdrawRecords'
import TransferLogs from './app/screens/TransferLogs'
import Recharge from './app/screens/Recharge'
import Withdraw from './app/screens/Withdraw'
import Transfer from './app/screens/Transfer'
import WebviewScreen from './app/screens/WebviewScreen'
import MyProxy from './app/screens/MyProxy'
import CreateRoom from './app/screens/CreateRoom';
import JoinRoom from './app/screens/JoinRoom';
import RoomMoreInfo from './app/screens/RoomMoreInfo';
import ChangePassword from './app/screens/ChangePassword';
import RoomMoreInfoModify from './app/screens/RoomMoreInfoModify'

import {
	FZ,
	SW,
	SH
} from './app/utils/ScreenUtil'

import { Provider } from "react-redux";
import configureStore from "./app/store/configureStore";

import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	PixelRatio,
	StatusBar,
	FlatList,
	TouchableHighlight,
	Platform,
	WebView
} from 'react-native';
// import { connect } from 'react-redux'


const store = configureStore();

const { width } = Dimensions.get('window');

class HomeScreen extends Component {
	static navigationOptions = {
		tabBarLabel: '微信',
		tabBarIcon: ({ focused, tintColor }) => {
			if (focused) {
				return (
					<Image style={styles.tabBarIcon} source={require('./images/ic_weixin_selected.png')} />
				);
			}
			return (
				<Image style={styles.tabBarIcon} source={require('./images/ic_weixin_normal.png')} />
			);
		},
	};

	constructor(props) {
		super(props);
		this.state = {
			checkedUpgrade: true, // 标记是否检查了更新，这里置为true则不会检查更新，设置为false则每次启动时检查更新，该功能默认不开启
			recentConversation: [],
			token: {},
			listRoom: [],
		};
		this.registerHXListener();
		const didBlurSubscription = this.props.navigation.addListener(
			'didFocus',
			payload => {
				this.componentDidMount();
			}
		)
		//及时更新数据，redux没用上的坑，，，shit
	}

	loadConversations(username) {

		ConversationUtil.getConversations(username, (result) => {
			let count = result.length;

			if (count == 0) {
				// 没有会话，创建两个会话

				this.generateAutoConversation('gm');
				return;
			}
			let index = 0;
			for (let i = 0; i < count; i++) {
				let conversation = result[i];


				let chatWithUsername = conversation.conversationId.replace(username, '');


				UserInfoUtil.getUserInfo(chatWithUsername, (userInfo) => {
					index++;
					if (userInfo != null) {
						conversation['avatar'] = userInfo.avatar;
						conversation['nick'] = userInfo.nick;
						//下面内容重复。。。 因为异步和同步的问题重新写函数麻烦 偷懒。
						if (index == count) {
							const { listRoom } = this.state;

							// console.log(listRoom);

							if (listRoom.length != 0) {
								// 开始循环建立房间列表
								for (let index = 0; index < listRoom.length; index++) {
									const element = listRoom[index];
									var j_gameRoom = JSON.parse(JSON.stringify(result));
									j_gameRoom[0].avatar = `http://app.daicui.net/css/${element.id}.png`
									j_gameRoom[0].conversationId = `aavv_${index}`
									j_gameRoom[0].lastTime = result[0].lastTime + 1
									j_gameRoom[0].nick = element.name
									j_gameRoom[0].towebUrl = `http://app.daicui.net/#/tab/rooms/${element.id}`
									j_gameRoom[0].messages = j_gameRoom[0].messages.slice(0, 1)
									j_gameRoom[0].messages[0].conversationId = 'aavv'
									// j_gameRoom[0].messages[0].data = `限${element.limitNum}人`
									j_gameRoom[0].messages[0].data = `限500人`
									j_gameRoom[0].unreadCount = '0';
									result.push(j_gameRoom[0]);
								}
							}

							this.setState({ recentConversation: result });

							ConversationUtil.showConversations();
						}

					} else {
						fetch(`http://118.123.22.134:8081/CreateRoom/api.php?action=searchfriend&searchaccount=${chatWithUsername}`, {
							method: 'GET',
						})
							.then(json => json.json())
							.then(data => {
								console.log(data);
								conversation['avatar'] = `http://app.daicui.net/img/user/${data.msg[0].id}.jpg`;
								conversation['nick'] = data.msg[0].nickName;

								if (index == count) {
									const { listRoom } = this.state;

									// console.log(listRoom);

									if (listRoom.length != 0) {
										// 开始循环建立房间列表
										for (let index = 0; index < listRoom.length; index++) {
											const element = listRoom[index];
											var j_gameRoom = JSON.parse(JSON.stringify(result));
											j_gameRoom[0].avatar = `http://app.daicui.net/css/${element.id}.png`
											j_gameRoom[0].conversationId = `aavv_${index}`
											j_gameRoom[0].lastTime = result[0].lastTime + 1
											j_gameRoom[0].nick = element.name
											j_gameRoom[0].towebUrl = `http://app.daicui.net/#/tab/rooms/${element.id}`
											j_gameRoom[0].messages = j_gameRoom[0].messages.slice(0, 1)
											j_gameRoom[0].messages[0].conversationId = 'aavv'
											j_gameRoom[0].messages[0].data = `限500人`
											j_gameRoom[0].unreadCount = '0';
											result.push(j_gameRoom[0]);
										}


									}

									this.setState({ recentConversation: result });

									ConversationUtil.showConversations();
								}


							})
							.catch(err => {
								console.log(err);
							})
						//此处设置如果没有找到信息的话则从服务器查询


					}
				});
			}
		});
	}

	// 生成自动回复的对话
	generateAutoConversation(chatUsername) {
		let id = WebIM.conn.getUniqueId();           // 生成本地消息id
		let msg = new WebIM.message('txt', id);      // 创建文本消息
		let message = '欢迎使用派派社交,有什么问题您都可以问我哦~派派社交官方客服QQ5163114(微信同号)';
		if (chatUsername == 'tulingrobot') {
			message = '我是图灵机器人，开心或者不开心，都可以找我聊天~';
		}
		msg.set({
			msg: message,                  // 消息内容
			to: this.state.username,        // 接收消息对象（用户id）
			roomType: false,
			success: function (id, serverMsgId) {
			},
			fail: function (e) {
			}
		});
		msg.body.chatType = 'singleChat';
		ConversationUtil.addMessage({
			'conversationId': ConversationUtil.generateConversationId(chatUsername, this.state.username),
			'id': id,
			'from': chatUsername,
			'to': this.state.username,
			'time': TimeUtil.currentTime(),
			'data': message,
			'msgType': 'txt'
		}, () => {
			// if (chatUsername == 'tulingrobot' && this.state.username != 'yubo666') {
			// 	this.generateAutoConversation('yubo666');
			// } else {
			this.loadConversations(this.state.username);
			// }

		});
	}

	registerHXListener() {  // 注册环信的消息监听器
		WebIM.conn.listen({
			// xmpp连接成功
			onOpened: (msg) => {
				Toast.showShortCenter('onOpend')
				// 登录环信服务器成功后回调这里
				// 出席后才能接受推送消息
				WebIM.conn.setPresence();
			},
			// 出席消息
			onPresence: (msg) => {
			},
			// 各种异常
			onError: (error) => {
				Toast.showShortCenter('登录聊天服务器出错');
				console.log('onError: ' + JSON.stringify(error));
			},
			// 连接断开
			onClosed: (msg) => {
				Toast.showShortCenter('与聊天服务器连接断开');
			},
			// 更新黑名单
			onBlacklistUpdate: (list) => {
			},
			// 文本消息
			onTextMessage: (message) => {
				message.conversationId = ConversationUtil.generateConversationId(message.from, message.to);
				message.msgType = 'txt';
				message.time = TimeUtil.currentTime();
				ConversationUtil.addMessage(message, (error) => {
					// 重新加载会话
					this.loadConversations(this.state.username);
					// 若当前在聊天界面，还要通知聊天界面刷新
					CountEmitter.emit('notifyChattingRefresh');
				});
			},
			onPictureMessage: (message) => {
				message.conversationId = ConversationUtil.generateConversationId(message.from, message.to);
				message.msgType = 'img';
				message.time = TimeUtil.currentTime();
				ConversationUtil.addMessage(message, (error) => {
					// 重新加载会话
					this.loadConversations(this.state.username);
					// 若当前在聊天界面，还要通知聊天界面刷新
					CountEmitter.emit('notifyChattingRefresh');
				});
			}
		});
	}

	componentWillMount() {

		CountEmitter.addListener('notifyConversationListRefresh', () => {
			// 重新加载会话
			this.loadConversations(this.state.username);
		});

	}



	render() {
		// const token = this.props.token
		// const {
		// 	accessToken,
		// 	id,
		// 	userId
		// } = token;
		// const password = this.state.password;
		// localStorage.setItem('accessToken',);
		// console.log(this.state.recentConversation);
		//我们可以在这里讨论现在我答应props你看
		//有时候这个token就是空的因为irender执行完毕了才获取到的token所以这个时候答应的token就是空的
		// 日edenr 会执行好几次 第一次执行时 props 应该拿不到
		//现在执行的多次时其他的生命周期函数改变了state造成的执行.你之前props改变触发了不是那些函数吗?
		//getDerivedStateFromProps
		//componentWillReceiveProps
		//这两个触发了 componentWillReceiveProps
		//我就很头疼,妈的不知道时他程序的问题还是咋的我这里就没有触发,所以我不能很准确的拿到token在这里. 有时候就是空的导致webview的页面显示未登录你等下
		return (
			<View style={styles.container}>
				<StatusBar
					backgroundColor='#393A3E'
					barStyle="light-content"
				/>
				<TitleBar nav={this.props.navigation} />
				<View style={styles.divider}></View>
				{/* ---- */}

				{/* <View>
					<TouchableHighlight underlayColor={Global.touchableHighlightColor}
						onPress={() => {
							this.props.navigation.navigate('Chatting', {
								'contactId': contactId,
								'name': nick,
								'avatar': avatar
							})
						}}>
						<View style={styles.listItemContainer}>
							<Image source={avatar} style={{ width: 50, height: 50 }} />
							<View style={styles.listItemTextContainer}>
								<View style={styles.listItemSubContainer}>
									<Text numberOfLines={1} style={styles.listItemTitle}>{nick}</Text>
									<Text numberOfLines={1} style={styles.listItemTime}>{TimeUtil.formatChatTime(lastTime)}</Text>
								</View>
								<View style={styles.listItemSubContainer}>
									<Text numberOfLines={1} style={styles.listItemSubtitle}>{lastMsgContent}</Text>
									{
										data.item.unreadCount > 0 ? (
											<View style={styles.redDot}>
												<Text style={styles.redDotText}>{data.item.unreadCount}</Text>
											</View>
										) : (null)
									}
								</View>
							</View>
						</View>
					</TouchableHighlight>
					<View style={styles.divider} />
				</View> */}
				{/* ---- */}

				<View style={styles.content}>
					{
						this.state.recentConversation.length == 0 ? (
							<Text style={styles.emptyHintText}>暂无会话消息</Text>
						) : (
								<FlatList
									data={this.state.recentConversation}
									renderItem={this.renderItem}
									keyExtractor={this._keyExtractor}
								/>
							)
						// 暂无回话消息
					}


				</View>
				<View style={styles.divider}></View>
				<View style={{ backgroundColor: 'transparent', position: 'absolute', left: 0, top: 0, width: width }}>
					<UpgradeDialog ref="upgradeDialog" content={this.state.upgradeContent} />
				</View>
			</View>
		);
	}


	// getDerivedStateFromProps(nextProps, prevState){
	//   console.log('getDerivedStateFromProps-----1');
	//   //该生命周期函数无效
	//   return{
	//     ...prevState,
	//     token:nextProps.token
	//   }
	// }
	// shouldComponentUpdate (nextProps,nextState) {
	//   this.setState({
	//     ...nextState,
	//     token:nextProps.token
	//   })


	//   return true;
	//   //这个有效

	// }
	// componentWillReceiveProps(nextPrniops){
	//   console.log('componentWillReceiveProps---2');
	//   //该生命周期函数无效
	// }


	unregisterListeners() {
		CountEmitter.removeListener('notifyConversationListRefresh', () => { });
	}

	_keyExtractor = (item, index) => item.conversationId

	componentDidMount() {
		// var a = 2
		// this.webview.injectJavaScript(`localStorage.setItem('a',${a})`);
		// this.webview.injectJavaScript(`alert(localStorage.getItem('a'))`);
		StorageUtil.get('username', (error, object) => {
			if (!error && object && object.username) {

				this.setState({ username: object.username });

				//更改加载的顺序不能从获取用户名的时候开始加载,因为fetch还没有拉取到房间列表这个时候加载会出现问题.
				// this.loadConversations(object.username);
			}
		});
		StorageUtil.get('password', (error, object) => {
			if (!error && object && object.password) {
				this.setState({ password: object.password });
				// this.loadConversations(object.password);
				//此处使用了password来生成了一个回话故障...
				//设置本地存储

				// this.webview.injectJavaScript(`localStorage.setItem('password','${object.password}')`)
			}
		});

		StorageUtil.get('tokeninfo', (error, object) => {
			if (!error && object) {
				this.setState({ tokeninfo: object });
				//设置本地存储
				// const { accessToken, id, userId } = object;
				// this.webview.injectJavaScript(`localStorage.setItem('accessToken','${accessToken}')`)
				// this.webview.injectJavaScript(`localStorage.setItem('uid','${id}')`)
				// this.webview.injectJavaScript(`localStorage.setItem('username','${userId}')`)
				// this.webview.injectJavaScript(`localStorage.setItem('autoLogin','undefined')`)
				//开始请求房间列表
				const { accessToken, id } = object;
				fetch('http://118.123.22.134:8081/CreateRoom/api.php?action=roomlist', {
					headers: {
						'Content-Type': 'application/json;charset=UTF-8'
					},
					method: 'get',
				}).then(response => response.json())
					.then(json => {
						this.setState({
							listRoom: json.msg
						}, () => {

							this.loadConversations(object.userId);
							//将房间列表移动到这里来加载因为这个状态设置完毕才可以确定房间列表已经放置到了state里面,才可以保证房间列表的正常加载.
						})
					}).catch((error) => {
						console.log(error);
					})
			}
		});
		// 拿到token
		// 组件挂载完成后检查是否有更新，只针对Android平台检查
		if (!this.state.checkedUpgrade) {
			if (Platform.OS === 'android') {
				UpgradeModule.getVersionCodeName((versionCode, versionName) => {
					if (versionCode > 0 && !Utils.isEmpty(versionName)) {
						// 请求服务器查询更新
						let url = 'http://app.yubo725.top/upgrade?versionCode=' + versionCode + '&versionName=' + versionName;
						fetch(url).then((res) => res.json())
							.then((json) => {
								if (json != null && json.code == 1) {
									// 有新版本
									let data = json.msg;
									if (data != null) {
										let newVersionCode = data.versionCode;
										let newVersionName = data.versionName;
										let newVersionDesc = data.versionDesc;
										let downUrl = data.downUrl;
										let content = "版本号：" + newVersionCode + "\n\n版本名称：" + newVersionName + "\n\n更新说明：" + newVersionDesc;
										this.setState({ upgradeContent: content }, () => {
											// 显示更新dialog
											this.refs.upgradeDialog.showModal();
										});
									}
								}
							}).catch((e) => {
							})
					}
				})
			}
			this.setState({ checkedUpgrade: true });
		}
	}

	componentWillUnmount() {
		this.unregisterListeners();
	}

	renderItem = (data) => {

		let lastTime = data.item.lastTime;
		let lastMsg = data.item.messages[data.item.messages.length - 1];
		let contactId = lastMsg.from;
		if (contactId == this.state.username) {
			contactId = lastMsg.to;
		}
		let nick = data.item.nick;
		if (Utils.isEmpty(nick)) {
			nick = contactId;
		}
		let lastMsgContent = '';
		if (lastMsg.msgType == 'txt') {
			lastMsgContent = lastMsg.data;
		} else if (lastMsg.msgType == 'img') {
			lastMsgContent = '[图片]';
		}
		let avatar = require('./images/ic_list_icon.png');
		if (data.item.avatar != null) {
			avatar = { uri: data.item.avatar };
		}
		return (
			<View>
				<TouchableHighlight underlayColor={Global.touchableHighlightColor}
					onPress={() => {
						if (data.item.towebUrl) {
							this.props.navigation.navigate('WebviewScreen', {
								'towebUrl': data.item.towebUrl,
								'name': data.item.nick,
							})
						} else {

							this.props.navigation.navigate('Chatting', {
								'contactId': contactId,
								'name': nick,
								'avatar': avatar
							})
						}
					}}>
					<View style={styles.listItemContainer}>
						<Image source={avatar} style={{ width: 50, height: 50 }} />
						<View style={styles.listItemTextContainer}>
							<View style={styles.listItemSubContainer}>
								<Text numberOfLines={1} style={styles.listItemTitle}>{nick}</Text>
								<Text numberOfLines={1} style={styles.listItemTime}>{TimeUtil.formatChatTime(lastTime)}</Text>
							</View>
							<View style={styles.listItemSubContainer}>
								<Text numberOfLines={1} style={styles.listItemSubtitle}>{lastMsgContent}</Text>
								{
									data.item.unreadCount > 0 ? (
										<View style={styles.redDot}>
											<Text style={styles.redDotText}>{data.item.unreadCount}</Text>
										</View>
									) : (null)
								}
							</View>
						</View>
					</View>
				</TouchableHighlight>
				<View style={styles.divider} />
			</View>
		);
	}
}

// const mapStateToProps = (state) => {
// 	return {
// 		token: state.token
// 	}
// }

// const mapDispatchToProps = {

// }

// export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
export default HomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		width: width,
		height: 1 / PixelRatio.get(),
		backgroundColor: Global.dividerColor
	},
	content: {
		flex: 1,
		width: width,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Global.pageBackgroundColor
	},
	listItemContainer: {
		flexDirection: 'row',
		width: width,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	},
	listItemTextContainer: {
		flexDirection: 'column',
		flex: 1,
		paddingLeft: 15,
	},
	listItemSubContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	listItemTitle: {
		color: '#333333',
		fontSize: FZ(20),
		flex: 1,
	},
	listItemTime: {
		color: '#999999',
		fontSize: FZ(20),
	},
	listItemSubtitle: {
		color: '#999999',
		fontSize: FZ(18),
		marginTop: SH(10),
		flex: 1,
	},
	redDot: {
		borderRadius: 90,
		width: 18,
		height: 18,
		backgroundColor: '#FF0000',
		justifyContent: 'center',
		alignItems: 'center'
	},
	redDotText: {
		color: '#FFFFFF',
		fontSize: 14,
	},
	tabBarIcon: {
		width: 24,
		height: 24,
	},
	emptyHintText: {
		fontSize: 18,
		color: '#999999'
	}
});

const tabNavigatorScreen = TabNavigator({
	// Home: { screen: connect(mapStateToProps, mapDispatchToProps)(HomeScreen) },
	Home: { screen: HomeScreen },
	Contacts: { screen: ContactsScreen },
	Find: { screen: FindScreen },
	Me: { screen: MeScreen }
}, {
		tabBarOptions: {
			activeTintColor: '#45C018',
			inactiveTintColor: '#999999',
			showIcon: true,
			labelStyle: {
				fontSize: FZ(15),
				marginTop: SH(5),
				marginBottom: 0,
			},
			style: {
				marginBottom: 0,
				height:SH(55),
				paddingBottom: SH(8),
				paddingTop: SH(8),
				backgroundColor: '#FCFCFC',
			},
			tabStyle: {}
		},
		tabBarPosition: 'bottom',
	});

const Stack = StackNavigator({
	Splash: { screen: SplashScreen },
	Home: { screen: tabNavigatorScreen },
	Search: { screen: SearchScreen },
	ContactDetail: { screen: ContactDetailScreen },
	Chatting: { screen: ChattingScreen },
	Moment: { screen: MomentScreen },
	Scan: { screen: ScanScreen },
	ScanResult: { screen: ScanResultScreen },
	Shopping: { screen: ShoppingScreen },
	CardPackage: { screen: CardPackageScreen },
	Login: { screen: LoginScreen },
	Register: { screen: RegisterScreen },
	NewFriend: { screen: NewFriendsScreen },
	PersonInfo: { screen: PersonInfoScreen },
	PublishMoment: { screen: PublishMomentScreen },
	ImageShow: { screen: ImageShowScreen },
	Shake: { screen: ShakeScreen },
	Settings: { screen: SettingsScreen },
	Money: { screen: MoneyScreen },
	GameList: { screen: GameList },
	RechargeRecords: { screen: RechargeRecords },
	//充值记录
	WithdrawRecords: { screen: WithdrawRecords },
	//提现记录
	TransferLogs: { screen: TransferLogs },
	//转账记录
	Recharge: { screen: Recharge },
	//充值页面
	Withdraw: { screen: Withdraw },
	//提现页面
	Transfer: { screen: Transfer },
	//转账页面
	WebviewScreen: { screen: WebviewScreen },
	//转账页面
	MyProxy: { screen: MyProxy },
	//我的代理
	CreateRoom: { screen: CreateRoom },
	//创建房间
	JoinRoom: { screen: JoinRoom },
	//加入房间
	RoomMoreInfo: { screen: RoomMoreInfo },
	//房间信息
	ChangePassword: { screen: ChangePassword },
	//改密码
	RoomMoreInfoModify: { screen: RoomMoreInfoModify }
	//修改房间信息


}, {
		headerMode: 'none', // 此参数设置不渲染顶部的导航条
	});

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<View style={app.container}>
					<Stack />
				</View>
			</Provider>
		);
	}
}

const app = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

// AppRegistry.registerComponent('RNWeChat', () => MyApp);
AppRegistry.registerComponent('RNWeChat', () => App);

