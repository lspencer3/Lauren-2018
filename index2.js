const crypto = require('crypto')
const fs = require('fs')
const inquirer = require('inquirer');
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;


let credentials = {
    key: fs.readFileSync('private.pem', 'utf-8'),
    passphrase: 'Angela1125$$'
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

let user = {}

//function to secure pw in mongo database through hash
const hash = crypto.createHash('sha256');

function hasher(input){
	const hash = crypto.createHash('sha256');

    hash.update(input);
    return hash.digest('hex')
}


function readPub(userparam){
	inquirer.prompt([
    {
	    message: "Please Re-enter your Password/passphrase to store public key",
	    name: 'pw2',
	    type: 'input'
    }
    ]).then(function(res){
        console.log(res.pw2)

        console.log(userparam.u1)

	    //some authentication comparing hash values

	    let securepw2 = hasher(res.pw2)

	    console.log("hashed pwd again")
        if(securepw2 == userparam.u1){
	    
		    console.log('user authenticated...storing public key')

		    const public_key = fs.readFileSync('public.pem', 'utf-8')
			console.log("stored public key = " + public_key)

			    inquirer.prompt([
		    {
			    message: "Sign the message in the .txt file",
			    name: 'answer',
			    type: 'confirm'
		    }
		    ]).then(function(res){

		    	signMessageandVerify(public_key)
		    })

		}

	    else{
	    	console.log("not a user")
	    }
	})    
}


function signMessageandVerify(pubkeyparam){

	const privateKey = fs.readFileSync('private.pem', 'utf-8')

	const message = fs.readFileSync('message.txt', 'utf-8')

	const signer = crypto.createSign('sha256');

	signer.update(message);
	signer.end();

	const signature = signer.sign(credentials)
	const signaturehex = signature.toString('hex')

	console.log('signature = '+ signaturehex)

	verify(message,pubkeyparam,signature)
}


function verify(messageparam,pubkeyparam,sigparam){
	const verifier = crypto.createVerify('sha256');
	verifier.update(messageparam);
	verifier.end();

	const verified = verifier.verify(pubkeyparam, sigparam);

	console.log(JSON.stringify({
	    message: messageparam,
	    signature: sigparam,
	    verified: verified,
	}, null, 2))
}


function createUser(){
	inquirer.prompt([
    {
	    message: "Please Enter a Password/passphrase",
	    name: 'pw',
	    type: 'input'
    }
    ]).then(function(res){
        console.log(res.pw)

	    //securing user pw
	    let securepw = hasher(res.pw)
	    console.log('\nvariable ' + securepw+'\n')

	    let user ={u1:securepw}

	    console.log(user)

	    readPub(user)
	})    
}


//createUser();

//xhttp.send();

/*http.get('/add_user', (res,err) => {

  if (statusCode !== 200) {
    console.log(err)
    // consume response data to free up memory
    res.resume();
    return;
  }
}) */ 

/*  hostname: 'localhost',
  port: 3000,
  path: '/add_user',
}, (res) => {
  console.log('yay')
  //response.send('yay')

  res.writeHead(200);
  res.end('Feel free to add query parameters to the end of the url');
});*/

/*const HttpClient = function() {
    this.get = function(aUrl, aCallback) {
	    var anHttpRequest = new XMLHttpRequest();
	    anHttpRequest.onreadystatechange = function() { 
		    if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200){
		        aCallback(anHttpRequest.responseText);
		    }    
		    anHttpRequest.open( "GET", aUrl, true );            
		    anHttpRequest.send( null );   
	    }
	}    
}


const client = new HttpClient();
client.get('/add_user', function(response) {

	//response.end('did it')
});*/



