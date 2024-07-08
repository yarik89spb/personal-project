import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function addWordCounts(projectId) {
  const pythonScriptPath = path.join(__dirname, '../nlp/user_comments.py');

  const pythonProcess = spawn('python', [pythonScriptPath, projectId]);

  pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });
}

export function addKeyWords(projectId) {
  const pythonScriptPath = path.join(__dirname, '../nlp/project_content.py');

  const pythonProcess = spawn('python', [pythonScriptPath, projectId]);

  pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });
}

