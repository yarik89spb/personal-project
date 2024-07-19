import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProjectConstructor.css'


const ProjectConstructor = () => {
  const { userId } = useContext(AuthContext);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: '',
      content: '',
      botNote: '',
      options: [{ id: 11, text: '', isCorrect: false }],
    },
  ]);
  const [nextQuestionId, setNextQuestionId] = useState(2); // To manage unique IDs for questions

  const handleQuestionChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    let newQuestions = [...questions];

    if (name.includes('option')) {
      const optionIndex = parseInt(name.split('-')[1], 10);
      newQuestions[index].options[optionIndex].text = value;
    } else if (name === 'title') {
      newQuestions[index].title = value;
    } else if (name === 'content') {
      newQuestions[index].content = value;
    } else if (name === 'botNote') {
      newQuestions[index].botNote = value;
    }  else if (name.startsWith('correct')) {
      const optionIndex = parseInt(name.split('-')[1], 10);
      newQuestions[index].options[optionIndex].isCorrect = (event.target as HTMLInputElement).checked;
    }

    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nextQuestionId,
        title: '',
        content: '',
        botNote: '',
        options: [{ id: nextQuestionId * 10 + 1, text: '', isCorrect: false}],
      },
    ]);
    setNextQuestionId(nextQuestionId + 1);
  };

  const addOption = (questionIndex: number) => {
    let newQuestions = [...questions];
    let nextOptionId = newQuestions[questionIndex].options.length
      ? newQuestions[questionIndex].options[newQuestions[questionIndex].options.length - 1].id + 1
      : newQuestions[questionIndex].id * 10 + 1;
    newQuestions[questionIndex].options.push({ id: nextOptionId, text: '', isCorrect: false});
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    let newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if(!questions || questions.length === 1){
      alert('Project must have at least one question');
      throw new Error('Cannot remove the last question');
    }

    let newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if(!questions || questions.length === 0){
      alert('Please, add at least one question');
      throw new Error('No questions added');
    }

    e.preventDefault();
    // Prepare the project object in the desired format
    const projectObject = {
      projectName,
      userId,
      description,
      questions: questions.map((question) => ({
        id: question.id,
        title: question.title,
        content: question.content,
        botNote: question.botNote,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      })),
    };
    await addProjectData(projectObject);
    // Reset form after submission
    setProjectName('');
    setDescription('');
    setQuestions([{ id: 1, title: '', content: '', botNote: '', options: [{ id: 11, text: '', isCorrect: false }] }]);
  };

  async function addProjectData(projectObject: object){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/project/add-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectObject),
    });
    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error(`${errorData.text}`);
    }
  }

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow-sm">
      <h2 className="mb-4 constructor-title">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            className="form-control"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder='專案標題'
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='簡單説明專案的主題和目標'
            required
          />
        </div>
        <div className="question-list">
          {questions.map((question, index) => (
            <div key={index} className="question-container p-2 mb-3 border rounded">
              <div className="form-group">
                <label>Question {index + 1} Title:</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={question.title}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder='僅主持人可見'
                  required
                />
              </div>
              <div className="form-group">
                <label>Question {index + 1} Content:</label>
                <textarea
                  className="form-control"
                  name="content"
                  value={question.content}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder='觀衆看到的内容'
                  required
                />
              </div>
              <div className="form-group">
                <label>Question {index + 1} bot note:</label>
                <textarea
                  className="form-control"
                  name="botNote"
                  value={question.botNote}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder='注意：當時内容會被機器人貼在聊天室'
                  required
                />
              </div>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="form-group d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control text-area-auto-grow"
                    name={`option-${optionIndex}`}
                    value={option.text}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                  <div className='checkbox-group d-flex align-items-center'>
                    <div className='correct-option-text'>Correct answer</div>
                    <input
                      type="checkbox"
                      name={`correct-${optionIndex}`}
                      checked={option.isCorrect}
                      onChange={(e) => handleQuestionChange(index, e)}
                      />
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => removeOption(index, optionIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => addOption(index)}>
                Add Option
              </button>
              <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => removeQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={addQuestion}>
          Add Question
        </button>
        <br />
        <button type="submit" className="btn btn-success mt-3">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default ProjectConstructor;
