import { useState, useEffect, useRef, ChangeEvent } from 'react';
import './EventScreen.css'; 


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
        <div className="mb-4">
          <div className="card " >
            <div className="card-body">
              <h4 className="card-title"> {question.content} </h4>
              <div className="row">
                {question.options.map((option, index)=>(
                  <div className="col-md-6 mb-2" key={index}>
                    <button key={index} type="button" className="btn btn-custom w-100">
                      {option.text}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>{renderQuestion(question)}</>
  )
}

export default EventScreen;