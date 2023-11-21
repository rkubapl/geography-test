const corsHeaders = {
	"Access-Control-Allow-Headers": "*",
	"Access-Control-Allow-Methods": "GET",
	"Access-Control-Allow-Origin": "*"
};

export interface Env {
	DB: D1Database;
}

export default {
	response(resp: object, status : number = 200) {
		return new Response(JSON.stringify(resp), {
			status,
			headers: corsHeaders
		});
	},
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response("OK", {
				headers: corsHeaders
			});
		}

		if (pathname === "/api/tests/all") {
			try {
				const { results } = await env.DB.prepare(
					"SELECT id, name, distinguishPoints FROM tests ORDER BY distinguishPoints DESC").all();
				return this.response({ success: true, results });
			} catch(e: any) {
				return this.response({ success: false, id: "ERROR", w: e.message, results: [] });
			}
		}

		if (pathname === "/api/tests/test") {
			try {
				if (searchParams.get("id")) {
					const { results } = await env.DB.prepare(
						"SELECT * FROM tests WHERE id = ?").bind(searchParams.get("id")).all();

					if (results.length > 0) {
						return this.response({ success: true, result: {...results[0], points: JSON.parse(<string>results[0].points)} });
					} else {
						return this.response({
							success: false,
							id: "NOT_FIND",
							message: "Didn't find test with this id!",
							result: {}
						});
					}
				}
			} catch (e: any) {
				return this.response({ success: false, id: "ERROR", message: e.message, result: {} });
			}
		}

		return this.response({status: false}, 405)
	},
};
