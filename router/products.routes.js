import fs from "fs";
import path from "path";
import express from "express";
const products = express.Router();
const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "/db/product.json"), "utf-8")) || "[]";
const obServer = JSON.parse(fs.readFileSync(path.join(process.cwd(), "/db/observer.json"), "utf-8")) || "[]";
products.get("/", (req, res) => {
        res.end(JSON.stringify(productsData))
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: "Hamma Productlar berildi."
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
    })
    .get("/:id", (req, res) => {

        let id = req.params.id;
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: id + "ID bo'yicha productlar olindi."
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
        if (id) {
            let product = productsData.find(el => el.id == id);
            if (product) {
                let obServerData = {
                    id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
                    name: req.method,
                    event: id + " selected by id."
                }
                obServer.push(obServerData)
                fs.writeFileSync(
                    process.cwd() + "/db/observer.json",
                    JSON.stringify(obServer, null, 4)
                );
                res.end(JSON.stringify(product))

            } else {
                res.status(404).send({
                    message: "Product not found " + id
                });
            }
        }
    })
    .post("/", (req, res) => {

        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: " Malumot qo'shildi shekilli xato qilgan bo'lsangiz qo'shilmagan bo'lishi ham mumkun."
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
        try {
            const {
                name,
                imagelink,
                price,
                description,
                category
            } = req.body;
            if (
                !name &&
                !category &&
                !imagelink &&
                !description &&
                !price
            ) throw new Error("Not found maqsad!");
            req.body.id = productsData.length ? productsData[productsData.length - 1].id + 1 : 1;
            productsData.push(req.body);
            fs.writeFileSync(
                process.cwd() + "/db/product.json",
                JSON.stringify(productsData, null, 4)
            );
            res.status(200).send("The product was created successfully!");
        } catch (error) {
            res.end(error)
        }
    })
    .put("/:id", (req, res) => {
        try {
            let {
                id
            } = req.params;
            let product = productsData.find((u) => u.id == id);
            if (!product) return res.status(404).send({
                message: "Product not found"
            });
            if (product) {
                let obServerData = {
                    id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
                    name: req.method,
                    event: id + " updated",
                }
                obServer.push(obServerData)
                fs.writeFileSync(
                    process.cwd() + "/db/observer.json",
                    JSON.stringify(obServer, null, 4)
                );
                const {
                    name,
                    imagelink,
                    price,
                    description,
                    category
                } = req.body;
                if (
                    !name ||
                    !imagelink ||
                    !description ||
                    !price ||
                    !category
                )

                    throw new Error("Not found maqsad!");
                product.name = name ? name : product.name;
                product.imagelink = imagelink ? imagelink : product.imagelink;
                product.description = description ? description : product.description;
                product.category = category ? category : product.category;
                product.price = price ? price : product.price;
                fs.writeFileSync(process.cwd() + "/db/product.json", JSON.stringify(productsData, null, 4))
                res.end("User " + id + " updated!");
            } else {
                throw new Error("Not found " + id + " -category")
            }
        } catch (error) {
            res.end(error)
        }
    })
    .delete("/:id", (req, res) => {
        let {
            id
        } = req.params;
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: id + " o'chirildi"
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
        const find = productsData.find((b) => b.id == id);
        if (!find) {
            res.jsonp({
                ok: false
            }).status(404);
        }
        let array = productsData.filter((b) => b.id != id);

        fs.writeFileSync(
            process.cwd() + "/db/product.json",
            JSON.stringify(array, null, 4)
        );
        res.jsonp({
            ok: true,
        }).json(200)
    })
export default products;