import * as prod from "~/environments/environment.prod";
import * as debug from "~/environments/environment.debug";

declare var isProduction: boolean;
let environment = isProduction ? prod : debug;

export default environment;