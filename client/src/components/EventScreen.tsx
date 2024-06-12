import { useState, useEffect, useRef, ChangeEvent } from 'react';


interface Option{
  // 一個選擇
  text: string;
  isCorrect: boolean;
}

interface Question{
  // 題目的問題
  content: string;
  options: Option[];
}

// interface Task{
//   // 一個題目（畫面）
//   project: Question[];
//   type?: String;
//   isInteractive: Boolean;
// }

interface EventScreenProps {
  question : Question;
}

function EventScreen( { question } : EventScreenProps){
  function renderQuestion(question : Question){
    return (
      <>
        <h3>Task</h3>
        <div>
          <h4> {question.content} </h4>
          <div>{question.options.map((option)=>{
            return <button>{option.text}</button>
          })}
          </div>
        </div>
      </>
    )
  }

  return <>{renderQuestion(question)}</>;
}

export default EventScreen;