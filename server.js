const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));  // Serve static files

app.post('/submit-quiz', (req, res) => {
    const quizData = req.body;  // Receive username and score only

    fs.readFile('quiz-data.json', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error(err);
            return res.status(500).send('Error reading quiz data.');
        }

        const existingData = data ? JSON.parse(data) : [];
        existingData.push(quizData);  // Save username and score only

        fs.writeFile('quiz-data.json', JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving quiz data.');
            }
            res.send('Quiz data saved successfully!');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
