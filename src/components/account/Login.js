/**
 * 在球场
 * zaiqiuchang.com
 */

import React, {Component} from 'react'
import dismissKeyboard from 'dismissKeyboard'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {navToTab} from '../../navigation'
import * as components from '../'
import * as actions from '../../actions'

class Login extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: '登录',
      headerRight: <components.NavButton
        onPress={() => navigation.navigate('ResetPassword')}
      >重设密码</components.NavButton>
    }
  };

  constructor (props) {
    super(props)

    this.screenId = props.screenId || 'Login'
  }

  submit () {
    let {navigation, input, validateInput, login} = this.props
    validateInput(this.screenId, input[this.screenId], () => {
      let {account, password} = input[this.screenId]
      let username, mobile, email
      if (account.match(/^\d+$/) !== null) {
        mobile = account
      } else if (account.match(/^.+@.+$/) !== null) {
        email = account
      } else {
        username = account
      }
      login({
        username,
        mobile,
        email,
        password,
        cbOk: user => {
          if (user.nickname && user.avatarType && user.gender) {
            navToTab(navigation)
          } else {
            navigation.navigate('RegisterProfile')
          }
        }
      })
    })
  }

  render () {
    let {input, saveInput} = this.props
    let {account, password} = input[this.screenId]

    return (
      <components.Layout screenId={this.screenId}>
        <components.Form>
          <components.FormItem
            icon='account-circle'
            containerStyle={{borderTopWidth: 0}}
          >
            <components.TextInput
              placeholder='输入手机号或绑定邮箱'
              returnKeyType='next'
              defaultValue={account}
              maxLength={50}
              onChangeText={text => saveInput(this.screenId,
                {account: text.trim()})}
              onSubmitEditing={() => this.refPassword.focus()}
            />
          </components.FormItem>
          <components.FormItem icon='lock'>
            <components.TextInput
              placeholder='输入密码'
              returnKeyType='done'
              secureTextEntry
              defaultValue={password}
              maxLength={20}
              onRef={ref => { this.refPassword = ref }}
              onChangeText={text => saveInput(this.screenId,
                {password: text.trim()})}
              onSubmitEditing={() => {
                dismissKeyboard()
                this.submit()
              }}
            />
          </components.FormItem>
        </components.Form>
        <components.ButtonWithBg
          text='登录'
          onPress={() => {
            dismissKeyboard()
            this.submit()
          }}
          textStyle={{fontSize: 16}}
        />
      </components.Layout>
    )
  }
}

function mapStateToProps (state) {
  let {input} = state
  return {
    input
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
