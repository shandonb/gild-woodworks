
# Gild Woodworks  
  
#### [Live Preview](https://gild-woodworks.onrender.com/)  
  
----------  
  
## About  
  
This project, which remains in active development, demonstrates an approach to creating a custom e-commerce platform built in a modern JS framework. It currently features a functional storefront with dynamic product displays and core logic fully implemented, and has a laundry list of planned expansions including mock checkout, authentication, and an admin dashboard. This repo is also planned to demonstrate collaborative workflows, such as feature branching and pull requests, as well as CI/CD practices.  
  
### Built With:  
  
#### Frontend  
  
- Vue  
- Vuetify  
- Pinia  
- Pinia Plugin Persistedstate  
- Vue Router  
  
#### Backend  
  
- Express.js  
- PostgreSQL  
  
  
## Local Setup  
  
#### Clone the Repository  
  
```bash  
git clone https://github.com/shandonb/gild-woodworks.git  
cd gild-woodworks  
```  
  
#### Database Setup  
  
1. Ensure PostgreSQL is installed and running  
2. Create the database  
	```sql  
	CREATE DATABASE gild_woodworks;
	```  
3. Define `category` data type  
	```sql  
	CREATE TYPE "product-types" AS ENUM ('Bookshelves', 'Cabinets', 'Consoles', 'Cutting Boards', 'Miscellaneous', 'Tables');
	```  
4. Create Tables  
	```sql  
	-- Create products table  
	CREATE TABLE IF NOT EXISTS public.products (  
		product_id SERIAL PRIMARY KEY,
		product_title VARCHAR NOT NULL,
		product_description TEXT,
		category "product-types" NOT NULL,
		product_handle VARCHAR
	);  
	  
	-- Create variants table  
	CREATE TABLE IF NOT EXISTS public.variants (  
		product_id INTEGER NOT NULL,
		variant_id SERIAL PRIMARY KEY,
		variant_name VARCHAR NOT NULL,
		variant_description TEXT,
		variant_price NUMERIC NOT NULL,
		variant_sku VARCHAR NOT NULL,
		variant_tags TEXT[],
		variant_height DOUBLE PRECISION NOT NULL,
		variant_length DOUBLE PRECISION NOT NULL,
		variant_width DOUBLE PRECISION NOT NULL,
		variant_weight DOUBLE PRECISION NOT NULL,
		variant_image_src TEXT[],
		variant_handle VARCHAR,
		CONSTRAINT "product-id" FOREIGN KEY (product_id)  
			REFERENCES public.products (product_id)  
	);  
	```  
5. Create SKU sequence  
	```sql  
	CREATE SEQUENCE IF NOT EXISTS sku_sequence  
		START WITH 1  
		INCREMENT BY 1  
		MINVALUE 1  
		MAXVALUE 9999  
		CACHE 1;  
	```  
6. Create function to generate SKU  
	```sql  
	CREATE OR REPLACE FUNCTION public.generate_sku()  
	RETURNS TRIGGER AS $$  
	BEGIN  
		IF NEW.variant_sku IS NULL THEN  
			NEW.variant_sku := 'GWW' || LPAD(nextval('sku_sequence')::text, 4, '0');  
		END IF;
		RETURN NEW;
	END;  
	$$ LANGUAGE plpgsql;  
	```  
7. Create SKU trigger  
	```sql  
	CREATE OR REPLACE TRIGGER variant_sku_trigger  
	BEFORE INSERT ON public.variants  
	FOR EACH ROW  
	EXECUTE FUNCTION public.generate_sku();  
	```  
  
#### Backend Setup  
  
1. Install dependencies  
	```bash  
	cd backend  
	npm install  
	```  
2. Connect PostgreSQL database  
	- Create a `.env` file in the backend root directory with connection details  
		```ini  
		DB_USER=username  
		DB_PASSWORD=password  
		DB_HOST=host  
		DB_PORT=5432  
		DB_DATABASE=database  
		PORT=6543  
		```  
3. Start the backend  
	```bash  
	node server.js  
	```  
  
#### Frontend Setup  
  
1. Install dependencies  
	- From backend folder  
		```bash  
		cd ../frontend  
		npm install  
		```  
	- From project root  
		```bash  
		cd frontend  
		npm install  
		```  
2. Start development server  
	```bash  
	npm run dev  
	```  
3. Open the page indicated by the terminal output (e.g. `http://localhost:3000`)  
  
  
## API Documentation  
  
### Base URL 
  
  `https://gild-woodworks.onrender.com/api` 
  
-----  
  
  
### Product Query (Paginated)  
  
##### Endpoint:  
  
```http  
GET /api/products  
```  
##### Query Parameters (Optional)  
  
|Parameter     |Type     |Description                                                    |
|--------------|---------|---------------------------------------------------------------|
|`itemsPerPage`|`integer`|Number of products per page (default: 10)                      |
|`page`        |`integer`|Page number (default: 1)                                       |
|`priceRange`  |`string` |Min/Max price range, formatted as `"min,max"` (e.g. `100,500`)|
|`tags`        |`string` |Comma separated list of variant tags                           |
|`types`       |`string` |Comma separated list of product categories                     |
  
##### Example Request  
  
```http  
GET /api/products?itemsPerPage=10&page=1&priceRange=800,2600&types=Tables  
```  
  
--------  
  
### Product Details (By ID)  
  
##### Endpoint:  
  
```http  
GET /api/products/:productId  
```  
  
##### Parameters  
  
| Parameter | Type | Description |  
| --------- | ---- | ----------- |  
| `productId` | `integer` | The ID of the product |  
  
##### Example Request  
  
```http  
GET /api/products/1  
```  
  
----  
  
### Get List of Materials  
  
##### Endpoint:  
  
```http  
GET /api/filter-materials  
```  
  
##### Description:  
  
Returns a list of distinct material filter tags used in product variants.  
  
------  
  
### Get List of Categories/Types  
  
##### Endpoint:  
  
```http  
GET /api/filter-categories  
```  
  
##### Description:  
  
Returns a list of distinct product categories/types available for filtering.
