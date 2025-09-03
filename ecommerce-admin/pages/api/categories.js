import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req, res) {
    const { method } = req;

    await mongooseConnect();

    if (method === "GET") {
        try {
            const categories = await Category.find().populate("parent");
            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching categories" });
        }
    } else if (method === "POST") {
        try {
            const { name, parentCategory, properties } = req.body;
            const categoryDoc = await Category.create({
                name,
                parent: parentCategory || undefined,
                properties: properties || [],
            });
            res.status(200).json({
                message: "Category created",
                category: categoryDoc,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating category" });
        }
    } else if (method === "PUT") {
        try {
            const { name, parentCategory, _id, properties } = req.body;
            const categoryDoc = await Category.findByIdAndUpdate(
                _id,
                {
                    name,
                    parent: parentCategory || undefined,
                    properties: properties || []
                },
                { new: true }
            );

            res.status(200).json({
                message: "Category updated",
                category: categoryDoc,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error updating category" });
        }
    } else if (method === "DELETE") {
        try {
            const { _id } = req.query;
            await Category.findByIdAndDelete(_id);
            res.status(200).json({ message: "Category deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error deleting category" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
