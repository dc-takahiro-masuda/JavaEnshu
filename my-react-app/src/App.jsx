import { createContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios"
//URLの共通部分をまとめるためのaxiosインスタンスを別ファイルで作成
import { apiClient } from './ApiClient'
import styles from "./styles.module.css"

const GlobalContext = createContext()

function App() {
  //全てのTODOを管理する状態
  const [todos, setTodos] = useState([])
  //表示するTODOのみを管理する状態
  const [displayTodos, setDisplayTodos] = useState([])
  //すべてのTODO、完了したTODO、完了していないTODOの表示を切り替える状態
  const [mode, setMode] = useState("All")
  //TODOの名前の入力を管理する状態
  const [inputValue, setInputValue] = useState("")
  //日付の入力を管理する状態
  const [selectedDate, setSelectedDate] = useState(new Date())

  //サーバーからすべてのTODOを取ってくる関数
  const getAllTodo = async () => {
    const res = await apiClient("/getAllTodo")
    const sortTodos = res.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    console.log(sortTodos)
    setTodos(sortTodos)

    //TODOの変更が終わったら表示TODOをモードによって設定する
    if (mode === "All") {
      setDisplayTodos(sortTodos)
    } else if (mode === "Completed") {
      setDisplayTodos(sortTodos.filter(({ done }) => done === true))
    } else if (mode === "Uncompleted") {
      setDisplayTodos(sortTodos.filter(({ done }) => done !== true))
    }
  }

  //表示モードが変わるごとにgetAllTodoを呼び出して変更する
  useEffect(() => {
    getAllTodo()
  }, [mode])

  //フォーム送信時の関数
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue || !selectedDate) {
      alert("値が入力されていない箇所があります")
      return
    }
    console.log(e.target)
    const name = e.target[0].value;

    console.log("post")
    //フォームから得た値を使用してリクエストを飛ばす
    await apiClient.post("/addTodo", {
      name: name,
      done: false,
      createdAt: new Date(),
      deadline: selectedDate
    })

    //再度サーバーからTODOをすべて取ってくる
    getAllTodo()
    //フォーム中のインプットの中身をリセット
    setInputValue("")
    setSelectedDate("")
  }

  const changeMode = (mode) => setMode(mode)

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  //チェックボックスが変更されたときの関数
  const handleCheckboxChange = async (name) => {
    let newTodo;
    const updatedTodos = todos.map(todo => {
      if (todo.name === name) {
        newTodo = { ...todo, done: !todo.done }
        return newTodo; // 指定された ToDo の done  を反転させる
      }
      return todo; // 指定された ToDo 以外の場合はそのまま返す
    });
    console.log(newTodo);
    //新しいTODOを使用して更新する
    await apiClient.patch(`/todos/${newTodo.id}`, newTodo)
    getAllTodo()
  }

  const deleteTask = async (id) => {
    await apiClient.delete(`/todos/${id}`)
    getAllTodo()
  }

  //締切日と現在時刻の日付の差を取得する関数
  const checkDays = (deadline) => {
    const nowDate = new Date()
    const dlDate = new Date(deadline)

    const diffInMilliseconds = dlDate - nowDate;
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return diffInDays
  }

  return (
    <GlobalContext.Provider value={{ todos, setTodos, mode, setMode }}>
      <div className={styles.container}>
        <h1>ToDo list</h1>
        <form
          className={styles.formContainer}
          action=""
          onSubmit={(e) => handleSubmit(e)}>
          TODO: <input
            className={styles.inputTodoName}
            type="text"
            onChange={handleInputChange}
            value={inputValue}
            placeholder='何に挑戦する？'
          /><br></br>
          締切日: <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          /><br></br>
          <div className={styles.submitContainer}>
            <input
              className={styles.submitBtn}
              type="submit"
              value="送信"
            />
          </div>
        </form>
        <button onClick={() => changeMode("All")}>All</button>
        <button onClick={() => changeMode("Completed")}>Completed</button>
        <button onClick={() => changeMode("Uncompleted")}>Uncompleted</button>
        <div className='showTodos'>
          {
            //displayTodos(表示TODO)をmap関数で展開する
            displayTodos.map(({ id, name, done, deadline }) => {
              return (<li key={id}
                className={`${styles.todoContainer} ${
                  //付与するクラスを現在日付と締切日の日付差分に応じて変更する
                  (() => {
                    const leftDays = checkDays(deadline);
                    if (done) {
                      return styles.borderGreen
                    }
                    if (leftDays < 0) {
                      return styles.borderRed
                    } else if(leftDays <= 3){
                      return styles.borderYellow
                    }
                  })()
                }`}>
                <div className={styles.todoLeft}>
                  <input
                    type="checkbox" name="" id=""
                    onChange={() => handleCheckboxChange(name)}
                    checked={done ? true : false}
                  />
                  <span>
                    {name} 
                  </span>
                </div>
                <div className={styles.todoRight}>
                  <span className={styles.deadline}>締切:{deadline}</span>
                  <span>
                    {(() => {
                      //表示文字列を現在日付と締切日の日付差分に応じて変更する
                      if (done) {
                        return "完了！"
                      }
                      if (checkDays(deadline) >= 0) {
                        return `残り${checkDays(deadline)}日`
                      } else {
                        return `${-checkDays(deadline)}日超過`
                      }
                    })()
                    }
                  </span>
                  <button onClick={() => deleteTask(id)} className={styles.deleteBtn}>
                    削除
                  </button>
                </div>
              </li>
              )
            })
          }
        </div>
      </div>
    </GlobalContext.Provider>
  )
}

export default App
