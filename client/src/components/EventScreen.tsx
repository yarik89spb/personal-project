import { MouseEvent} from 'react';

import './EventScreen.css'; 


interface Option{
  // 一個選擇
  _id: string,
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question{
  // 題目的問題
  id: number;
  title: string;
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
  onOptionClick: (userAnswer: Option) => void;
}

function EventScreen( { question, onOptionClick } : EventScreenProps){

  // Called outside the EventScreen 
  function handleOptionClick(e:  MouseEvent<HTMLButtonElement>){
    const optionId = (e.target as HTMLButtonElement).value;
    const userAnswer = question.options.find((option) => option.id === parseInt(optionId))
    if(userAnswer){
      onOptionClick(userAnswer);
    }else{
      onOptionClick({
        _id: '000000000', 
        id: 0,
        text: 'unknown option',
        isCorrect: false});
    }
  }

  function renderQuestion(question : Question){
    return (
      <>
        <div className="mb-4">
          <div className="card" >
            <div className="card-body">
              <h4 className="card-title"> {question.content} </h4>
              <div className="row">
                {question.options.map((option, index)=>(
                  <div className="col-md-6 mb-2" key={index}>
                    <button 
                      key={index} 
                      type="button"
                      value={option.id}
                      className="btn btn-custom w-100"
                      onClick={(e)=> handleOptionClick(e)}
                    >
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