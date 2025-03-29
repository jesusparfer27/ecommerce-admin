import Layout from "../../components/Layout"

export default function NewProduct() {
    return (
        <Layout>
            <div className="flex flex-col gap-2 max-w-[40%]">
            <h1>New Product</h1>
            <label>Product Image</label>
            <input type="text" placeholder="product name" />
            <label>Description</label>
            <textarea placeholder="description"></textarea>
            <label>Price (in USD)</label>
            <input type="number" placeholder="price" />
            <button className="btn-primary">Save</button>
            </div>
        </Layout>
    )
}