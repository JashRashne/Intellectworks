import { db } from "..";

const createUser = async (req: any, res: any) => {
    try {
      const { id, name, description, price } = req.body;
  
      // Ensure all fields are provided
      if (!id || !name || !description || !price) {
        return res.status(400).send("Missing required fields");
      }
  
      console.log("ID :", id);
      console.log("Name :", name);
      console.log("Desc :", description);
      console.log("Price :", price);
  
      // Use `set()` to create the document
      await db.collection("products").doc(id).set({
        name,
        description,
        price,
      });
  
      return res.status(200).send("Product created successfully");
    } catch (err) {
      console.error("Error creating product:", err);
      return res.status(500).send("Error creating product");
    }
  }


  const testServer = (req:any, res:any) => {
    return res.status(200).send("Hello World");
  }

  export {createUser, testServer}