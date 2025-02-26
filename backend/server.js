require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const pool = require('./db');
const cors = require('cors');

app.use(cors({
  origin:['https://gild-woodworks.onrender.com'],
  credentials: true
}));
app.use(express.json());

// Quick function to format tags for display
const titleFormatter = (camelText) => {
    const words = camelText.split(/(?=[A-Z])/);
    return words.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// General product API call
app.get('/api/products', async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage, 10);
    const page = Math.max(parseInt(req.query.page, 10) || 1);
    const priceRange = req.query.priceRange ? req.query.priceRange.split(',').map(Number) : [0, 2600];
    const tags = req.query.tags ? req.query.tags.split(',') : [];
    const productTypes = req.query.types ? req.query.types.split(',') : [];

    let queryText = `SELECT p.*, v.*
                        FROM (
                            SELECT *
                            FROM products
                            ORDER BY product_id ASC
                            LIMIT $1 OFFSET ($2 - 1 ) * $1
                        ) p
                        JOIN variants v ON p.product_id = v.product_id
                        WHERE v.variant_price >= $3 AND v.variant_price <= $4
                        `;
    let queryValues = [itemsPerPage, page, priceRange[0], priceRange[1]];

    let totalQueryText = `SELECT COUNT(DISTINCT p.product_id)
                            FROM products p
                            JOIN variants v ON p.product_id = v.product_id
                            WHERE v.variant_price >= $1 AND v.variant_price <= $2
                            `;
    let totalQueryValues = [priceRange[0], priceRange[1]];

    let queryParam = 5;
    let totalQueryParam = 3;

    if (tags.length > 0) {
        queryText += ` AND v.variant_tags && $${queryParam}`;
        queryValues.push(tags);
        totalQueryText += ` AND v.variant_tags && $${totalQueryParam}`;
        totalQueryValues.push(tags);
        queryParam++;
        totalQueryParam++;
    }

    if (productTypes.length > 0) {
        queryText += ` AND p.category = ANY($${queryParam})`;
        queryValues.push(productTypes);
        totalQueryText += ` AND p.category = ANY($${totalQueryParam})`;
        totalQueryValues.push(productTypes);
        queryParam++;
        queryParam++;
    }

    queryText += ` ORDER BY p.product_id, v.variant_id ASC`

    try {
        const query = {
            text: queryText,
            values: queryValues,
        };
        const totalQuery = {
            text: totalQueryText,
            values: totalQueryValues,
        }     
        const productResults = await pool.query(query);
        const products = productResults.rows;


        const totalResults = await pool.query(totalQuery);
        const totalProducts = parseInt(totalResults.rows[0].count, 10);

        res.json({ products, totalProducts });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Product detail API call
app.get('/api/products/:productId', async (req,res) => {
    const productId = req.params.productId;

    try {
        const productQuery = {
            text: `SELECT p.*, v.*
                        FROM products p
                        JOIN variants v ON p.product_id = v.product_id
                        WHERE p.product_id = $1
                        ORDER BY v.variant_id ASC`,
            values: [productId],
        };
        const productResult = await pool.query(productQuery);

        if (productResult.rows.length ===0) {
            return res.status(404).send('Product not found');
        }

        const product = productResult.rows.reduce((acc, row) => {
            if (!acc.product_id) {
                acc = { ...row, variants: [] };
            }
            acc.variants.push(row);
            return acc;
        }, {});
        res.json(product);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Sever error');
    }
});

// Filter material endpoing
app.get('/api/filter-materials', async(req, res) => {
    try {
        const query = {
            text: `SELECT DISTINCT tag
                        FROM (
                            SELECT UNNEST(variant_tags) AS tag
                            FROM variants
                        ) AS subquery
                        WHERE tag LIKE 'filter-material_%'`
        };
        const result = await pool.query(query);
        const materials = result.rows.map(row => {
            const originalTag = row.tag.replace('filter-material_', "");
            return {
                value: originalTag,
                label: titleFormatter(originalTag)
            };
        });
        res.json(materials);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Filter category endpoint
app.get('/api/filter-categories', async(req, res) => {
    try {
        const query = {
            text: `SELECT DISTINCT category FROM products`
        };
        const result = await pool.query(query);
        const categories = result.rows.map(row => row.category);
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});