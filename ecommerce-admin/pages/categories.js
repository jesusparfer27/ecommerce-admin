import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function Categories() {
    const [editingCategory, setEditingCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        if (!name.trim()) {
            return MySwal.fire("Error", "El nombre de la categoría es obligatorio", "error");
        }
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values
            }))
        };
        if (editingCategory) {
            await axios.put("/api/categories", { ...data, _id: editingCategory._id });
        } else {
            await axios.post("/api/categories", data);
        }
        resetForm();
        fetchCategories();
    }


    function editCategory(category) {
        setEditingCategory(category);
        setName(category.name);
        setParentCategory(category.parent ? category.parent._id : "");
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values, // mantener como array
            }))
        );
    }


    function deleteCategory(category) {
        MySwal.fire({
            title: "Are you sure?",
            text: `You want to delete "${category.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete("/api/categories?_id=" + category._id);
                    MySwal.fire("Deleted!", "Category has been deleted.", "success");
                    fetchCategories();
                } catch (error) {
                    MySwal.fire("Error!", "There was an error deleting the category.", "error");
                }
            }
        });
    }

    function addProperty() {
        setProperties((prev) => [...prev, { name: "", values: [] }]);
    }

    function handlePropertyChange(index, field, value) {
        setProperties((prev) => {
            const newProps = [...prev];
            if (field === "name") {
                newProps[index].name = value;
            } else if (field === "values") {
                newProps[index].values = value.split(",").map((v) => v.trim());
            }
            return newProps;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties((prev) => prev.filter((_, i) => i !== indexToRemove));
    }

    function resetForm() {
        setEditingCategory(null);
        setName("");
        setParentCategory("");
        setProperties([]);
    }

    return (
        <Layout>
            <h1>Categories</h1>

            <form onSubmit={saveCategory}>
                <div>
                    <label className="block mb-2 font-semibold">
                        {editingCategory
                            ? `Edit Category: ${editingCategory.name}`
                            : "New Category"}
                    </label>

                    <div className="flex gap-1 mb-3">
                        <input
                            type="text"
                            placeholder="Category name"
                            onChange={(ev) => setName(ev.target.value)}
                            value={name}
                            className="border p-1 rounded flex-1"
                        />
                        <select
                            onChange={(ev) => setParentCategory(ev.target.value)}
                            value={parentCategory}
                            className="border p-1 rounded"
                        >
                            <option value="">No parent Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block font-semibold">Properties</label>
                        <button
                            type="button"
                            className="btn-default text-sm my-2"
                            onClick={addProperty}
                        >
                            Add new property
                        </button>

                        {properties.map((property, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Property name (ej: color, tamaño, material)"
                                    value={property.name}
                                    onChange={(ev) =>
                                        handlePropertyChange(index, "name", ev.target.value)
                                    }
                                    className="border p-1 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Values (comma separated: rojo, azul)"
                                    value={Array.isArray(property.values) ? property.values.join(", ") : property.values}
                                    onChange={(ev) =>
                                        handlePropertyChange(index, "values", ev.target.value)
                                    }
                                    className="border p-1 rounded"
                                />

                                <button
                                    type="button"
                                    className="btn-red"
                                    onClick={() => removeProperty(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary py-1">
                            Save
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-default py-1"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {!editingCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category.parent ? category.parent.name : "No Parent"}</td>
                                <td>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => editCategory(category)}
                                            className="btn-primary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className="btn-red"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default Categories;
