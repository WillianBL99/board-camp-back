import express,{json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(json());
app.use(routes);

app.listen(port, () => {
  console.log(chalk.blue(`Server is starting on port ${chalk.bold(port)}`));
})