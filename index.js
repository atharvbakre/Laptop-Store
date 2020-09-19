const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// Create Server when someone gets connected
const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // Get products page and add Cards of the available products
    if(pathName === '/products' || pathName === '/'){
        res.writeHead(200, { 'Content-type': 'text/html' });
        
        fs.readFile(`${__dirname}/data/templates/template-overview.html`, 'utf-8', (err, data) => {
            
            let overviewOutput = data;
            fs.readFile(`${__dirname}/data/templates/template-card.html`, 'utf-8', (err, data) => {
                
                let output = laptopData.map(el => replaceTemplate(el, data)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', output);

                res.end(overviewOutput);
            });
        });
    }

    // get details of the product selected
    else if(pathName === '/laptop' && id < laptopData.length){
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/data/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(laptop, data);
            
            res.end(output);
        });

    }

    // get image using Regex
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});

            res.end(data);
        });
    }

    // URL not found
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        
        res.end('Page not Found');
    }

});

// Listen for a connection
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests');
});

// Replace required strings, use regex for there may be more instances of a same type 
const replaceTemplate = function(laptop, data) {
    let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
};
