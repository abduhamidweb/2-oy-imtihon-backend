import express from "express";
import noutbuk from "./router/noutbuk.routes.js";
import cors from "cors";
import smartphone from "./router/smartphone.routes.js";
import holadilnik from "./router/holadilnik.routes.js";
import products from "./router/products.routes.js";
const port = process.env.PORT || 5000;
const app = express();
// GET /db/product.json category product
app.use(cors("*"));
app.use(express.json());
app.use("/noutbuk", noutbuk);
app.use("/smartfon", smartphone);
app.use("/holodilnik", holadilnik);
app.use("/products", products);
app.get("/*", (req, res) => {
    res.send({
        message: "Bu saxifa mavjud emas."
    })
})
app.listen(port, () => console.log("This port is listening on port " + port));