import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

export default class Quiz extends React.Component {

  pressAnswer = async (answersArray) => {
    this.props.pressAnswer(answersArray)
  }

  render() {
    return (
      <SafeAreaView style={{ width: '100%' }}>
        <Text>{this.props.question}</Text>
        <View style={{ marginTop: 20, alignItems: 'flex-start' }}>
          <RadioGroup
            radioButtons={this.props.answers}
            onPress={this.pressAnswer}
            containerStyle={{ alignItems: 'baseline' }}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 5
  }
})
