import express = require('express');
import bodyParser = require('body-parser');
import { ObjectID } from 'mongodb';
import { mongoConnect } from './mongo-connect';

(async () => {
	// Express app config
	const app = express();
	const mongoUrl = 'mongodb+srv://test:test@cluster0-9igoz.mongodb.net/test?retryWrites=true&w=majority';
	const port = process.env.PORT || 3000;

	// body-parser config
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// Allow Cross Domain Requests
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
		res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
		next();
	});

	let getNotes = async (req: any, res: any) => {
		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, 'note');

		let notePromise = () => {
			return new Promise((resolve, reject) => {
				mongoDb
					.collection('notes')
					.find({})
					.toArray(function (err: any, data: any) {
						if (err) throw err;
						resolve(data);
					});
			});
		}

		let callNotePromise = async () => {
			try {
				let result = await notePromise();
				return result;
			}
			catch (err) {
				res.status(500).send({status: "error", error: err});
				return;
			}
		}

		const result = await callNotePromise();
		try {
			await mongoClient.close();
		}
		catch (err) {
			res.status(500).send({ status: 'error', error: err });
			return;
		}

		res.json(result);
	}

	let createNote = async (req: any, res: any) => {

		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, 'note');
		let data = req.body;
		try {
			await mongoDb.collection('notes').insertOne(data);
		}
		catch (err) {
			res.status(500).send({ status: 'error', error: err });
			return;
		}

		try {
			await mongoClient.close();
		}
		catch (err) {
			res.status(500).send({ status: 'error', error: err });
			return;
		}
		res.status(500).send({ status: "Success" });

	}

	let deleteNote = async (req: any, res: any) => {

		let id = req.params.id;
		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, 'note');
	
		try {
			mongoDb
				.collection('notes')
				.deleteOne({ _id: new ObjectID(id) }, (err: any) => {
					if (err) throw err;
				});
		}
		catch (err) {
			res.status(500).send({ status: 'error', error: err });
			return;
		}

		try {
			mongoClient.close();
		}
		catch (err) {
			res.status(500).send({ status: 'error', error: err });
			return;
		}
		
		res.status(200).send({ status: "Success" });
	
	}

	let updateNote = async (req: any, res: any) => {

		let id = req.params.id;
		let data = req.body;

		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, 'note');

		try {
			mongoDb
				.collection('notes')
				.updateOne(
					{ _id: new ObjectID(id) },
					{ $set: { title: data.title, content: data.content } },
					(err: any) => {
						if (err) throw err;
					});
		}
		catch (err) {
			res.status(500).send({status: "error", error: err});
			return;
		}

		try {
			mongoClient.close();
		}
		catch (err) {
			res.status(500).send({status: "error", error: err});
			return;
		}

		res.status(200).send({ status: "Success" });

	}

	let getNote = async (req: any, res: any) => {

		let id = req.params.id;
		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, "note");
		
			let notePromise = () => {
				return new Promise((resolve, reject) => {
					mongoDb
						.collection('notes')
						.find({ _id: new ObjectID(id) })
						.toArray((err: any, data: any) => {
							if (err) throw err;
							resolve(data);
						});
				});
			}

			let callNotePromise = async () => {
				try {
					let result = await (notePromise());
					return result;
				}
				catch (err) {
					res.status(500).send({status: "error", error: err});
					return;
				}
			}

			callNotePromise().then((result) => {
				try {
					mongoClient.close();
				}
				catch (err) {
					res.status(500).send({status: "error", error: err});
					return;
				}
				res.json(result);
			});
	}

	let createTag = async (req: any, res: any) => {

		let data = req.body;
		let noteId = req.params.id;
		const { mongoDb, mongoClient } = await mongoConnect(mongoUrl, "note");

		try {
			mongoDb
			.collection('notes')
			.updateOne(
				{ _id: new ObjectID(noteId) },
				{ $push: { tags: data } },
				(err: any) => {
					if (err) throw err;
				}
			)
		}
		catch (err) {
			res.status(500).send({status: "error", error: err});
			return;
		}
		
		res.status(200).send({ status: "Success" });
	}
	

	// API endpoints for notes
	app.get('/api/notes', getNotes);
	app.post('/api/notes/create', createNote);
	app.delete('/api/notes/delete/:id', deleteNote);
	app.patch('/api/notes/update/:id', updateNote);
	app.get('/api/notes/:id', getNote);

	// API endpoints for tags
	app.post('/api/notes/:id/tags/create', createTag);

	app.listen(port, function () {
		console.log(`Server started, listening on port ${port}.`)
	});

})();
