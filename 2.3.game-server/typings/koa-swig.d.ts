declare module "koa-swig" {
    function renderer<T>(value: T): any;
    namespace renderer {
        interface defaultSettings {
            root?: string,
            autoescape?: boolean,
            writeBody: boolean,
            cache?: string | boolean, // disable, set to false
            ext: string
        }
    }
    export default renderer;
}