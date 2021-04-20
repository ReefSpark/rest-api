require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");

const { SequelizeCheck, sequelize } = require("./src/config/SequelizeConfig");

const AuthRoutes = require("./src/routes/auth.routes");
const TicketRoutes = require("./src/routes/ticket.routes");
const UserRoutes = require("./src/routes/user.routes");
const PurchaseTicket = require("./src/routes/purchase.routes");
const WinningNumberRoutes = require("./src/routes/winningNumber.routes");
const PriceCalculationRoutes = require("./src/routes/priceCalculation.routes");

const accessLogFileStream = fs.createWriteStream(
  path.join(__dirname, "accessFile.log"),
  {
    flags: "a",
  }
);

const app = express();
app.use(morgan("combined", { stream: accessLogFileStream }));
app.use(helmet());
app.use(helmet.dnsPrefetchControl({ allow: true }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || "3001";
app.use("/api", AuthRoutes);
app.use("/api", TicketRoutes);
app.use("/api", UserRoutes);
app.use("/api", PurchaseTicket);
app.use("/api", WinningNumberRoutes);
app.use("/api", PriceCalculationRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Models are created successfully");
  })
  .catch((err) => {
    console.log(err);
  });

SequelizeCheck();

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
