import ProductForm from "../../../components/ProductForm";
import Layout from "../../../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);   
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
            console.log(response.data);
        });
    }, [id]);
    return (
        <Layout>
        <h1>Edit Product</h1>   
        {productInfo && (
            <ProductForm {...productInfo}/>
        )}
        </Layout>
    )
}