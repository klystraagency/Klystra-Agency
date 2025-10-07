import { storage } from "./storage";
import * as bcrypt from "bcrypt";

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  
  // Hash password with bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      console.log("Admin user already exists");
      process.exit(0);
    }
    
    await storage.createUser({
      username,
      password: hashedPassword,
      isAdmin: "true"
    });
    
    console.log(`✓ Admin user created successfully!`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Please change the password after first login.`);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

createAdmin();
