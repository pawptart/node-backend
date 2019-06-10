import express = require('express');
import { MongoClient } from 'mongodb';

// Express app config
const app = express();
const port = 3000;
const mongoUrl = 'mongodb+srv://test:test@cluster0-9igoz.mongodb.net/test?retryWrites=true&w=majority';

let getNotes = (req: any, res: any) => {

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {
		
		if (err) throw err;

		const db = client.db('note');

		let notePromise = () => {
			return new Promise((resolve, reject) => {
				db
					.collection('notes')
					.find({})
					.toArray(function(err: any, data: any) {
						if (err) throw err;
						resolve(data);
						});
			});
		}

		let callNotePromise = async () => {
			let result = await (notePromise());
			return result;
		}

		callNotePromise().then((result) => {

			client.close();
			res.json(result);

		});

	});

}

let createNote = (req: any, res: any) => {

	MongoClient.connect( mongoUrl, { useNewUrlParser: true }, (err: any, client: any) => {

		if (err) throw err;

		var db = client.db('note');
		
		db.collection('notes').insertOne({
			title: "Testing!",
			content: "This is just a test, for real." 
		});

		client.close();
	});	

}

// API endpoints

app.get( '/api/notes', getNotes );
app.get( '/api/notes/create', createNote );

app.listen( process.env.PORT || 8080, () => {
	console.log( "SERVER STARTED" );
});

