const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);
    const userInput = data.user_input;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `다음 고민에 어울리는 책을 추천해줘:\n\n고민: ${userInput}\n\n추천 책:`,
        max_tokens: 150,
        temperature: 0.7,
        n: 1,
        stop: null
      })
    });

    const result = await response.json();

    if (response.ok) {
      const recommendation = result.choices[0].text.trim();

      return {
        statusCode: 200,
        body: JSON.stringify({ recommendation: recommendation })
      };
    } else {
      console.error('OpenAI API 에러:', result);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result.error.message })
      };
    }
  } catch (error) {
    console.error('서버 에러:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '서버에서 오류가 발생했습니다.' })
    };
  }
};
