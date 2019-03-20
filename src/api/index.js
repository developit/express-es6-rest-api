import { version } from "../../package.json";
import { Router } from "express";
import facets from "./facets";

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use("/facets", facets({ config, db }));
	api.use("/todos", require("./todos"));
	api.use("/users", require("./user"));
	// perhaps expose some API metadata at the root
	api.get("/", (req, res) => {
		res.json({ version });
	});

	return api;
};
