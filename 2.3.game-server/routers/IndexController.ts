import { route, GET } from "awilix-koa";
import { Context } from "../interface/IKoa";
@route("/")
class IndexController {
    @route("/")
    @GET()
    async actionList(ctx: Context, next: () => Promise<unknown>): Promise<any> {
        ctx.body = await ctx.render("index")
    }
}
export default IndexController;