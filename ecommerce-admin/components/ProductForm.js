// import { Product } from "../models/Product";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
// import { link } from "fs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: existingCategory,   // ✅ aquí lo defines
    properties: existingProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState
        (existingDescription || '')
    const [category, setCategory] = useState(existingCategory || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState(existingProperties || [])
    // 🔑 transformamos existingImages (strings) en objetos {id, src}
    const [images, setImages] = useState(
        existingImages?.map((link, index) => ({
            id: `${Date.now()}-${index}`,
            src: link,
        })) || []
    );
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter(); // ✅ Inicializa useRouter

    useEffect(() => {
        axios.get('/api/categories').then(response => {
            setCategories(response.data);
        });
    }, [])

    console.log({ _id })
    async function saveProduct(ev) {
        ev.preventDefault()
        const data = { title, description, price, images: images.map((img) => img.src), category, properties }
        if (_id) {
            // update
            await axios.put('/api/products', { ...data, _id })
        } else {
            //  create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)

    }
    if (goToProducts) {
        return router.push('/products')
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);
            setImages((oldImages) => [
                ...oldImages,
                ...res.data.links.map((link, index) => ({
                    id: `${Date.now()}-${index}`,
                    src: link,
                })),
            ]);
            setIsUploading(false);
        }
    }


    function updateImagesOrder(newImages) {
        console.log(newImages)
        setImages(newImages)
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        const selectedCategory = categories.find(c => c._id === category);
        if (selectedCategory && selectedCategory.properties) {
            propertiesToFill.push(...selectedCategory.properties);
        }
    }


    return (
        <form onSubmit={saveProduct}
            className="flex flex-col gap-2 max-w-[40%]">
            <label>Product name</label>
            <input
                type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>
                Category
            </label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>
            {propertiesToFill.map((property, index) => {
                // valores ya seleccionados en este producto
                const selectedValues = properties.find(p => p.name === property.name)?.value || [];

                return (
                    <div key={index} className="mb-2">
                        <label className="font-medium">{property.name}</label>
                        <div className="flex gap-4 flex-wrap mt-1">
                            {property.values?.map((val, i) => (
                                <label key={i} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(val)}
                                        onChange={(ev) => {
                                            let newProperties = [...properties];
                                            const propIndex = newProperties.findIndex(p => p.name === property.name);

                                            if (propIndex === -1) {
                                                // no existe -> agregarlo
                                                newProperties.push({
                                                    name: property.name,
                                                    value: [val],
                                                });
                                            } else {
                                                // ya existe -> actualizar
                                                let values = newProperties[propIndex].value || [];
                                                if (ev.target.checked) {
                                                    values = [...values, val];
                                                } else {
                                                    values = values.filter(v => v !== val);
                                                }
                                                newProperties[propIndex].value = values;
                                            }

                                            setProperties(newProperties);
                                        }}
                                    />
                                    {val}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-2"
                    setList={updateImagesOrder}
                >
                    {!!images?.length && images.map(img => (
                        <div key={img.id} className="h-24">
                            <img src={img.src} alt="Product Image" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex rounded-lg items-center gap-2">
                        <Spinner />
                    </div>
                )}
                <label className="inline-block w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                   <label htmlFor="fileInput" className="inline-block ...">Upload</label>
<input
  id="fileInput"
  type="file"
  multiple
  onChange={uploadImages}
  className="hidden"
/>

                </label>
            </div>
            <label>Description</label>
            <textarea
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Price (in USD)</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button
                type="submit"
                className="btn-primary">Save</button>
        </form>
    )
}