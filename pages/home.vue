<template>
  <div class="content-view">
    <!-- 헤더 -->
    <div class="main-title">
      <div class="side" @click="$router.push('/')">
        <ChevronLeftIcon class="left-icon" />
      </div>
      <div class="title">사랑의 두근두근 테스트</div>
      <div class="side"></div>
    </div>

    <!-- 테스트 로딩 -->
    <div v-if="!isLoading" class="loading-main">
      <div class="spinner"></div>
      <div>
        {{ loadingMassage }}
      </div>
    </div>

    <!-- 테스트 페이지 -->
    <div v-if="isLoading && currentData" class="test-main">
      <div class="test-title">
        <div class="side"></div>
        <div class="title">이럴때 나는?</div>
        <div class="side">
          {{ currentData.id }} / {{ questionnaire.length }}
        </div>
      </div>
      <div class="bar">
        <hr class="bar-back" />
        <hr
          class="bar-front"
          :style="{
            width: `${(100 / questionnaire.length) * currentData.id}%`,
          }"
        />
      </div>
      <img src="" />
      <div class="question">{{ currentData.question }}</div>

      <div class="answers">
        <div @click="selectOption(currentData.answers[0].value)">
          {{ currentData.answers[0].text }}
        </div>
        <div @click="selectOption(currentData.answers[1].value)">
          {{ currentData.answers[1].text }}
        </div>
      </div>
    </div>

    <!-- 결과 페이지 -->
    <div v-if="isLoading && !currentData" class="result-main">
      <div class="result-title">
        <div class="title">당신의 MBIT는</div>
        <div class="type">{{ userType }}</div>
      </div>
      <div class="content">
        {{ description }}
      </div>
      <div
        class="start-btn"
        :style="{ backgroundColor: 'lightblue' }"
        @click="$router.push('/')"
      >
        처음으로
      </div>
    </div>
  </div>
</template>

<script>
import { Configuration, OpenAIApi } from "openai";
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";

export default {
  setup() {
    const key = useRuntimeConfig().public.OPENAI_API_KEY;
    const configuration = new Configuration({
      apiKey: key,
    });
    const openai = new OpenAIApi(configuration);

    const content = `우린 "두근두근 사랑의 MBTI"을 주제로하는 MBTI 질문지를 만들거야
  질문은 총 12가지이고, 너가 만들어줘
  질문은 존댓말이아닌 반말로 해줘
  질문은 어떤 상황을 제시하는 형식으로 해주고 문장 정도 길이로 해줘 예를들면) 파티를 하고 있는 우리, 지금 너가 듣고 싶은 음악은?,
  질문은 창의적이어야하고, 이전 질문들과 겹치는 문장은 지양해줘,
  질문에 어울리는 concep을 영어 문장으로 적어줘,
  설문지를 마치고나면 MBTI 성향을 판단할 수 있는 질문지어야해
  질문에대한 두가지 답변을 제시하고,
  각 답변이 MBTI 기준의 어떤속성에 해당하는 답변인지도 표시해줘야해
  결과를 다음과 같은 json array형식으로 12가지가 다 포함되도록 중략하지말고 답변해줘.
  다른 답변은 하지 말고 오직 json 형식으로만 답해줘.
  [{id: 3, question: "연인과의 춤을 추는 상황에서, 어떤 음악을 선택하고 싶어?" , concep: "3 people dancing under the bright light", answers: [{text: "로맨틱하고 감성적인 음악", value: "F"}]}, {id:4 }]`;

    const questionnaire = ref("");
    const currentData = ref(null);
    const isLoading = ref(false);

    async function loadTest() {
      let loadingInterval = setInterval(() => {
        if (count >= massageList.length - 1) {
          count = 0;
        } else {
          count++;
        }
        loadingMassage.value = massageList[count];
      }, 5000);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      });
      const result = JSON.parse(completion.data.choices[0].message.content);
      console.log(result);

      // const result = JSON.parse(
      //   '[\n  {\n    "id": 1,\n    "question": "연인과의 야외 데이트 중인 우리, 어떤 옷을 선택하고 싶어?",\n    "concept": "A couple enjoying a romantic picnic in a beautiful park",\n    "answers": [\n      {\n        "text": "편안하고 자유로운 옷이지만 허름하면서 어쩌고 저쩌고인 옷",\n        "value": "P"\n      },\n      {\n        "text": "세련되고 고급스러운 옷",\n        "value": "J"\n      }\n    ]\n  },\n  {\n    "id": 2,\n    "question": "우리가 함께하는 영화 관람 시간에 어떤 장르의 영화를 보고 싶어?",\n    "concept": "Hands holding popcorn while watching a captivating movie",\n    "answers": [\n      {\n        "text": "로맨틱한 멜로드라마",\n        "value": "F"\n      },\n      {\n        "text": "스릴 넘치는 액션영화",\n        "value": "T"\n      }\n    ]\n  },\n  {\n    "id": 3,\n    "question": "함께 노래방에 간 우리, 어떤 노래를 부르고 싶어?",\n    "concept": "Singing and dancing with joy in a colorful karaoke room",\n    "answers": [\n      {\n        "text": "사랑스러운 발라드",\n        "value": "F"\n      },\n      {\n        "text": "신나는 팝송",\n        "value": "E"\n      }\n    ]\n  },\n  {\n    "id": 4,\n    "question": "우리가 데이트 중인 카페에서, 어떤 음료를 주문하고 싶어?",\n    "concept": "Holding hands while enjoying a cozy coffee date",\n    "answers": [\n      {\n        "text": "따뜻한 아메리카노",\n        "value": "S"\n      },\n      {\n        "text": "상큼한 과일 스무디",\n        "value": "N"\n      }\n    ]\n  }\n]'
      // );

      questionnaire.value = result;
      currentData.value = questionnaire.value[0];
      if (currentData.value) {
        isLoading.value = true;
        clearInterval(loadingInterval);
      }
    }

    let page = 0;

    const result = {
      E: 0,
      I: 0,
      N: 0,
      S: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };
    let userType = ref("");

    function calculateScores(data) {
      return `${data.E > data.I ? "E" : "I"}${data.N > data.S ? "N" : "S"}${
        data.T > data.F ? "T" : "F"
      }${data.P > data.J ? "P" : "J"}`;
    }

    const description = ref("");

    async function selectOption(type) {
      type = type[0];
      result[type]++;
      console.log(result);
      page++;
      if (page < questionnaire.value.length) {
        currentData.value = questionnaire.value[page];
      } else {
        currentData.value = false;
        userType.value = calculateScores(result);
        await makeResult(userType.value);
      }
    }

    async function makeResult(type) {
      loadingMassage.value = "MBTI 계산중..";
      isLoading.value = false;
      let count = 0;
      let loadingInterval = setInterval(() => {
        if (count >= resultMassageList.length - 1) {
          count = 0;
        } else {
          count++;
        }
        loadingMassage.value = resultMassageList[count];
      }, 5000);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `${type}는 사랑에 빠지면 어떤 행동을 하고 어떤 심리를 가지는지 알려줘? 답변은 오직 JSON 형식으로만 답해줘. 다음과 같이 만들어줘. [type: 'ISTJ', answer: respon ]`,
          },
        ],
      });
      const result = JSON.parse(completion.data.choices[0].message.content);

      if (result) {
        description.value = result.answer;
        clearInterval(loadingInterval);
        isLoading.value = true;
      }
    }

    const loadingMassage = ref("데이터를 훔쳐오는 중..");

    const massageList = [
      "데이터를 훔쳐오는 중..",
      "마법의 봇이 주문을 완성 중..",
      "데이터 감정을 정리 중..",
      "별들을 수집 중..",
      "로맨틱한 빛으로 화면을 가득 채우는 중..",
      "하트 모양의 구름을 만들어내는 중..",
      "연인들이 만나기 위해 준비 중..",
      "별자리를 그리는 중..",
    ];

    const resultMassageList = ["결과를 작성하는중..", "MBTI 계산중.."];

    let count = 0;

    return {
      loadTest,
      selectOption,
      questionnaire,
      currentData,
      isLoading,
      userType,
      loadingMassage,
      description,
    };
  },

  mounted() {
    this.loadTest();
    console.log(this.questionnaire);
  },

  components: {
    ChevronLeftIcon,
  },
};
</script>

<style scoped>
.test-main {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.test-title {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
}

.test-title .side {
  width: 96px;
  font-size: 14px;
}

.test-title .title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.main-title {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: solid 2px red;
}

.main-title .side {
  width: 96px;
}

.main-title .title {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  /* color: white;
  -webkit-text-stroke: 1px black; */
  font-family: "tmon", sans-serif;
}

.left-icon {
  width: 32px;
  cursor: pointer;
}
.answers {
}

img {
  width: 300px;
  height: 300px;
  background-color: aquamarine;
}
.question {
  font-size: 24px;
  margin: 40px 20px;
  text-align: center;
  word-break: keep-all;
  font-family: "tmon", sans-serif;
}

.answers {
  width: 80%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.answers div {
  width: 80%;
  text-align: center;
  border: solid 1px lightgray;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  word-break: keep-all;
  cursor: pointer;
}

.answers :hover {
  background-color: lightblue;
}

.bar {
  width: 80%;
  height: 20px;
  position: relative;
}

.bar-back {
  width: 100%;
  height: 2px;
  border: 0;
  position: absolute;
  background-color: lightgray;
  top: 0px;
}

.bar-front {
  background-color: rgb(155, 139, 245);
  height: 2px;
  border: 0;
  position: absolute;
  top: 0px;
  z-index: 10;
}

.result-title {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.result-title .title {
  font-size: 28px;
  font-family: "tmon", sans-serif;
  color: red;
}

.result-title .type {
  font-size: 40px;
  font-family: "miwon", sans-serif;
}

.content {
  font-size: 20px;
  word-break: keep-all;
  text-align: center;
  margin: 20px 0;
}

.loading-main {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.loading-main div {
  font-size: 20px;
  color: palevioletred;
  font-family: "miwon", sans-serif;
}

@keyframes spinner {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-main .spinner {
  box-sizing: border-box;

  width: 64px;
  height: 64px;

  border-radius: 50%;
  border: 8px solid transparent;
  border-top-color: #f9ccfd;
  border-bottom-color: #c7c3ff;
  animation: spinner 1.5s ease infinite;
}

.result-main {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
