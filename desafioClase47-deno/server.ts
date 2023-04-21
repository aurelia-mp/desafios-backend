import { Application, Router, Context } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const app = new Application();
const router = new Router();

router.get('/', (ctx: Context) => {
    const listaColores = colores.map(color => {
        return (`<li style="color: ${color}">${color}</li>`)
    })
    ctx.response.body = `<!DOCTYPE html>
      <html>
        <head><title>Colors</title><head>
        <body style="background-color: black">
            <ul>
                ${listaColores}
            </ul>
        </body>
      </html>
    `;
});

let colores:String[] = [];

router.post("/", async (ctx: Context) => {
   
    const body = ctx.request.body({type: 'json'});
    const color : {color: String}  = await body.value;

    ctx.response.status = 200;
    ctx.response.body = {
        code: 200,
        data: {
            color: `${color.color}`
        },
        colores
    };
    colores.push(color.color)
    console.log(colores);
    
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
console.log('Listening on http://localhost:8080/')