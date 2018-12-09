import React, { Component } from 'react';
import Toast from '@remobile/react-native-toast';
import CommonTitleBar from '../views/CommonTitleBar';
import LoadingView from '../views/LoadingView';
import StorageUtil from '../utils/StorageUtil';
import Utils from '../utils/Utils';
import { api } from '../Lib/WebIM'
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import {
	SW,
	SH,
	FZ,
} from '../utils/ScreenUtil'
const { width } = Dimensions.get('window');

export default class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			confirmPwd: '',
			ymq: '',
			showProgress: false
		}
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<CommonTitleBar nav={this.props.navigation} title={"注册"} />
				<View style={styles.content}>
					{
						this.state.showProgress ? (
							<LoadingView cancel={() => this.setState({ showProgress: false })} />
						) : (null)
					}
					<Image source={require('../../images/ic_launcher.png')} style={{ width: 100, height: 100, marginTop: 70 }} />
					<KeyboardAvoidingView behavior={'padding'}>
						<View style={styles.pwdView}>
							<View style={styles.pwdContainer}>
								<Text style={{ fontSize: Platform.OS == 'ios' ? FZ(20) : 16 }}> 用户名：</Text>
								<TextInput onChangeText={(text) => {
									this.setState({ username: text })
								}} style={styles.textInput} underlineColorAndroid="transparent" />
							</View>
							<View style={styles.pwdDivider}></View>
							<View style={styles.pwdContainer}>
								<Text style={{ fontSize: Platform.OS == 'ios' ? FZ(20) : 16 }}> 密码：</Text>
								<TextInput secureTextEntry={true} onChangeText={(text) => {
									this.setState({ password: text })
								}} style={styles.textInput} underlineColorAndroid="transparent" />
							</View>
							<View style={styles.pwdDivider}></View>
							<View style={styles.pwdContainer}>
								<Text style={{ fontSize: Platform.OS == 'ios' ? FZ(20) : 16 }}>重复密码：</Text>
								<TextInput secureTextEntry={true} onChangeText={(text) => {
									this.setState({ confirmPwd: text })
								}} style={styles.textInput} underlineColorAndroid="transparent" />
							</View>
							<View style={styles.pwdDivider}></View>
							<View style={styles.pwdContainer}>
								<Text style={{ fontSize: Platform.OS == 'ios' ? FZ(20) : 16 }}>邀请码：</Text>
								<TextInput onChangeText={(text) => {
									this.setState({ ymq: text })
								}} style={styles.textInput} underlineColorAndroid="transparent" />
							</View>

							<View style={styles.pwdDivider}></View>
							<TouchableOpacity activeOpacity={0.6} onPress={() => this.register()}>
								<View style={styles.loginBtn}>
									<Text style={{ color: '#FFFFFF', fontSize: Platform.OS == 'ios' ? FZ(20) : 16 }}>注册</Text>
								</View>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</View>
			</ScrollView>
		);
	}

	// componentDidMount() {
	// 	this.addStaticFriend();
	// }
	isContainChinese(str) {
		var reg = /[\u4e00-\u9fa5]/g;
		if (reg.test(str)) {
			return true;
		}
		return false;
	}

	registerHX(username, password) {
		// 请求环信的注册接口
		let options = {
			username: username,
			password: password,
			nickname: username
		};
		api.register(options).then((data) => {
			this.setState({ showProgress: false });
			if (data.error) {
				Toast.showShortCenter('注册失败：' + data.error_description);
				return;
			}

			this.addStaticFriend(username);


			StorageUtil.set('username', { 'username': username });
			// 关闭当前页面
			this.props.navigation.goBack();
			// 跳转到登录界面
			this.props.navigation.navigate('Login');
		});
	}
	addStaticFriend(username) {


		// AppKey:1125181017177671#paipai
		// Orgname:1125181017177671
		// 应用ID:paipai
		// Client ID:YXA65N-BsPSJEeiHGmPQNfGNHg
		// Client Secret:YXA6tbkd7mwUjJG9Qxd91bKzBKADdi4
		fetch('https://a1.easemob.com/1125181017177671/paipai/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				grant_type: "client_credentials",
				client_id: "YXA65N-BsPSJEeiHGmPQNfGNHg",
				client_secret: "YXA6tbkd7mwUjJG9Qxd91bKzBKADdi4"
			}),
		})
			.then(json => json.json())
			.then(json => {
				const { access_token } = json;
				// /users/${username}/contacts/users/gm
				// /users/${username}/contacts/users/service
				console.log(access_token);
				fetch(`https://a1.easemob.com/1125181017177671/paipai/users/${username}/contacts/users/gm`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${access_token}`
					},
				})

					.then(jsonc => jsonc.json())
					.then(jsonc => {
						console.log(jsonc);
					}).catch(err => {
						console.log(err);
					})
				fetch(`https://a1.easemob.com/1125181017177671/paipai/users/${username}/contacts/users/service`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${access_token}`
					},
				})
					.then(jsonc => jsonc.json())
					.then(jsonc => {
						console.log(jsonc);
					}).catch(err => {
						console.log(err);

					})

				Toast.showShortCenter('注册成功');

			})
			.catch(err => {
				console.log(err);
			})
		// {
		// 	url: 'https://a1.easemob.com/1125181017177671/rnwechat/token',
		// 	method: "POST",
		// 	contentType: "application/json",
		// 	data: JSON.stringify({grant_type: "client_credentials",client_id: "YXA6Z1FdQNHtEeiwJutrJYpG_Q",client_secret: "YXA6URKCSxfhB8LlsO8ZMIHNq6aDR40"})
		// }
	}
	register() {
		var username = this.state.username;
		var password = this.state.password;
		var confirmPwd = this.state.confirmPwd;
		var ymq = this.state.ymq;


		if (Utils.isEmpty(username) || Utils.isEmpty(password) || Utils.isEmpty(confirmPwd)) {
			Toast.showShortCenter('用户名或密码不能为空！');
			return;
		}
		if (this.isContainChinese(username)) {
			Toast.showShortCenter('用户名不能包含中文！');
			return;
		}
		if (username.length > 15) {
			Toast.showShortCenter('用户名长度不得大于15个字符！');
			return;
		}
		if (password.length < 6) {
			Toast.showShortCenter('密码至少需要6个字符！');
			return;
		}
		if (password !== confirmPwd) {
			Toast.showShortCenter('两次输入的密码不一致！');
			return;
		}
		if (ymq != '') {
			if (!ymq.match(/^\d+?$/)) {
				Toast.showShortCenter('邀请码填写错误请重试！');
				return;
			}
		}
		this.setState({ showProgress: true });
		//请求服务器注册接口
		var registerUrl = 'http://app.daicui.net/register';
		// let formData = new FormData();
		// formData.append('username', username);
		// formData.append('password', password);
		// formData
		fetch(registerUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			body: ymq == '' ? JSON.stringify({
				username,
				password,
				password_c: password,
				wx: username,
			}) : JSON.stringify({
				username,
				password,
				password_c: password,
				wx: username,
				parentId: parseInt(ymq),
			})
		}).then((res) => res.json())
			.then((json) => {
				if (!Utils.isEmpty(json)) {
					if (json.code === 200) {
						this.registerHX(username, password);
					} else {
						this.setState({ showProgress: false });
						Toast.showShortCenter(json.msg);
					}
				} else {
					this.setState({ showProgress: false });
				}
			}).catch((e) => {
				Toast.showShortCenter('网络请求出错' + e);
				console.log(e);
				this.setState({ showProgress: false });
			})
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	content: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center'
	},
	pwdView: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 50,
	},
	textInput: {
		flex: 1,
	},
	pwdContainer: {
		flexDirection: 'row',
		height: 50,
		alignItems: 'center',
		marginLeft: 40,
		marginRight: 40,
	},
	pwdDivider: {
		width: width - 60,
		marginLeft: 30,
		marginRight: 30,
		height: 1,
		backgroundColor: '#00BC0C'
	},
	loginBtn: {
		width: width - 40,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 50,
		height: 50,
		borderRadius: 3,
		backgroundColor: '#00BC0C',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	}
});
