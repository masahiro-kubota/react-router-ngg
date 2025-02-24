import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

interface UserAnswer {
  answer: number
}

class GameLogic {
  #_secretNumber: number;
  #_maxAttempts: number
  #_attempts: number

  constructor (secretNumber: number, maxAttempts: number) {
    this.#_secretNumber = secretNumber;
    this.#_maxAttempts = maxAttempts;
    this.#_attempts = 0;
  }

  get remainingAttempts () {
    return this.#_maxAttempts - this.#_attempts;
  }

  checkAnswer (answer: number): string {
    this.#_attempts++;
    if (this.#_attempts >= this.#_maxAttempts) {
      this.resetGame(this.#_secretNumber, this.#_maxAttempts);
      return '試行回数が上限に達しました。';
    }
    if (answer === this.#_secretNumber) {
      return '正解です！';
    } else if (answer < this.#_secretNumber) {
      return 'もっと大きい数字です。';
    } else {
      return 'もっと小さい数字です。';
    }
  }

  resetGame (secretNumber: number, maxAttempts: number) {
    this.#_secretNumber = secretNumber;
    this.#_maxAttempts = maxAttempts;
    this.#_attempts = 0;
  }
}

interface GameState {
  remainingAttempts: number;
  result: string;
}

interface GameAction {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;  // eslint-disable-line no-unused-vars
  handleReset: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;  // eslint-disable-line no-unused-vars
}

export function useGameState (): [GameState, GameAction] {
  const [gameLogic, setGameLogic] = useState<GameLogic>(new GameLogic(43, 10));
  const [userAnswer, setUserAnswer] = useState<UserAnswer>({answer: 0})
  const [remainingAttempts, setRemainingAttempts] = useState<number>(gameLogic.remainingAttempts);
  const [result, setResult] = useState<string>('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = gameLogic.checkAnswer(userAnswer.answer);
    // 非同期なので最新の回答はconsole.log反映されない。
    setRemainingAttempts(gameLogic.remainingAttempts);
    setResult(result);
    console.log(result);
  }
  const handleReset = () => {
    setGameLogic(new GameLogic(43, 10));
    setResult('');
    setRemainingAttempts(gameLogic.remainingAttempts);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserAnswer({ answer: Number(e.target.value) });
  }
  return [
    { remainingAttempts, result },
    { handleSubmit, handleReset, handleChange }
  ]
}


export function Welcome() {
  //すべてのuseStateをカスタムフックでまとめて管理
  const [
    { remainingAttempts, result }, 
    { handleSubmit, handleReset, handleChange }
  ] = useGameState();

  return (
    // ゲームクラスとのアダプタをAppコンポーネントの中で実装する。
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Number Guessing Game</h1>
      <form onSubmit={ handleSubmit } className="mb-6">
        <div className="mb-4">
          <input
              type="number"
              name="answer"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={ handleChange }
              placeholder="1~100の数字を入力してくさい"
              min="1"
              max="100"
              required
            />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-700 mb-2">
          { result }
        </p>
        <p className="text-center text-gray-700">
          残り試行回数: { remainingAttempts }回
        </p>
      </div>
      <div className="mt-6 rounded-lg">
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}