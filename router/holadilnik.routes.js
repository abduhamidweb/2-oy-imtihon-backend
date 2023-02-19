import express from "express";
const holadilnik = express.Router();
import fs from "fs";
import path from "path";
const productsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "/db/product.json"), "utf-8")) || "[]";
let CATEGORY = "holodilnik"
const obServer = JSON.parse(fs.readFileSync(path.join(process.cwd(), "/db/observer.json"), "utf-8")) || "[]";

holadilnik.get("/", (req, res) => {
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: "Holadilnik datalari uzatildi"
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
        let filterCategory = productsData.filter(category => {
            return category.category == CATEGORY
        })
        res.end(JSON.stringify(filterCategory))
    })
    .get("/:id", (req, res) => {
        let id = req.params.id;
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: id + "id li xoladilnik uzatildi."
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
        if (productsData.length < id) return res.status(404).send({
            message: "Product not found"
        })
        if (id) {
            let product = productsData.find(el => el.id == id);
            if (!product) return res.status(404).send({
                message: "Product not found"
            });
            if (product.category == CATEGORY) {
                res.end(JSON.stringify(product))
            } else {
                res.status(404).send({
                    message: "Product not found"
                });
            }
        }
    })
    .post("/", (req, res) => {
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: "holadilnik datasi qo'shildi."
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
                description
            } = req.body;
            if (
                !name &&
                !imagelink &&
                !description &&
                !price
            ) throw new Error("Not found maqsad!");
            req.body.category = CATEGORY
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
        let {
            id
        } = req.params;
        let obServerData = {
            id: obServer.length ? obServer[obServer.length - 1].id + 1 : 1,
            name: req.method,
            event: id + " Manashu dataga o'zgartirish kiritildi."
        }
        obServer.push(obServerData)
        fs.writeFileSync(
            process.cwd() + "/db/observer.json",
            JSON.stringify(obServer, null, 4)
        );
        try {

            let product = productsData.find((u) => u.id == id);
            if (!product) return res.send({
                message: "Product not found"
            });
            if (product.category == CATEGORY) {
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
            } else return res.send({
                message: "Error updating product SIz faqat " + CATEGORY + "  productini update qila olasiz."
            });
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
            event: id + " Manashu data o'chirildi."
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
        if (find.category == CATEGORY) {

            let array = productsData.filter((b) => b.id != id);
            fs.writeFileSync(
                process.cwd() + "/db/product.json",
                JSON.stringify(array, null, 4)
            );
            res.jsonp({
                ok: true,
            }).json(200)
        } else {
            res.send({
                status: 404,
                message: "You are not allowed to access this product.",
                accsept: `Siz faqat ${CATEGORY} larni o'chira olasiz.`
            })
        }
    })
export default holadilnik;