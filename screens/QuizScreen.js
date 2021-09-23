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
import { ActivityIndicator, Button, Colors } from 'react-native-paper';
import Quiz from '../components/Quiz';
import { Header } from 'react-native-elements'

export default class QuizScreen extends React.Component {
    state = {
        loading: true,
        quizs: [],
        quizNum: 0,
        answers: [],
        selectedAnswer: null,
        result: []
    }


    componentDidMount = async () => {
        await this.getQuizs()
        await this.setAnswers()
    }

    getQuizs = async () => {
        console.log('getQuizs')
        let jsonData = null
        try {
            await fetch('https://opentdb.com/api.php?amount=10&type=multiple')
                .then(response => response.json())
                .then(json => jsonData = json)

            await this.setState({ quizs: jsonData.results })
            await this.setState({ loading: false })

        } catch (e) {
            console.log(e)
        }
    }

    setAnswers = async () => {
        let answers = []
        for (let i = 0; i < this.state.quizs[this.state.quizNum].incorrect_answers.length; i++) {
            answers.push({ id: i, label: this.state.quizs[this.state.quizNum].incorrect_answers[i], value: this.state.quizs[this.state.quizNum].incorrect_answers[i] })
        }
        answers.push({ id: this.state.quizs[this.state.quizNum].incorrect_answers.length, label: this.state.quizs[this.state.quizNum].correct_answer, value: this.state.quizs[this.state.quizNum].correct_answer })
        await this.setState({ answers: answers.sort(() => Math.random() - 0.5)})
    }

    nextQuiz = async () => {
        await this.setState({ showButton: false, quizNum: this.state.quizNum + 1 })
        await this.setAnswers()
    }

    pressAnswer = async(answersArray) => {
        let selectedAnswer = null
        for(let i=0; i<answersArray.length; i++) {
            if(answersArray[i].selected) {
                selectedAnswer = answersArray[i].value
            }
        }
        await this.setState({ selectedAnswer: selectedAnswer })
        this.setState({ showButton: true })
    }

    render() {
        if (this.state.loading) {
            return (
                <SafeAreaView style={{ flex: 1, width: '100%', marginTop: 30 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.loadingText}>퀴즈 문제들을 불러오고 있습니다</Text>
                        <Text style={styles.loadingText}>잠시만 기다려주시기 바랍니다</Text>
                        <ActivityIndicator
                            style={{ marginTop: 30 }}
                            size='large'
                            color={Colors.blue600}
                        />
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={{ flex: 1, width: '100%' }}>
                    <Header
                        placement="center"
                        barStyle="dark-content" // or directly
                        // leftComponent={<Text>퀴즈</Text>}
                        centerComponent={<Text style={{ fontWeight:'bold' }}>퀴즈  ({this.state.quizNum+1 + ' / ' + this.state.quizs.length})</Text>}
                        // rightComponent={<Text>퀴즈</Text>}
                        containerStyle={{
                            backgroundColor: '#FFFFFF',
                            height: 50
                        }}
                    />

                    <View style={{ alignItems: 'center', margin: 30 }}>
                        <Quiz
                            question={this.state.quizs[this.state.quizNum].question}
                            correct_answer={this.state.quizs[this.state.quizNum].correct_answer}
                            incorrect_answers={this.state.quizs[this.state.quizNum].incorrect_answers}
                            answers={this.state.answers}
                            pressAnswer={this.pressAnswer}
                        />
                        {this.state.showButton ?
                            <View>
                                {this.state.quizNum + 1 == this.state.quizs.length ?
                                    <Button mode="contained" style={{ marginTop: 20 }}>
                                        결과 보기
                                    </Button>
                                    :
                                    <Button mode="contained" style={{ marginTop: 20 }} onPress={this.nextQuiz}>
                                        다음 문항
                                    </Button>
                                }
                            </View>
                            :
                            <View></View>
                        }
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
