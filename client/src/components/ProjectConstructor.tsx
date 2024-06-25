import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';


const ProjectConstructor = () => {
  const { userId } = useContext(AuthContext);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: '',
      content: '',
      options: [{ id: 11, text: '', isCorrect: false }],
    },
  ]);
  const [nextQuestionId, setNextQuestionId] = useState(2); // To manage unique IDs for questions

  const handleQuestionChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'title') {
      let newQuestions = [...questions];
      newQuestions[index].title = value;
      setQuestions(newQuestions);
    } else if (name === 'content') {
      let newQuestions = [...questions];
      newQuestions[index].content = value;
      setQuestions(newQuestions);
    } else if (name.includes('option')) {
      let optionIndex = parseInt(name.split('-')[1], 10);
      let newQuestions = [...questions];
      newQuestions[index].options[optionIndex].text = value;
      setQuestions(newQuestions);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nextQuestionId,
        title: '',
        content: '',
        options: [{ id: nextQuestionId * 10 + 1, text: '', isCorrect: false }],
      },
    ]);
    setNextQuestionId(nextQuestionId + 1);
  };

  const addOption = (questionIndex: number) => {
    let newQuestions = [...questions];
    let nextOptionId = newQuestions[questionIndex].options.length
      ? newQuestions[questionIndex].options[newQuestions[questionIndex].options.length - 1].id + 1
      : newQuestions[questionIndex].id * 10 + 1;
    newQuestions[questionIndex].options.push({ id: nextOptionId, text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    let newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    let newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      })),
    };
    console.log(projectObject);
    await addProjectData(projectObject);
    // Reset form after submission
    setProjectName('');
    setDescription('');
    setQuestions([{ id: 1, title: '', content: '', options: [{ id: 11, text: '', isCorrect: false }] }]);
  };

  async function addProjectData(projectObject: object){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/add-project`, {
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
    <div>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        {questions.map((question, index) => (
          <div key={index}>
            <label>
              Question {index + 1} Title:
              <input
                type="text"
                name="title"
                value={question.title}
                onChange={(e) => handleQuestionChange(index, e)}
                required
              />
            </label>
            <br />
            <label>
              Question {index + 1} Content:
              <textarea
                value={question.content}
                name="content"
                onChange={(e) => handleQuestionChange(index, e)}
                required
              />
            </label>
            <br />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label>
                  Option {optionIndex + 1}:
                  <input
                    type="text"
                    name={`option-${optionIndex}`}
                    value={option.text}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeOption(index, optionIndex)}
                >
                  Remove Option
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addOption(index)}>
              Add Option
            </button>
            <button type="button" onClick={() => removeQuestion(index)}>
              Remove Question
            </button>
            <hr />
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <br />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default ProjectConstructor;
