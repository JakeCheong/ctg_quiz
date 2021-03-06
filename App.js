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
import { Button, Colors } from 'react-native-paper';
import QuizScreen from './screens/QuizScreen';
import { Header } from 'react-native-elements'

export default class App extends React.Component {
  state = {
    quizStart: false
  }

  setQuizStart = async () => {
    this.setState({ quizStart: true })
  }

  render() {
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:'white'}}>
          {this.state.quizStart ?
            <QuizScreen />
            :
            <View style={{ alignItems:'center', marginTop: 50 }}>
              <Text style={styles.headLine}>아래 버튼을 터치하면 퀴즈가 시작됩니다</Text>
              <Button mode="contained" onPress={this.setQuizStart.bind(this)} color={Colors.blue600} labelStyle={{ fontWeight:'bold'}}>
                퀴즈 풀기
              </Button>
            </View>
          }
       
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  headLine: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 20
  }
});
