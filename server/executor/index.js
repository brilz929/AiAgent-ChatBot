import express from 'express';
import cors from 'cors';

// Helper to safely execute code
async function executeJavaScript(code) {
  console.log('  [Executing Code]');
  console.log('  ' + code.substring(0, 100) + '...\n');
  
  // Capture console output
  const outputs = [];
  const originalLog = console.log;
  
  console.log = (...args) => {
    const output = args.join(' ');
    outputs.push(output);
    originalLog('  Output:', output);
  };
  
  try {
    // Create async function wrapper
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction(code);
    
    // Execute
    const result = await fn();
    
    // Capture return value
    if (result !== undefined) {
      outputs.push(`Returned: ${JSON.stringify(result)}`);
    }
    
    console.log = originalLog;
    return { 
      success: true, 
      output: outputs.join('\n') 
    };
    
  } catch (error) {
    console.log = originalLog;
    return { 
      success: false, 
      output: `Error: ${error.message}` 
    };
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({ origin: '*' }))

app.post('/', async (req, res) => {
    const { code } = req.body;
    console.log('Executing running code:');
    console.log(code)
    const result = await executeJavaScript(code);
    
    //run code
    res.json({result})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})