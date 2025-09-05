// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import {mongooseConnect} from "../../lib/mongoose";
import {Product} from "../../models/Product";

export default async function handler(req, res) {
  const {method} = req;
  await mongooseConnect()
  // mongoose.connect(clientPromise.url)
  if (method === 'POST') {
    const { title, description, price } = req.body;
    const productDoc = await Product.create({
      title, description, price,
    })
    res.json(productDoc)
  }
}
