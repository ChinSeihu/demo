<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>9-Digit Number Formatter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
            color: #333;
            line-height: 1.6;
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            width: 100%;
            max-width: 1000px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        header {
            background: linear-gradient(to right, #2c3e50, #4a6491);
            color: white;
            padding: 25px 30px;
            text-align: center;
        }
        
        header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        header p {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 700px;
            margin: 0 auto;
        }
        
        .content {
            display: flex;
            padding: 20px;
            gap: 20px;
        }
        
        .input-section, .output-section {
            flex: 1;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        
        .panel-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e1e4e8;
        }
        
        .panel-title h2 {
            font-size: 1.4rem;
            color: #2c3e50;
        }
        
        .stats {
            background: #e3e7eb;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        textarea {
            width: 100%;
            height: 300px;
            padding: 15px;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            resize: vertical;
            font-family: 'Consolas', monospace;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        textarea:focus {
            border-color: #3498db;
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .button-group {
            display: flex;
            gap: 15px;
            margin: 25px 0;
        }
        
        button {
            flex: 1;
            padding: 14px 10px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        #formatBtn {
            background: linear-gradient(to right, #3498db, #2c80b9);
            color: white;
        }
        
        #formatBtn:hover {
            background: linear-gradient(to right, #2c80b9, #256a9c);
        }
        
        #copyBtn {
            background: linear-gradient(to right, #2ecc71, #27ae60);
            color: white;
        }
        
        #copyBtn:hover {
            background: linear-gradient(to right, #27ae60, #219653);
        }
        
        #clearBtn {
            background: linear-gradient(to right, #e74c3c, #c0392b);
            color: white;
        }
        
        #clearBtn:hover {
            background: linear-gradient(to right, #c0392b, #a23526);
        }
        
        .output-container {
            border: 2px solid #d1d5db;
            border-radius: 8px;
            padding: 15px;
            background: white;
            min-height: 300px;
            max-height: 400px;
            overflow-y: auto;
            font-family: 'Consolas', monospace;
            white-space: pre;
            line-height: 1.8;
        }
        
        .processing {
            display: none;
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
        }
        
        .progress-container {
            width: 100%;
            background: #e0e0e0;
            border-radius: 10px;
            margin: 15px 0;
            height: 20px;
            overflow: hidden;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(to right, #3498db, #2c80b9);
            border-radius: 10px;
            width: 0%;
            transition: width 0.3s;
        }
        
        .notification {
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 18px 28px;
            background: #2ecc71;
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s;
            font-weight: 600;
            z-index: 1000;
        }
        
        .notification.error {
            background: #e74c3c;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f0f3f7;
            border-top: 1px solid #e1e4e8;
        }
        
        .feature-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        
        .feature-card h3 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .feature-card p {
            color: #555;
            font-size: 0.95rem;
        }
        
        .icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #3498db;
        }
        
        @media (max-width: 768px) {
            .content {
                flex-direction: column;
            }
            
            header h1 {
                font-size: 2rem;
            }
            
            .button-group {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>9-Digit Number Formatter</h1>
            <p>Format large lists of 9-digit numbers with quotes and commas for SQL or programming use</p>
        </header>
        
        <div class="content">
            <div class="input-section">
                <div class="panel-title">
                    <h2>Input Data</h2>
                    <div class="stats">Lines: <span id="lineCount">0</span></div>
                </div>
                <textarea id="inputText" placeholder="Enter your 9-digit numbers (one per line):
Example:
000003489
000014562
000037824"></textarea>
            </div>
            
            <div class="output-section">
                <div class="panel-title">
                    <h2>Formatted Output</h2>
                    <div class="stats">Items: <span id="outputCount">0</span></div>
                </div>
                <div id="outputText" class="output-container">Formatted results will appear here</div>
            </div>
        </div>
        
        <div id="processing" class="processing">
            <h3>Processing Data...</h3>
            <p>Please wait while we format your numbers</p>
            <div class="progress-container">
                <div id="progressBar" class="progress-bar"></div>
            </div>
            <p>Progress: <span id="progressText">0%</span></p>
        </div>
        
        <div class="button-group">
            <button id="formatBtn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm12 3a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1 0-1h11a.5.5 0 0 1 .5.5zm-6 2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5z"/>
                </svg>
                Format Data
            </button>
            <button id="copyBtn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
                Copy Results
            </button>
            <button id="clearBtn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                Clear All
            </button>
        </div>
        
        <div class="features">
            <div class="feature-card">
                <div class="icon">🔢</div>
                <h3>Format Validation</h3>
                <p>Ensures all entries are exactly 9-digit numbers</p>
            </div>
            <div class="feature-card">
                <div class="icon">💾</div>
                <h3>Local Processing</h3>
                <p>All data processed in your browser - nothing sent to servers</p>
            </div>
            <div class="feature-card">
                <div class="icon">⚡</div>
                <h3>High Performance</h3>
                <p>Optimized to handle up to 5,000 rows efficiently</p>
            </div>
            <div class="feature-card">
                <div class="icon">📋</div>
                <h3>Easy Copy</h3>
                <p>One-click copy to clipboard for immediate use</p>
            </div>
        </div>
    </div>
    
    <div id="notification" class="notification">Results copied to clipboard!</div>

    <script>
        // Initialize DOM elements
        const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const formatBtn = document.getElementById('formatBtn');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');
        const notification = document.getElementById('notification');
        const lineCount = document.getElementById('lineCount');
        const outputCount = document.getElementById('outputCount');
        const processing = document.getElementById('processing');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        // Initialize line counter
        function updateLineCount() {
            const lines = inputText.value.trim().split('\n').filter(line => line.trim() !== '');
            lineCount.textContent = lines.length;
        }
        
        // Set initial example data
        inputText.value = '000003489\n000014562\n000037824';
        updateLineCount();
        
        // Update line count on input
        inputText.addEventListener('input', updateLineCount);
        
        // Format numbers function
        formatBtn.addEventListener('click', function() {
            const input = inputText.value.trim();
            if (!input) {
                outputText.textContent = 'Please enter at least one 9-digit number';
                outputText.style.color = '#e74c3c';
                outputCount.textContent = '0';
                return;
            }
            
            // Disable buttons and show processing
            formatBtn.disabled = true;
            copyBtn.disabled = true;
            processing.style.display = 'block';
            
            // Process data asynchronously to prevent UI blocking
            setTimeout(() => {
                const lines = input.split('\n');
                const totalLines = lines.length;
                const result = [];
                let validCount = 0;
                let hasError = false;
                let errorMessage = '';
                
                // Process in batches for large datasets
                const batchSize = 500;
                const batchCount = Math.ceil(totalLines / batchSize);
                
                function processBatch(batchIndex) {
                    const start = batchIndex * batchSize;
                    const end = Math.min(start + batchSize, totalLines);
                    
                    for (let i = start; i < end; i++) {
                        const num = lines[i].trim();
                        if (!num) continue;
                        
                        // Validate 9-digit number format
                        if (!/^\d{9}$/.test(num)) {
                            hasError = true;
                            errorMessage = `Error: "${num}" is not a valid 9-digit number`;
                            break;
                        }
                        
                        result.push(`'${num}'`);
                        validCount++;
                    }
                    
                    // Update progress
                    const progress = Math.round(((batchIndex + 1) / batchCount) * 100);
                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${progress}%`;
                    
                    // Process next batch or finish
                    if (!hasError && batchIndex < batchCount - 1) {
                        setTimeout(() => processBatch(batchIndex + 1), 1);
                    } else {
                        // Processing complete
                        if (hasError) {
                            outputText.textContent = errorMessage;
                            outputText.style.color = '#e74c3c';
                        } else {
                            outputText.textContent = result.join(',\n');
                            outputText.style.color = '#333';
                        }
                        
                        outputCount.textContent = validCount;
                        formatBtn.disabled = false;
                        copyBtn.disabled = false;
                        processing.style.display = 'none';
                        progressBar.style.width = '0%';
                        
                        // Show notification if no valid entries
                        if (validCount === 0 && !hasError) {
                            showNotification('No valid 9-digit numbers found', true);
                        }
                    }
                }
                
                // Start processing
                processBatch(0);
            }, 100);
        });
        
        // Copy to clipboard function
        copyBtn.addEventListener('click', function() {
            const output = outputText.textContent;
            if (!output.trim() || output.startsWith('Please enter') || output.startsWith('Error:')) {
                showNotification('No content to copy', true);
                return;
            }
            
            // Use modern Clipboard API
            navigator.clipboard.writeText(output).then(() => {
                showNotification('Results copied to clipboard!');
            }).catch(err => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = output;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showNotification('Results copied to clipboard!');
            });
        });
        
        // Clear all fields
        clearBtn.addEventListener('click', function() {
            inputText.value = '';
            outputText.textContent = 'Formatted results will appear here';
            outputText.style.color = '#333';
            lineCount.textContent = '0';
            outputCount.textContent = '0';
        });
        
        // Show notification function
        function showNotification(message, isError = false) {
            notification.textContent = message;
            notification.className = isError ? 'notification error' : 'notification';
            notification.style.opacity = 1;
            
            setTimeout(() => {
                notification.style.opacity = 0;
            }, 3000);
        }
    </script>
</body>
</html>
