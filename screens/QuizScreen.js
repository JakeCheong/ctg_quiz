import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ActivityIndicator, Button, Colors } from 'react-native-paper';
import Quiz from '../components/Quiz';
import { Header } from 'react-native-elements'
import Modal from "react-native-modal";
import { PieChart } from 'react-native-svg-charts'

export default class QuizScreen extends React.Component {
    state = {
        loading: true,
        quizs: [],
        quizNum: 0,
        answers: [],
        selectedAnswer: null,
        result: [],
        resultView: false,
        startTime: null,
        endTime: null,
        correctCount: 0,
        wrongCount: 0,
        visibleModal: false
    }


    componentDidMount = async () => {
        await this.getQuizs()
        await this.setAnswers()
        await this.setState({ loading: false, startTime: new Date() })
    }

    getQuizs = async () => {
        let jsonData = null
        try {
            await fetch('https://opentdb.com/api.php?amount=10&type=multiple')
                .then(response => response.json())
                .then(json => jsonData = json)

            await this.setState({ quizs: jsonData.results })
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
        await this.setState({ answers: answers.sort(() => Math.random() - 0.5) }) // 선택지 랜덤 출력
    }

    updateResult = async () => {
        let result = this.state.result
        result.push({
            question: this.state.quizs[this.state.quizNum].question,
            correctAnswer: this.state.quizs[this.state.quizNum].correct_answer,
            selectedAnswer: this.state.selectedAnswer
        })
        await this.setState({ result: result })
    }

    nextQuiz = async () => {
        await this.updateResult()
        await this.setState({ showButton: false, quizNum: this.state.quizNum + 1 })
        await this.setAnswers()
    }

    pressAnswer = async (answersArray) => {
        let selectedAnswer = null
        let correct = null
        for (let i = 0; i < answersArray.length; i++) {
            if (answersArray[i].selected) {
                selectedAnswer = answersArray[i].value
            }
        }
        if (this.state.quizs[this.state.quizNum].correct_answer == selectedAnswer) {
            correct = true
        } else {
            correct = false
        }
        await this.setState({ selectedAnswer: selectedAnswer, correct: correct })

        this.setState({ showButton: true })
    }

    showResult = async () => {
        await this.updateResult()
        let correctCount = 0
        let wrongCount = 0
        for (let i = 0; i < this.state.result.length; i++) {
            if (this.state.result[i].correctAnswer == this.state.result[i].selectedAnswer) {
                correctCount++
            } else {
                wrongCount++
            }
        }
        await this.setState({ resultView: true, endTime: new Date(), correctCount: correctCount, wrongCount: wrongCount })
    }

    repeatQuiz = async () => {
        await this.setState({ quizNum: 0, resultView: false, showButton: false, startTime: new Date(), correctCount: 0, wrongCount: 0, result: [] })
        await this.setAnswers()
    }

    newQuiz = async () => {
        await this.setState({ loading: true, quizNum: 0, resultView: false, showButton: false, correctCount: 0, wrongCount: 0, result: [] })
        await this.getQuizs()
        await this.setAnswers()
        await this.setState({ loading: false, startTime: new Date() })
    }

    visibleModal = async () => { this.setState({ visibleModal: true }) }
    hideModal = async () => { this.setState({ visibleModal: false }) }

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
                <SafeAreaView>
                    <Header
                        placement="center"
                        barStyle="dark-content"
                        backgroundColor="white"
                        centerComponent={<Text style={{ fontWeight: 'bold' }}>퀴즈  ({this.state.quizNum + 1 + ' / ' + this.state.quizs.length})</Text>}
                        containerStyle={{
                            backgroundColor: '#FFFFFF',
                            marginTop: Platform.OS == 'ios' ? 0 : 30
                        }}
                    />
                    <Modal isVisible={this.state.visibleModal} style={styles.modal}>
                        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                            <Header
                                placement="center"
                                barStyle="dark-content"
                                backgroundColor="white"
                                leftComponent={<Text onPress={this.hideModal}>  닫기</Text>}
                                centerComponent={<Text style={{ fontWeight: 'bold' }}>오답 노트</Text>}
                                rightComponent={<Text>오답:  {this.state.wrongCount + '/' + this.state.quizs.length}</Text>}
                                containerStyle={{
                                    backgroundColor: '#FFFFFF',
                                    height: 50
                                }}
                            />
                            <ScrollView>
                                {this.state.result.map((item, i) => {
                                    if (item.correctAnswer != item.selectedAnswer) {
                                        return (
                                            <View key={i} style={{ margin: 15 }}>
                                                <Text>{item.question}</Text>
                                                <Text style={{ marginTop: 10, color:Colors.red600 }}>선택한 답: {item.selectedAnswer}</Text>
                                                <Text style={{ marginTop: 5, color:Colors.green900 }}>실제 정답: {item.correctAnswer}</Text>
                                                <View style={{ marginTop: 20, height: 2, backgroundColor: Colors.grey300 }}></View>
                                            </View>
                                        )
                                    }
                                })}
                            </ScrollView>
                        </SafeAreaView>
                    </Modal>
                    <View style={{ alignItems: 'center', margin: 30 }}>
                        <Quiz
                            question={this.state.quizs[this.state.quizNum].question}
                            answers={this.state.answers}
                            pressAnswer={this.pressAnswer}
                        />
                        {this.state.showButton ?
                            <View style={{alignItems:'center'}}>
                                {this.state.quizNum + 1 == this.state.quizs.length ?
                                    <View style={styles.flexRow}>
                                        {this.state.correct ?
                                            <Text style={styles.correctText}>O  정답입니다!</Text>
                                            :
                                            <Text style={styles.wrongText}>X  오답입니다!</Text>
                                        }
                                        <Button mode="contained" onPress={this.showResult} disabled={this.state.resultView}>
                                            결과 보기
                                        </Button>
                                    </View>
                                    :
                                    <View style={styles.flexRow}>
                                        <View>
                                        {this.state.correct ?
                                            <Text style={styles.correctText}>O  정답입니다!</Text>
                                            :
                                            <Text style={styles.wrongText}>X  오답입니다!</Text>
                                        }
                                        </View>
                                        <Button mode="contained" onPress={this.nextQuiz} color={Colors.blue500} labelStyle={{ color:'white', fontWeight:'bold'}}>
                                            다음 문항
                                        </Button>
                                    </View>
                                }
                            </View>
                            :
                            <View></View>
                        }
                        {this.state.resultView ?
                            <View style={{ marginTop: 30 }}>
                                <Text>총 시험시간: {(this.state.endTime.getTime() - this.state.startTime.getTime()) / 1000}초</Text>
                                <View style={styles.flexRow}>
                                    <PieChart innerRadius={25} style={{ width: 90, height: 90 }} data={[{ key: "correct", svg: { fill: Colors.green300 }, value: this.state.correctCount * 10 }, { key: "wrong", svg: { fill: Colors.red300 }, value: this.state.wrongCount * 10 }]} />
                                    <View style={{ alignItems:'baseline'}}>
                                        <Text style={{ fontSize:15, color: Colors.green900 }}>정답 수: {this.state.correctCount}</Text>
                                        <Text style={{ fontSize:15, color: Colors.red600, marginTop: 3 }}>오답 수: {this.state.wrongCount}</Text>
                                    </View>
                                </View>
                                <View style={styles.flexRow}>
                                    <Button mode="contained" onPress={this.visibleModal} color={Colors.red300} labelStyle={{ color:'white' }}>
                                        오답 노트
                                    </Button>
                                    <Button mode="contained" onPress={this.repeatQuiz} color={Colors.green300} labelStyle={{ color:'white' }}>
                                        다시 풀기
                                    </Button>
                                    <Button mode="contained" onPress={this.newQuiz} color={Colors.blue300} labelStyle={{ color:'white' }}>
                                        새로 하기
                                    </Button>
                                </View>
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
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: 20
    },
    correctText: {
        fontSize: 16,
        color: Colors.green900,
        fontWeight: 'bold'
    },
    wrongText: {
        fontSize: 16,
        color: Colors.red600,
        fontWeight: 'bold'
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0
    }
})
