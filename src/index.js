const http = require("http");
const { getUsers } = require("./modules/users");
const { URL } = require("url");

const HOST = "127.0.0.1";
const PORT = process.env.PORT || 3003;

const server = http.createServer((request, response) => {
    const url = new URL(request.url, `http://${HOST}:${PORT}`);
    const params = url.searchParams;
    const keys = [...params.keys()];

    if (keys.length === 0) {
        response.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("Hello, World!");
        return;
    }

    if (params.has("hello")) {
        const name = params.get("hello");

        if (!name) {
            response.writeHead(400, {
                "Content-Type": "text/plain; charset=utf-8",
            });
            response.end("Enter a name");
            return;
        }

        response.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
        });
        response.end(`Hello, ${name}.`);
        return;
    }

    if (params.has("users") && keys.length === 1) {
        getUsers()
            .then((users) => {
                response.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8",
                });
                response.end(JSON.stringify(users));
            })
            .catch((error) => {
                console.error("Error reading users:", error);
                response.writeHead(500, {
                    "Content-Type": "text/plain; charset=utf-8",
                });
                response.end();
            });

        return;
    }

    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end();
});

server.listen(PORT, HOST, () => {
    console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
