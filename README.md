# ctg_quiz

[React Native JS] 간단한 퀴즈프로그램 입니다.

1. 첫 화면에서 [퀴즈 시작] 버튼을 누르면 퀴즈가 시작됩니다.
2. 퀴즈는 https://opentdb.com/api_config.php 에서 받아오게 되며 1번문제 시작과 함께 퀴즈시작시간을 체크합니다.
3. 선택지(4개)는 랜덤으로 출력됩니다.
4. 정답을 선택함과 동시에 정답여부를 확인할 수 있습니다.
5. 정답 수 테스트를 할 수 있도록 답을 선택한 후 선택지가 disabled 되지 않도록 했습니다.
6. 정답은 현재 문항 내에서는 변경이 가능하며 [다음 문항] 버튼을 터치하여 다음 문항으로 넘어가면 저장됩니다.
7. 10문제의 답을 모두 선택하면 [결과 보기] 버튼이 나오며 이것을 터치하면 퀴즈가 종료되며 퀴즈종료시간을 체크합니다.
8. 퀴즈 결과에서는 총 시험시간과 정답 수, 오답 수가 원형 차트와 함께 출력됩니다.
9. [다시 풀기] 버튼은 현재 풀었던 10문제를 다시 풀게 됩니다.
10. [오답 노트] 버튼은 내가 틀린 문제들을 모아서 내가 선택한 답과 문제의 정답을 비교해서 보여줍니다.
