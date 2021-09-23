import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { ActivityIndicator, Button, Colors, RadioButton } from 'react-native-paper';
import RadioGroup from 'react-native-radio-buttons-group';

export default class Quiz extends React.Component {
  state = {
  }

  componentDidMount = async () => {
  }

  setValue = async (value) => {
    console.log(value)
  }

  pressAnswer = async (answersArray) => {
    this.props.pressAnswer(answersArray)
  }

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView>
          <ActivityIndicator />
        </SafeAreaView>
      )
    } else {
      return (
        <SafeAreaView style={{ width:'100%' }}>
          <Text>{this.props.question}</Text>
          <View style={{ marginTop: 20, alignItems:'flex-start' }}>
            <RadioGroup
              radioButtons={this.props.answers}
              onPress={this.pressAnswer}
              containerStyle={{ alignItems:'baseline'}}
            />
          </View>
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 5
  }
})
