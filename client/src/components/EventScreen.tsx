import { MouseEvent, useEffect, useState } from 'react';

import { Option, Question } from '../utils/interfaces.ts';
import './EventScreen.css'; 

interface EventScreenProps {
  question : Question;
  onOptionClick?: (userAnswer: Option) => void;
}

function EventScreen( { question, onOptionClick } : EventScreenProps){

  const [selectedAnswerId, setSelectedAnswerId] = useState<number>();

  // Called outside the EventScreen 
  function handleOptionClick(e:  MouseEvent<HTMLButtonElement>){
    const optionId = (e.target as HTMLButtonElement).value;
    const userAnswer = question.options.find((option) => option.id === parseInt(optionId))
    if(onOptionClick && userAnswer){
      setSelectedAnswerId(userAnswer.id);
      onOptionClick(userAnswer);
    }
  }

  useEffect(() => {
    setSelectedAnswerId(0);
  }, [question])

  function renderQuestion(currentQuestion : Question){
    return (
      <>
        <div className="mb-4">
          <div className="card" >
            <div className="card-body question-background">
              <h4 className="card-title question-content"> {currentQuestion.content} </h4>
              <div className="row">
                {currentQuestion.options.map((option, index)=>(
                  <div className="col-md-6 mb-2" key={index}>
                    <button 
                      key={index} 
                      type="button"
                      value={option.id}
                      className={`btn btn-custom w-100 ${selectedAnswerId == option.id ? 'selected' : ''}`}
                      disabled={
                        selectedAnswerId ? true : false}
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