import Express from 'express';

const express = Express();

express.get('/', (req, res) => {
    res.send('Hello World!');
});

express.listen(3000);
