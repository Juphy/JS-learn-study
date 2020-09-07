import { serve } from "https://deno.land/std@0.66.0/http/server.ts";
const s = serve({ hostname: '10.110.30.116', port: 9000 });
console.log("http://localhost:9000/");
for await (const req of s) {
    req.respond({ body: "Hello World\n" });
}
